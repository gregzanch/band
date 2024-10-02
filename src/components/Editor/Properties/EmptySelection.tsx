import { Text } from "@/components/shared/Text";
import { Box } from "@/components/shared/Box";

type EmptySelectionProps = {
  text: string;
};

export function EmptySelection({ text }: EmptySelectionProps) {
  return (
    <Box
      css={{
        backgroundColor: "$slate2",
        py: "0.5rem",
      }}
    >
      <Text
        size='1'
        css={{
          textAlign: "center",
          // opacity: "0.25",
          fontFamily: "$mono",
          color: "$highlight1",
        }}
      >
        {text}
      </Text>
    </Box>
  );
}
