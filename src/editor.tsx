import React, { useState, useMemo } from "react";
import {
  InlineLinkBlock,
  ParagraphBlock,
  QuoteBlock,
  ImageBlock,
  BlockLinkBlock,
  HeadingBlock,
  ListBlock,
  ListItem,
  CodeBlock,
  CodeLine,
} from "./elements/reader";
import { StaticToolbar } from "./toolbar";
import { ElementTypeKeys, ParagraphType } from "./interfaces/custom-types";
import "prismjs/themes/prism.min.css";
// import "prismjs/themes/prism-dark.min.css";

import {
  Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
  Path,
  Node,
  createEditor,
} from "slate";
import { Slate, Editable, ReactEditor, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { eventsHandler, deleteBlockAtPath } from "./handlers/operator";
import {
  useDecorate,
  SetNodeToDecorations,
} from "./handlers/codeBlock/decorator";

interface editorProp {
  editor: Editor;
  initialValue: Descendant[];
  getContentJSON?: (val: any) => void;
  readOnly?: boolean;
  customKeyBoardShortcuts: [{ shortcut: string; handler: () => void }];
  uploadImageHandler: () => any;
}

const withVoidsElems = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === ElementTypeKeys.Image ||
      element.type === ElementTypeKeys.BlockLink
      ? true
      : isVoid(element);
  };
  return editor;
};

const withInlineElems = (editor: Editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === ElementTypeKeys.InlineLink
      ? true
      : isInline(element);
  };
  return editor;
};

export function getEditor() {
  const editor: Editor = useMemo(
    () =>
      withInlineElems(withVoidsElems(withHistory(withReact(createEditor())))),
    []
  );
  return editor;
}

export default function TextEditor({
  editor,
  initialValue,
  getContentJSON,
  readOnly,
  customKeyBoardShortcuts,
  uploadImageHandler,
}: editorProp) {
  const { isVoid, insertBreak, deleteBackward } = editor;
  editor.insertBreak = (...args) => {
    if (!editor.selection) {
      return;
    }
    const parentPath = Path.parent(editor.selection.focus.path);
    const parentNode = Node.get(editor, parentPath);

    if (
      isVoid(parentNode as SlateElement) ||
      (parentNode as SlateElement).type === ElementTypeKeys.Heading ||
      (parentNode as SlateElement).type === ElementTypeKeys.Quote
    ) {
      const nextPath = Path.next(parentPath);
      const node: ParagraphType = {
        type: ElementTypeKeys.Paragraph,
        children: [{ text: "" }],
      };
      Transforms.insertNodes(editor, node, {
        at: nextPath,
        select: true, // Focus on this node once inserted
      });
    } else {
      insertBreak(...args);
    }
  };

  editor.deleteBackward = (...args) => {
    if (!editor.selection) {
      return;
    }
    const parentPath = Path.parent(editor.selection.focus.path);
    const parentNode = Node.get(editor, parentPath);

    if (
      parentPath[0] !== 0 &&
      (isVoid(parentNode as SlateElement) || !Node.string(parentNode).length)
    ) {
      Transforms.removeNodes(editor, { at: parentPath });
    } else if (parentPath[0] === 0) {
      if (
        (parentNode as SlateElement).type !== ElementTypeKeys.ListItem &&
        !Node.string(parentNode).length
      ) {
        deleteBackwardForTopElements(editor, parentPath, Path.next(parentPath));
      } else {
        deleteBackward(...args);
      }
    } else {
      deleteBackward(...args);
    }
  };

  function deleteBackwardForTopElements(
    editor: Editor,
    parentPath: Path,
    insertionPath: Path
  ) {
    Transforms.insertNodes(
      editor,
      { type: ElementTypeKeys.Paragraph, children: [] },
      { at: insertionPath }
    );
    Transforms.removeNodes(editor, { at: parentPath });
    ReactEditor.focus(editor);
  }

  const [_, setCurrentSelection] = useState(editor.selection);
  const decorate = useDecorate(editor);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        setCurrentSelection(editor.selection);
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          // const content = JSON.stringify(value);
          // localStorage.setItem("content", content);
          if (getContentJSON) {
            getContentJSON(value);
          }
        }
      }}
    >
      {/* <HoveringToolbar editor={editor} /> */}
      {!readOnly && (
        <div className="flex justify-center">
          <div className="sticky top-10 z-10 w-[770px]">
            <StaticToolbar editor={editor} />
          </div>
        </div>
      )}
      <SetNodeToDecorations />
      <div className="flex w-full justify-center pt-10">
        <Editable
          decorate={decorate}
          className="w-[768px]"
          renderElement={(props) =>
            renderElement(props, editor, uploadImageHandler)
          }
          renderLeaf={renderLeaf}
          autoFocus
          readOnly={readOnly}
          onKeyDown={(e) => eventsHandler(editor, e, customKeyBoardShortcuts)}
        />
      </div>
    </Slate>
  );
}

