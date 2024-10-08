import { Box } from "./Box";
export type ContentProps = {
  children?: React.ReactChild | React.ReactChild[];
};
export function Content({ children }: ContentProps) {
  return <Box as='main'>{children}</Box>;
}
