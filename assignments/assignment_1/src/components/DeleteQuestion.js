import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function DeleteQuestion({ question, onDeleteQuestion}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <div>
      <Button variant="danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this question?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            onDeleteQuestion(question.id);
            handleClose();
            }
          }>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>  
  );
}