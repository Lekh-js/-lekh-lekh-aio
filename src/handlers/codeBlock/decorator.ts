import { useSlate } from "slate-react";
import { normalizeTokens } from "./normalize";
import { Editor, Element as SlateElement, NodeEntry, Node } from "slate";
import { ElementTypeKeys, CodeType } from "../../interfaces/custom-types";
import Prism from "prismjs";
import { useCallback } from "react";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-php";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-scss";

export const SetNodeToDecorations = () => {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: "highest",
      match: (n) =>
        SlateElement.isElement(n) && n.type === ElementTypeKeys.Code,
    })
  );

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations)
  );

  editor.nodeToDecorations = nodeToDecorations;

  return null;
};

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>();

  for (const m of maps) {
    for (const item of m) {
      map.set(...item);
    }
  }

  return map;
};

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<CodeType>) => {
  const nodeToDecorations = new Map<Element, Range[]>();

  const text = block.children.map((line) => Node.string(line)).join("\n");
  const language = block.lang;
  const tokens = Prism.tokenize(text, Prism.languages[language]);
  const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
  const blockChildren = block.children as unknown as Element[];

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of tokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map((type) => [type, true])),
      };

      nodeToDecorations.get(element)!.push(range);

      start = end;
    }
  }

  return nodeToDecorations;
};

export const useDecorate = (editor: Editor) => {
  return useCallback(
    ([node, path]) => {
      if (
        SlateElement.isElement(node) &&
        node.type === ElementTypeKeys.CodeLine
      ) {
        const ranges = editor.nodeToDecorations.get(node) || [];
        return ranges;
      }

      return [];
    },
    [editor.nodeToDecorations]
  );
};
