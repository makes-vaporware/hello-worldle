import {
  Box,
  Divider,
  IconButton,
  Modal,
  Switch,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SettingsModal = ({
  open,
  onClose,
  lightningRoundSelected,
  handleLightningRoundChange,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography component="div" sx={{ flex: 1, fontWeight: "bold" }}>
            SETTINGS
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
            // sx={{ mr: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider
          sx={{ borderBottom: "3px solid black", borderRadius: "5px" }}
        />
        <Box sx={{ padding: "1em 0" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ flex: 1 }}>Dark Theme</Typography>
            <Switch disabled />
          </Box>
          <Typography sx={{ fontSize: "12px", fontWeight: "light" }}>
            Use the dark theme instead. Coming soon!
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "1em 0" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ flex: 1 }}>Hard Mode</Typography>
            <Switch disabled />
          </Box>
          <Typography sx={{ fontSize: "12px", fontWeight: "light" }}>
            Any revealed hints must be used in subsequent guesses. Coming soon!
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "1em 0" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ flex: 1 }}>Lightning Round</Typography>
            <Switch
              checked={lightningRoundSelected}
              onChange={handleLightningRoundChange}
            />
          </Box>
          <Typography sx={{ fontSize: "12px", fontWeight: "light" }}>
            Games generate with 4 guesses pre-filled.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export { SettingsModal };
