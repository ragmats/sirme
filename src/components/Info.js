import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function HighScores({
  disableButtonsDuringComputerMoves,
  gameOver,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    // Remove focus from the "info" button clicked to open the modal
    e.target.blur();
  };

  return (
    <>
      <button
        className="info-button"
        onClick={(e) => handleShow(e)}
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
      >
        i
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="center">SIRME INFO</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h3>Rules</h3>
            <ul>
              <li>Copy the computer (duh).</li>
              <li>For each correct move, get 1 point.</li>
              <li>For every repeat, lose 1 point.</li>
              <li>Make a wrong move, it's game over, man.</li>
            </ul>

            <h3>Etc.</h3>
            <p>
              SIRME was created in React in March 2023. See more web dev
              projects at{" "}
              <a target="_blank" href="https://stevencoy.com">
                stevencoy.com
              </a>
              .
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
