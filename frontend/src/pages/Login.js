//Import required dependencies
import React, { useState } from 'react'; // React and state management hook
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'; // UI components
import { useNavigate } from 'react-router-dom'; // Navigation hook
import axios from 'axios'; // HTTP client
import config from '../config'; // API configuration

//Login component - Handles user authentication
//Props: setToken - Function to update authentication state in parent component
const Login = ({ setToken }) => {

 //State management using hooks
 const [email, setEmail] = useState(''); // Email input state
 const [password, setPassword] = useState(''); // Password input state
 const [error, setError] = useState(''); // Error message state
 const [loading, setLoading] = useState(false); // Loading state for form submission
 const navigate = useNavigate(); // Navigation function

 //Form submission handler
 const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form behavior
  setError(''); // Clear any existing errors
  setLoading(true); // Show loading state

    try {
      //send login request to backend
      const response = await axios.post(`${config.apiUrl}/users/login`, {
        email,
        password
      });
      //.post('http://localhost:3000/api/users/login', {

      console.log('Login response:', response.data); //Debug log

      //Extract token and user data from response
      const { token, user } = response.data;

      if (token) {
        //Store JWT token and user data in localStorage
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);

        //Configure axios to use JWT token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        //Update parent component's state
        if (setToken) {
          setToken(token);
        }

        //Navigate to dashboard
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
    <Card.Header style={{ backgroundColor: '#2E8B57' }} className="text-white">
      <h4 className="mb-0">Login</h4>
    </Card.Header>
    <Card.Body>
      {/* Error alert display */}
      {error && <Alert variant="danger">{error}</Alert>}
      {/* Login form */}
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
      {/* Password input field */}
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
      {/* Submit button with loading state */}
        <Button 
          type="submit" 
          className="w-100" 
          style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
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