import Main from "@/components/Docs/Markdown/main.mdx";
import { Grid } from "@/components/shared/Grid";
import { Flex } from "@/components/shared/Flex";
import { DocsHeader } from "@/components/Docs/DocsHeader";
import { MainContent } from "@/components/Docs/MainContent";

export function Docs() {
  return (
    <Flex
      direction='column'
      css={{
        height: "100vh",
      }}
    >
      <DocsHeader />
      <MainContent />
    </Flex>
  );
}
