import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  makeStyles,
  Grid,
  IconButton,
} from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowBack } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    maxWidth: 400,
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

const AddBus = () => {
  const classes = useStyles();
  
  const [busData, setBusData] = useState({
    Busnumber: '',
    Drivername: '',
    DriverLicense: '',
    mobileNumber: '',
    Route: '',
    Villages: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData({ ...busData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(busData).every(Boolean)) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (busData.mobileNumber.length !== 10) {
      toast.error('Driver phone number must be 10 digits.');
      return;
    }

    try {
      const response = await fetch('https://akash-school.onrender.com/api/Addbus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(busData),
      });
      if (response.ok) {
        console.log('Bus added successfully');
        toast.success('Bus added successfully');
        setBusData({
          Busnumber: '',
          Drivername: '',
          DriverLicense: '',
          mobileNumber: '',
          Route: '',
          Villages: '',
        });
      } else {
        throw new Error('Failed to add bus');
      }
    } catch (error) {
      console.error('Error adding bus:', error);
      toast.error('Failed to add bus. Please try again later.');
    }
  };
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
const goBack = () => {
  navigate('/'); 
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


  return (
    <div className={classes.root}>
      <IconButton className={classes.backButton} onClick={goBack}>
        <ArrowBack />
      </IconButton>
      <div className={classes.formContainer}>
        <Typography variant="h4" gutterBottom>
          Add Bus
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Bus Number"
                name="Busnumber"
                fullWidth
                value={busData.Busnumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Driver Name"
                name="Drivername"
                fullWidth
                value={busData.Drivername}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Driver License"
                name="DriverLicense"
                fullWidth
                value={busData.DriverLicense}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Driver Phone Number"
                name="mobileNumber"
                fullWidth
                value={busData.mobileNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Route"
                name="Route"
                fullWidth
                value={busData.Route}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Villages"
                name="Villages"
                fullWidth
                value={busData.Villages}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                fullWidth
              >
                Add Bus
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBus;
