//Import required dependencies
import React, { useState } from 'react';  //React and useState hook for component state management
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'; //Bootstrap UI components
import { useNavigate } from 'react-router-dom'; //Hook for programmatic navigation
import axios from 'axios'; //HTTP client for API requests
import config from '../config'; //Configuration for API URLs

//CreateSession component - Manager functionality to create new training sessions
const CreateSession = () => {
 //State management using useState hook
 const [formData, setFormData] = useState({
   date: '',          //Training date
   time: '',          //Training time
   location: '',      //Training location
   description: ''    //Optional session details
 });
 const [error, setError] = useState('');      //Error message state
 const [loading, setLoading] = useState(false); //Loading state for form submission
 const navigate = useNavigate();              //Navigation function

 //Form submission handler
 const handleSubmit = async (e) => {
   e.preventDefault();           //Prevent default form submission
   setLoading(true);            //Show loading state
   setError('');                //Clear any existing errors

   try {
     //Combine date and time strings into a single Date object
     const dateTime = new Date(`${formData.date}T${formData.time}`);
     
     //Send POST request to create new session
     await axios.post(`${config.apiUrl}/sessions`, {  
       date: dateTime,
       location: formData.location,
       description: formData.description
     });
     
     //Show success message and redirect to dashboard
     alert('Training session created successfully!');
     navigate('/dashboard');
   } catch (err) {
     //Handle errors and show error message
     setError(err.response?.data?.message || 'Error creating training session');
   } finally {
     setLoading(false);         //Reset loading state
   }
 };

 //Component render
 return (
   <Container className="mt-4">
     <Card className="mx-auto" style={{ maxWidth: '600px' }}>
       {/* Card header with styled background */}
       <Card.Header style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57', color: 'white' }}>
         <h4 className="mb-0">Create Training Session</h4>
       </Card.Header>
       <Card.Body>
         {/* Error alert display */}
         {error && <Alert variant="danger">{error}</Alert>}
         
         {/* Session creation form */}
         <Form onSubmit={handleSubmit}>
           {/* Date input field */}
           <Form.Group className="mb-3">
             <Form.Label>Date</Form.Label>
             <Form.Control
               type="date"
               value={formData.date}
               onChange={(e) => setFormData({...formData, date: e.target.value})}
               required
             />
           </Form.Group>

           {/* Time input field */}
           <Form.Group className="mb-3">
             <Form.Label>Time</Form.Label>
             <Form.Control
               type="time"
               value={formData.time}
               onChange={(e) => setFormData({...formData, time: e.target.value})}
               required
             />
           </Form.Group>

           {/* Location input field */}
           <Form.Group className="mb-3">
             <Form.Label>Location</Form.Label>
             <Form.Control
               type="text"
               value={formData.location}
               onChange={(e) => setFormData({...formData, location: e.target.value})}
               required
               placeholder="Enter training location"
             />
           </Form.Group>

           {/* Description textarea field */}
           <Form.Group className="mb-3">
             <Form.Label>Description</Form.Label>
             <Form.Control
               as="textarea"
               rows={3}
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               placeholder="Enter session details"
             />
           </Form.Group>

           {/* Form buttons */}
           <div className="d-flex gap-2">
             {/* Submit button with loading state */}
             <Button 
               type="submit" 
               className="flex-grow-1" 
               style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
               disabled={loading}
             >
               {loading ? 'Creating...' : 'Create Session'}
             </Button>
             {/* Cancel button - returns to dashboard */}
             <Button 
               variant="secondary"
               onClick={() => navigate('/dashboard')}
             >
               Cancel
             </Button>
           </div>
         </Form>
       </Card.Body>
     </Card>
   </Container>
 );
};

export default CreateSession;