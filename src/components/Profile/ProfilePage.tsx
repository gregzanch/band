import { Box, Flex, Heading, Layout, Separator } from "@/components/shared";
import { UserInfo } from "./UserInfo";

export function ProfilePage() {
  return (
    <Layout title='Band | Profile'>
      <Flex direction='column' css={{ margin: "$3", maxWidth: "100vw", alignItems: "center" }}>
        <Box>
          <Box css={{ marginBottom: "$4" }}>
            <Heading size='4'>Profile</Heading>
            <Separator css={{ marginBottom: "$1", marginTop: "$1" }} />
          </Box>
          <UserInfo />
        </Box>
      </Flex>
    </Layout>
  );
}
