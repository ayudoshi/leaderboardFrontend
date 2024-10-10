import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('https://leaderboardbackend-r5lc.onrender.com/api/users');
    setUsers(response.data);
  };

  const addUser = async () => {
    if (name) {
      const response = await axios.post('https://leaderboardbackend-r5lc.onrender.com/api/users', { name });
      setUsers([...users, response.data]);
      setName('');
    }
  };

  const claimPoints = async (userId) => {
    const response = await axios.post(`https://leaderboardbackend-r5lc.onrender.com/api/users/${userId}/claim`);
    const updatedUsers = users.map((user) => 
      user._id === userId ? response.data : user
    );
    setUsers(updatedUsers.sort((a, b) => b.points - a.points));
  };

  return (
    <div className="App">
      <h1>Leaderboard</h1>

      {/* Layout Wrapper */}
      <div className="layout-wrapper">
        
        {/* Add User Section */}
        <div className="section add-user">
          <h2>Add User</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
          />
          <button onClick={addUser}>Add User</button>
        </div>

        {/* Select User and Claim Points Section */}
        <div className="section claim-points">
          <h2>Assign Points</h2>
          <select onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => claimPoints(selectedUser)}
            disabled={!selectedUser}
          >
            Claim Points
          </button>
        </div>

        {/* Display User Section */}
        <div className="section display-users">
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name} - Points: {user.points}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
