import {
  ListTypeVariants,
  ElementTypeKeys,
  HeadingVariants,
  InlinePropsKeys,
  ParagraphType,
  QuoteTypeVariants,
} from "../interfaces/custom-types";
import React from "react";
import {
  Editor,
  Transforms,
  Element as SlateElement,
  Node,
  Path,
  Descendant,
} from "slate";
import { ReactEditor } from "slate-react";
import isHotkey from "is-hotkey";

const PARAGRAPHTRANSFORMATIONS = [
  ElementTypeKeys.Heading,
  ElementTypeKeys.Quote,
  ElementTypeKeys.List,
  ElementTypeKeys.Image,
  ElementTypeKeys.BlockLink,
  ElementTypeKeys.Code,
];

export const pushNode = (
  editor: Editor,
  block: ElementTypeKeys,
  addNewLine: boolean = true
) => {
  ReactEditor.focus(editor);
  const insertionNode = getInsertionNode(block);
  const paragraphNode: ParagraphType = {
    type: ElementTypeKeys.Paragraph,
    children: [{ text: "" }],
  };
  // console.log("insertion got", insertionNode);

  // Transforms.setNodes(editor, node, {
  //   match: (n) => Element.isElement(n),
  // });
  const { selection } = editor;

  if (!!selection) {
    const [parentNode, parentPath] = Editor.parent(
      editor,
      selection.focus?.path
    );

    if (
      editor.isVoid(parentNode as SlateElement) ||
      Node.string(parentNode).length
    ) {
      // Insert the new image node after the void node or a node with content
      Transforms.insertNodes(editor, insertionNode, {
        at: Path.next(parentPath),
        select: true,
      });
      if (addNewLine) {
        Transforms.insertNodes(editor, paragraphNode, {
          at: Path.next(Path.next(parentPath)),
          select: true,
        });
      }
    } else {
      // If the node is empty, replace it instead
      Transforms.removeNodes(editor, { at: parentPath });
      Transforms.insertNodes(editor, insertionNode, {
        at: parentPath,
        select: true,
      });
      if (addNewLine) {
        Transforms.insertNodes(editor, paragraphNode, {
          at: Path.next(parentPath),
          select: true,
        });
      }
    }
  } else {
    // Insert the new node at the bottom of the Editor when selection
    // is falsey
    Transforms.insertNodes(editor, insertionNode, { select: true });
  }
};

function getInsertionNode(block: ElementTypeKeys) {
  let node: Descendant;
  switch (block) {
    case ElementTypeKeys.Quote:
      node = {
        type: ElementTypeKeys.Quote,
        variant: QuoteTypeVariants.Default,
        children: [],
      };
      return node;
    case ElementTypeKeys.Image:
      node = {
        type: ElementTypeKeys.Image,
        src: "",
        alt: "",
        caption: "",
        children: [{ text: "" }],
      };
      return node;
    case ElementTypeKeys.BlockLink:
      node = {
        type: ElementTypeKeys.BlockLink,
        url: "",
        title: "",
        description: "",
        imgsrc: "",
        children: [{ text: "" }],
      };
      return node;
    case ElementTypeKeys.InlineLink:
      node = {
        type: ElementTypeKeys.InlineLink,
        url: "",
        children: [{ text: "" }],
      };
      return node;
    case ElementTypeKeys.Heading:
      node = {
        type: ElementTypeKeys.Heading,
        variant: HeadingVariants.Large,
        children: [{ text: "" }],
      };
      return node;
    case ElementTypeKeys.List:
      node = {
        type: ElementTypeKeys.List,
        variant: ListTypeVariants.Unordered,
        children: [{ text: "" }],
      };
      return node;
    case ElementTypeKeys.Code:
      node = {
        type: ElementTypeKeys.Code,
        lang: "js",
        children: [{ text: "" }],
      };
      return node;
    default:
      node = {
        type: ElementTypeKeys.Paragraph,
        children: [{ text: "" }],
      };
      return node;
  }
}

//
//
//
export const toggleMark = (editor: Editor, format: InlinePropsKeys) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor: Editor, format: InlinePropsKeys) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

