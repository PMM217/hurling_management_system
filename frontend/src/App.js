import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';  // Remove unused imports
// import SessionList from './components/SessionList';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSession from './pages/CreateSession';
import SessionDetails from './pages/SessionDetails';


// Navigation Component
const NavigationBar = ({ token, onLogout }) => {
  const userRole = localStorage.getItem('userRole'); // Add this line to get user role

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
                {/* <Nav.Link as={Link} to="/sessions">Sessions</Nav.Link> */}
                <Nav.Link as={Link} to="/players">Players</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                {userRole === 'manager' && (
                  <Nav.Link as={Link} to="/create-session">Create Session</Nav.Link>
                )}
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

// Main App Component
const App = () => {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const userRole = localStorage.getItem('userRole'); // Add this line

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Also remove userRole
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
          {/* <Route path="/sessions" element={token ? <SessionList /> : <Navigate to="/login" />} /> */}
          <Route path="/create-session" element={token && userRole === 'manager' ? <CreateSession /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          <Route path="/session-details/:id" element={token && userRole === 'manager' ? <SessionDetails /> : <Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;