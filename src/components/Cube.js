import { useEffect, useState } from "react";
import "../CSS/Cube.css";
import tone0 from "../audio/tone0.mp3";
import tone1 from "../audio/tone1.mp3";
import tone2 from "../audio/tone2.mp3";

export default function Cube({
  playerName,
  computerStart,
  computerRestart,
  toggleComputerRestart,
  handleEndGame,
  handleRestart,
  repeat,
  toggleDisableButtonsDuringComputerMoves,
  advanceRound,
  addPoint,
  gameOver,
  toggleGameOver,
}) {
  const onSeconds = 0.3;
  const playerOnSeconds = 0.15;
  const offSeconds = 0.25;
  const waitSeconds = 1;
  const sounds = [new Audio(tone0), new Audio(tone1), new Audio(tone2)];

  const [computerTurn, setComputerTurn] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [computerMoves, setComputerMoves] = useState([]);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [sideClasses, setSideClasses] = useState(["side0", "side1", "side2"]);
  const [cubeClass, setCubeClass] = useState("cube");
  // const [gameOver, setGameOver] = useState(false);

  /*
   * Resets after user enters name and it's the computer's first turn
   */
  useEffect(() => {
    if (computerStart) {
      // Add first random computer move
      addRandomComputerMove();
    } else {
      setComputerMoves([]);
    }
  }, [computerStart]);

  /*
   * Resets after user resets current game
   */
  useEffect(() => {
    if (computerRestart) {
      setComputerMoves([]);
    }
  }, [computerRestart]);

  /*
   * Resets after each player turn when it's the computer's non-first turn
   */
  useEffect(() => {
    if (computerTurn && !gameOver) {
      // Reset the player moves
      setPlayerMoves([]);
      // Add the next random computer move
      addRandomComputerMove();
    }
  }, [computerTurn]);

  /*
   * Resets when a new random computer move is added or moves are reset
   */
  useEffect(() => {
    if (computerRestart) {
      toggleComputerRestart();
      addRandomComputerMove();
    }
    toggleDisableButtonsDuringComputerMoves(true);
    // Start "flashing" the sides, starting with move at index 0
    setTimeout(() => turnSideOn(0), 1000 * waitSeconds);
  }, [computerMoves]);

  /*
   * Resets when user repeats the computer moves
   */
  useEffect(() => {
    if (repeat) {
      turnSideOn(0);
      toggleDisableButtonsDuringComputerMoves(true);
    }
  }, [repeat]);

  /*
   * Resets when it's the player's turn
   */
  useEffect(() => {
    // Change styling of the cube and sides for the player turn
    if (playerTurn) {
      setSideClasses(["side0 player", "side1 player", "side2 player"]);
      setCubeClass("cube player-cube");
    }
  }, [playerTurn]);

  /*
   * Resets when the player makes a move
   */
  useEffect(() => {
    // TODO Need a game-over screen
    // Compare current player move to corresponding computer move
    const lastPlayerMoveIdx = playerMoves.length - 1;
    const playerMove = playerMoves[lastPlayerMoveIdx];
    const computerMove = computerMoves[lastPlayerMoveIdx];

    if (playerMoves.length > 0) {
      if (playerMoves.length > 0 && playerMove === computerMove) {
        console.log("You get a point!");
        addPoint();
      } else {
        console.log("You lose!");
        toggleGameOver();
        toggleDisableButtonsDuringComputerMoves(true);
      }

      // Compare player moves to computer moves and advance to next round if fully matched
      if (playerMoves.length === computerMoves.length) {
        // console.log(compareArrays(playerMoves, computerMoves));
        console.log("Next round!");
        advanceRound();
        setTimeout(() => endPlayerTurn(), 1000 * playerOnSeconds);
      }
    }
  }, [playerMoves]);

  // Get random number between 0 and 2
  function getRandomNumber() {
    let randomNumber = Math.floor(Math.random() * 3);
    return randomNumber;
  }

  // Add a random number to the array of computer moves
  function addRandomComputerMove() {
    let newMove = getRandomNumber();
    setComputerMoves((prevMoves) => [...prevMoves, newMove]);
  }

  // Add the selected move to the array of player moves
  function addPlayerMove(id) {
    turnPlayerSideOn(id);
    setPlayerMoves((prevMoves) => [...prevMoves, parseInt(id)]);
  }

  // Set cube and side classes for the computer's turn
  function endPlayerTurn() {
    setSideClasses(["side0", "side1", "side2"]);
    setCubeClass("cube");
    setComputerTurn(true);
    setPlayerTurn(false);
  }

  // Turn "on" a single side and play sound based on player selection
  function turnPlayerSideOn(playerSide) {
    sideClasses[playerSide] = sideClasses[playerSide] + " player on";
    setSideClasses([...sideClasses]);
    sounds[playerSide].play();
    setTimeout(() => turnPlayerSideOff(playerSide), 1000 * playerOnSeconds);
  }

  // Turn the selected player side off after turning on
  function turnPlayerSideOff(playerSide) {
    sideClasses[playerSide] = "side" + playerSide + " player";
    setSideClasses([...sideClasses]);
  }

  // Turn on side and play sound based on next computer move
  function turnSideOn(moveIdx) {
    if (computerMoves.length > 0 && !gameOver) {
      const side = computerMoves[moveIdx];
      sideClasses[side] = sideClasses[side] + " on";
      setSideClasses([...sideClasses]);
      sounds[side].play();
      setTimeout(() => turnSideOff(moveIdx), 1000 * onSeconds);
    }
  }

  // Turn off side after turning on for computer move
  function turnSideOff(moveIdx) {
    const side = computerMoves[moveIdx];
    sideClasses[side] = "side" + side;
    setSideClasses([...sideClasses]);

    // If not the last move, blink the next side after a short time
    if (moveIdx < computerMoves.length - 1) {
      setTimeout(() => turnSideOn(moveIdx + 1), 1000 * offSeconds);
    } else {
      setComputerTurn(false);
      toggleDisableButtonsDuringComputerMoves(false);
      setPlayerTurn(true);
    }
  }

  return (
    <div>
      <div className={cubeClass}>
        {gameOver ? (
          <div>
            <p>Game over, man!</p>
            <button
              onClick={() => {
                setPlayerMoves([]);
                handleRestart();
              }}
            >
              Retry as {playerName}?
            </button>
            <button
              onClick={() => {
                setPlayerMoves([]);
                handleEndGame();
              }}
            >
              Play as someone else?
            </button>
          </div>
        ) : (
          <div>
            <div
              id="0"
              onClick={playerTurn ? (e) => addPlayerMove(e.target.id) : null}
              className={sideClasses[0]}
            ></div>
            <div
              id="1"
              onClick={playerTurn ? (e) => addPlayerMove(e.target.id) : null}
              className={sideClasses[1]}
            ></div>
            <div
              id="2"
              onClick={playerTurn ? (e) => addPlayerMove(e.target.id) : null}
              className={sideClasses[2]}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
