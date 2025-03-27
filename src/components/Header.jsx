import { Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const Header = ({ settingsOnClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: "1px solid #aaa",
        margin: "10px",
      }}
    >
      <Box sx={{ flex: 1 }}></Box>
      <IconButton color="inherit" onClick={settingsOnClick}>
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};

export { Header };
