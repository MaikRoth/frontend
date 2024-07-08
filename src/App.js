import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [visitCount, setVisitCount] = useState(0);
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);
  const [nameCount, setNameCount] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [lastVisit, setLastVisit] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      fetch('/api/visit')
        .then(response => response.json())
        .then(data => {
          setVisitCount(data.visitCount);
          setLastVisit(data.lastVisit);
        });

      fetch('/api/names')
        .then(response => response.json())
        .then(data => setNames(data.names));

      fetch('/api/names/count')
        .then(response => response.json())
        .then(data => setNameCount(Number(data.count)));
    }
  }, [loggedIn]);

  const handleRegister = (e) => {
    e.preventDefault();
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (response.ok) {
        alert('Registration successful! Please log in.');
        setRegistering(false);
      } else {
        response.json().then(data => alert(data.error));
      }
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (response.ok) {
        setLoggedIn(true);
        setUsername('');
        setPassword('');
      } else {
        response.json().then(data => alert(data.error));
      }
    });
  };

  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST'
    })
    .then(response => {
      if (response.ok) {
        setLoggedIn(false);
        setVisitCount(0);
        setNames([]);
        setNameCount(0);
        setGreeting('');
        setLastVisit('');
      }
    });
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    fetch('/api/names', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    }).then(() => {
      setNames([...names, name]);
      setName('');
      setNameCount(prevCount => prevCount + 1);
      setGreeting(`Hello, ${name}!`);
    });
  };

  const handleNameDelete = (nameToDelete) => {
    fetch('/api/names', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: nameToDelete })
    }).then(() => {
      setNames(names.filter(n => n !== nameToDelete));
      setNameCount(prevCount => prevCount - 1);
      if (nameToDelete === greeting.split(', ')[1]?.slice(0, -1)) {
        setGreeting('');
      }
    });
  };

  if (!loggedIn) {
    if (registering) {
      return (
        <div className="App container mt-5">
          <header className="text-center mb-5">
            <h1 className="display-4">Register</h1>
            <form className="form-inline justify-content-center" onSubmit={handleRegister}>
              <input
                type="text"
                className="form-control mr-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                type="password"
                className="form-control mr-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <button className="btn btn-link" onClick={() => setRegistering(false)}>Already have an account? Log in</button>
          </header>
        </div>
      );
    }

    return (
      <div className="App container mt-5">
        <header className="text-center mb-5">
          <h1 className="display-4">Login</h1>
          <form className="form-inline justify-content-center" onSubmit={handleLogin}>
            <input
              type="text"
              className="form-control mr-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              className="form-control mr-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <button className="btn btn-link" onClick={() => setRegistering(true)}>Don't have an account? Register</button>
        </header>
      </div>
    );
  }

  return (
    <div className="App container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4">Stateful Application</h1>
        <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>
        <p className="lead">This page has been visited {visitCount} times.</p>
        {lastVisit && <p>Last visit: {lastVisit}</p>}
        {greeting && <p className="alert alert-info">{greeting}</p>}
        <form className="form-inline justify-content-center" onSubmit={handleNameSubmit}>
          <input
            type="text"
            className="form-control mr-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <h2 className="mt-5">Names submitted ({nameCount}):</h2>
        <ul className="list-group">
          {names.map((name, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {name}
              <button className="btn btn-danger btn-sm" onClick={() => handleNameDelete(name)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
