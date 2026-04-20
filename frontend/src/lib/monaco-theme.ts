import { loader } from "@monaco-editor/react";

export const initMonacoTheme = () => {
  loader.init().then((monaco) => {
    monaco.editor.defineTheme("tokyo-drift", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "565f89", fontStyle: "italic" },
        { token: "keyword", foreground: "9d7cd8" },
        { token: "variable", foreground: "c0caf5" },
        { token: "variable.predefined", foreground: "c0caf5" },
        { token: "variable.parameter", foreground: "e0af68" },
        { token: "function", foreground: "7aa2f7" },
        { token: "string", foreground: "9ece6a" },
        { token: "constant", foreground: "ff9e64" },
        { token: "type", foreground: "0db9d7" },
        { token: "class", foreground: "0db9d7" },
        { token: "tag", foreground: "f7768e" },
        { token: "attribute", foreground: "e0af68" },
      ],
      colors: {
        "editor.background": "#1a1b26",
        "editor.foreground": "#a9b1d6",
        "editor.selectionBackground": "#33467C",
        "editor.lineHighlightBackground": "#1e202e",
        "editorCursor.foreground": "#c0caf5",
        "editorWhitespace.foreground": "#3b4261",
        "editorIndentGuide.background": "#292e42",
        "editorIndentGuide.activeBackground": "#414868",
        "editorLineNumber.foreground": "#414868",
        "editorLineNumber.activeForeground": "#737aa2",
      },
    });
  });
};
