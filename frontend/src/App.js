import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Button, Form, Table, Card } from 'react-bootstrap';
import SessionList from './components/SessionList';

// Navigation Component
const NavigationBar = ({ token, onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Hurling Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {token ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/sessions">Sessions</Nav.Link>
                <Nav.Link as={Link} to="/players">Players</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button variant="outline-light" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Basic Page Components
const Login = ({ setToken }) => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Login</h1>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

const Register = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Register</h1>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select>
                <option value="player">Player</option>
                <option value="manager">Manager</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Header>Upcoming Sessions</Card.Header>
            <Card.Body>
              <p>No upcoming sessions</p>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Header>Recent Activity</Card.Header>
            <Card.Body>
              <p>No recent activity</p>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <Button variant="primary" className="w-100 mb-2">Create Session</Button>
              <Button variant="success" className="w-100">Mark Attendance</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

const Players = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Players</h1>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <Form.Control 
              type="text" 
              placeholder="Search players..." 
              className="w-auto"
            />
            <Button variant="primary">Add Player</Button>
          </div>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3">No players found</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

const Profile = () => {
  return (
    <Container className="mt-4">
      <h1 className="mb-4">Profile</h1>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" disabled />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Main App Component
const App = () => {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div>
        <NavigationBar token={token} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/sessions" element={token ? <SessionList /> : <Navigate to="/login" />} />
          <Route path="/players" element={token ? <Players /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;