import { RightSidebar } from "@/components/Editor/Sidebar/RightSidebar"
import { EditorToolbar } from "@/components/Editor/EditorToolbar"
import { LeftSidebar } from "@/components/Editor/Sidebar/LeftSidebar"
import Editor from "@/components/Editor/Editor";
import { useEffect } from "react"
import { globalCss, darkTheme, lightTheme } from "@/styles/stitches.config"
import useTheme from "@/state/theme"
import { MaterialDialog } from "@/components/Editor/MaterialDialog/MaterialDialog";
import { RaytracerSolverAlert } from "@/components/Editor/Alerts/RaytracerSolverAlert";
import { MaterialProvider, createMaterialStore } from "@/components/Editor/State/materials";

const globalStyles = globalCss({
  html: { width: "100%", height: "100%", margin: 0, padding: 0 },
  body: { width: "100%", height: "100%", margin: 0, padding: 0 },
  "#__next": { width: "100%", height: "100%", margin: 0, padding: 0 },
  ".csr-container": { width: "100%", height: "100%", margin: 0, padding: 0 },
  ".editor-stats": { bottom: "$2", right: "$2", top: "unset !important", left: "unset !important" },
});

export default function EditorPage() {
  const currTheme = useTheme((state) => state.theme);

  useEffect(() => {
    Object.assign(window, { useTheme });
    document.body.classList.remove(lightTheme, darkTheme);
    document.body.classList.add(currTheme);
  }, [currTheme]);

  globalStyles();

  return (
    <MaterialProvider createStore={createMaterialStore}>
      <EditorToolbar />
      <LeftSidebar />
      <RightSidebar />
      <MaterialDialog />
      <RaytracerSolverAlert />
      <Editor />
    </MaterialProvider>
  );
}
