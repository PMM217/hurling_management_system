import React, { useState } from 'react';
import axios from 'axios';

const CreateSession = () => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      '/api/sessions',
      { date, location },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Session created!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <button type="submit">Create Session</button>
    </form>
  );
};

export default CreateSession;
