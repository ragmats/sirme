import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import HighScoresTable from "./HighScoresTable";
import "../CSS/HighScores.css";

export default function HighScores({
  playerName,
  highScores,
  clearHighScores,
  areYouSure,
  toggleAreYouSure,
  disableButtonsDuringComputerMoves,
  gameOver,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function handleYes() {
    clearHighScores();
    toggleAreYouSure();
  }

  // TODO ask if the person is sure they want to clear the scores.

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}
      <button
        onClick={handleShow}
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
