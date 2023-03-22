import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import HighScoresTable from "./HighScoresTable";
import "../CSS/HighScores.css";

export default function HighScores({
  playerName,
  highScores,
  clearHighScores,
  disableButtonsDuringComputerMoves,
  gameOver,
}) {
  const [areYouSure, setAreYouSure] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setAreYouSure(false);
    setShow(false);
  };
  const handleShow = (e) => {
    setShow(true);
    // Remove focus from the "high Scores" button clicked to open the modal
    e.target.blur();
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
        <Modal.Header closeButton>
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
            <HighScoresTable highScores={highScores} playerName={playerName} />
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
