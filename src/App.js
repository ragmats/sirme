// import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import Cube from "./components/Cube";
import Start from "./components/EnterNameAndStart";

// ! BUG
// !! Happens with Quit, Restart, Retry as X, and Retry as someone else, fist blink side is not pointer. Resolves after first move.
// I think what's happening is the player moves are being reset before the computer moves, so computer move changes the style back to non-player.
// To fix, find a way to set player moves to [] after reset/quits AFTER the computer moves
// Check how the player styles are applied when there is no quit/restart. Find a way to mimic this.
// !! Repeat causes all flashes sides to not have pointer
// TODO move left and right panels into their own components - is there an easier way to set states of other components other than props? useContext?
// TODO Record top 10 scores with names
// TODO Show top scores in a modal
// TODO Handle names that are too long with...
// TODO handle same player names with different capitalization -- convert to all CAP?
// TODO Show score to beat if player has a previous high score
// TODO Change "score to beat" to "New high score!" if current player beats it
// TODO Add cool styling to buttons
// TODO Add cool styling to flashing sides
// TODO Add cool styling to player turn behind cube?
// TODO Add link to website?
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
    localStorage.playerName ? localStorage.playerName : defaultName
  );
  const [round, setRound] = useState(1);
  const [points, setPoints] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [repeats, setRepeats] = useState(0);
  const [score, setScore] = useState(0);
  const [restart, setRestart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [quit, setQuit] = useState(false);

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
   * Resets when user repeats
   */
  // useEffect(() => {
  //   if (repeat) {
  //     setRepeat((prevRepeat) => false);
  //   }
  // }, [repeat]);

  /*
   * Resets when
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
    if (localStorage.playerName) {
      setPlayerName(localStorage.playerName);
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
            <p>{playerName}</p>
            <p>Round: {round}</p>
            <p>Points: {points}</p>
            <p>Repeats: ({repeats})</p>
            <p>Total Score: {score}</p>
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
            <button
              disabled={
                disableButtonsDuringComputerMoves && !gameOver ? true : false
              }
            >
              High Scores
            </button>
            <br />
            <button
              disabled={
                disableButtonsDuringComputerMoves && !gameOver ? true : false
              }
              onClick={() => setQuit(true)}
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
