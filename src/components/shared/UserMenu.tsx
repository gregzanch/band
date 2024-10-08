import Link from "next/link";
import { Avatar } from "./Avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./DropdownMenu";

export type UserMenuProps = {};

export function UserMenu({}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar src='/im/logo-new.svg' role='button' fallback='GZ' size='3' interactive />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='DropdownMenuContent' sideOffset={5}>
        <Link href='/profile' passHref>
          <a>
            <DropdownMenuItem className='DropdownMenuItem'>Profile</DropdownMenuItem>
          </a>
        </Link>
        <DropdownMenuItem className='DropdownMenuItem'>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
