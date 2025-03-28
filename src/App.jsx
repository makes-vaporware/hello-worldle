import "./App.css";
import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { answers, guesses } from "./words/words.js";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import { GameState } from "./constants/gameStates.js";
import { ColorStyle } from "./constants/colorStyles.js";
import { BorderStyle } from "./constants/borderStyles.js";
import { getMinColorStyle } from "./utils/getMinColorStyle.js";
import { Keyboard } from "./components/Keyboard.jsx";
import { checkGuess } from "./utils/checkGuess.js";
import { Grid } from "./components/Grid.jsx";
import { SettingsModal } from "./components/SettingsModal.jsx";
import { Header } from "./components/Header.jsx";

const App = () => {
  const [gameState, setGameState] = useState(GameState.ACTIVE);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [lightningRoundSelected, setLightningRoundSelected] = useState(false);
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
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== GameState.ACTIVE) return;

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
              SnackbarProps: { onClick: () => closeSnackbar() },
            }
          );
          setGameState(GameState.INACTIVE);
        } else {
          setCurrentRow((prevRow) => prevRow + 1);
          setCurrentCol(0);

          if (currentRow + 1 > 5) {
            enqueueSnackbar(`Game Over! Word was ${answer.toUpperCase()}`, {
              persist: true,
              variant: "error",
              SnackbarProps: { onClick: () => closeSnackbar() },
            });
            setGameState(GameState.INACTIVE);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentRow, currentCol, grid, gameState, answer]);

  const restartGame = async () => {
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
    setGameState(GameState.PENDING_MODIFIERS);
  };

  const lightningRound = async () => {
    // lightning round
    // 4 words already done.
    console.log("Lightning Round!");
    const guesses = [];
    while (guesses.length < 4) {
      let guess = answers[Math.floor(Math.random() * answers.length)];
      while (guess === answer || guesses.includes(guess)) {
        guess = answers[Math.floor(Math.random() * answers.length)];
      }
      guesses.push(guess);
    }

    for (let j = 0; j < 4; j++) {
      const matches = checkGuess(guesses[j], answer);

      setGrid((prevGrid) => {
        let newGrid = prevGrid.map((row) => [...row]);
        for (const i in matches) {
          newGrid[j][i].letter = guesses[j].at(i).toUpperCase();
          newGrid[j][i].colorStyle = matches[i];
          newGrid[j][i].borderStyle = BorderStyle.LOCKED;
        }
        return newGrid;
      });

      setAlphabet((prevAlphabet) => {
        let newAlphabet = prevAlphabet;
        for (const i in matches) {
          let letter = newAlphabet.find(
            (x) => x.letter === guesses[j][i].toUpperCase()
          );
          letter.colorStyle = getMinColorStyle(letter.colorStyle, matches[i]);
        }
        return newAlphabet;
      });

      setCurrentRow((prevRow) => prevRow + 1);
    }
  };

  useEffect(() => {
    if (gameState === GameState.PENDING_MODIFIERS) {
      // if lightning round check
      if (lightningRoundSelected) {
        lightningRound();
      }
      setGameState(GameState.ACTIVE);
    }
  }, [gameState]);

  const handleCloseSettingsModal = () => {
    setSettingsModalOpen(false);
  };

  return (
    <Box>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1500}
        maxSnack={1}
      />
      <Header settingsOnClick={() => setSettingsModalOpen(true)} />
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
          HELLO WORLDLE!
        </Typography>
        <SettingsModal
          open={settingsModalOpen}
          onClose={handleCloseSettingsModal}
          lightningRoundSelected={lightningRoundSelected}
          handleLightningRoundChange={(e) => {
            setLightningRoundSelected(e.target.checked);
          }}
        />
        {
          /*!gameActive &&*/ <Button
            sx={{
              display: "inline-block",
              float: "right",
              fontWeight: "bold",
              color: "black",
              border: "1px solid black",
              height: "30px",
              fontSize: "10px",
            }}
            onClick={(e) => {
              restartGame();
              e.target.blur();
            }}
          >
            PLAY AGAIN
          </Button>
        }
      </Box>
      <Grid grid={grid} />
      <p /> {/* lol */}
      <Keyboard alphabet={alphabet} />
    </Box>
  );
};

export default App;
