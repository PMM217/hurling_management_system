import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionDetails = () => {
  const [session, setSession] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: '',
    location: '',
    description: ''
  });
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/sessions/${id}/attendance`);
      setSession(response.data.session);
      setAttendanceDetails(response.data.attendance);
      
      // Set initial form data for editing
      const sessionDate = new Date(response.data.session.date);
      setEditFormData({
        date: sessionDate.toISOString().split('T')[0],
        time: sessionDate.toTimeString().split(':').slice(0, 2).join(':'),
        location: response.data.session.location,
        description: response.data.session.description || ''
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load session details');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const dateTime = new Date(`${editFormData.date}T${editFormData.time}`);
      await axios.put(`http://localhost:3000/api/sessions/${id}`, {
        date: dateTime,
        location: editFormData.location,
        description: editFormData.description
      });
      
      setShowEditModal(false);
      setMessage('Session updated successfully');
      fetchSessionDetails(); // Refresh the data
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Error updating session');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:3000/api/sessions/${id}`);
        navigate('/dashboard', { state: { message: 'Session deleted successfully' } });
      } catch (error) {
        setError('Error deleting session');
      }
    }
  };

  if (loading) return <Container className="mt-4">Loading...</Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!session) return <Container className="mt-4"><Alert variant="info">Session not found</Alert></Container>;

  return (
    <Container className="mt-4">
      {message && <Alert variant="success">{message}</Alert>}
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Session Details - {new Date(session.date).toLocaleDateString()}</h4>
          <div>
            <Button 
              variant="warning" 
              className="me-2"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button 
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <p><strong>Time:</strong> {new Date(session.date).toLocaleTimeString()}</p>
            <p><strong>Location:</strong> {session.location}</p>
            {session.description && <p><strong>Details:</strong> {session.description}</p>}
          </div>

          <h5>Attendance List</h5>
          {attendanceDetails.length === 0 ? (
            <p>No responses yet</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Status</th>
                  <th>Response Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceDetails.map((attendance, index) => (
                  <tr key={index}>
                    <td>{attendance.userName}</td>
                    <td>
                      <span className={`text-${attendance.attending ? 'success' : 'danger'}`}>
                        {attendance.attending ? 'Attending' : 'Not Attending'}
                      </span>
                    </td>
                    <td>{new Date(attendance.respondedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

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
      onClick={handleUpdate}
      style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }}
      className="text-white"
    >
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
    </Container>
  );
};

export default SessionDetails;