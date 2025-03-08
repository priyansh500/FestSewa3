import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function EventList() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(res => setEvents(res.data));
  }, []);
  return (
    <div>
      <h1>Events</h1>
      {events.map(event => (
        <div key={event._id}>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleString()}</p>
          <p>Tickets Available: {event.ticketsAvailable}</p>
          <Link to={`/register/${event._id}`}>Register</Link>
        </div>
      ))}
    </div>
  );
}

function Register({ match }) {
  const eventId = match.params.id;
  const [userId] = useState('example-user-id'); // Replace with actual user auth
  const handleRegister = () => {
    axios.post('http://localhost:5000/api/register', { userId, eventId })
      .then(res => alert(res.data.message));
  };
  return (
    <div>
      <h1>Register for Event</h1>
      <button onClick={handleRegister}>Book Ticket</button>
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:5000/api/user/example-user-id') // Add this endpoint in backend
      .then(res => setUser(res.data));
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <>
          <h2>Registered Events</h2>
          <ul>{user.registeredEvents.map(id => <li key={id}>{id}</li>)}</ul>
          <h2>Quiz Scores</h2>
          <ul>{user.quizScores.map(score => <li key={score.eventId}>{score.score}</li>)}</ul>
        </>
      )}
    </div>
  );
}

function App() {
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    socket.on('announcement', (msg) => setAnnouncement(msg));
  }, []);
  return (
    <div>
      {announcement && <div className="announcement">{announcement}</div>}
      <nav>
        <Link to="/">Events</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;