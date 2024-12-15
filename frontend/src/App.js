//Required imports for React functionality, routing, styling, and components
import React, { useState, useEffect } from 'react';

//BrowserRouter enables routing, Route defines routes, Link for navigation, Navigate for redirects
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

//Bootstrap CSS framework for styling
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

//Page component imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSession from './pages/CreateSession';
import SessionDetails from './pages/SessionDetails';
import Players from './pages/Players';
import Profile from './pages/Profile';
import config from './config';

//Axios for making HTTP requests
import axios from 'axios';

//Navigation Component: Handles the navigation bar display based on authentication state
//Props: token (authentication state), onLogout (logout function)
const NavigationBar = ({ token, onLogout }) => {

  //Get user role from localStorage to determine navigation options
 const userRole = localStorage.getItem('userRole');

  return (

    //Navbar with custom green styling, dark theme, and responsive
    <Navbar style={{ backgroundColor: '#2E8B57' }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Cul App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            {/* Conditional rendering based on authentication state */}
            {token ? (
              <>

              {/* Authenticated user navigation options */}
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>

              {/* Role based Access - Manager-only navigation options */}
              {userRole === 'manager' && (
                <Nav.Link as={Link} to="/players">Players</Nav.Link>
              )}
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              {userRole === 'manager' && (
                <Nav.Link as={Link} to="/create-session">Create Session</Nav.Link>
              )}
              <Button variant="outline-light" onClick={onLogout}>Logout</Button>
            </>
          ) : (

            //Non-authenticated user navigation options
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

//Protected Route Component: Handles route protection based on authentication and role
//Props: children (components to render), allowedRoles (roles allowed to access the route)
const ProtectedRoute = ({ children, allowedRoles = [] }) => {

  //Get authentication token and user role from localStorage
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('userRole');

  //Redirect to login if no token exists
  if (!token) return <Navigate to="/login" />;

  //Redirect to dashboard if user's role isn't in allowedRoles
  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

//Main App Component: Root component of the application
const App = () => {
  //State management for authentication token
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  //Effect hook to set up axios authentication headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  //Effect hook to verify token validity on app load and token changes
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await axios.get(`${config.apiUrl}/users/verify`, {// await axios.get('http://localhost:3000/api/users/verify', {
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

  //Logout handler: Clears all authentication data
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    //Router wrapper for handling navigation
    <Router>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <NavigationBar token={token} onLogout={handleLogout} />
        <Routes>
          {/* Public routes accessible without authentication */}
          <Route 
            path="/login" 
            element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/dashboard" />} 
          />

          {/* Protected routes requiring authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Manager-only routes */}
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
          <Route 
            path="/profile" 
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } 
          />
          {/* Default route with conditional redirect based on authentication */}
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