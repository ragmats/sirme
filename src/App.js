// import logo from './logo.svg';
import { useEffect, useState } from "react";
import "./App.css";
import Cube from "./components/Cube";
import Start from "./components/EnterNameAndStart";

// ! BUG quit and start without changing name - it gets truncated. Why?
// TODO Create array of random number 1-3
// TODO add to this array on click of something for testing
// TODO make the cube flash according to array
// TODO allow user to click cube to add to new array
// TODO if new array
// TODO Handle names that are too long with...
// TODO Record scores and reset states on quit
// TODO handle same player names with different capitalization -- convert to all CAP?
// TODO Add link to website?

export default function App() {
  const [endGame, setEndGame] = useState(true);
  const [computerStart, setComputerStart] = useState(false);
  const [defaultName] = useState("Guest Player");
  const [playerName, setPlayerName] = useState(
    localStorage.playerName ? localStorage.playerName : defaultName
  );

  useEffect(() => {
    if (endGame === false) {
      setComputerStart(true);
    } else {
      setComputerStart(false);
    }
  }, [endGame]);

  // Send function as a prop so modal can begin the game
  function startGame() {
    setEndGame(false);
  }
  function handleEndGame() {
    // Record high score
    // Reset states
    setEndGame(true);
  }

  function getNewPlayerName(newPlayerName) {
    if (localStorage.playerName) {
      setPlayerName(localStorage.playerName);
    } else {
      setPlayerName(newPlayerName);
    }
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
            <p>Round: 1</p>
            <p>Points: 999</p>
            <p>Repeats: -2</p>
            <p>Total Score: 997</p>
          </div>
          <div className="main-inside">
            <Cube computerStart={computerStart} />
          </div>
          <div className="main-inside">
            <p>Repeat Round</p>
            <p>Restart</p>
            <p>High Scores</p>
            <button
              onClick={() => {
                // End game - will need to handle recording score,
                handleEndGame();
              }}
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
