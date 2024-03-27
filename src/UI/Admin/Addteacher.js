import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';
import teacher from './Teacher.jpg';
import { Card, CardContent, TextField, Button, Typography, Grid ,MenuItem,Select} from '@material-ui/core';
import {  useNavigate } from 'react-router-dom';

const FormCard = ({ label, name, value, type = 'text', onChange }) => (
  <TextField
    variant="outlined"
    margin="normal"
    required
    fullWidth
    id={name}
    label={label}
    name={name}
    autoComplete={name}
    autoFocus
    type={type}
    value={value}
    onChange={onChange}
  />
);

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundImage: `url(${teacher})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    padding: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(8),
    },
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
  },
  header: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  username: {
    textAlign: 'right',
    color: '#333',
    fontWeight: 'bold',
  },
}));

const AddTeacher = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    TeacherId: '',
    Teachername: '',
    subject: '',
    mobileNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.TeacherId) {
      errors.TeacherId = 'Teacher ID is required';
      isValid = false;
      toast.error(errors.TeacherId);
    }

    if (!formData.Teachername) {
      errors.Teachername = 'Teacher name is required';
      isValid = false;
      toast.error(errors.Teachername);
    }

    if (!formData.subject) {
      errors.subject = 'Subject is required';
      isValid = false;
      toast.error(errors.subject);
    }

    if (!formData.mobileNumber || !/^\d+$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number is required and must be a number';
      isValid = false;
      toast.error(errors.mobileNumber);
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
      toast.error(errors.password);
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
      toast.error(errors.confirmPassword);
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch('https://akash-school.onrender.com/api/Addteacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to add teacher');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setFormData({
            TeacherId: '',
            Teachername: '',
            subject: '',
            mobileNumber: '',
            address: '',
            password: '',
            confirmPassword: '',
          });
          toast.success('Teacher added successfully');
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error('Failed to add teacher');
        });
    }
  };

  return (
    <div className={classes.root}>
      <Grid container justify="flex-end">
        <Typography variant="body1" className={classes.username}>
          Logged in as: {username}
        </Typography>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" className={classes.header}>
                Add Teacher
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormCard label="Teacher ID" name="TeacherId" value={formData.TeacherId} onChange={handleChange} />
                <FormCard label="Name" name="Teachername" value={formData.Teachername} onChange={handleChange} />
                <div style={{ marginBottom: '20px' }}>
                  <Typography variant="subtitle1" gutterBottom>Subject:</Typography>
                  <Select
                    id="class"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="Telugu">Telugu</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Maths">Maths</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="Social">Social</MenuItem>
                  </Select>
                  </div>
                <FormCard label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                <FormCard label="Address" name="address" value={formData.address} onChange={handleChange} />
                <FormCard label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
                <FormCard label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Add Teacher
                </Button>
              </form>
              <ToastContainer />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddTeacher;
