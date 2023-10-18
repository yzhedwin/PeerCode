import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function ReadQuestion({ question }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <div>
      <div onClick={handleShow}>
        {question.title}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{question.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Description:
          <div className="read-description">{question.description}</div>
          <br></br>
          Categories: 
          <ul>
            {question.categories.map((category) =>
              <li>
                {category}
              </li>
            )}
          </ul>
          <br></br>
          Complexity: 
          <div>{question.complexity}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>  
  );
}