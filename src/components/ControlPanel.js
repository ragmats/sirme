import HighScores from "./HighScores";
import Info from "./Info";

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
  return (
    <>
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves ? true : false}
        onClick={toggleComputerSpeed}
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
