import { Box, Button } from "@mui/material";
import { ColorStyle } from "../constants/colorStyles";

const Keyboard = ({ alphabet }) => {
  const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"];

  const keyboardStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "5px",
    width: "80%",
    margin: "0 auto",
  };
  const rowStyle = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    gap: "5px",
  };
  const keyStyle = {
    outline: "none",
    fontWeight: "bold",
    ...ColorStyle.DEFAULT_KEYBOARD,
    flex: 1,
    minWidth: "30px",
    minHeight: "50px",
  };

  const renderKeyButton = (x) => {
    return (
      <Button
        key={x}
        sx={{
          ...keyStyle,
          ...alphabet.find((y) => y.letter === x).colorStyle,
        }}
        onClick={(e) => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: x }));
          e.target.blur();
        }}
      >
        {x}
      </Button>
    );
  };

  return (
    <Box sx={keyboardStyle}>
      <Box sx={rowStyle}>{topRow.map((x) => renderKeyButton(x))}</Box>
      <Box sx={rowStyle}>{middleRow.map((x) => renderKeyButton(x))}</Box>
      <Box sx={rowStyle}>
        <Button
          key="Enter"
          sx={{ ...keyStyle, minWidth: "60px", fontSize: "10px" }}
          onClick={(e) => {
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Enter" })
            );
            e.target.blur();
          }}
        >
          ENTER
        </Button>
        {bottomRow.map((x) => renderKeyButton(x))}
        <Button
          key="Backspace"
          sx={{ ...keyStyle, minWidth: "60px" }}
          onClick={(e) => {
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Backspace" })
            );
            e.target.blur();
          }}
        >
          ⌫
        </Button>
      </Box>
    </Box>
  );
};

export { Keyboard };
