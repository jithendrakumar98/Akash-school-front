import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Grid, Paper, IconButton, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Notifications as NotificationsIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(2),
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#f0f0f0',
    marginTop: theme.spacing(2),
    cursor: 'pointer',
  },
  floatingPaper: {
    position: 'fixed',
    top: theme.spacing(8), 
    right: theme.spacing(2),
    width: 300,
    zIndex: 1000,
  },
}));

const AdminHome = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [blink, setBlink] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
      fetchNotifications();
    }
  }, [navigate, setUsername]);

  useEffect(() => {
    const unread = notifications.filter(notification => !notification.read);
    setUnreadNotifications(unread);
    setBlink(unread.length > 0);
  }, [notifications]);

  const fetchNotifications = () => {
    fetch('https://akash-school.onrender.com/api/Update')
      .then(response => response.json())
      .then(data => {
        setNotifications(data);
      })
      .catch(error => console.error('Error fetching notifications:', error));
  };

  const markAsRead = (studentId) => {
    fetch(`https://akash-school.onrender.com/api/Update/${studentId}`, {
      method: 'DELETE', 
    })
      .then(response => {
        if (response.ok) {
          console.log(`Notifications for student ${studentId} deleted successfully`);
          fetchNotifications(); 
        } else {
          console.error(`Error deleting notifications for student ${studentId}: ${response.statusText}`);
        }
      })
      .catch(error => console.error('Error deleting notifications:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUsername');
    navigate('/');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome, {username}
          </Typography>
          <IconButton color="inherit" onClick={() => setShowNotifications(!showNotifications)}>
            <Badge badgeContent={unreadNotifications.length} color="secondary" variant={blink ? 'dot' : 'standard'}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <div className={classes.floatingPaper} style={{ display: showNotifications ? 'block' : 'none' }}>
          {unreadNotifications.map(notification => (
            <Paper key={notification.id} className={classes.paper} onClick={() => markAsRead(notification.StudentId)}>
              <Typography variant="h6">{notification.StudentId}</Typography>
              <Typography variant="h6">{notification.UpdateRequest}</Typography>
              <Typography>{notification.Disc}</Typography>
              <Button variant="outlined" color="primary" onClick={() => markAsRead(notification.StudentId)}>Mark as Read</Button>
            </Paper>
          ))}
        </div>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/Addstudent">
                Add Student
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/Addteacher">
                Add Teacher
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/viewstudents">
                View All Students
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/addbus">
                Add Bus
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/newadmin">
                Add Admin
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/viewbuses">
                View All Buses
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/updatefee">
                Update Student Fee
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/viewteachers">
                View All Teachers
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/Addexam">
                 Student Marks
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <div className={classes.buttonContainer}>
          <Button variant="contained" color="secondary" className={classes.button} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
