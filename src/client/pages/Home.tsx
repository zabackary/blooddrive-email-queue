import { Box, Button, Stack } from "@mui/material";

export default function Home({
  onAdmin,
  onUser,
  onUserCode,
}: {
  onAdmin: () => void;
  onUser: () => void;
  onUserCode: () => void;
}) {
  return (
    <Box>
      <Stack justifyContent={"center"}>
        <Button onClick={onAdmin}>Open admin panel</Button>
        <Button onClick={onUser}>Open user display</Button>
        <Button onClick={onUserCode}>Open user display (with QR code)</Button>
      </Stack>
    </Box>
  );
}
