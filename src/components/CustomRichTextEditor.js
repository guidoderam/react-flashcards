import React from "react";
import RichTextEditor from "react-rte";

const CustomRichTextEditor = props => {
  const { value, onChange } = props;

  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ["INLINE_STYLE_BUTTONS", "BLOCK_TYPE_BUTTONS", "HISTORY_BUTTONS"],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" }
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" }
    ]
  };

  return (
    <RichTextEditor
      toolbarConfig={toolbarConfig}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomRichTextEditor;
