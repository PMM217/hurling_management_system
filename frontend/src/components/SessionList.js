import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await axios.get('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    };
    fetchSessions();
  }, [token]);

  const handleMarkAttendance = async (sessionId) => {
    await axios.put(
      '/api/sessions/attendance',
      { sessionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Attendance marked!');
  };

  return (
    <ul>
      {sessions.map(session => (
        <li key={session._id}>
          {session.date} at {session.location}
          <button onClick={() => handleMarkAttendance(session._id)}>Mark Attendance</button>
        </li>
      ))}
    </ul>
  );
};

export default SessionList;
