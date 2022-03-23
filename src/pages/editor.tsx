import { SidePanel } from "@/components/dom/SidePanel"
import Editor from "@/components/canvas/Editor/Editor"
import MenuBar from "@/components/dom/MenuBar"

export default function EditorPage() {
  return (
    <>
      <MenuBar />
      <SidePanel />
      <Editor />
    </>
  )
}
