import { useEffect, useState } from "react";
import "../CSS/Cube.css";
import tone0 from "../audio/tone0.mp3";
import tone1 from "../audio/tone1.mp3";
import tone2 from "../audio/tone2.mp3";

export default function Cube({
  playerName,
  computerStart,
  restart,
  handleEndGame,
  handleRestart,
  repeat,
  toggleRepeat,
  toggleDisableButtonsDuringComputerMoves,
  advanceRound,
  addPoint,
  gameOver,
  toggleGameOver,
  quit,
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

  // ? Make a state computerClassBase and playerClassBase
  const [computerClassBase, setComputerClassBase] = useState(false);
  const [playerClassBase, setPlayerClassBase] = useState(false);

  /*
   * Resets when classes change and detects whe base classes have been set
   */
  useEffect(() => {
    const baseComputerSideClasses = ["side0", "side1", "side2"];
    const baseComputerCubeClass = "cube";
    const basePlayerSideClasses = [
      "side0 player",
      "side1 player",
      "side2 player",
    ];
    const basePlayerCubeClass = "cube player-cube";

    // Check if side classes are bases classes
    const computerSideClassesAreBase = sideClasses.every(
      (sideClass, idx) => sideClass === baseComputerSideClasses[idx]
    );
    const playerSideClassesAreBase = sideClasses.every(
      (sideClass, idx) => sideClass === basePlayerSideClasses[idx]
    );

    // Toggle class base indicators when classes do and don't match base classes
    if (computerSideClassesAreBase && baseComputerCubeClass === cubeClass) {
      setComputerClassBase(true);
    } else {
      setComputerClassBase(false);
    }
    if (playerSideClassesAreBase && basePlayerCubeClass === cubeClass) {
      setPlayerClassBase(true);
    } else {
      setPlayerClassBase(false);
    }
  }, [sideClasses, cubeClass]);

  /*
   * Resets when class bases change
   */
  useEffect(() => {
    // Once repeat is on and base computer classes confirmed, then repeat the sequence
    if (repeat && computerClassBase) {
      toggleRepeat();
      setPlayerTurn(false);
      toggleDisableButtonsDuringComputerMoves(true);
      setTimeout(() => turnSideOn(0), 1000 * waitSeconds);
    }
  }, [computerClassBase, playerClassBase]);

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
   * Resets after each player turn when it's the computer's non-first turn
   */
  useEffect(() => {
    if (computerTurn && !gameOver) {
      applyComputerTurnStyles();
      // Only do the following if not during a repeat phase
      if (!repeat) {
        // Reset the player moves each round
        setPlayerMoves([]);
        // Add the next random computer move
        addRandomComputerMove();
      }
    }
  }, [computerTurn]);

  /*
   * Resets after user resets current game
   */
  useEffect(() => {
    if (restart) {
      setComputerMoves([]);
      applyComputerTurnStyles();
      setPlayerTurn(false);
      setComputerTurn(true);
    }
  }, [restart]);

  /*
   * Resets when a new random computer move is added or moves are reset
   */
  useEffect(() => {
    toggleDisableButtonsDuringComputerMoves(true);
    // Start "flashing" the sides, starting with move at index 0
    setTimeout(() => turnSideOn(0), 1000 * waitSeconds);
  }, [computerMoves]);

  /*
   * Resets when user repeats the computer moves
   */
  useEffect(() => {
    // Reset player moves for this round
    setPlayerMoves([]);
    // First, if repeat, apply computer turn styles
    if (repeat) applyComputerTurnStyles();
  }, [repeat]);

  /*
   * Resets when it's the player's turn
   */
  useEffect(() => {
    // Change styling of the cube and sides for the player turn
    if (playerTurn) {
      applyPlayerTurnStyles();
    }
  }, [playerTurn]);

  /*
   * Resets when the player makes a move
   */
  useEffect(() => {
    if (playerMoves.length > 0) {
      // Compare current player move to corresponding computer move
      const lastPlayerMoveIdx = playerMoves.length - 1;
      const playerMove = playerMoves[lastPlayerMoveIdx];
      const computerMove = computerMoves[lastPlayerMoveIdx];

      if (playerMove === computerMove) {
        // console.log("You get a point!");
        addPoint();
        // Compare player moves to computer moves and advance to next round if fully matched
        if (playerMoves.length === computerMoves.length) {
          // console.log("Next round!");
          advanceRound();
          setTimeout(() => endPlayerTurn(), 1000 * playerOnSeconds);
        }
      } else {
        // console.log("You lose!");
        setTimeout(() => toggleGameOver(), 1000 * playerOnSeconds);
        toggleDisableButtonsDuringComputerMoves(true);
      }
    }
  }, [playerMoves]);

  useEffect(() => {
    if (gameOver) {
      setPlayerTurn(false);
      applyComputerTurnStyles();
    }
  }, [gameOver]);

  useEffect(() => {
    setPlayerTurn(false);
    applyComputerTurnStyles();
    restartNewPlayer();
  }, [quit]);

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

  // Add the selected move to the array of player moves and turn that side on/off
  function addPlayerMove(id) {
    turnPlayerSideOn(id);
    setPlayerMoves((prevMoves) => [...prevMoves, parseInt(id)]);
  }

  // Set cube and side classes for the computer's turn
  function endPlayerTurn() {
    setComputerTurn(true);
    setPlayerTurn(false);
  }

  function applyComputerTurnStyles() {
    setSideClasses(["side0", "side1", "side2"]);
    setCubeClass("cube");
  }

  function applyPlayerTurnStyles() {
    setSideClasses(["side0 player", "side1 player", "side2 player"]);
    setCubeClass("cube player-cube");
  }

  function restartSamePlayer() {
    handleRestart();
  }

  function restartNewPlayer() {
    handleEndGame();
    setPlayerMoves([]);
  }

  // Turn "on" a single side and play sound based on player selection
  function turnPlayerSideOn(playerSide) {
    sideClasses[playerSide] = sideClasses[playerSide] + " on";
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
      // if (repeat) toggleRepeat();
    }
  }

  function cheat() {
    addPoint();
    advanceRound();
    setTimeout(() => endPlayerTurn(), 1000 * playerOnSeconds);
  }

  return (
    <div>
      <div className={cubeClass}>
        {gameOver ? (
          <div>
            <p>Game over, man!</p>
            <button onClick={() => restartSamePlayer()}>
              Retry as {playerName}?
            </button>
            <button onClick={() => restartNewPlayer()}>
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
      <button onClick={cheat}>cheat</button>
    </div>
  );
}
