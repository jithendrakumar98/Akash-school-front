import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  makeStyles,
  Grid,
  Avatar,
  Container,
  IconButton,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    margin: '0 auto',
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  logoutButton: {
    marginLeft: 'auto',
    width: '100%',
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    marginTop: theme.spacing(5),
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  detailsContainer: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
  detailItem: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: '#f9f9f9',
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  welcomeText: {
    marginBottom: theme.spacing(4),
  },
  appBar: {
    minHeight: 10,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    borderBottom: '1px solid #eee',
  },
}));

const TeacherHome = () => {
  const classes = useStyles();
  const [teacherDetails, setTeacherDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    const teacherId = localStorage.getItem('adminUsername');

    if (!isLoggedIn || isLoggedIn !== 'true' || !teacherId) {
      navigate('/Teacherlogin');
    } else {
      fetchTeacherDetails(teacherId);
    }
  }, [navigate]);

  const fetchTeacherDetails = async (teacherId) => {
    try {
      const response = await fetch(`https://akash-school.onrender.com/api/Addteacher/teacher/${teacherId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch teacher details');
      }
      const data = await response.json();
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => !['_id', 'password', '__v'].includes(key))
      );
      setTeacherDetails(filteredData);
    } catch (error) {
      console.error('Error fetching teacher details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('userType');
    navigate('/Teacherlogin');
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Teacher Portal
          </Typography>
          <IconButton color="inherit">
            <Avatar className={classes.avatar}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Button variant="white" color="white" component={Link} to="/Addmarks">
            Add Marks
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom className={classes.welcomeText}>
          Welcome, {localStorage.getItem('adminUsername')}
        </Typography>
        <Paper elevation={3} className={classes.detailsContainer}>
          <Typography variant="h5" gutterBottom>
            Teacher Details:
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(teacherDetails).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <Paper elevation={2} className={classes.detailItem}>
                  <Typography variant="subtitle1" gutterBottom>
                    {key}
                  </Typography>
                  <Typography variant="body1">{teacherDetails[key]}</Typography>
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </Container>
  );
};

export default TeacherHome;