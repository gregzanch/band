import useUserStore from "@/state/userStore";
import { Avatar, Box, Button, Grid } from "../shared";

export function ProfileAvatar() {
  const avatarUrl = useUserStore((state) => state.avatarUrl);
  const uploadAvatar = useUserStore((state) => state.uploadAvatar);
  return <Avatar src={avatarUrl} role='button' fallback='GZ' size='7' interactive onClick={uploadAvatar} />;
}
