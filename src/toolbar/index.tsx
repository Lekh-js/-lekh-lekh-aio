import React from "react";
import { Editor, Transforms, Element as SlateElement, Range } from "slate";
import { ToolbarButton } from "../elements/toolbar";
import {
  ElementTypeKeys,
  InlineLinkType,
  InlinePropsKeys,
} from "../interfaces/custom-types";
import {
  pushNode,
  transformNode,
  toggleMark,
  isMarkActive,
} from "../handlers/operator";
import { ReactEditor } from "slate-react";

interface ToolbarProps {
  editor: Editor;
}

export const StaticToolbar = ({ editor }: ToolbarProps) => {
  return (
    <section className="flex h-16 w-full items-center rounded border-b border-neutral-200 bg-neutral-100 px-5">
      <div className="flex space-x-5">
        <ToolbarButton
          value={InlinePropsKeys.Bold}
          active={isMarkActive(editor, InlinePropsKeys.Bold)}
          clickHandler={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMark(editor, InlinePropsKeys.Bold);
          }}
        />
        <ToolbarButton
          value={InlinePropsKeys.Italic}
          active={isMarkActive(editor, InlinePropsKeys.Italic)}
          clickHandler={() => toggleMark(editor, InlinePropsKeys.Italic)}
        />
        <ToolbarButton
          value={InlinePropsKeys.Underline}
          active={isMarkActive(editor, InlinePropsKeys.Underline)}
          clickHandler={() => toggleMark(editor, InlinePropsKeys.Underline)}
        />
        <ToolbarButton
          value={InlinePropsKeys.InlineCode}
          active={isMarkActive(editor, InlinePropsKeys.InlineCode)}
          clickHandler={() => toggleMark(editor, InlinePropsKeys.InlineCode)}
        />
        <ToolbarButton
          value={InlinePropsKeys.Highlight}
          active={isMarkActive(editor, InlinePropsKeys.Highlight)}
          clickHandler={() => toggleMark(editor, InlinePropsKeys.Highlight)}
        />
        <ToolbarButton
          value={ElementTypeKeys.InlineLink}
          active={false}
          clickHandler={() => toggleInlineLink(editor)}
        />
      </div>
      <div className="mx-5 h-[18px] border-r border-neutral-300"></div>
      <div className="flex space-x-5">
        <ToolbarButton
          value={ElementTypeKeys.Paragraph}
          active={false}
          clickHandler={() =>
            pushNode(editor, ElementTypeKeys.Paragraph, false)
          }
        />
        <ToolbarButton
          value={ElementTypeKeys.Heading}
          active={false}
          clickHandler={() => transformNode(editor, ElementTypeKeys.Heading)}
        />
        <ToolbarButton
          value={ElementTypeKeys.Quote}
          active={false}
          clickHandler={() =>
            transformNode(editor, ElementTypeKeys.Quote, false)
          }
        />
        <ToolbarButton
          value={ElementTypeKeys.Image}
          active={false}
          clickHandler={() => transformNode(editor, ElementTypeKeys.Image)}
        />
        <ToolbarButton
          value={ElementTypeKeys.BlockLink}
          active={false}
          clickHandler={() => transformNode(editor, ElementTypeKeys.BlockLink)}
        />
        <ToolbarButton
          value={ElementTypeKeys.List}
          active={false}
          clickHandler={() => transformNode(editor, ElementTypeKeys.List)}
        />
        <ToolbarButton
          value={ElementTypeKeys.Code}
          active={false}
          clickHandler={() => transformNode(editor, ElementTypeKeys.Code)}
        />
      </div>
    </section>
  );
};

function toggleInlineLink(editor: Editor) {
  if (editor.selection) {
    // if (isLinkActive(editor)) {
    //   unwrapLink(editor);
    // }
    // ReactEditor.focus(editor);
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);

    const node: InlineLinkType = {
      type: ElementTypeKeys.InlineLink,
      url: "",
      children: [{ text: "" }],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, node);
    } else {
      Transforms.wrapNodes(editor, node, { split: true });
      Transforms.collapse(editor, { edge: "end" });
      // Transforms.insertNodes(editor, node, { at: selection.focus.path });
      // Transforms.unwrapNodes(editor, { split: true });
    }
  }
}
