import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSession from './pages/CreateSession';
import SessionDetails from './pages/SessionDetails';
import Players from './pages/Players';
import axios from 'axios';

// Navigation Component
const NavigationBar = ({ token, onLogout }) => {
  const userRole = localStorage.getItem('userRole');

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
              {userRole === 'manager' && (  // Only show Players link for managers
                <Nav.Link as={Link} to="/players">Players</Nav.Link>
              )}
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

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// Main App Component
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  // const userRole = localStorage.getItem('userRole');

  // Setup axios defaults when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token on app load and token changes
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await axios.get('http://localhost:3000/api/users/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Token verified successfully');
        } catch (error) {
          console.error('Token verification failed:', error);
          handleLogout();
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setToken(null);
    
    // Clear axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <Router>
      <div>
        <NavigationBar token={token} onLogout={handleLogout} />
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/dashboard" />} 
          />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/create-session" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <CreateSession />
              </ProtectedRoute>
            } 
          />
            <Route 
    path="/players" 
    element={
        <ProtectedRoute allowedRoles={['manager']}>
            <Players />
        </ProtectedRoute>
    } 
/>
          <Route 
            path="/session-details/:id" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <SessionDetails />
              </ProtectedRoute>
            } 
          />

          {/* Default route */}
          <Route 
            path="/" 
            element={<Navigate to={token ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;