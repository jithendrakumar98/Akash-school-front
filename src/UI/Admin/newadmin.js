import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  makeStyles,
  Container,
  Grid,
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submitButton: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AdminForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    Username: '',
    Adminname: '',
    mobileNumber: '',
    mail: '',
    address: '',
    password: '',
  });
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  
  const fetchAdminData = (loggedInUsername, navigate, setUsername) => {
    fetch('https://akash-school.onrender.com/api/Admin')
        .then(response => {
            if (!response.ok) {
                console.error('Error:', response.statusText);
                navigate('/Adminlogin');
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .then(data => {
            const isAdmin = data.some(admin => admin.Username === loggedInUsername);
            if (isAdmin) {
                setUsername(loggedInUsername);
            } else {
                console.log("User is not an admin, redirecting to login page");
                navigate('/Adminlogin');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            navigate('/Adminlogin');
        });
};

useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUsername = localStorage.getItem('adminUsername');

    console.log("isLoggedIn:", isLoggedIn);
    console.log("loggedInUsername:", loggedInUsername);

    if (!isLoggedIn || isLoggedIn !== 'true' || !loggedInUsername) {
        console.log("Redirecting to login page");
        navigate('/Adminlogin');
    } else {
        fetchAdminData(loggedInUsername, navigate, setUsername);
    }
}, [navigate, setUsername]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://akash-school.onrender.com/api/Admin', formData);
      console.log('Admin added successfully:', response.data);
      setFormData({
        Username: '',
        Adminname: '',
        mobileNumber: '',
        mail: '',
        address: '',
        password: '',
      });
      toast.success('Admin added successfully');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Error adding admin');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Admin
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Admin Name"
              name="Adminname"
              value={formData.Adminname}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={classes.submitButton}
        >
          Add Admin
        </Button>
      </form>
      <ToastContainer /> 
    </Container>
  );
};

export default AdminForm;