//
// all events handler
//
export const eventsHandler = (
  editor: Editor,
  e: React.KeyboardEvent<HTMLDivElement>,
  customKeyBoardShortcuts: [{ shortcut: string; handler: () => void }]
) => {
  if (!editor.selection) {
    return;
  }

  const [parentNode, parentPath] = Editor.parent(
    editor,
    editor.selection.focus.path
  );

  if (isHotkey("tab", e)) {
    if ((parentNode as SlateElement).type === ElementTypeKeys.CodeLine) {
      e.preventDefault();
      Editor.insertText(editor, "\t");
    }
  }

  if (isHotkey("shift+enter", e)) {
    if (
      (parentNode as SlateElement).type === ElementTypeKeys.ListItem ||
      (parentNode as SlateElement).type === ElementTypeKeys.CodeLine
    ) {
      e.preventDefault();
      insertBlockAsNextElement(
        editor,
        ElementTypeKeys.Paragraph,
        Path.parent(parentPath)
      );
      return;
    } else if ((parentNode as SlateElement).type === ElementTypeKeys.Image) {
      e.preventDefault();
      const parentPath = Path.parent(editor.selection.focus.path);
      insertBlockAsNextElement(editor, ElementTypeKeys.Paragraph, parentPath);
    }
  }

  if (e.shiftKey && e.altKey) {
    if (e.key.toLowerCase() == "h") {
      generalNodeToggler(
        editor,
        parentNode as SlateElement,
        ElementTypeKeys.Heading
      );
    } else if (e.key.toLowerCase() == "l") {
      generalNodeToggler(
        editor,
        parentNode as SlateElement,
        ElementTypeKeys.List
      );
    } else if (e.key.toLowerCase() === "i") {
      e.preventDefault();
      e.stopPropagation();
      generalNodeToggler(
        editor,
        parentNode as SlateElement,
        ElementTypeKeys.Image
      );
    } else if (e.key.toLowerCase() === "q") {
      e.preventDefault();
      e.stopPropagation();
      generalNodeToggler(
        editor,
        parentNode as SlateElement,
        ElementTypeKeys.Quote
      );
    } else if (e.key.toLowerCase() === "c") {
      e.preventDefault();
      e.stopPropagation();
      generalNodeToggler(
        editor,
        parentNode as SlateElement,
        ElementTypeKeys.Code
      );
    }
  }

  customKeyBoardShortcuts.map((so) => {
    if (isHotkey(so.shortcut, e)) {
      e.preventDefault();
      e.stopPropagation();
      so.handler();
      return;
    }
  });
};

//
// delete element at path
//
export function deleteBlockAtPath(editor: Editor, path?: Path) {
  if (path) {
    Transforms.removeNodes(editor, { at: path });
  } else {
    Transforms.removeNodes(editor);
  }
}

//
//
//
export function insertBlockAsNextElement(
  editor: Editor,
  type: ElementTypeKeys,
  parentPath?: Path
) {
  const node = getInsertionNode(type);
  if (parentPath) {
    Transforms.insertNodes(editor, node, {
      at: Path.next(parentPath),
      select: true,
    });
  } else {
    Transforms.insertNodes(editor, node, {
      select: true,
    });
  }
}

//
// transform node
//
export function transformNode(
  editor: Editor,
  block: ElementTypeKeys,
  addNewLine: boolean = false
) {
  ReactEditor.focus(editor);
  const transformationNode = getInsertionNode(block);
  const paragraphNode: ParagraphType = {
    type: ElementTypeKeys.Paragraph,
    children: [{ text: "" }],
  };

  if (!!editor.selection) {
    const [parentNode, parentPath] = Editor.parent(
      editor,
      editor.selection.focus.path
    );

    generalNodeToggler(editor, parentNode as SlateElement, block);
    if (addNewLine) {
      // allow addNewLine only if
      // block !== paragraph
      // next node is not paragraph
      Transforms.insertNodes(editor, paragraphNode);
    }
  } else {
    Transforms.insertNodes(editor, transformationNode, { select: true });
  }
}

