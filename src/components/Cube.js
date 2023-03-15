import { useEffect, useState } from "react";
import "../CSS/Cube.css";
import tone0 from "../audio/tone0.mp3";
import tone1 from "../audio/tone1.mp3";
import tone2 from "../audio/tone2.mp3";

export default function Cube({ computerStart }) {
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
    if (computerTurn) {
      // Reset the player moves
      setPlayerMoves([]);
      // Add the next random computer move
      addRandomComputerMove();
    }
  }, [computerTurn]);

  /*
   * Resets when a new random computer move is added
   */
  useEffect(() => {
    // Start "flashing" the sides, starting with move at index 0
    setTimeout(() => turnSideOn(0), 1000 * waitSeconds);
  }, [computerMoves]);

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
    // TODO Actually needs to compare every move to the parallel computer move, not just the final arrays so that a wrong move can end it.
    // TODO Need a game-over screen
    // TODO increase point counter
    // Compare player moves to computer move
    if (playerMoves.length > 0 && playerMoves.length === computerMoves.length) {
      if (compareArrays(playerMoves, computerMoves)) {
        console.log(compareArrays(playerMoves, computerMoves));
        // If player moves match, advance to the next "round"
        setTimeout(() => endPlayerTurn(), 1000 * playerOnSeconds);
        // TODO need to auto advance next round (like "Cheater" button)
        // TODO Increase round counter
      } else {
        console.log("You lose!");
      }
    }
  }, [playerMoves]);

  // Get random number between 0 and 2
  function getRandomNumber() {
    let randomNumber = Math.floor(Math.random() * 3);
    return randomNumber;
  }

  // Compare arrays and return true if every element is equal
  function compareArrays(playerMoves, computerMoves) {
    return playerMoves.every(
      (playerMove, idx) => playerMove === computerMoves[idx]
    );
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
    if (computerMoves.length > 0) {
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
      setPlayerTurn(true);
    }
  }

  return (
    <div>
      <div className={cubeClass}>
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
      <button onClick={() => endPlayerTurn()}>Cheater</button>
    </div>
  );
}
