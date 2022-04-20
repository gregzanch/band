import { Box } from "@/components/shared/Box";
import { Flex } from "@/components/shared/Flex";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/shared/Table";
import { Text } from "@/components/shared/Text";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import { copyString } from "@/helpers/dom/clipboard";

export function AbsorptionTable({ data }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th align='center' css={{ py: 0 }}>
            <Flex
              justify='center'
              align='center'
              gap='1'
              fillHeight
              onClick={() => {
                const str = data.map((d) => d.frequency).join("\n");
                copyString(str);
              }}
              css={{
                position: "relative",
                py: "$2",
                "& > div": {
                  opacity: 0,
                },
                "&:hover > div": {
                  opacity: 1,
                },
              }}
            >
              <Text bold inline size='2'>
                Frequency (Hz)
              </Text>
              <Box css={{ position: "absolute", right: "$2" }}>
                <ClipboardCopyIcon />
              </Box>
            </Flex>
          </Th>
          <Th align='center' css={{ py: 0 }}>
            <Flex
              justify='center'
              align='center'
              gap='1'
              fillHeight
              onClick={() => {
                const str = data.map((d) => d.absorption).join("\n");
                copyString(str);
              }}
              css={{
                position: "relative",
                py: "$2",
                "& > div": {
                  opacity: 0,
                },
                "&:hover > div": {
                  opacity: 1,
                },
              }}
            >
              <Text bold inline size='2'>
                Absorption
              </Text>
              <Box css={{ position: "absolute", right: "$2" }}>
                <ClipboardCopyIcon />
              </Box>
            </Flex>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((d) => {
          return (
            <Tr key={d.frequency}>
              <Td align='center'>
                <Text inline size='1'>
                  {d.frequency}
                </Text>
              </Td>
              <Td align='center'>
                <Text inline size='1'>
                  {d.absorption}
                </Text>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
