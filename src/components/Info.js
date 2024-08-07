import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ThemeContext } from "../contexts/ThemeContext";

export default function HighScores({
  disableButtonsDuringComputerMoves,
  gameOver,
  setPlayerBusy,
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setPlayerBusy(false);
  };
  const handleShow = (e) => {
    setShow(true);
    // Remove focus from the "info" button clicked to open the modal
    e.target.blur();
    setPlayerBusy(true);
  };

  const { theme } = useContext(ThemeContext);

  return (
    <>
      <button
        className="right-menu-button"
        onClick={(e) => handleShow(e)}
        disabled={disableButtonsDuringComputerMoves && !gameOver ? true : false}
      >
        Info
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          closeVariant={theme === "dark" ? "white" : null}
        >
          {/* For dark mode, use closeVariant="white" in above line */}
          <Modal.Title>
            <div className="center">SIRME INFO</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h3>Controls</h3>
            <p>Tap, click, or use WAD/arrow keys (if on PC).</p>
            <h3>Rules</h3>
            <ul>
              <li>Copy the computer (duh).</li>
              <li>For each correct move, get 1 point.</li>
              <li>For every repeat, lose 1 point.</li>
              <li>Make a wrong move, it's game over, man.</li>
            </ul>

            <h3>Etc.</h3>
            <p>SIRME was created in React in March 2023.</p>
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
