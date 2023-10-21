import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const parseError = (err) => {
        if (err.includes("invalid-login-credentials")) {
            return "Wrong Username or Password!"
        }
        if (err.includes("too-many-requests")) {
            return "Access has been temporarily disabled due to many failed login attempts! Reset your password or try again later."
        }
        return "Login Error!"
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError()
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/dashboard');
        } catch (e) {
            setError(parseError(e.message));
        }
        setLoading(false)
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center text-uppercase mb-4">Log In</h2>
                    {error && <Alert key="danger" variant="danger">{error}</Alert>}
                </Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">Log In</Button>
                </Form>
                <div className="w-100 text-center mt-2">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    )
}