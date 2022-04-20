import { Button } from "@/components/shared/Button";
import {
  // Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogCloseButton,
} from "@/components/shared/Dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { Flex } from "@/components/shared/Flex";
import { Box } from "@/components/shared/Box";
import { Heading } from "@/components/shared/Heading";
import { Text } from "@/components/shared/Text";
import { useTransition, animated, config } from "react-spring";
import useEditor from "../State/useEditor";
import { IconButton } from "@/components/shared/IconButton";
import { Cross1Icon } from "@radix-ui/react-icons";
import { MaterialView } from "./MaterialView";
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@/components/shared/ScrollArea";

export function MaterialDialog({}) {
  const open = useEditor((state) => state.materialDialogOpen);
  const transitions = useTransition(open, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff,
  });
  return (
    <Dialog.Root
      defaultOpen={false}
      open={open}
      onOpenChange={(isOpen) => useEditor.setState({ materialDialogOpen: isOpen })}
    >
      {transitions((styles, item) =>
        item ? (
          <>
            <DialogContent forceMount asChild css={{ px: 0, boxShadow: "0px 0px 0px 2px $colors$slate7" }}>
              <animated.div style={styles}>
                <DialogTitle>Materials</DialogTitle>
                <ScrollArea css={{ width: "100%", height: 300 }}>
                  <ScrollAreaViewport>
                    <MaterialView />
                  </ScrollAreaViewport>
                  <ScrollAreaScrollbar orientation='vertical'>
                    <ScrollAreaThumb />
                  </ScrollAreaScrollbar>
                </ScrollArea>
                <DialogCloseButton asChild>
                  <IconButton variant='ghost'>
                    <Cross1Icon />
                  </IconButton>
                </DialogCloseButton>
                <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
                  <DialogClose>
                    <Button aria-label='Close' variant='green'>
                      Save changes
                    </Button>
                  </DialogClose>
                </Flex>
              </animated.div>
            </DialogContent>
          </>
        ) : null
      )}
    </Dialog.Root>
  );
}
