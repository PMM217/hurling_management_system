//Import required dependencies
import React, { useState, useEffect, useCallback } from 'react'; //React and hooks
import { Container, Card, Form, Button, Row, Col, Alert, Image } from 'react-bootstrap'; //UI components
import axios from 'axios'; //HTTP client
import config from '../config'; //API configuration

//Profile component - Manages user profile information and image
const Profile = () => {
    //State management
    const [profile, setProfile] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        position: '',
        county: '',
        imageUrl: ''
    });
    const [error, setError] = useState(''); //Error message state
    const [success, setSuccess] = useState(''); //Success message state
    const [loading, setLoading] = useState(true); //Loading state
    const [isEditing, setIsEditing] = useState(false); //Edit mode toggle
    const [selectedImage, setSelectedImage] = useState(null); //Selected image for upload

    //Get the JWT token
    const token = localStorage.getItem('jwt_token');

     //Fetch profile data function wrapped in useCallback
    const fetchProfile = useCallback(async () => {
        try {
            //const response = await axios.get('http://localhost:3000/api/users/profile', {
                const response = await axios.get(`${config.apiUrl}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            //Extract and set user data
            const userData = response.data;
            setProfile({
                name: userData.name || '',
                age: userData.profileInfo?.age || '',
                height: userData.profileInfo?.height || '',
                weight: userData.profileInfo?.weight || '',
                position: userData.profileInfo?.position || '',
                county: userData.profileInfo?.county || '',
                imageUrl: userData.imageUrl || ''
            });
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch profile');
            setLoading(false);
        }
    }, [token]);

    //Load profile data on component mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    //Handle image file selection - (Not currently working)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1048576) { // Check file size (1MB limit)
                setError('File size should be less than 1MB');
                return;
            }

            //Read and set image file
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setProfile(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    //Handle form submission for profile updates
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            //await axios.put('http://localhost:3000/api/users/profile',
                await axios.post(`${config.apiUrl}/users/profile`, {
                profile,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setSuccess('Profile updated successfully');
            setIsEditing(false);
            setSelectedImage(null);
        } catch (err) {
            setError('Failed to update profile');
        }
    };
//Show loading state while fetching data
    if (loading) {
        return <Container className="mt-4">Loading...</Container>;
    }

    return (
        <Container className="mt-4">
            <Card>
            <Card.Header style={{ backgroundColor: '#2E8B57' }} className="text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Player Profile</h4>
                    {!isEditing && (
                        <Button variant="light" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                    )}
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    
                    <Row>
                        <Col md={4} className="text-center mb-4">
                            {/* Profile Picture Section */}
                            <Card>
                                <Card.Body>
                                    {(profile.imageUrl || selectedImage) ? (
                                        <Image 
                                            src={selectedImage || profile.imageUrl} 
                                            alt="Profile" 
                                            roundedCircle 
                                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                            className="mb-3"
                                        />
                                    ) : (
                                        <div 
                                            className="bg-light rounded-circle mb-3 d-flex align-items-center justify-content-center"
                                            style={{ width: '200px', height: '200px', margin: '0 auto' }}
                                        >
                                            <i className="bi bi-person-fill" style={{ fontSize: '5rem' }}></i>
                                        </div>
                                    )}
                                    {isEditing && (
                                        <Form.Group>
                                            <Form.Label>Update Profile Picture</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="mt-2"
                                            />
                                            <Form.Text className="text-muted">
                                                Maximum file size: 1MB
                                            </Form.Text>
                                        </Form.Group>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={8}>
                            {isEditing ? (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={profile.age}
                                                    onChange={(e) => setProfile({...profile, age: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Position</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={profile.position}
                                                    onChange={(e) => setProfile({...profile, position: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Height (cm)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={profile.height}
                                                    onChange={(e) => setProfile({...profile, height: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Weight (kg)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={profile.weight}
                                                    onChange={(e) => setProfile({...profile, weight: e.target.value})}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>County</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={profile.county}
                                            onChange={(e) => setProfile({...profile, county: e.target.value})}
                                        />
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                    <Button 
                                            type="submit" 
                                            style={{ backgroundColor: '#2E8B57', borderColor: '#2E8B57' }} 
                                            className="flex-grow-1"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="secondary"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setSelectedImage(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div>
                                    <h5>Personal Information</h5>
                                    <Row className="mb-4">
                                        <Col md={12}>
                                            <strong>Name: </strong>{profile.name}
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <strong>Age: </strong>{profile.age}
                                        </Col>
                                        <Col md={6}>
                                            <strong>Position: </strong>{profile.position}
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <strong>Height: </strong>{profile.height} cm
                                        </Col>
                                        <Col md={6}>
                                            <strong>Weight: </strong>{profile.weight} kg
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col md={12}>
                                            <strong>County: </strong>{profile.county}
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;