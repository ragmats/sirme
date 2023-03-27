import { useContext } from "react";
import HighScores from "./HighScores";
import Info from "./Info";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ControlPanel({
  disableButtonsDuringComputerMoves,
  repeatComputer,
  handleRestart,
  playerName,
  highScores,
  clearHighScores,
  areYouSure,
  toggleAreYouSure,
  gameOver,
  handleQuit,
  togglePlayerBusy,
  computerSpeed,
  toggleComputerSpeed,
}) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves ? true : false}
        onClick={(e) => {
          toggleComputerSpeed();
          e.target.blur();
        }}
      >
        {computerSpeed === 0
          ? "Speed >>"
          : computerSpeed === 1
          ? "Speed >>>"
          : computerSpeed === -1
          ? "Speed >"
          : null}
      </button>
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves ? true : false}
        onClick={repeatComputer}
      >
        Repeat
      </button>
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
        onClick={handleRestart}
      >
        Restart
      </button>
      <HighScores
        playerName={playerName}
        highScores={highScores}
        clearHighScores={clearHighScores}
        areYouSure={areYouSure}
        toggleAreYouSure={toggleAreYouSure}
        disableButtonsDuringComputerMoves={disableButtonsDuringComputerMoves}
        gameOver={gameOver}
        togglePlayerBusy={togglePlayerBusy}
      />
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
        onClick={(e) => {
          toggleTheme();
          e.target.blur();
        }}
      >
        {theme === "light" ? "Dark " : "Light "}Mode
      </button>
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
        onClick={handleQuit}
      >
        Quit
      </button>

      <Info
        disableButtonsDuringComputerMoves={disableButtonsDuringComputerMoves}
        gameOver={gameOver}
        togglePlayerBusy={togglePlayerBusy}
      />
    </>
  );
}
