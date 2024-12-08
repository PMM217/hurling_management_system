import React, { useState, useEffect } from 'react'; //React core and hooks
import { Container, Card, Button, Alert, Modal, Form } from 'react-bootstrap'; //UI 
import axios from 'axios'; // For HTTP requests
import { useNavigate } from 'react-router-dom'; //For navigation between routes
import config from '../config'; //Api Configuration

const Dashboard = () => {
    //State management using React hooks
  const [sessions, setSessions] = useState([]); // Stores all training sessions
  const [userRole] = useState(localStorage.getItem('userRole')); // Gets user role from localStorage
  const [message, setMessage] = useState('');  // For success/error messages
  const [showEditModal, setShowEditModal] = useState(false);  // Controls edit modal visibility
  const [selectedSession, setSelectedSession] = useState(null); // Stores session being edited
   //Form data state for editing sessions
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: '',
    location: '',
    description: ''
  });
  const userId = localStorage.getItem('userId'); //Get current user's ID
  const navigate = useNavigate(); //Hook for navigation

//Fetch sessions when component mounts
  useEffect(() => {
    fetchSessions();
  }, []);

  //Function to fetch all training sessions from backend
  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/sessions`);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  //await axios.get('http://localhost:3000/api/sessions');
  //Handle player attendance responses
  const handleAttendance = async (sessionId, isAttending) => {
    try {
      await axios.post(`${config.apiUrl}/users/sessions/attendance`, {
        sessionId,
        userId,
        attending: isAttending
      });
      //await axios.post('http://localhost:3000/api/sessions/attendance', {
  //Show success message and refresh sessions    
      setMessage(`Thanks for confirming your ${isAttending ? 'attendance' : 'non-attendance'} for training`);
      fetchSessions();

   //The below will Clear message after 3 seconds   
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setMessage('Failed to update attendance. Please try again.');
    }
  };
//When using edit button - session data for editing
  const handleEdit = (session) => {
    const sessionDate = new Date(session.date);
    setSelectedSession(session);
    //Split date and time for form fields
    setEditFormData({
      date: sessionDate.toISOString().split('T')[0],
      time: sessionDate.toTimeString().split(':').slice(0, 2).join(':'),
      location: session.location,
      description: session.description || ''
    });
    setShowEditModal(true);
  };
  //Update session with new data
  const handleUpdate = async () => {
    try {
      const dateTime = new Date(`${editFormData.date}T${editFormData.time}`);
      await axios.put(`${config.apiUrl}/sessions/${selectedSession._id}`, {
        date: dateTime,
        location: editFormData.location,
        description: editFormData.description
        //await axios.put(`http://localhost:3000/api/sessions/${selectedSession._id}`, {
      });
      setShowEditModal(false);
      setMessage('Session updated successfully');
      fetchSessions();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating session:', error);
      setMessage('Error updating session');
    }
  };
  //Delete session with confirmation message asking are you sure?
  const handleDelete = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await axios.delete(`${config.apiUrl}/sessions/${sessionId}`);
        setMessage('Session deleted successfully');
        fetchSessions();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting session:', error);
        setMessage('Error deleting session');
        //await axios.delete(`http://localhost:3000/api/sessions/${sessionId}`);
      }
    }
  };

//Player view component - Shows only session list and attendance options
  const PlayerView = () => (
    <div>
      <h2 className="mb-4">Upcoming Training Sessions</h2>
      {message && <Alert variant="success">{message}</Alert>}
      
      {sessions.map(session => {
        const userAttendance = session.attendance?.find(a => a.userId === userId);
        
        return (
          <Card key={session._id} className="mb-3">
            <Card.Body>
              <Card.Title>{new Date(session.date).toLocaleDateString()}</Card.Title>
              <Card.Text>
                Time: {new Date(session.date).toLocaleTimeString()}<br/>
                Location: {session.location}
                {session.description && <><br/>Details: {session.description}</>}
                {userAttendance && (
                  <div className="mt-2">
                    Your response: <strong>{userAttendance.attending ? 'Attending' : 'Not Attending'}</strong>
                  </div>
                )}
              </Card.Text>
              {!userAttendance && (
                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    onClick={() => handleAttendance(session._id, true)}
                  >
                    I'll Attend
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleAttendance(session._id, false)}
                  >
                    Can't Attend
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
//Manager view component - Shows full CRUD functionality and attendance overview
  const ManagerView = () => (
    <div>
      <h2 className="mb-4">Training Sessions Overview</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {sessions.map(session => (
        <Card key={session._id} className="mb-3">
          <Card.Body>
            <Card.Title>{new Date(session.date).toLocaleDateString()}</Card.Title>
            <Card.Text>
              Time: {new Date(session.date).toLocaleTimeString()}<br/>
              Location: {session.location}<br/>
              {session.description && <>Details: {session.description}<br/></>}
            </Card.Text>
            <div className="mt-3">
              <h6>Attendance Summary:</h6>
              <p>
                Attending: {session.attendance?.filter(a => a.attending).length || 0}<br/>
                Not Attending: {session.attendance?.filter(a => !a.attending).length || 0}
              </p>
              <div className="d-flex gap-2">
                <Button 
                  variant="info" 
                  onClick={() => navigate(`/session-details/${session._id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="warning" 
                  onClick={() => handleEdit(session)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(session._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Training Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editFormData.date}
                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={editFormData.time}
                onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.location}
                onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      Cancel
    </Button>
    <Button 
      variant="primary" 
      onClick={handleUpdate}
      style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
    >
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
// Conditional rendering based on user role - This is where the Role Based Access COntrol occurs
  return (
    <Container className="mt-4">
      {userRole === 'manager' ? <ManagerView /> : <PlayerView />}
    </Container>
  );
};

export default Dashboard;