const renderElement = (
  props: any,
  editor: Editor,
  uploadImageHandler: () => any
) => {
  // console.log("propss", props.element.type === ElementTypeKeys.InlineLink);

  switch (props.element.type) {
    case ElementTypeKeys.InlineLink:
      return (
        <InlineLinkBlock
          {...props}
          updateCustomProperty={(property, value) =>
            updateLinkProperty(editor, property, value)
          }
        />
      );
    case ElementTypeKeys.List:
      return (
        <ListBlock
          {...props}
          updateCustomProperty={(property, value, at) =>
            updateListProperty(editor, property, value)
          }
        />
      );
    case ElementTypeKeys.ListItem:
      return <ListItem {...props} />;
    case ElementTypeKeys.Heading:
      return (
        <HeadingBlock
          {...props}
          updateCustomProperty={(property, value) =>
            updateCustomProperty(editor, property, value)
          }
        />
      );
    case ElementTypeKeys.Paragraph:
      return <ParagraphBlock {...props} />;
    case ElementTypeKeys.Image:
      return (
        <ImageBlock
          {...props}
          uploadImage={uploadImageHandler}
          updateCustomProperty={(property, value) =>
            updateCustomProperty(editor, property, value)
          }
        />
      );
    case ElementTypeKeys.Quote:
      return (
        <QuoteBlock
          {...props}
          updateCustomProperty={(property, value) =>
            updateCustomProperty(editor, property, value)
          }
        />
      );
    case ElementTypeKeys.Code:
      return (
        <CodeBlock
          {...props}
          deleteBlockAtPath={(at?: Path) => deleteBlockAtPath(editor, at)}
          updateCustomProperty={(property, value) =>
            updateCustomProperty(editor, property, value)
          }
        />
      );
    case ElementTypeKeys.CodeLine:
      return <CodeLine {...props} />;
    case ElementTypeKeys.BlockLink:
      return (
        <BlockLinkBlock
          {...props}
          updateCustomProperty={(property, value) =>
            updateCustomProperty(editor, property, value)
          }
        />
      );
    default:
      return <ParagraphBlock {...props} />;
  }
};

const renderLeaf = ({ attributes, children, leaf }) => {
  const { text, ...rest } = leaf;

  if (leaf.bold) {
    children = <strong className="font-serif font-bold">{children}</strong>;
  }

  if (leaf.inlineCode) {
    children = (
      <code className=" rounded bg-red-50 pl-1 pr-2 font-serif font-medium italic text-red-600">
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.highlight) {
    children = <mark className="bg-blue-100">{children}</mark>;
  }

  return (
    <span {...attributes} className={Object.keys(rest).join(" ")}>
      {children}
    </span>
  );
};

const updateCustomProperty = (
  editor: Editor,
  property: string,
  value: string
) => {
  Transforms.setNodes(editor, { [property]: value });
};

const updateLinkProperty = (
  editor: Editor,
  property: string,
  value: string
) => {
  Transforms.setNodes(
    editor,
    { [property]: value },
    {
      match: (n) =>
        SlateElement.isElement(n) && n.type === ElementTypeKeys.InlineLink,
    }
  );
};

const updateListProperty = (
  editor: Editor,
  property: string,
  value: string
) => {
  Transforms.setNodes(
    editor,
    { [property]: value },
    {
      at: Path.parent(editor.selection?.focus.path),
      match: (n) =>
        SlateElement.isElement(n) && n.type === ElementTypeKeys.List,
    }
  );
};
