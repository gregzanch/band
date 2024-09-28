import { Grid } from "@/components/shared/Grid";
import { DocsNavigationBar } from "@/components/Docs/DocsNavigationBar";
import { Content } from "@/components/Docs/Content";

export function MainContent() {
  return (
    <Grid
      columns='3'
      css={{
        gridTemplateColumns: "300px 1fr",
      }}
    >
      <DocsNavigationBar />
      <Content />
    </Grid>
  );
}
