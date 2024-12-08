//Import required dependencies
import React, { useState } from 'react'; //React and state management hook
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'; //UI components
import { useNavigate } from 'react-router-dom'; //Navigation hook
import axios from 'axios'; //HTTP client
import config from '../config'; //API configuration

//Register component - Handles new user registration
const Register = () => {
   //State management using hooks
   const [formData, setFormData] = useState({
       name: '',
       email: '',
       password: '',
       role: 'player'  //Default role set to player
   });
   const [error, setError] = useState(''); //Error message state
   const [loading, setLoading] = useState(false); //Loading state
   const navigate = useNavigate(); //Navigation function

   //Form submission handler
   const handleSubmit = async (e) => {
       e.preventDefault();
       setError(''); //Clear any existing errors
       setLoading(true); //Show loading state

       console.log('Attempting to register with data:', formData); // Debug logging

       try {
           //Send registration request to backend
           const response = await axios.post(`${config.apiUrl}/users/register`, formData);
           console.log('Registration response:', response.data);
           
           //Show success message and redirect to login
           alert('Registration successful!');
           navigate('/login');
       } catch (err) {
           //Handle registration errors
           console.error('Registration error details:', err);
           setError(
               err.response?.data?.message || 
               err.message || 
               'Registration failed. Please try again.'
           );
       } finally {
           setLoading(false); //Reset loading state
       }
   };

   //Component render
   return (
       <Container className="mt-5">
           <Card className="mx-auto" style={{ maxWidth: '400px' }}>
               {/* Card header with styled background */}
               <Card.Header style={{ backgroundColor: '#2E8B57' }} className="text-white">
                   <h4 className="mb-0">Register</h4>
               </Card.Header>
               <Card.Body>
                   {/* Error alert display */}
                   {error && <Alert variant="danger">{error}</Alert>}
                   
                   {/* Registration form */}
                   <Form onSubmit={handleSubmit}>
                       {/* Name input field */}
                       <Form.Group className="mb-3">
                           <Form.Label>Name</Form.Label>
                           <Form.Control
                               type="text"
                               name="name"
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               required
                           />
                       </Form.Group>

                       {/* Email input field */}
                       <Form.Group className="mb-3">
                           <Form.Label>Email</Form.Label>
                           <Form.Control
                               type="email"
                               name="email"
                               value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})}
                               required
                           />
                       </Form.Group>

                       {/* Password input field */}
                       <Form.Group className="mb-3">
                           <Form.Label>Password</Form.Label>
                           <Form.Control
                               type="password"
                               name="password"
                               value={formData.password}
                               onChange={(e) => setFormData({...formData, password: e.target.value})}
                               required
                           />
                       </Form.Group>

                       {/* Role selection dropdown */}
                       <Form.Group className="mb-3">
                           <Form.Label>Role</Form.Label>
                           <Form.Select
                               name="role"
                               value={formData.role}
                               onChange={(e) => setFormData({...formData, role: e.target.value})}
                           >
                               <option value="player">Player</option>
                               <option value="manager">Manager</option>
                           </Form.Select>
                       </Form.Group>

                       {/* Submit button with loading state */}
                       <Button 
                           type="submit" 
                           className="w-100" 
                           style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
                           disabled={loading}
                       >
                           {loading ? 'Registering...' : 'Register'}
                       </Button>
                   </Form>
               </Card.Body>
           </Card>
       </Container>
   );
};

export default Register;
