import { ColorStyle } from "../constants/colorStyles";

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

export { checkGuess };
