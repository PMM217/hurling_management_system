import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'player'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // TESTING CODE - Remove after testing
    console.log('Form updated:', {
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // TESTING CODE - Remove after testing
    console.log('Attempting to register with data:', formData);

    try {
      // TESTING CODE - Remove these console.logs after testing
      console.log('Making request to:', 'http://localhost:3000/api/users/register');
      
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
      
      // TESTING CODE - Remove after testing
      console.log('Registration response:', response.data);
      
      // Optional: Add alert for testing - Remove after testing
      alert('Registration successful! Redirecting to login...');
      
      navigate('/login');
    } catch (err) {
      // TESTING CODE - Remove these detailed logs after testing
      console.error('Registration error:', {
        message: err.message,
        response: err.response,
        data: err.response?.data
      });
      
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Register</h4>
        </Card.Header>
        <Card.Body>
          {/* TESTING CODE - Add more detailed error display for testing */}
          {error && (
            <Alert variant="danger">
              {error}
              {/* Remove the detailed error info after testing */}
              <pre className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="player">Player</option>
                <option value="manager">Manager</option>
              </Form.Select>
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100" 
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      {/* TESTING CODE - Remove this debug info after testing */}
      <div className="mt-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <details>
          <summary>Debug Info</summary>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({ formData, loading, error }, null, 2)}
          </pre>
        </details>
      </div>
    </Container>
  );
};

export default Register;
