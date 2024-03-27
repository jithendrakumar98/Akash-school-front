import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import * as XLSX from 'xlsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  editButton: {
    color: theme.palette.warning.main,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  searchInput: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
}));

const ViewTeachers = () => {
  const classes = useStyles();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [teacherIdToDelete, setTeacherIdToDelete] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [teacherToUpdate, setTeacherToUpdate] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://akash-school.onrender.com/api/AddTeacher')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);
  
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


  const handleDeleteClick = (id) => {
    setTeacherIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`https://akash-school.onrender.com/api/AddTeacher/${teacherIdToDelete}`)
      .then(() => {
        setTeachers(teachers.filter(teacher => teacher._id !== teacherIdToDelete));
        setOpenDeleteDialog(false);
      })
      .catch(error => {
        console.error('Error deleting teacher:', error);
      });
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleUpdateClick = (teacher) => {
    setTeacherToUpdate(teacher);
    setOpenUpdateDialog(true);
  };

  const handleUpdateConfirm = () => {
    axios.put(`https://akash-school.onrender.com/api/AddTeacher/${teacherToUpdate._id}`, teacherToUpdate)
      .then((response) => {
        const updatedTeachers = teachers.map((teacher) =>
          teacher._id === response.data._id ? response.data : teacher
        );
        setTeachers(updatedTeachers);
        setOpenUpdateDialog(false);
      })
      .catch((error) => {
        console.error('Error updating teacher:', error);
      });
  };

  const handleUpdateCancel = () => {
    setOpenUpdateDialog(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    axios.get('https://akash-school.onrender.com/api/AddTeacher')
      .then((response) => {
        const filteredTeachers = response.data.filter((teacher) =>
          teacher.Teachername.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setTeachers(filteredTeachers);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  };

  const handleDownloadExcel = () => {
    const data = teachers.map((teacher) => ({
      TeacherId: teacher.TeacherId,
      TeacherName: teacher.Teachername,
      Subject: teacher.subject,
      MobileNumber: teacher.mobileNumber,
      Address: teacher.address,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
    XLSX.writeFile(wb, 'teachers.xlsx');
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        All Teachers Information
      </Typography>
      <div className={classes.buttonGroup}>
        <TextField
          label="Search by Name"
          variant="outlined"
          className={classes.searchInput}
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teacher Id</TableCell>
              <TableCell>Teacher Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell>{teacher.TeacherId}</TableCell>
                <TableCell>{teacher.Teachername}</TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>{teacher.mobileNumber}</TableCell>
                <TableCell>{teacher.address}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    className={classes.editButton}
                    onClick={() => handleUpdateClick(teacher)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    className={classes.deleteButton}
                    onClick={() => handleDeleteClick(teacher._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this teacher?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdateDialog}
        onClose={handleUpdateCancel}
        style={{ height: '700px' }}
      >
        <DialogTitle>Edit Teacher Information</DialogTitle>
        <DialogContent style={{ height: '100%' }}>
          <TextField
            label="Teacher Name"
            variant="outlined"
            fullWidth
            value={teacherToUpdate ? teacherToUpdate.Teachername : ''}
            onChange={(e) =>
              setTeacherToUpdate({ ...teacherToUpdate, Teachername: e.target.value })
            }
          />
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
            value={teacherToUpdate ? teacherToUpdate.subject : ''}
            onChange={(e) =>
              setTeacherToUpdate({ ...teacherToUpdate, subject: e.target.value })
            }
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            value={teacherToUpdate ? teacherToUpdate.mobileNumber : ''}
            onChange={(e) =>
              setTeacherToUpdate({ ...teacherToUpdate, mobileNumber: e.target.value })
            }
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={teacherToUpdate ? teacherToUpdate.address : ''}
            onChange={(e) =>
              setTeacherToUpdate({ ...teacherToUpdate, address: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateConfirm} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewTeachers;
