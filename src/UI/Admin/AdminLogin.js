import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowBack } from '@material-ui/icons';
import Loader from '../loading' 

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(4),
  },
  formContainer: {
    alignItems: 'Center',
    maxWidth: 400,
    margin: '0 auto',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  backButton: {
    position: 'fixed',
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
  },
}));

const AdminLogin = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await fetch('https://akash-school.onrender.com/api/Admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, password: password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();

      if (data === "Success login") {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('adminUsername', username);
        navigate('/AdminHome');
      } else {
        if (data === "No user found") {
          throw new Error("Not an admin");
        } else if (data === "Wrong password") {
          throw new Error("Wrong password");
        } else {
          throw new Error(data);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      if (error.message === "Not an admin" || error.message === "Wrong password") {
        toast.error(error.message);
      } else {
        toast.error('Failed to login. Please try again later.');
      }
    } finally {
      setLoading(false); 
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={classes.root}>
      <IconButton className={classes.backButton} onClick={goBack}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Login
      </Typography>
      <div className={classes.formContainer}>
        {loading ? ( 
          <Loader loading={loading} />
        ) : (
          <form onSubmit={handleLogin}>
            <TextField
              className={classes.textField}
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              className={classes.textField}
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading} 
            >
              Login
            </Button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;  