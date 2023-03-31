import React, { useState, ChangeEvent } from "react";
import { Path, Transforms, Element as SlateElement } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";

// import uploadImage from "@/utils/uploadImage/uploader";
import { useDropzone } from "react-dropzone";
import { useSelected, useFocused, useReadOnly } from "slate-react";
import { KeyPressEventHandler } from "../handlers/blockLink";
import {
  ElementTypeKeys,
  HeadingType,
  HeadingVariants,
  ListTypeVariants,
} from "../interfaces/custom-types";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const LANGTOSTRING = {
  Python: "py",
  JavaScript: "js",
  JSX: "jsx",
  TypeScript: "ts",
  TSX: "tsx",
  Java: "java",
  CSS: "css",
  SCSS: "scss",
  HTML: "html",
  Markdown: "md",
  PHP: "php",
  SQL: "sql",
};

const STRINGTOLANG = {
  py: "Python",
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  java: "Java",
  css: "CSS",
  html: "HTML",
  md: "Markdown",
  php: "PHP",
  sql: "SQL",
  scss: "SCSS",
};

interface defaultElementType {
  attributes: any;
  children: any;
  element?: any;
}

interface ReadOnly {
  readOnly: boolean;
}

interface ImageHelpers {
  uploadImage: (file: File) => any;
}

interface CustomPropertyUpdater {
  updateCustomProperty: (property, value, at?) => void;
}

interface CustomListPropertySetter {
  updateListPoints: (value: string, index: number) => void;
}

interface DeleteBlockAtPath {
  deleteBlockAtPath: (path?: Path) => void;
}

//
// Image Element
//
export const InlineLinkBlock = ({
  children,
  attributes,
  element,
  updateCustomProperty,
}: defaultElementType & CustomPropertyUpdater & ReadOnly): JSX.Element => {
  const selected = useSelected();
  const readOnly = useReadOnly();
  const [values, setValues] = useState({
    url: element.url || "#",
  });

  const EditableMarkup = ({ el }) => {
    return (
      <>
        <span className="text-inline-link-color underline">{el}</span>
        <div
          contentEditable={false}
          className={`absolute bottom-[100%] left-1/2 -translate-x-1/2 transform items-center justify-center overflow-hidden rounded transition-all duration-200 ${
            selected ? "inline-link-url-field flex flex-col" : "hidden"
          }`}
        >
          <div className="rounded bg-black py-[2px] px-2">
            <input
              type="text"
              name="url"
              className="unstyled-input font-primary appearance-none bg-transparent p-2 text-sm text-white"
              placeholder="Enter link"
              value={values.url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setValues({
                  ...values,
                  [e.target.name]: e.target.value,
                });
                updateCustomProperty("url", e.target.value);
              }}
            />
          </div>
          <div className="flex h-2 w-full justify-center">hvkjv</div>
        </div>
      </>
    );
  };

  const ReadOnlyMarkup = ({ el }) => {
    return (
      <>
        <a
          href={values.url}
          target="_blank"
          className="text-inline-link-color underline"
        >
          {el}
        </a>
      </>
    );
  };

  return (
    <span
      {...attributes}
      className={`inline-link-parent relative transform transition-shadow duration-200 ${
        !readOnly && selected && "rounded ring-green-600 hover:ring-2"
      }`}
    >
      {!readOnly && <EditableMarkup el={children} />}
      {readOnly && <ReadOnlyMarkup el={children} />}
    </span>
  );
};

//
// Default / Paragraph Element
//
export const ParagraphBlock = (props: defaultElementType) => {
  return (
    <p className="lc-paragraph" {...props.attributes}>
      {props.children}
    </p>
  );
};

