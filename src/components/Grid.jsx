import { Box, Typography } from "@mui/material";

const Grid = ({ grid }) => {
  return (
    <Box
      sx={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridGap: 10,
      }}
    >
      {grid.flat().map((x, i) => (
        <Box
          key={i}
          sx={{
            height: 50,
            width: 50,
            ...x.colorStyle,
            ...x.borderStyle,
            alignContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            {x.letter}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export { Grid };
