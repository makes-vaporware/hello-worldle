import { Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const Header = ({ settingsOnClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        // borderBottom: "1px solid #aaa",
        margin: "15px",
      }}
    >
      <Box sx={{ flex: 1 }}></Box>
      <IconButton
        // sx={{ borderBottom: "1px solid #aaa" }}
        color="inherit"
        onClick={settingsOnClick}
      >
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};

export { Header };
