import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PasswordUtilPage = ({ view }) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState();
  const [tokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const[message,setMessage]=useState("");



  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    axios.post('/api/auth/validate-token', { token })
      .then(response => {
        // Token je validan, možeš da prikažeš formu
        console.log(response);
        setLoading(false);
        setMessage("");
        setTokenExpired(false);
      })
      .catch(error => {
        // Token nije validan, postavi tokenExpired na true
        console.log(error);
        setTokenExpired(true);
        setMessage(" Unfortunately, your token has expired or is invalid. Therefore, this link is useless.");
        setLoading(false);
      });
  }, [location.search]);





  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password === "") {
      setError("You must enter a password");
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    setToken(token);

    axios.post('/api/auth/change-password', { token: token, newPassword: password })
      .then((response) => {
        console.log('Password successfully changed');
       // navigate('/login');
        setTokenExpired(true);
        setMessage("Unfortunately, your token has expired or is invalid. Therefore, this link is useless.");
        alert(response.data);
      })
      .catch((error) => {
        console.error('Error changing password', error);
         
        if (error.response && error.response.status === 401) {
          setTokenExpired(true);
        }
      });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          Loading...
        </div>
      </div>
    );
  }
  if (tokenExpired) {
    return (
      <div style={styles.expiredContainer}>
        <div style={styles.expiredContent}>
          <h2 style={styles.expiredTitle}>Token Expired</h2>
          <p style={styles.expiredMessage}>
           {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{view === 1 ? "Set Up Your Password" : "Reset Your Password"}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            style={styles.input}
          />
          <label style={styles.label}>Repeat Password:</label>
          <input
            type="password"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {view === 1 ? "Set Up Password" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    border: '1px solid #dcdcdc',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333333',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '18px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
    fontSize: '18px',
    color: '#555555',
  },
  input: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #cccccc',
    borderRadius: '8px',
    fontSize: '18px',
    color: '#555555',
  },
  button: {
    padding: '15px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  expiredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fbeaea', // Blaga crvena pozadina
    padding: '20px',
  },
  expiredContent: {
    maxWidth: '500px',
    width: '100%',
    padding: '40px',
    border: '2px solid #e74c3c', // Crveni okvir
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 0px 30px rgba(231, 76, 60, 0.3)', // Jači shadow za dramatičniji efekt
    textAlign: 'center',
  },
  expiredTitle: {
    fontSize: '26px',
    marginBottom: '25px',
    fontWeight: 'bold',
    color: '#c0392b', // Tamnija crvena za tekst
  },
  expiredMessage: {
    fontSize: '18px',
    color: '#555555',
    lineHeight: '1.6',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  loadingContent: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#3498db', // Plava boja teksta
    animation: 'pulse 2s infinite', // Animacija za loading tekst
  },

  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
};

export default PasswordUtilPage;
