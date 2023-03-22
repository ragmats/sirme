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
}) {
  return (
    <>
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves ? true : false}
        onClick={repeatComputer}
      >
        Repeat
      </button>
      <br />
      <button
        className="right-menu-button"
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
        disableButtonsDuringComputerMoves={disableButtonsDuringComputerMoves}
        gameOver={gameOver}
      />
      <br />
      <button
        className="right-menu-button"
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
        onClick={handleQuit}
      >
        Quit
      </button>
      <br />

      <Info
        disableButtonsDuringComputerMoves={disableButtonsDuringComputerMoves}
        gameOver={gameOver}
      />
    </>
  );
}