//
// general transformation validator
//
function generalNodeToggler(
  editor: Editor,
  parentNode: SlateElement,
  node: ElementTypeKeys
) {
  if (parentNode.type === node) {
    if (node === ElementTypeKeys.Heading) {
      toggleParagraphAndHeading(editor, parentNode);
    }
    return;
  }

  if (parentNode.type === ElementTypeKeys.Paragraph) {
    if (PARAGRAPHTRANSFORMATIONS.includes(node)) {
      if (node === ElementTypeKeys.Heading) {
        toggleParagraphAndHeading(editor, parentNode);
        return;
      }

      if (node === ElementTypeKeys.List) {
        toggleParagraphAndList(editor, parentNode);
        return;
      }

      if (node === ElementTypeKeys.Image) {
        insertNode(editor, parentNode, ElementTypeKeys.Image);
        return;
      }

      if (node === ElementTypeKeys.Quote) {
        insertNode(editor, parentNode, ElementTypeKeys.Quote);
        return;
      }

      if (node === ElementTypeKeys.BlockLink) {
        insertNode(editor, parentNode, ElementTypeKeys.BlockLink);
      }

      if (node === ElementTypeKeys.Code) {
        insertCode(editor, parentNode, ElementTypeKeys.Code);
      }
    }
  }
}

//
// convert paragragh to heading and vice-versa
//
function toggleParagraphAndHeading(editor: Editor, parentNode: SlateElement) {
  if (parentNode.type === ElementTypeKeys.Paragraph) {
    Transforms.setNodes(editor, {
      type: ElementTypeKeys.Heading,
      variant: HeadingVariants.Large,
    });
  } else {
    Transforms.setNodes(editor, {
      type: ElementTypeKeys.Paragraph,
    });
    Transforms.unsetNodes(editor, "variant");
  }
}

//
// toggle paragraph and list
//
export const toggleParagraphAndList = (
  editor: Editor,
  parentNode: SlateElement
) => {
  if (!editor.selection) {
    return;
  }
  // const isActive = isBlockActive(
  //   editor,
  //   format,
  //   TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  // )

  // insertion is important bec unwrap removes the node on selection focus from it's place
  // therefore the node below it becomes current selection and gets transformed.
  // That's y we insert a blank default node and it gets transformed to the list
  Transforms.insertNodes(
    editor,
    { type: ElementTypeKeys.Paragraph, children: [] } as SlateElement,
    {
      at: editor.selection.focus.path,
    }
  );

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  newProperties = {
    type: ElementTypeKeys.ListItem,
    children: parentNode.children,
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  const block = {
    type: ElementTypeKeys.List,
    variant: ListTypeVariants.Unordered,
    children: [],
  };
  Transforms.wrapNodes(editor, block as SlateElement);
};

//
// insert node at next position
//
export function insertNode(
  editor: Editor,
  parentNode: SlateElement,
  insertionNode: ElementTypeKeys
) {
  if (!editor.selection) {
    return;
  }

  const node = getInsertionNode(insertionNode);
  const parentPath = Path.parent(editor.selection.focus.path);
  if (!Node.string(parentNode).length) {
    Transforms.removeNodes(editor);
    Transforms.insertNodes(editor, node, { at: parentPath });
  } else {
    Transforms.insertNodes(editor, node, {
      at: Path.next(parentPath),
      select: true,
    });
  }
}

//
//
//
export function insertCode(
  editor: Editor,
  parentNode: SlateElement,
  insertionNode: ElementTypeKeys
) {
  if (!editor.selection) {
    return;
  }
  const codeNode = getInsertionNode(ElementTypeKeys.Code);
  // Transforms.wrapNodes(editor, codeNode, {
  //   match: (n) =>
  //     SlateElement.isElement(n) && n.type === ElementTypeKeys.Paragraph,
  //   split: true,
  // });
  // Transforms.setNodes(
  //   editor,
  //   { type: ElementTypeKeys.CodeLine },
  //   {
  //     match: (n) =>
  //       SlateElement.isElement(n) && n.type === ElementTypeKeys.Paragraph,
  //   }
  // );

  Transforms.insertNodes(
    editor,
    { type: ElementTypeKeys.Paragraph, children: [] } as SlateElement,
    {
      at: editor.selection.focus.path,
    }
  );

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  newProperties = {
    type: ElementTypeKeys.CodeLine,
    children: parentNode.children,
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);
  Transforms.wrapNodes(editor, codeNode);
}
