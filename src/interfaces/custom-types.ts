import {Descendant} from "slate"

export enum InlinePropsKeys {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  InlineCode = "inlineCode",
  Highlight = "highlight",
}

export enum ElementTypeKeys {
  Quote = "quote",
  Paragraph = "paragraph",
  Image = "image",
  InlineLink = "inlineLink",
  BlockLink = "blockLink",
  Heading = "heading",
  List = "list",
  ListItem = "listItem",
  Code = "code",
  CodeLine = "code-line"
}

export enum HeadingVariants {
  Large = "h2",
  Medium = "h3",
  Small = "h4",
}

export enum QuoteTypeVariants {
  Default = "default",
  Centered = "centered",
}

export enum ListTypeVariants {
  Unordered = "ul",
  Ordered = "ol",
}

export type ParagraphType = {
  type: ElementTypeKeys.Paragraph;
  children: CustomText[];
};

export type ImageType = {
  type: ElementTypeKeys.Image;
  src: string;
  alt?: string;
  caption?: string;
  children: CustomText[];
};

export type InlineLinkType = {
  type: ElementTypeKeys.InlineLink;
  url: string;
  children: CustomText[];
};

export type QuoteType = {
  type: ElementTypeKeys.Quote;
  variant: QuoteTypeVariants;
  children: CustomText[];
};

export type BlockLinkType = {
  type: ElementTypeKeys.BlockLink;
  url: string;
  title?: string;
  description?: string;
  imgsrc?: string;
  children: CustomText[];
};

export type HeadingType = {
  type: ElementTypeKeys.Heading;
  variant: HeadingVariants;
  children: CustomText[];
};

export type ListType = {
  type: ElementTypeKeys.List;
  variant: ListTypeVariants;
  children: CustomText[];
};

export type ListItemType = {
  type: ElementTypeKeys.ListItem;
  children: CustomText[];
};

export type CodeType = {
  type: ElementTypeKeys.Code;
  lang: string;
  children: CustomText[];
};

export type CodeLineType = {
  type: ElementTypeKeys.CodeLine,
  children: CustomText[];
}

export type CustomText = {
  text: string;
  [InlinePropsKeys.Bold]?: boolean;
  [InlinePropsKeys.Italic]?: boolean;
  [InlinePropsKeys.Underline]?: boolean;
  [InlinePropsKeys.InlineCode]?: boolean;
  [InlinePropsKeys.Highlight]?: boolean;
};
