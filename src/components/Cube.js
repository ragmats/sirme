import { useEffect, useState } from "react";
import "../CSS/Cube.css";
import useSound from "use-sound";
import sadFace from "../images/sadface.svg";
import sound0 from "../audio/sound0.mp3";
import sound1 from "../audio/sound1.mp3";
import sound2 from "../audio/sound2.mp3";
import soundBadMove from "../audio/soundBadMove.mp3";

export default function Cube({
  computerStart,
  restart,
  handleEndGame,
  repeat,
  setRepeat,
  setDisableButtonsDuringComputerMoves,
  setRound,
  setPoints,
  gameOver,
  setGameOver,
  handleRestart,
  quit,
  playerBusy,
  computerSpeed,
}) {
  const playerOnSeconds = 0.15;
  const waitSeconds = 1;

  const [computerTurn, setComputerTurn] = useState(false);
  const [computerOnSeconds, setComputerOnSeconds] = useState(0.25);
  const [computerOffSeconds, setComputerOffSeconds] = useState(0.25);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [computerMoves, setComputerMoves] = useState([]);
  const [playerMoves, setPlayerMoves] = useState([]);
  const [sideClasses, setSideClasses] = useState(["side0", "side1", "side2"]);
  const [cubeClass, setCubeClass] = useState("cube");
  const [computerClassBase, setComputerClassBase] = useState(false);
  const [playerClassBase, setPlayerClassBase] = useState(false);

  // Ref: https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
  const [soundEffect0] = useSound(sound0);
  const [soundEffect1] = useSound(sound1);
  const [soundEffect2] = useSound(sound2);
  const [soundEffectBadMove] = useSound(soundBadMove);
  const soundEffects = [soundEffect0, soundEffect1, soundEffect2];

  /*
   * Resets when classes change and detects when base classes have been set
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
      setRepeat(false);
      setPlayerTurn(false);
      setDisableButtonsDuringComputerMoves(true);
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
      if (!repeat) {
        // Reset the player moves each round
        setPlayerMoves([]);
        // Add the next random computer move
        addRandomComputerMove();
      }
    }
  }, [computerTurn]);

  /*
   * Resets if player clicks the speed button
   */
  useEffect(() => {
    if (computerSpeed === 0) {
      setComputerOnSeconds(0.25);
      setComputerOffSeconds(0.25);
    }
    if (computerSpeed === 1) {
      setComputerOnSeconds(0.15);
      setComputerOffSeconds(0.15);
    }
    if (computerSpeed === -1) {
      setComputerOnSeconds(0.35);
      setComputerOffSeconds(0.35);
    }
  }, [computerSpeed]);

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
    setDisableButtonsDuringComputerMoves(true);
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
   * Resets when the player's turn changes
   */
  useEffect(() => {
    // Change styling of the cube and sides for the player turn
    if (playerTurn) {
      applyPlayerTurnStyles();
    }
  }, [playerTurn]);

  /*
   * Listens for conditions during a player turn to when to listen for keypresses
   */
  useEffect(() => {
    if (
      (playerTurn && !playerBusy && playerClassBase) ||
      (gameOver && !playerBusy)
    ) {
      // Listen for keypresses
      window.addEventListener("keydown", downHandler);
      // Clean up keypress listener
      return () => window.removeEventListener("keydown", downHandler);
    }
  }, [playerTurn, playerBusy, playerClassBase, gameOver]);

  // Detect keypresses during a player turn
  function downHandler({ key }) {
    if (playerTurn && !playerBusy) {
      if (key === "w" || key === "W" || key === "ArrowUp") addPlayerMove(0);
      if (key === "a" || key === "A" || key === "ArrowLeft") addPlayerMove(2);
      if (key === "d" || key === "D" || key === "ArrowRight") addPlayerMove(1);
    } else if (gameOver && !playerBusy) {
      if (key === "r" || key === "R") handleRestart();
    }
  }

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
        soundEffects[playerMove]();
        setPoints((currentPoints) => currentPoints + 1);
        // Compare player moves to computer moves and advance to next round if fully matched
        if (playerMoves.length === computerMoves.length) {
          // console.log("Next round!");
          setRound((currentRound) => currentRound + 1);
          setTimeout(() => endPlayerTurn(), 1000 * playerOnSeconds);
        }
      } else {
        // console.log("You lose!");
        soundEffectBadMove();
        setTimeout(() => {
          setGameOver(true);
        }, 1000 * playerOnSeconds);
        setDisableButtonsDuringComputerMoves(true);
      }
    }
  }, [playerMoves]);

  /*
   * Resets when the player loses the game
   */
  useEffect(() => {
    if (gameOver) {
      setPlayerTurn(false);
      applyComputerTurnStyles();
    }
  }, [gameOver]);

  /*
   * Resets when the player quits the game
   */
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
    turnPlayerSideOn(String(id));
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

  function restartNewPlayer() {
    handleEndGame();
    setPlayerMoves([]);
  }

  // Turn "on" a single side and play sound based on player selection
  function turnPlayerSideOn(playerSide) {
    sideClasses[playerSide] = sideClasses[playerSide] + " on";
    setSideClasses([...sideClasses]);
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
      soundEffects[side]();
      setTimeout(() => turnSideOff(moveIdx), 1000 * computerOnSeconds);
    }
  }

  // Turn off side after turning on for computer move
  function turnSideOff(moveIdx) {
    const side = computerMoves[moveIdx];
    sideClasses[side] = "side" + side;
    setSideClasses([...sideClasses]);

    // If not the last move, blink the next side after a short time
    if (moveIdx < computerMoves.length - 1) {
      setTimeout(() => turnSideOn(moveIdx + 1), 1000 * computerOffSeconds);
    } else {
      setComputerTurn(false);
      setDisableButtonsDuringComputerMoves(false);
      setPlayerTurn(true);
    }
  }

  return (
    <div>
      {gameOver ? (
        <div className="game-over">
          <img className="game-over-svg" src={sadFace}></img>
          <span>Game over, man!</span>
          <span>(R to restart)</span>
        </div>
      ) : (
        <div className={cubeClass}>
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
        </div>
      )}
    </div>
  );
}
