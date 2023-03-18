// import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import Cube from "./components/Cube";
import Start from "./components/EnterNameAndStart";
import HighScores from "./components/HighScores";

// TODO Show score to beat if player has a previous high score
// TODO Change "score to beat" to "New high score!" if current player beats it
// TODO Handle names that are too long with...
// TODO handle same player names with different capitalization -- convert to all CAP?
// TODO move left and right panels into their own components - is there an easier way to set states of other components other than props? useContext?
// TODO Add cool styling to buttons
// TODO Add cool styling to flashing sides
// TODO Add cool styling to player turn behind cube?
// TODO Add link to website?
// TODO Possibly move retry/quit buttons from Cube to here. Should it be a GameOver component?
//

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
  const [numberOfHighScores, setNumberOfHighscores] = [10];
  const [highScores, setHighScores] = useState(
    localStorage.getItem("highScores")
      ? JSON.parse(localStorage.getItem("highScores"))
      : []
  );
  const [areYouSure, setAreYouSure] = useState(false);

  /*
   * Resets when endGame ends or begins
   */
  useEffect(() => {
    if (endGame === false) {
      setComputerStart(true);
    } else {
      setComputerStart(false);
    }
  }, [endGame]);

  /*
   * Resets whenever the score changes
   */
  useEffect(() => {
    if (score > 0) {
      // Check if user is already in highscores
      const playerFound = highScores.some(
        (highScore) => highScore.name === playerName
      );

      // Add to highscores if player is not already present
      if (!playerFound) {
        // If there is an open space, just go ahead and add the score
        if (highScores.length < numberOfHighScores) {
          addNewHighScore();
          // If no open space, repace the lowest score once the player exceeds it
        } else if (score > highScores[numberOfHighScores - 1].score) {
          replaceLowestHighScore();
        }
      } else {
        const currentPlayerHighScore = highScores.filter(
          (highScore) => highScore.name === playerName
        );
        if (score > currentPlayerHighScore[0].score) updatePlayerHighScore();
      }
    }
  }, [score]);

  useEffect(() => {
    console.log(highScores);
    console.log(typeof highScores);
    if (highScores) {
      highScores.sort((a, b) => b.score - a.score);
      // Ref: https://blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/
      localStorage.setItem("highScores", JSON.stringify(highScores));
    }
  }, [highScores]);

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

  // Send function as a prop so modal can begin the game
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

  function addNewHighScore() {
    const newHighScore = {
      id: uuidv4(),
      name: playerName,
      score: score,
    };
    setHighScores([...highScores, newHighScore]);
  }

  function replaceLowestHighScore() {
    highScores[numberOfHighScores - 1] = {
      id: uuidv4(),
      name: playerName,
      score: score,
    };
    setHighScores(highScores);
  }

  function updatePlayerHighScore() {
    // Update existing high scores
    const updatedHighScores = highScores.map((highscore) => {
      if (highscore.name === playerName) {
        return { ...highscore, score: score };
      }
      return highscore;
    });
    setHighScores(updatedHighScores);
  }

  function clearHighScores() {
    setHighScores([]);
  }

  function toggleAreYouSure() {
    setAreYouSure(!areYouSure);
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
            <p className="name">{playerName}</p>
            <p>Round: {round}</p>
            <p>Points: {points}</p>
            <p>Repeats: ({repeats})</p>
            <p>Total Score: {score}</p>
          </div>
          <div className="main-inside">
            {gameOver ? <p>:(</p> : <p>Points until high score: 9,999</p>}
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
          </div>
          <div className="main-inside">
            <button
              disabled={disableButtonsDuringComputerMoves ? true : false}
              onClick={() => repeatComputer()}
            >
              Repeat
            </button>
            <br />
            <button
              disabled={disableButtonsDuringComputerMoves ? true : false}
              onClick={handleRestart}
            >
              Restart
            </button>
            <br />
            <HighScores
              highScores={highScores}
              clearHighScores={clearHighScores}
              areYouSure={areYouSure}
              toggleAreYouSure={toggleAreYouSure}
              disableButtonsDuringComputerMoves={
                disableButtonsDuringComputerMoves
              }
              gameOver={gameOver}
            />
            <br />
            <button
              disabled={
                disableButtonsDuringComputerMoves && !gameOver ? true : false
              }
              onClick={() => setQuit(true)}
            >
              Quit
            </button>
            <br />
            <button
              disabled={
                disableButtonsDuringComputerMoves && !gameOver ? true : false
              }
            >
              ( i )
              {/* This will open up a modal with rules and info about the app. */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
