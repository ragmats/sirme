import { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import Cube from "./components/Cube";
import Start from "./components/EnterNameAndStart";
import InfoPanel from "./components/InfoPanel";
import ControlPanel from "./components/ControlPanel";
import ScoreMessage from "./components/ScoreMessage";
import { ThemeContext } from "./contexts/ThemeContext";

// TODO cleanup code, removing functions that simple set state -- send the setters instead

export default function App() {
  const [endGame, setEndGame] = useState(true);
  const [computerStart, setComputerStart] = useState(false);
  const [
    disableButtonsDuringComputerMoves,
    setDisableButtonsDuringComputerMoves,
  ] = useState(false);
  const [defaultName] = useState("Guest");
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName")
      ? localStorage.getItem("playerName")
      : defaultName
  );
  const [round, setRound] = useState(1);
  const [points, setPoints] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [repeats, setRepeats] = useState(0);
  const [score, setScore] = useState(0);
  const [restart, setRestart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [quit, setQuit] = useState(false);
  const [numberOfHighScoresLimit, setNumberOfHighScoresLimit] = [10];
  const [playerRank, setPlayerRank] = useState(null);
  const [highScores, setHighScores] = useState(
    localStorage.getItem("highScores")
      ? JSON.parse(localStorage.getItem("highScores"))
      : []
  );
  const [personalBest, setPersonalBest] = useState(null);
  const [playerBusy, setPlayerBusy] = useState(false);
  const [computerSpeed, setComputerSpeed] = useState(0);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const lightThemeVariables = [
    { name: "--body-background-color", color: "#d5f5fc" },
    { name: "--body-text-color", color: "black" },
    { name: "--title-name-buttons-color", color: "red" },
    { name: "--main-buttons-hover-background-color", color: "yellow" },
    { name: "--main-buttons-hover-text-color", color: "red" },
    { name: "--main-buttons-disabled-color", color: "rgb(255, 150, 150)" },
    { name: "--highscores-table-stripe", color: "#c1e6f0" },
    { name: "--cube-side0-color", color: "red" },
    { name: "--cube-side1-color", color: "green" },
    { name: "--cube-side2-color", color: "blue" },
    { name: "--cube-shadow-color", color: "yellow" },
  ];

  const darkThemeVariables = [
    { name: "--body-background-color", color: "#212525" },
    { name: "--body-text-color", color: "#cbe4de" },
    { name: "--title-name-buttons-color", color: "#0e8388" },
    { name: "--main-buttons-hover-background-color", color: "#f9d923" },
    { name: "--main-buttons-hover-text-color", color: "#b25068" },
    { name: "--main-buttons-disabled-color", color: "#2a4242" },
    { name: "--highscores-table-stripe", color: "#303636" },
    { name: "--cube-side0-color", color: "red" },
    { name: "--cube-side1-color", color: "green" },
    { name: "--cube-side2-color", color: "blue" },
    { name: "--cube-shadow-color", color: "white" },
  ];

  useEffect(() => {
    // Save theme to local storage
    localStorage.setItem("theme", theme);
    if (theme === "light") {
      // Set CSS variables for light theme
      lightThemeVariables.forEach((variable) => {
        document.documentElement.style.setProperty(
          variable.name,
          variable.color
        );
      });
    } else if (theme === "dark") {
      // Set CSS variables for dark theme
      darkThemeVariables.forEach((variable) => {
        document.documentElement.style.setProperty(
          variable.name,
          variable.color
        );
      });
    }
  }, [theme]);

  /*
   * Resets when endGame ends or begins
   */
  useEffect(() => {
    if (endGame) {
      setComputerStart(false);
    } else {
      setComputerStart(true);
      getCurrentPlayerRank();
    }
  }, [endGame]);

  /*
   * Resets whenever the score changes
   */
  useEffect(() => {
    if (score > 0) {
      if (playerFound()) {
        const currentPlayerHighScore = getCurrentPlayerHighScore();
        if (score > currentPlayerHighScore) {
          updatePlayerHighScore();
        }
      } else {
        // If there is an open space, just go ahead and add the score
        if (highScores.length < numberOfHighScoresLimit) {
          addNewHighScore();
          // If no open space, replace the lowest score once the player exceeds it
        } else if (score > getLowestHighScore()) {
          replaceLowestHighScore();
        }
      }
    }
    getCurrentPlayerRank();
  }, [score]);

  /*
   * Resets whenever a high score is added or changed
   */
  useEffect(() => {
    if (highScores.length > 0) {
      highScores.sort((a, b) => b.score - a.score);
    }
    // Ref: https://blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/
    localStorage.setItem("highScores", JSON.stringify(highScores));
    getCurrentPlayerRank();
    setPersonalBest(getPersonalBest());
  }, [highScores]);

  /*
   * Resets whenever the player changes name
   */
  useEffect(() => {
    getCurrentPlayerRank();
  }, [playerName]);

  /*
   * Resets whenever player rank changes
   */
  useEffect(() => {
    // console.log({ playerRank });
    setPersonalBest(getPersonalBest());
  }, [playerRank]);

  /*
   * Resets when restart button is pressed, toggles back to false
   */
  useEffect(() => {
    if (restart) setRestart(false);
  }, [restart]);

  /*
   * Resets when quit button is pressed, toggles back to false
   */
  useEffect(() => {
    if (quit) setQuit(false);
  }, [quit]);

  /*
   * Resets when user gains a point or clicks repeat
   */
  useEffect(() => {
    setScore(points - repeats);
  }, [points, repeats]);

  function startGame() {
    setEndGame(false);
  }

  function handleEndGame() {
    setRound(1);
    setPoints(0);
    setRepeats(0);
    setEndGame(true);
    setGameOver(false);
    setComputerSpeed(0);
  }

  function handleRestart() {
    setRound(1);
    setPoints(0);
    setRepeats(0);
    setGameOver(false);
    setRestart(true);
  }

  function handleQuit() {
    setQuit(true);
  }

  function toggleDisableButtonsDuringComputerMoves(isDisabled) {
    setDisableButtonsDuringComputerMoves(isDisabled);
  }

  function advanceRound() {
    setRound((currentRound) => currentRound + 1);
  }

  function addPoint() {
    setPoints((currentPoints) => currentPoints + 1);
  }

  function repeatComputer() {
    setRepeat(true);
    addRepeat();
  }

  function addRepeat() {
    setRepeats((currentRepeats) => currentRepeats + 1);
  }

  function toggleRepeat() {
    setRepeat(!repeat);
  }

  function toggleGameOver() {
    setGameOver(!gameOver);
  }

  function togglePlayerBusy() {
    setPlayerBusy(!playerBusy);
  }

  function toggleComputerSpeed() {
    if (computerSpeed === 0) setComputerSpeed(1);
    if (computerSpeed === 1) setComputerSpeed(-1);
    if (computerSpeed === -1) setComputerSpeed(0);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // Check if user is already in highscores
  function playerFound() {
    const playerFound = highScores.some(
      (highScore) => highScore.name === playerName.toLowerCase()
    );
    return playerFound;
  }

  function getCurrentPlayerHighScore() {
    const currentPlayerHighScore = highScores.filter(
      (highScore) => highScore.name === playerName.toLowerCase()
    );
    return currentPlayerHighScore[0].score;
  }

  function getCurrentPlayerIdx() {
    const idx = highScores.findIndex(
      (highScore) => highScore.name === playerName.toLowerCase()
    );
    return idx;
  }

  function getCurrentPlayerRank() {
    if (playerFound()) {
      const idx = getCurrentPlayerIdx();
      setPlayerRank(idx + 1);
    } else {
      setPlayerRank(null);
    }
  }

  function getPersonalBest() {
    let currentPersonalBest;
    if (highScores.length > 0 && playerRank) {
      const currentPlayerIndex = getCurrentPlayerIdx();
      currentPersonalBest = highScores[currentPlayerIndex].score;
    } else {
      currentPersonalBest = null;
    }
    return currentPersonalBest;
  }

  function getLowestHighScore() {
    return highScores[highScores.length - 1].score;
  }

  function addNewHighScore() {
    const newHighScore = {
      id: uuidv4(),
      name: playerName.toLowerCase(),
      score: score,
    };
    setHighScores([...highScores, newHighScore]);
  }

  function replaceLowestHighScore() {
    highScores[numberOfHighScoresLimit - 1] = {
      id: uuidv4(),
      name: playerName.toLowerCase(),
      score: score,
    };
    setHighScores(highScores);
  }

  function updatePlayerHighScore() {
    const updatedHighScores = highScores.map((highscore) => {
      if (highscore.name === playerName.toLowerCase()) {
        return { ...highscore, score: score };
      }
      return highscore;
    });
    setHighScores(updatedHighScores);
  }

  function clearHighScores() {
    setHighScores([]);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <div className="app-main">
          {endGame ? (
            <Start
              startGame={startGame}
              setPlayerName={setPlayerName}
              defaultName={defaultName}
              playerName={playerName}
            />
          ) : null}
          <div>
            <h1>sirme</h1>
            <h4>a Simon game</h4>
            <div className="main">
              <InfoPanel
                playerName={playerName}
                round={round}
                points={points}
                repeats={repeats}
                score={score}
                playerRank={playerRank}
              />
              <div className="cube-panel">
                <Cube
                  computerStart={computerStart}
                  restart={restart}
                  handleEndGame={handleEndGame}
                  repeat={repeat}
                  toggleRepeat={toggleRepeat}
                  toggleDisableButtonsDuringComputerMoves={
                    toggleDisableButtonsDuringComputerMoves
                  }
                  advanceRound={advanceRound}
                  addPoint={addPoint}
                  gameOver={gameOver}
                  toggleGameOver={toggleGameOver}
                  handleRestart={handleRestart}
                  quit={quit}
                  playerBusy={playerBusy}
                  computerSpeed={computerSpeed}
                />
                <ScoreMessage
                  gameOver={gameOver}
                  personalBest={personalBest}
                  score={score}
                  playerRank={playerRank}
                />
              </div>
              <div className="control-panel">
                <ControlPanel
                  disableButtonsDuringComputerMoves={
                    disableButtonsDuringComputerMoves
                  }
                  repeatComputer={repeatComputer}
                  handleRestart={handleRestart}
                  playerName={playerName}
                  highScores={highScores}
                  clearHighScores={clearHighScores}
                  gameOver={gameOver}
                  handleQuit={handleQuit}
                  togglePlayerBusy={togglePlayerBusy}
                  computerSpeed={computerSpeed}
                  toggleComputerSpeed={toggleComputerSpeed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
