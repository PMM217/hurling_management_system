import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch players on component mount
    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/players', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                }
            });
            setPlayers(response.data);
        } catch (error) {
            setError('Failed to fetch players');
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (playerId) => {
        if (window.confirm('Are you sure you want to delete this player?')) {
            try {
                await axios.delete(`http://localhost:3000/api/users/players/${playerId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                
                setMessage('Player deleted successfully');
                // Refresh players list
                fetchPlayers();
                
                // Clear success message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setError('Failed to delete player');
                console.error('Error deleting player:', error);
            }
        }
    };

    if (loading) return <Container className="mt-4">Loading...</Container>;

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h4 className="mb-0">Player Management</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    
                    {players.length === 0 ? (
                        <Alert variant="info">No registered players found.</Alert>
                    ) : (
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