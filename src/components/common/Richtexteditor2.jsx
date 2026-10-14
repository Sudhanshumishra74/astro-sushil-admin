import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Image as ImageIcon } from "lucide-react";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading2,
  Heading3,
  Quote,
  Minus,
  RotateCcw,
  RotateCw,
  Table2,
  Rows,
  Columns,
} from "lucide-react";
import { useRef } from "react";

function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition text-sm
        ${
          active
            ? "bg-[#6c63ff] text-white shadow-sm shadow-[#6c63ff]/30"
            : "text-[#7c7ca0] hover:bg-[#f0f0fb] hover:text-[#6c63ff]"
        }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-[#e8e8f4] shrink-0" />;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Detailed product description, features, specifications...",
  minHeight = 200,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
        },

        orderedList: {
          keepMarks: true,
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-[#b0b0cc] before:pointer-events-none before:h-0",
      }),

      Image,

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[inherit] max-w-none text-[#1a1a2e]",
      },
      handlePaste(view, event) {
        // If clipboard has HTML, let Tiptap handle it natively to preserve formatting
        const html = event.clipboardData?.getData("text/html");
        if (html) return false;

        const text = event.clipboardData?.getData("text/plain");

        if (text) {
          const lines = text
            .split(/\r?\n/)
            .filter((line) => line.trim() !== "");

          if (lines.length > 1) {
            const { schema } = view.state;

            const fragment = schema.nodeFromJSON({
              type: "doc",
              content: lines.map((line) => ({
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: line,
                  },
                ],
              })),
            });

            const transaction = view.state.tr.replaceSelectionWith(
              fragment,
              false,
            );

            view.dispatch(transaction);

            return true;
          }
        }

        // image paste
        const items = event.clipboardData?.items;

        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          if (item.type.startsWith("image")) {
            const file = item.getAsFile();

            const reader = new FileReader();

            reader.onload = (e) => {
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({
                    src: e.target.result,
                  }),
                ),
              );
            };

            reader.readAsDataURL(file);

            return true;
          }
        }

        return false;
      },
    },
  });
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-[#e8e8f4] bg-white transition focus-within:border-[#6c63ff] focus-within:ring-2 focus-within:ring-[#6c63ff]/10 overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#f0f0f8] bg-[#fafafd] px-2.5 py-1.5">
        <ToolBtn
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <RotateCcw size={13} />
        </ToolBtn>
        <ToolBtn
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RotateCw size={13} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={14} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={13} />
        </ToolBtn>
        <ToolBtn
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={13} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14} />
        </ToolBtn>

        <ToolBtn
          title="Ordered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Align Left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={13} />
        </ToolBtn>
        <ToolBtn
          title="Align Center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={13} />
        </ToolBtn>
        <ToolBtn
          title="Align Right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={13} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={13} />
        </ToolBtn>
        <ToolBtn
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={13} />
        </ToolBtn>
        <ToolBtn
          title="Insert Image"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={13} />
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Table2 size={13} />
        </ToolBtn>

        <ToolBtn onClick={() => editor.chain().focus().deleteRow().run()}>
          <Rows size={13} />
        </ToolBtn>

        <ToolBtn onClick={() => editor.chain().focus().deleteColumn().run()}>
          <Columns size={13} />
        </ToolBtn>
      </div>

      <div
        className="px-3.5 py-3 overflow-y-auto"
        style={{ minHeight, maxHeight: 480 }}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !editor) return;

          const reader = new FileReader();

          reader.onload = (event) => {
            editor.chain().focus().setImage({ src: event.target.result }).run();
          };

          reader.readAsDataURL(file);

          e.target.value = "";
        }}
      />
      <style>{`
        .ProseMirror {
          outline: none;
        }

        .ProseMirror h2 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0.6em 0 0.3em;
          color: #1a1a2e;
        }

        .ProseMirror h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0.5em 0 0.25em;
          color: #1a1a2e;
        }

        .ProseMirror p {
          margin: 0.25em 0;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        /* BULLETS FIX */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .ProseMirror ul ul {
          list-style-type: circle;
        }

        .ProseMirror ul ul ul {
          list-style-type: square;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror li p {
          margin: 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #6c63ff;
          padding-left: 0.75rem;
          color: #7c7ca0;
          font-style: italic;
          margin: 0.4em 0;
        }

        .ProseMirror hr {
          border: none;
          border-top: 1px solid #e8e8f4;
          margin: 0.75em 0;
        }

        .ProseMirror strong {
          font-weight: 700;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror u {
          text-decoration: underline;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #e8e8f4;
          padding: 8px;
        }

        .ProseMirror th {
          background: #fafafd;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
