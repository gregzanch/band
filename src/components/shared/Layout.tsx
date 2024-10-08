import Head from "next/head";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { Header } from "./Header";
import { Content } from "./Content";

export type LayoutProps = {
  title: string;
  children?: React.ReactChild | React.ReactChild[];
};

export function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Flex direction='column'>
        <Header />
        <Content>{children}</Content>
      </Flex>
    </>
  );
}
