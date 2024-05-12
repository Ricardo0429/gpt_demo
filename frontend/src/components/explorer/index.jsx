import { Box } from '@mui/material';

export default function CommonExplorer({ title, description, children }) {
  return (
    <div className="common-explorer flex flex-col h-full justify-between">
      <Box>
        <p className="font-bold text-3xl mb-2">{title}</p>
        <p className="text-2xl">{description}</p>
      </Box>
      <Box className="flex-1">{children}</Box>
    </div>
  );
}
