import { Box } from "@/components/shared/Box"
import useEditor from "@/components/Editor/State/useEditor"
import { useEffect, useState } from "react"
import { Text } from "@/components/shared/Text"
import { styled } from "@/styles/stitches.config"

const HistoryItemContainer = styled(Box, {
  cursor: "pointer",
  display: "flex",
  width: "100%",
  flexDirection: "row",

  paddingLeft: "$2",
  paddingRight: "$2",
  paddingTop: "$1",
  paddingBottom: "$1",
  gap: "8px",
  alignItems: "flex-start",
  backgroundColor: "$slate2",
  color: "$highlight2",
  fontFamily: "$mono",
  "&:hover": {
    backgroundColor: "$slate3",
    color: "$hiContrast",
  },
})

function UndoItem({ undo }) {
  // return <Text>{undo.name}</Text>
  return (
    <HistoryItemContainer
      onClick={() => {
        useEditor.getState().history.goToState(undo.id)
        // console.log(undo)
      }}
    >
      <Text
        size='1'
        as='a'
        css={{
          cursor: "pointer",
          color: "inherit",
          fontFamily: "inherit",
        }}
      >
        {undo.name}
      </Text>
    </HistoryItemContainer>
  )
}

function RedoItem({ redo }) {
  return (
    <HistoryItemContainer
      onClick={() => {
        useEditor.getState().history.goToState(redo.id)
      }}
    >
      <Text
        size='1'
        as='a'
        css={{
          cursor: "pointer",
          color: "$highlight1",
          fontFamily: "inherit",
          textDecoration: "line-through",
          textDecorationThickness: "1px",
        }}
      >
        {redo.name}
      </Text>
    </HistoryItemContainer>
  )
}

export default function HistoryPanel() {
  const history = useEditor((state) => state.history)
  const signals = useEditor((state) => state.signals)

  const [undos, setUndos] = useState(history.undos.map((undo) => undo.toJSON()))
  const [redos, setRedos] = useState(history.redos.map((redo) => redo.toJSON()).reverse())

  useEffect(() => {
    const listener = (cmd) => {
      // console.log(cmd)
      setUndos(history.undos.map((undo) => undo.toJSON()))
      setRedos(history.redos.map((redo) => redo.toJSON()).reverse())
      // console.log(history.undos, history.redos)
    }
    signals.historyChanged.add(listener)
    return () => {
      if (signals.historyChanged.has(listener)) {
        signals.historyChanged.remove(listener)
      }
    }
  }, [history.redos, history.undos, signals.historyChanged])

  return (
    <Box fillHeight>
      {undos.map((undo) => (
        <UndoItem undo={undo} key={undo.id} />
      ))}
      {redos.map((redo) => (
        <RedoItem redo={redo} key={redo.id} />
      ))}
    </Box>
  )
}