//
// Quote Element
//
export const QuoteBlock = ({
  children,
  attributes,
  element,
  updateCustomProperty,
}: defaultElementType & CustomPropertyUpdater): JSX.Element => {
  const selected = useSelected();
  const focused = useFocused();
  const readOnly = useReadOnly();

  return (
    <>
      <div
        className={`mb-10 transform overflow-hidden transition-shadow duration-200 ${
          selected && focused && "focus-rin"
        }`}
        {...attributes}
      >
        <div
          className={`flow-root w-full rounded-r border-l-[3px] border-zinc-800 py-4 px-6 dark:border-white ${
            !readOnly && "min-h-[100px"
          }`}
        >
          <div
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="need-dark-placeholder text-cente relative bg-transparent font-serif text-lg italic tracking-wide text-black outline-none dark:text-white md:text-xl"
          >
            <blockquote className="bg-transparent">{children}</blockquote>

            {(element.children.length === 0 ||
              element.children[0]?.text === "") && (
              <div
                contentEditable={false}
                className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full text-neutral-400"
              >
                Enter Quote
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

//
// Quote Element
//
export const ImageBlock = ({
  children,
  attributes,
  element,
  updateCustomProperty,
  uploadImage,
}: defaultElementType & CustomPropertyUpdater & ImageHelpers): JSX.Element => {
  const [files, setFiles] = useState([]);
  const readOnly = useReadOnly();
  const [uiData, setUiData] = useState<{
    src: string;
    alt?: string;
    caption?: string;
  }>({
    src: element.src,
    alt: element.alt,
    caption: element.caption,
  });
  const selected = useSelected();
  const editor = useSlateStatic();
  const setProperty = (property: string, value: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      { [property]: value },
      {
        at: path,
        match: (n) =>
          SlateElement.isElement(n) && n.type === ElementTypeKeys.Image,
      }
    );
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const {
        responseData: { url },
      } = await uploadImage(file);

      setUiData({ src: url });
      setProperty("src", url);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  return (
    <div
      {...attributes}
      contentEditable={false}
      className={`mb-10 ${
        !readOnly && selected && "rounded ring-2 ring-green-600 ring-offset-1"
      }`}
    >
      <span className="hidden">{children}</span>
      {!readOnly ? (
        !uiData.src ? (
          <>
            <div className="h-48 w-full rounded-sm bg-zinc-50 p-1 text-center md:h-56 xl:h-72">
              <div
                {...getRootProps({ className: "dropzone" })}
                className="flex h-full items-center justify-center rounded-sm border text-zinc-400"
              >
                <input {...getInputProps()} />
                <p className="xl:text-lg">
                  Drag & drop image here, or click to select file.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative mb-1 flex justify-center">
              <img src={uiData.src} alt={uiData.alt} className="" />
              <div className="absolute inset-0 transform bg-white opacity-0 transition-all duration-200 hover:opacity-90 dark:bg-black">
                <div className="font-primary absolute top-1/2 left-1/2 w-1/2 max-w-[220px] -translate-x-1/2 -translate-y-1/2 transform text-sm font-medium text-black dark:text-white">
                  <input
                    type="text"
                    placeholder="Alternate text."
                    className="creator-dashboard-input-image font-primary mt-1 mb-1 w-full border-b border-black bg-transparent pb-1 font-medium outline-none disabled:text-neutral-400 dark:border-neutral-400"
                    name="alt"
                    value={uiData.alt}
                    onChange={(e) => {
                      setUiData({ ...uiData, alt: e.target.value });
                      setProperty(e.target.name, e.target.value);
                    }}
                  />
                  <label
                    className={`dark-on-valid-label-image transform text-sm font-medium text-black opacity-0 transition-all duration-200`}
                  >
                    Alternate Text
                  </label>
                </div>
              </div>
            </div>
            <input
              type="text"
              value={uiData.caption}
              placeholder="Write image caption."
              name="caption"
              className="unstyled-input bg-transparent lb-imagecaption w-full text-center"
              onChange={(e) => {
                setUiData({ ...uiData, caption: e.target.value });
                setProperty(e.target.name, e.target.value);
              }}
            />
          </>
        )
      ) : null}

      {readOnly && (
        <figure>
          <img
            src={uiData.src}
            alt={(uiData?.alt as string).trim() || "LumBytes"}
            className=""
          />
          {(uiData?.caption as string).trim().length > 0 && (
            <figcaption className="mt-1 lb-imagecaption text-center">
              {uiData.caption}
            </figcaption>
          )}
        </figure>
      )}
    </div>
  );
};

//
// Block Link element
//
export const BlockLinkBlock = ({
  children,
  attributes,
  element,
  updateCustomProperty,
}: defaultElementType & CustomPropertyUpdater): JSX.Element => {
  const [link, setLink] = useState<string>(element.url);
  const [fetchStatus, setFetchStatus] = useState("neutral");
  const readOnly = useReadOnly();
  const [displayPreview, setDisplayPreview] = useState<boolean>(
    !!element.title.trim() || !!element.description.trim() || false
  );
  const [errorMsg, setErrorMsg] = useState("Error");

  let responseClasses;
  if (fetchStatus === "neutral") {
    responseClasses = "border-gray-300 text-black";
  } else {
    responseClasses = "border-red-600 text-red-600";
  }

  function handleData(data) {
    if (data.success !== 1) {
      setFetchStatus("failure");
      setErrorMsg(data.msg);
      return;
    }

    const {
      meta: { title, description, url, imageURL },
    } = data;

    updateCustomProperty("title", title);
    updateCustomProperty("description", description);
    updateCustomProperty("imgsrc", imageURL);
    updateCustomProperty("url", url);
    setDisplayPreview(true);
  }

  const editableMarkup = (
    <>
      <div className="mb-10 w-full text-center">
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={`mb-1 w-full rounded border px-2 py-3 text-base outline-none ${responseClasses}`}
          onKeyDown={async (e) => {
            if (e.key !== "Enter") {
              return;
            }
            const data = await KeyPressEventHandler(
              (e.target as HTMLInputElement).value
            );
            handleData(data);
          }}
          // onPaste={async (e) => {
          //   const data = await PasteEventHandler(e, link);
          // }}
          placeholder='enter the link then press "Enter"'
        />
        <p
          className={`text-sm text-red-600 ${
            fetchStatus === "failure" ? "block" : "hidden"
          }`}
        >
          {errorMsg}
        </p>
      </div>
    </>
  );

  const readOnlyMarkup = (
    <a
      href={element.url}
      rel="nofollow noindex noreferrer"
      target="_blank"
      style={{ textDecoration: "none" }}
    >
      <div className="mb-10 flex transform overflow-hidden rounded border shadow transition-colors duration-200 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-black">
        <div className="flex-1 p-6">
          <div className="flex h-full flex-col justify-between">
            <h3 className="font-primary remove-decoration mb-2 text-xl font-bold text-black decoration-white dark:text-white lg:text-xl">
              {element.title}
            </h3>
            <p
              style={{ fontSize: "15px" }}
              className="line-clamp-2 leading-normal text-black dark:text-zinc-300"
            >
              {element.description}
            </p>
          </div>
        </div>
        {element.imgsrc && (
          <div className="flex items-center py-2 pr-2">
            <div
              style={{ backgroundImage: `url(${element.imgsrc})` }}
              className="aspect-1 hidden rounded bg-cover bg-center sm:block sm:h-28 md:h-32"
            ></div>
          </div>
        )}
      </div>
    </a>
  );

  return (
    <div {...attributes} contentEditable={false}>
      <span className="hidden">{children}</span>
      {!readOnly && !displayPreview && editableMarkup}
      {!readOnly && displayPreview && readOnlyMarkup}
      {readOnly && readOnlyMarkup}
    </div>
  );
};

//
// Heading element
//
export const HeadingBlock = ({
  attributes,
  children,
  element,
  updateCustomProperty,
}: defaultElementType & CustomPropertyUpdater): JSX.Element => {
  const selected = useSelected();
  const readOnly = useReadOnly();

  const headingToolbar = (
    <div
      contentEditable={false}
      className={`absolute bottom-full left-1/2 hidden z-20 -translate-x-1/2 transform bg-black px-4 py-2 ${
        selected && "heading-toolbar"
      }`}
    >
      <div className="flex justify-between space-x-2 text-white">
        <button
          className="flex h-5 w-5 items-center justify-center border-none outline-none"
          onClick={() => {
            updateCustomProperty("variant", HeadingVariants.Large);
          }}
        >
          A
        </button>
        <button
          className="flex h-5 w-5 items-center justify-center border-none outline-none"
          onClick={() => {
            updateCustomProperty("variant", HeadingVariants.Medium);
          }}
        >
          B
        </button>
        <button
          className="flex h-5 w-5 items-center justify-center border-none outline-none"
          onClick={() => {
            updateCustomProperty("variant", HeadingVariants.Small);
          }}
        >
          C
        </button>
      </div>
    </div>
  );

  const Markup = () => {
    switch ((element as HeadingType).variant) {
      case HeadingVariants.Medium:
        return (
          <h3 className="font-open-sans-condensed pt-2 text-[28px] font-bold leading-tight">
            <span>{children}</span>
          </h3>
        );
      case HeadingVariants.Small:
        return (
          <h4 className="font-open-sans-condensed pt-2 text-2xl font-bold leading-tight">
            <span>{children}</span>
          </h4>
        );
      default:
        return (
          <h2 className="font-open-sans-condensed pt-2 text-4xl font-bold leading-tight">
            <span>{children}</span>
          </h2>
        );
    }
  };

  return (
    <>
      {!readOnly && (
        <div
          {...attributes}
          className={`heading relative mb-4 transform transition-shadow duration-200 ${
            selected &&
            "ring-green-600 ring-offset-1 hover:rounded hover:ring-2"
          }`}
        >
          {headingToolbar}
          <Markup />
        </div>
      )}
      {readOnly && (
        <div {...attributes} className="mb-4">
          <Markup />
        </div>
      )}
    </>
  );
};

//
// Bulleted list
//
export const ListBlock = ({
  attributes,
  children,
  element,
  updateCustomProperty,
  updateListPoints,
}: defaultElementType &
  ReadOnly &
  CustomPropertyUpdater &
  CustomListPropertySetter) => {
  const selected = useSelected();
  const readOnly = useReadOnly();

  return (
    <ul
      {...attributes}
      className={`list-parent relative mb-10 transform rounded py-2 pl-10 font-serif text-lg transition-shadow duration-200 ${
        element.variant === ListTypeVariants.Ordered
          ? "list-decimal"
          : "list-disc"
      } ${
        selected && !readOnly && "ring-green-600 ring-offset-1 hover:ring-2"
      }`}
    >
      {!readOnly && selected && (
        <div
          contentEditable={false}
          className="list-toolbar absolute bottom-full left-1/2 z-20 flex -translate-x-1/2 transform items-center space-x-4 rounded bg-black px-3 py-1 text-white"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              updateCustomProperty("variant", ListTypeVariants.Unordered);
            }}
            className="h-6 w-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="1 0 47 47"
              className="fill-white"
            >
              <path d="M18.85 38.1v-3H42v3Zm0-12.6v-3H42v3Zm0-12.65v-3H42v3Zm-9.4 27.1q-1.4 0-2.4-.95t-1-2.4q0-1.4.975-2.375Q8 33.25 9.45 33.25q1.4 0 2.35 1 .95 1 .95 2.4 0 1.35-.975 2.325-.975.975-2.325.975Zm0-12.6q-1.4 0-2.4-.975T6.05 24q0-1.4 1-2.375 1-.975 2.4-.975 1.35 0 2.325.975.975.975.975 2.375t-.975 2.375q-.975.975-2.325.975ZM9.4 14.7q-1.4 0-2.375-.975-.975-.975-.975-2.375t.975-2.375Q8 8 9.4 8t2.375.975q.975.975.975 2.375t-.975 2.375Q10.8 14.7 9.4 14.7Z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              updateCustomProperty("variant", ListTypeVariants.Ordered);
            }}
            className="h-6 w-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="1 0 47 47"
              className="fill-white"
            >
              <path d="M6 44v-3h5v-1.5H8v-3h3V35H6v-3h6q.85 0 1.425.575Q14 33.15 14 34v2q0 .85-.575 1.425Q12.85 38 12 38q.85 0 1.425.575Q14 39.15 14 40v2q0 .85-.575 1.425Q12.85 44 12 44Zm0-14v-5.5q0-.85.575-1.425Q7.15 22.5 8 22.5h3V21H6v-3h6q.85 0 1.425.575Q14 19.15 14 20v3.5q0 .85-.575 1.425-.575.575-1.425.575H9V27h5v3Zm3-14V7H6V4h6v12Zm9.45 21.55v-3H42v3Zm0-12.15v-3H42v3Zm0-12.15v-3H42v3Z" />
            </svg>
          </button>
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </ul>
  );
};

//
// Bulleted list
//
export const ListItem = ({
  attributes,
  children,
  element,
  updateListPoints,
}: defaultElementType & CustomListPropertySetter) => {
  return (
    <li
      {...attributes}
      className="p-0 font-serif text-lg md:text-xl md:leading-8"
    >
      {children}
    </li>
  );
};

//
// new code Block
//
export const CodeBlock = ({
  attributes,
  children,
  element,
  updateCustomProperty,
  deleteBlockAtPath,
}: defaultElementType & CustomPropertyUpdater & DeleteBlockAtPath) => {
  const editor = useSlateStatic();
  const setLanguage = (lang: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { lang }, { at: path });
  };
  const ro = useReadOnly();

  // useEffect(() => {}, [element.lang]);
  return (
    <code
      spellCheck={false}
      lang={element.lang}
      className="relative mt-0 mb-10 block rounded bg-[#F7F8F9] px-[5px] py-[13px] text-base leading-snug caret-white"
      {...attributes}
    >
      <div className="relative pl-2">
        <Listbox
          value={element.lang}
          onChange={(lang) => {
            updateCustomProperty("lang", lang);
            setLanguage(lang);
          }}
          disabled={ro}
        >
          <Listbox.Button className="font-primary flex items-center text-xs font-medium text-black">
            <span
              contentEditable={false}
              className="mr-2 font-semibold tracking-wider"
            >
              {STRINGTOLANG[element.lang]}
            </span>
            {!ro && <ChevronDownIcon className="h-4 w-4" />}
          </Listbox.Button>

          <Listbox.Options className="font-primary absolute bottom-full z-20 max-h-96 min-w-[200px] space-y-3 overflow-y-auto rounded border border-neutral-200 bg-white p-3 text-base font-medium text-neutral-600 outline-none dark:bg-zinc-800">
            {Object.keys(LANGTOSTRING).map((l) => (
              <Listbox.Option
                key={l}
                value={LANGTOSTRING[l]}
                className="cursor-pointer"
              >
                {l}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
      <div className="mt-3 max-h-96 overflow-y-auto pl-6 text-black">
        {children}
      </div>
    </code>
  );
};

//
// code line element
//
export const CodeLine = ({
  attributes,
  children,
  element,
}: defaultElementType) => {
  return (
    <div
      className="font-mono caret-black"
      {...attributes}
      onPaste={(e: ClipboardEvent) => {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
      }}
    >
      {children}
    </div>
  );
};
