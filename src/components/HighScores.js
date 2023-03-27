import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../CSS/HighScores.css";
import { ThemeContext } from "../contexts/ThemeContext";

export default function HighScores({
  playerName,
  highScores,
  clearHighScores,
  disableButtonsDuringComputerMoves,
  gameOver,
  setPlayerBusy,
}) {
  const { theme } = useContext(ThemeContext);
  const [areYouSure, setAreYouSure] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setAreYouSure(false);
    setShow(false);
    setPlayerBusy(false);
  };

  const handleShow = (e) => {
    setShow(true);
    // Remove focus from the "high Scores" button clicked to open the modal
    e.target.blur();
    setPlayerBusy(true);
  };

  function handleYes() {
    clearHighScores();
    toggleAreYouSure();
  }

  function toggleAreYouSure() {
    setAreYouSure(!areYouSure);
  }

  return (
    <>
      <button
        className="right-menu-button"
        onClick={(e) => handleShow(e)}
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
      >
        High Scores
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          closeVariant={theme === "dark" ? "white" : null}
        >
          {/* For dark mode, use closeVariant="white" in above line */}
          <Modal.Title>
            <div className="center">SIRME High Scores</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {areYouSure ? (
            <div className="center">
              <p>Sure you wanna do that?</p>
              <Button
                className="button"
                variant="danger"
                size="lg"
                onClick={handleYes}
              >
                Yes
              </Button>
              <Button
                className="button"
                variant="secondary"
                size="lg"
                onClick={toggleAreYouSure}
              >
                No
              </Button>
            </div>
          ) : (
            // <HighScoresTable highScores={highScores} playerName={playerName} />
            <>
              {highScores.length > 0 ? (
                <table className="highscores-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Player</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highScores.map(({ id, name, score }, idx) => {
                      return (
                        <tr
                          className={
                            playerName.toLowerCase() === name
                              ? "highlighted"
                              : null
                          }
                          key={id}
                        >
                          <td>{idx + 1}</td>
                          <td className="highscore-name">
                            {name.length > 8
                              ? name.toLowerCase().substring(0, 8) + "..."
                              : name.toLowerCase()}
                          </td>
                          <td>{score}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="center">
                  No high scores yet... be the first!
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!areYouSure && highScores.length > 0 ? (
            <Button variant="danger" onClick={toggleAreYouSure}>
              Clear Scores
            </Button>
          ) : null}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
