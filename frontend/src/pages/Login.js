import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Make login request
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password
      });

      console.log('Login response:', response.data); // Debug log

      // Extract token and user data from response
      const { token, user } = response.data;

      if (token) {
        // Store JWT token and user data in localStorage
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);

        // Configure axios to use JWT token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Update parent component's state
        if (setToken) {
          setToken(token);
        }

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      console.error('Login error details:', err);
      setError(
        err.response?.data?.message || 
        'Failed to login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Login</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;