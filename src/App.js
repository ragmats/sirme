// import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import Cube from "./components/Cube";
import Start from "./components/EnterNameAndStart";
import HighScores from "./components/HighScores";

// !! Consider replacing next high score, etc with "personal best!"
// how to reduce flickering? useCallback hook?
// Test when only 1 player, in top rank, and scores were cleared.
// TODO when high scores are cleared, rank needs to be reset (should be done), along with personal best, etc.
// TODO same when pressing restart and quit

// TODO Handle names that are too long with...
// TODO handle same player names with different capitalization -- convert to all CAP?
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
  const [areYouSure, setAreYouSure] = useState(false);

  /*
   * Resets when endGame ends or begins
   */
  useEffect(() => {
    if (endGame) {
      setComputerStart(false);
    } else {
      setComputerStart(true);
      getCurrentPlayerRank();

      // On game start, set initial playerHighScore if player has a high score
      if (playerFound()) {
        // setPlayerHighScore(getCurrentPlayerHighScore());
      } else {
        // setPlayerRank(null);
        // If high scores are less than 10, should be set to 1
        if (highScores.length < numberOfHighScoresLimit) {
          // setPointsUntilHighScore(1);
        } else {
          // Since leaderboard is full, set to lowest score + 1
          // setPointsUntilHighScore(lowestScoreOfLeaderboard());
        }
      }
    }
  }, [endGame]);

  /*
   * Resets whenever the score changes
   */
  useEffect(() => {
    if (score > 0) {
      if (playerFound()) {
        // setPlayerRank(getCurrentPlayerRank());
        const currentPlayerHighScore = getCurrentPlayerHighScore();
        if (score > currentPlayerHighScore) {
          updatePlayerHighScore();
        }
      } else {
        // If there is an open space, just go ahead and add the score
        if (highScores.length < numberOfHighScoresLimit) {
          addNewHighScore();
          // If no open space, replace the lowest score once the player exceeds it
        } else if (score > lowestScoreOfLeaderboard()) {
          replaceLowestHighScore();
        }
      }
    }
    getCurrentPlayerRank();
  }, [score]);

  useEffect(() => {
    // console.log("highScores is triggered");
    if (highScores.length > 0) {
      highScores.sort((a, b) => b.score - a.score);
      // Ref: https://blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/
    }
    localStorage.setItem("highScores", JSON.stringify(highScores));
    getCurrentPlayerRank();
    setPersonalBest(getPersonalBest());
    // console.log({ highScores });
  }, [highScores]);

  useEffect(() => {
    getCurrentPlayerRank();
  }, [playerName]);

  useEffect(() => {
    console.log({ playerRank });
    setPersonalBest(getPersonalBest());
  }, [playerRank]);

  useEffect(() => {
    console.log({ personalBest });
  }, [personalBest]);

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

  // Check if user is already in highscores
  function playerFound() {
    const playerFound = highScores.some(
      (highScore) => highScore.name === playerName
    );
    return playerFound;
  }

  function getCurrentPlayerHighScore() {
    const currentPlayerHighScore = highScores.filter(
      (highScore) => highScore.name === playerName
    );
    return currentPlayerHighScore[0].score;
  }

  function getCurrentPlayerIdx() {
    const idx = highScores.findIndex(
      (highScore) => highScore.name === playerName
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
    if (playerRank) {
      const currentPlayerIndex = getCurrentPlayerIdx();
      currentPersonalBest = highScores[currentPlayerIndex].score;
    } else {
      currentPersonalBest = null;
    }
    return currentPersonalBest;
  }

  function lowestScoreOfLeaderboard() {
    return highScores[highScores.length - 1].score;
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
    highScores[numberOfHighScoresLimit - 1] = {
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
            {playerRank ? <p>Rank: {playerRank}</p> : null}
            {personalBest === score && playerRank === 1 ? (
              <p>Top score!</p>
            ) : personalBest === score ? (
              <p>Personal best!</p>
            ) : null}
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
              playerName={playerName}
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
