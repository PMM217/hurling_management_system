//Import required dependencies
import React, { useState, useEffect } from 'react'; //React and hooks
import { Container, Card, Table, Button, Alert } from 'react-bootstrap'; //UI components
import axios from 'axios'; //HTTP client
import config from '../config';

//Players component - Manages player list for managers
const Players = () => {
   //State management
   const [players, setPlayers] = useState([]); // Stores player list
   const [error, setError] = useState(''); // Error message state
   const [message, setMessage] = useState(''); // Success message state
   const [loading, setLoading] = useState(true); // Loading state

   //Load players when component mounts
   useEffect(() => {
       fetchPlayers();
   }, []);

   //Function to fetch player list from backend
   const fetchPlayers = async () => {
       try {
        const response = await axios.get(`${config.apiUrl}/users/players`, {
               headers: {
                   Authorization: `Bearer ${localStorage.getItem('jwt_token')}` //Add JWT for authentication
               }
           });
           setPlayers(response.data); //Update players state with response
       } catch (error) {
           setError('Failed to fetch players');
           console.error('Error fetching players:', error);
       } finally {
           setLoading(false); //Stop loading state
       }
   };

   //Handler for player deletion
   const handleDelete = async (playerId) => {
       //Show confirmation dialog
       if (window.confirm('Are you sure you want to delete this player?')) {
           try {
               //Send delete request to backend
               await axios.delete(`${config.apiUrl}/users/players/${playerId}`, {
                   headers: {
                       Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                   }
               });
               
               setMessage('Player deleted successfully'); //Show success message
               fetchPlayers(); //Refresh player list
               
               //Clear success message after timeout
               setTimeout(() => setMessage(''), 3000);
           } catch (error) {
               setError('Failed to delete player');
               console.error('Error deleting player:', error);
           }
       }
   };

   //Show loading state while fetching data
   if (loading) return <Container className="mt-4">Loading...</Container>;

   //Component render
   return (
       <Container className="mt-4">
           <Card>
               <Card.Header>
                   <h4 className="mb-0">Player Management</h4>
               </Card.Header>
               <Card.Body>
                   {/* Error and success messages */}
                   {error && <Alert variant="danger">{error}</Alert>}
                   {message && <Alert variant="success">{message}</Alert>}
                   
                   {/* Conditional rendering based on players array */}
                   {players.length === 0 ? (
                       <Alert variant="info">No registered players found.</Alert>
                   ) : (
                       // Player list table
                       <Table striped bordered hover responsive>
                           <thead>
                               <tr>
                                   <th>Name</th>
                                   <th>Email</th>
                                   <th>Registration Date</th>
                                   <th>Actions</th>
                               </tr>
                           </thead>
                           <tbody>
                               {/* Map through players array to create table rows */}
                               {players.map(player => (
                                   <tr key={player._id}>
                                       <td>{player.name}</td>
                                       <td>{player.email}</td>
                                       <td>
                                           {new Date(player.createdAt).toLocaleDateString()}
                                       </td>
                                       <td>
                                           <Button 
                                               variant="danger" 
                                               size="sm"
                                               onClick={() => handleDelete(player._id)}
                                           >
                                               Delete
                                           </Button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </Table>
                   )}
               </Card.Body>
           </Card>
       </Container>
   );
};

export default Players;