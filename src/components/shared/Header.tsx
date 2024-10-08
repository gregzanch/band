import { AppBar } from "./AppBar";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import Image from "next/image";
export type HeaderProps = {};

export function Header({}: HeaderProps) {
  return (
    <AppBar sticky glass border color='plain' as='header'>
      <Flex direction='row' justify='between' css={{ paddingLeft: "$4", paddingRight: "$4" }}>
        <Box>
          <Flex>
            <Image src='/img/logo-new.svg' alt='Band Logo' width={32} height={32} />
          </Flex>
        </Box>
        <UserMenu />
      </Flex>
    </AppBar>
  );
}
