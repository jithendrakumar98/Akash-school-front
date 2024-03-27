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
  Menu,
  MenuItem,
  Button,
  TextField,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  updateForm: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 400,
    padding: theme.spacing(3),
    backgroundColor: '#fff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  balance: {
    marginTop: theme.spacing(3),
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

const StudentHome = () => {
  const classes = useStyles();
  const [studentDetails, setStudentDetails] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateOption, setUpdateOption] = useState('');
  const [description, setDescription] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const studentId = localStorage.getItem('adminUsername');

    if (!isLoggedIn || isLoggedIn !== 'true' || !studentId) {
      navigate('/Studentlogin');
    } else {
      fetchStudentDetails(studentId);
    }
  }, [navigate]);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await fetch(`https://akash-school.onrender.com/api/Addstudent/student/${studentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }
      const data = await response.json();
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => !['_id', 'password', '__v'].includes(key))
      );
      setStudentDetails(filteredData);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUsername');
    navigate('/Studentlogin');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateRequest = async () => {
    try {
      const response = await fetch('https://akash-school.onrender.com/api/Update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          StudentId: localStorage.getItem('adminUsername'),
          UpdateRequest: updateOption,
          Disc: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post update request');
      }

      setUpdateOption('');
      setDescription('');
      setShowUpdateForm(false);
      handleMenuClose();
    } catch (error) {
      console.error('Error posting update request:', error);
      toast.error('Failed to submit update request. Please try again later.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const calculateBalance = () => {
    const { fee, feepaid } = studentDetails;
    console.log("Fee:", fee); 
    console.log("FeePaid:", feepaid); 
    const balance = fee - feepaid;
    console.log("Balance:", balance); 
    return balance;
  };

  return (
    <Container maxWidth="md" style={{ position: 'relative' }}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Student Portal
          </Typography>
          <IconButton color="inherit">
            <Avatar className={classes.avatar}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Button variant="" color="gray" to="/seemarks" component={Link}>
            See Marks
          </Button>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setShowUpdateForm(true); handleMenuClose(); }}>Request Update</MenuItem>
      </Menu>
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom className={classes.welcomeText}>
          Welcome, {localStorage.getItem('adminUsername')}
        </Typography>
        <Paper elevation={3} className={classes.detailsContainer}>
          <Typography variant="h5" gutterBottom>
            Student Details:
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(studentDetails).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <Paper elevation={2} className={classes.detailItem}>
                  <Typography variant="subtitle1" gutterBottom>
                    {key}
                  </Typography>
                  <Typography variant="body1">{studentDetails[key]}</Typography>
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="body1" className={classes.balance}>
                Balance: {calculateBalance()}
              </Typography>
            </Grid>
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
      {showUpdateForm && (
        <Paper elevation={3} className={classes.updateForm}>
          <Typography variant="h5" gutterBottom>
            Update Request:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Update Option"
                value={updateOption}
                onChange={(e) => setUpdateOption(e.target.value)}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="Marks">Update Marks</MenuItem>
                <MenuItem value="Profile">Update Profile</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateRequest}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      <ToastContainer />
    </Container>
  );
};

export default StudentHome;
