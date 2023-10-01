import React, { useRef, useState } from 'react'
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';

import Axios from 'axios';

export default function UpdateProfile() {
  const displayNameRef = useRef();
  const usernameRef = useRef();
  const proficiencyLevelRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false)


async function handleSubmit(event) {
    event.preventDefault();
    const user = {
      displayName: displayNameRef.current.value,
      username: usernameRef.current.value,
      proficiency: proficiencyLevelRef.current.value
    }


    await Axios.post("http://localhost:3001/update", { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
      .catch (err => {
        console.log(err.message);
      })
  }

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-3 border-primary"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-4">
                  <h2 className="fw-bold mb-2 text-uppercase">Update Profile</h2>
                  <p className=" mb-5">Customise your profile here!</p>

                  <Form className="mb-3" onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="formDisplayName">
                      <Form.Label className="text-center">Display Name</Form.Label>
                      <Form.Control type="text" ref={displayNameRef} placeholder="Enter your Display Name" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formUserName">
                      <Form.Label className="text-center">Username</Form.Label>
                      <Form.Control type="text" ref={usernameRef} placeholder="Enter your Username" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formProficiencyLevel">
                      <Form.Label className="text-center">Proficiency Level</Form.Label>
                      <Form.Control type="text" ref={proficiencyLevelRef} placeholder="Enter your Proficiency Level" />
                    </Form.Group>

                    <div className="d-grid">
                      <Button disabled={loading} variant="primary" type="submit">Confirm Changes</Button>
                    </div>

                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
