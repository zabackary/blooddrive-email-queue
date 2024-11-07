import { Box, Button, Stack } from "@mui/material";

export default function Home({
  onAdmin,
  onUser,
}: {
  onAdmin: () => void;
  onUser: () => void;
}) {
  return (
    <Box>
      <Stack justifyContent={"center"}>
        <Button onClick={onAdmin}>Open admin panel</Button>
        <Button onClick={onUser}>Open user display</Button>
      </Stack>
    </Box>
  );
}
