import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EnterNameAndStart({
  startGame,
  setPlayerName,
  defaultName,
  playerName,
}) {
  const [show, setShow] = useState(true);
  const [name, setName] = useState(playerName);

  useEffect(() => {
    if (name === "") {
      localStorage.setItem("playerName", defaultName);
    } else {
      localStorage.setItem("playerName", name);
    }
  }, [name]);

  const handleClose = () => {
    setShow(false);
    startGame();
  };

  function submitForm(e) {
    e.preventDefault();
    setPlayerName(name);
    handleClose();
  }

  function clearName() {
    setName("");
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
      >
        <Modal.Body>
          <form onSubmit={(e) => submitForm(e)} id="submitName">
            <div className="input-container">
              <p className="name-input-text">Enter Player Name</p>
              <input
                className="name-input"
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
                // Ref: https://stackoverflow.com/questions/28889826/how-to-set-focus-on-an-input-field-after-rendering
                ref={function (input) {
                  if (input != null) input.focus();
                }}
                placeholder={defaultName}
                value={name}
                onKeyDown={(e) => {
                  if (e.key === "Escape") clearName();
                }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearName}>
            Clear
          </Button>
          <Button variant="secondary" form="submitName" type="submit">
            Start
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
