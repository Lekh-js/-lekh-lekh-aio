// TypeScript users only add this code
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import {
  ParagraphType,
  ImageType,
  QuoteType,
  CustomText,
  BlockLinkType,
  InlineLinkType,
  HeadingType,
  ListType,
  ListItemType,
  CodeType,
  CodeLineType,
} from "./custom-types";

/*
 * slatejs type declarations
 */
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element:
      | ParagraphType
      | InlineLinkType
      | ImageType
      | QuoteType
      | BlockLinkType
      | HeadingType
      | ListType
      | ListItemType
      | CodeType
      | CodeLineType;
    Text: CustomText;
  }
}
