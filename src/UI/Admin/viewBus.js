import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  makeStyles,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  formInput: {
    width: '100%',
  },
}));

const ViewBusPage = () => {
  const classes = useStyles();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    Busnumber: '',
    Drivername: '',
    DriverLicense: '',
    mobileNumber: '',
    Route: '',
    Villages: '',
  });
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [updateConfirmationOpen, setUpdateConfirmationOpen] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('https://akash-school.onrender.com/api/Addbus');
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
      toast.error('Failed to fetch buses. Please try again later.');
    }
  };

  const handleUpdate = (bus) => {
    setSelectedBus(bus);
    setUpdateFormData({ ...bus });
    setUpdateConfirmationOpen(true);
  };

  const handleDelete = async (id) => {
    setSelectedBus(id);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`https://akash-school.onrender.com/api/Addbus/${selectedBus}`);
      toast.success('Bus deleted successfully');
      fetchBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast.error('Failed to delete bus. Please try again later.');
    } finally {
      setDeleteConfirmDialogOpen(false);
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdateConfirmed = async () => {
    try {
      await axios.put(
        `https://akash-school.onrender.com/api/Addbus/${selectedBus._id}`,
        updateFormData
      );
      toast.success('Bus updated successfully');
      fetchBuses();
    } catch (error) {
      console.error('Error updating bus:', error);
      setUpdateError('An error occurred while updating the bus.');
    } finally {
      setUpdateConfirmationOpen(false);
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


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(buses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buses');
    XLSX.writeFile(workbook, 'buses.xlsx');
  };

  const filteredBuses = buses.filter((bus) =>
    Object.values(bus).some(
      (value) =>
        typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())
    )
  );
  return (
    <div className={classes.root}>
    <Typography variant="h4" gutterBottom>
      All Buses Information
    </Typography>
    {updateError && <Alert severity="error">{updateError}</Alert>}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{width:500}}
      />
      <Button variant="contained" color="primary" onClick={exportToExcel}>
        Export to Excel
      </Button>
    </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus Number</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Driver License</TableCell>
              <TableCell>Driver Phone Number</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Villages</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBuses.map((bus) => (
              <TableRow key={bus._id}>
                <TableCell>{bus.Busnumber}</TableCell>
                <TableCell>{bus.Drivername}</TableCell>
                <TableCell>{bus.DriverLicense}</TableCell>
                <TableCell>{bus.mobileNumber}</TableCell>
                <TableCell>{bus.Route}</TableCell>
                <TableCell>{bus.Villages}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(bus)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(bus._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={updateConfirmationOpen}
        onClose={() => setUpdateConfirmationOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleUpdateConfirmed}>
          <DialogTitle id="form-dialog-title">Update Bus</DialogTitle>
          <DialogContent>
            <div className={classes.formContainer}>
              <TextField
                className={classes.formInput}
                label="Bus Number"
                name="Busnumber"
                value={updateFormData.Busnumber}
                onChange={handleUpdateFormChange}
              />
              <TextField
                className={classes.formInput}
                label="Driver Name"
                name="Drivername"
                value={updateFormData.Drivername}
                onChange={handleUpdateFormChange}
              />
              <TextField
                className={classes.formInput}
                label="Driver License"
                name="DriverLicense"
                value={updateFormData.DriverLicense}
                onChange={handleUpdateFormChange}
              />
              <TextField
                className={classes.formInput}
                label="Driver Phone Number"
                name="mobileNumber"
                value={updateFormData.mobileNumber}
                onChange={handleUpdateFormChange}
              />
              <TextField
                className={classes.formInput}
                label="Route"
                name="Route"
                value={updateFormData.Route}
                onChange={handleUpdateFormChange}
              />
              <TextField
                className={classes.formInput}
                label="Villages"
                name="Villages"
                value={updateFormData.Villages}
                onChange={handleUpdateFormChange}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateConfirmationOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={() => setDeleteConfirmDialogOpen(false)}
      >
        <DialogTitle>Delete Bus</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bus?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ViewBusPage;
