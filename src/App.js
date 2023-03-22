// import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import Cube from "./components/Cube";
import Start from "./components/EnterNameAndStart";
import HighScores from "./components/HighScores";
import Button from "react-bootstrap/Button";
import InfoPanel from "./components/InfoPanel";
import ControlPanel from "./components/ControlPanel";
import ScoreMessage from "./components/ScoreMessage";

// TODO Reduce flickering of Personal Best message -- possibly have a state that only changes if this changes, not getting checked every score change. Maybe call it "scoreMessage"

// TODO move left and right panels into their own components - is there an easier way to set states of other components other than props? useContext?
// TODO Add cool styling to buttons
// TODO Add cool styling to flashing sides
// TODO Add cool styling to player turn behind cube?
// TODO Add link to website?
// TODO Possibly move retry/quit buttons from Cube to here. Should it be a GameOver component?
// TODO Emris' suggestion: add WAD and Arrow controls for move inputs

export default function App() {
  const [endGame, setEndGame] = useState(true);
  const [computerStart, setComputerStart] = useState(false);
  const [
    disableButtonsDuringComputerMoves,
    setDisableButtonsDuringComputerMoves,
  ] = useState(false);
  const [defaultName] = useState("Guest Player");
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
   * Resets whenever player changes name
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

  function getNewPlayerName(newPlayerName) {
    if (localStorage.getItem("playerName")) {
      setPlayerName(localStorage.getItem("playerName"));
    } else {
      setPlayerName(newPlayerName);
    }
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
    <div className="App">
      {endGame ? (
        <Start
          startGame={startGame}
          getNewPlayerName={getNewPlayerName}
          defaultName={defaultName}
          playerName={playerName}
        />
      ) : null}
      <div>
        <h1>sirme</h1>
        <h4>a Simon game</h4>
        <div className="main">
          <div className="main-inside">
            <InfoPanel
              playerName={playerName}
              round={round}
              points={points}
              repeats={repeats}
              score={score}
              playerRank={playerRank}
            />
          </div>
          <div className="main-inside">
            <Cube
              playerName={playerName}
              computerStart={computerStart}
              restart={restart}
              handleEndGame={handleEndGame}
              handleRestart={handleRestart}
              repeat={repeat}
              toggleRepeat={toggleRepeat}
              toggleDisableButtonsDuringComputerMoves={
                toggleDisableButtonsDuringComputerMoves
              }
              advanceRound={advanceRound}
              addPoint={addPoint}
              gameOver={gameOver}
              toggleGameOver={toggleGameOver}
              quit={quit}
            />
            <ScoreMessage
              gameOver={gameOver}
              personalBest={personalBest}
              score={score}
              playerRank={playerRank}
            />
          </div>
          <div className="main-inside">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
