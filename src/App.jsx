import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./App.css";
import { answers, guesses } from "./words/words.js";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";

const ColorStyle = Object.freeze({
  GREEN: { backgroundColor: "#6aaa64", color: "#ffffff" },
  YELLOW: { backgroundColor: "#c9b458", color: "#ffffff" },
  GREY: { backgroundColor: "#787c7e", color: "#ffffff" },
  DEFAULT_GRID: { backgroundColor: "#ffffff", color: "#000000" },
  DEFAULT_KEYBOARD: { backgroundColor: "#d3d8da", color: "#000000" },
});

const COLOR_STYLE_ORDER = [
  ColorStyle.GREEN,
  ColorStyle.YELLOW,
  ColorStyle.GREY,
  ColorStyle.DEFAULT_GRID,
  ColorStyle.DEFAULT_KEYBOARD,
];

const getMinColorStyle = (enum1, enum2) => {
  return COLOR_STYLE_ORDER.indexOf(enum1) < COLOR_STYLE_ORDER.indexOf(enum2)
    ? enum1
    : enum2;
};

const BorderStyle = Object.freeze({
  EMPTY: { border: "2px solid #dddddd" },
  FILLED: { border: "2px solid black" },
  LOCKED: { border: "2px solid transparent" },
});

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

const App = () => {
  const [gameActive, setGameActive] = useState(true);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [grid, setGrid] = useState(
    Array.from({ length: 6 }).map((_) =>
      Array.from({ length: 5 }).map((_) => {
        return {
          letter: "",
          colorStyle: ColorStyle.DEFAULT_GRID,
          borderStyle: BorderStyle.EMPTY,
        };
      })
    )
  );
  const [alphabet, setAlphabet] = useState(
    [..."QWERTYUIOPASDFGHJKLZXCVBNM"].map((x) => {
      return { letter: x, colorStyle: ColorStyle.DEFAULT_KEYBOARD };
    })
  );
  const [answer, setAnswer] = useState(
    answers[Math.floor(Math.random() * answers.length)]
    // "dress"
  );

  const checkGuess = (guess, answer) => {
    let expected = answer.split("").map((x) => {
      return { letter: x, flagged: false };
    });
    let results = guess.split("").map((x) => {
      return { letter: x, flagged: false, colorStyle: ColorStyle.GREY };
    });

    // first pass: flag exact matches
    for (const i in results) {
      if (results[i].letter === expected[i].letter) {
        expected[i].flagged = true;
        results[i].flagged = true;
        results[i].colorStyle = ColorStyle.GREEN;
      }
    }

    // second pass: compare unflagged guesses against unflagged answers
    for (const i in results) {
      for (const j in expected) {
        if (
          !results[i].flagged &&
          !expected[j].flagged &&
          results[i].letter === expected[j].letter
        ) {
          expected[j].flagged = true;
          results[i].flagged = true;
          results[i].colorStyle = ColorStyle.YELLOW;
          break;
        }
      }
    }

    return results.map((x) => x.colorStyle);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameActive) return;

      const key = e.key;

      // check if it's a letter a-z or A-Z, add to grid
      if (/^[a-zA-Z]$/.test(key)) {
        if (currentCol < 5) {
          setGrid((prevGrid) => {
            let newGrid = prevGrid.map((row) => [...row]);
            newGrid[currentRow][currentCol].letter = key.toUpperCase();
            newGrid[currentRow][currentCol].borderStyle = BorderStyle.FILLED;
            return newGrid;
          });
          setCurrentCol((prevCol) => prevCol + 1);
        }
      }

      // if it's backspace, delete the last letter
      if (key === "Backspace") {
        if (currentCol > 0) {
          setGrid((prevGrid) => {
            let newGrid = prevGrid.map((row) => [...row]);
            newGrid[currentRow][currentCol - 1].letter = "";
            newGrid[currentRow][currentCol - 1].borderStyle = BorderStyle.EMPTY;

            return newGrid;
          });
          setCurrentCol((prevCol) => (prevCol === 0 ? 0 : currentCol - 1));
        }
      }

      // if enter, move to next row
      if (key === "Enter") {
        // exceptions:
        // not enough letters
        if (currentCol !== 5) {
          return enqueueSnackbar("Not enough letters!");
        }

        let guess = grid[currentRow]
          .map((x) => x.letter)
          .join("")
          .toLowerCase();

        // not a valid word
        if (!guesses.includes(guess)) {
          return enqueueSnackbar("Not in word list!");
        }

        const matches = checkGuess(guess, answer);

        // display visual stuff here
        setGrid((prevGrid) => {
          let newGrid = prevGrid.map((row) => [...row]);
          for (const i in matches) {
            newGrid[currentRow][i].colorStyle = matches[i];
            newGrid[currentRow][i].borderStyle = BorderStyle.LOCKED;
          }
          return newGrid;
        });

        setAlphabet((prevAlphabet) => {
          let newAlphabet = prevAlphabet;
          for (const i in matches) {
            let letter = newAlphabet.find(
              (x) => x.letter === guess[i].toUpperCase()
            );
            letter.colorStyle = getMinColorStyle(letter.colorStyle, matches[i]);
          }
          return newAlphabet;
        });

        if (matches.every((x) => x === ColorStyle.GREEN)) {
          enqueueSnackbar(
            `Answer was ${answer.toUpperCase()}! Congratulations!`,
            {
              persist: true,
              variant: "success",
              SnackbarProps: {onClick: () => closeSnackbar()},
            }
          );
          setGameActive(false);
        } else {
          setCurrentRow((prevRow) => prevRow + 1);
          setCurrentCol(0);

          if (currentRow + 1 > 5) {
            enqueueSnackbar(`Game Over! Word was ${answer.toUpperCase()}`, {
              persist: true,
              variant: "error",
              SnackbarProps: {onClick: () => closeSnackbar()},
            });
            setGameActive(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentRow, currentCol, grid, gameActive]);

  return (
    <Box>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1500}
        maxSnack={1}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "5px solid black",
          borderRadius: "5px",
          margin: "10px",
        }}
      >
        <Typography sx={{ fontSize: "26px", fontWeight: "bold" }}>
          HELLO WORLDLE
        </Typography>
        {!gameActive && (
          <Button
            sx={{
              display: "inline-block",
              float: "right",
              fontWeight: "bold",
              color: "black",
              border: "1px solid black",
              height: "30px",
              fontSize: "10px",
            }}
            onClick={() => {
              setCurrentRow(0);
              setCurrentCol(0);
              setGrid(
                Array.from({ length: 6 }).map((_) =>
                  Array.from({ length: 5 }).map((_) => {
                    return {
                      letter: "",
                      colorStyle: ColorStyle.DEFAULT_GRID,
                      borderStyle: BorderStyle.EMPTY,
                    };
                  })
                )
              );
              setAlphabet(
                [..."QWERTYUIOPASDFGHJKLZXCVBNM"].map((x) => {
                  return { letter: x, colorStyle: ColorStyle.DEFAULT_KEYBOARD };
                })
              );
              setAnswer(answers[Math.floor(Math.random() * answers.length)]);
              closeSnackbar();
              setGameActive(true);
            }}
          >
            PLAY AGAIN
          </Button>
        )}
      </Box>
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
      <p> </p>
      <Keyboard alphabet={alphabet} />
    </Box>
  );
};

export default App;
