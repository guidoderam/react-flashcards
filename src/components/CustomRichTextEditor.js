import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/paste";
import "tinymce/plugins/autoresize";

const CustomRichTextEditor = props => {
  const { value, onChange } = props;

  return (
    <Editor
      initialValue="<p></p>"
      init={{
        height: 500,
        menubar: false,
        plugins: ["paste", "autoresize"],
        toolbar:
          "undo redo | formatselect | bold italic underline | bullist numlist | removeformat"
      }}
      onEditorChange={onChange}
      value={value}
    />
  );
};

export default CustomRichTextEditor;
