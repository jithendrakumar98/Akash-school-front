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
  makeStyles,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
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

const UpdateStudentFee = () => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    actualFee: '',
    amountPaid: '',
    balance: '',
    presentPaid: '',
  });
  const [updateError, setUpdateError] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get('https://akash-school.onrender.com/api/Addstudent')
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filteredStudents = students.filter((student) => {
      const studentId = student.Studentid ? student.Studentid.toLowerCase() : '';
      const studentName = student.Studentname ? student.Studentname.toLowerCase() : '';
      return studentId.includes(query) || studentName.includes(query);
    });
    setFilteredStudents(filteredStudents);
  };

  const handleDownload = () => {
    const data = students.map((student) => ({
      StudentId: student.Studentid,
      Name: student.Studentname,
      ParentName: student.parentNames,
      'Mobile Number': student.mobileNumber,
      Fee: student.fee,
      FeePaid: student.feepaid,
      Balance: student.fee - student.feepaid,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'studentsFee.xlsx');
  };

  const handleUpdateFee = (student) => {
    setSelectedStudent(student);
    setUpdateFormData({
      actualFee: student.actualFee,
      amountPaid: '',
      balance: student.balance,
      presentPaid: student.feepaid,
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAmountPaid = parseFloat(updateFormData.amountPaid);
      const newPresentPaid = parseFloat(updateFormData.presentPaid) + newAmountPaid;
      const newBalance = parseFloat(updateFormData.actualFee) - newPresentPaid;

      await axios.put(
        `https://akash-school.onrender.com/api/Addstudent/${selectedStudent._id}`,
        { feepaid: newPresentPaid, balance: newBalance }
      );

      const updatedStudents = students.map((student) =>
        student._id === selectedStudent._id
          ? { ...student, feepaid: newPresentPaid, balance: newBalance }
          : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);

      setUpdateDialogOpen(false);
      setUpdateFormData({
        actualFee: '',
        amountPaid: '',
        balance: '',
      });
      setUpdateError(null);
    } catch (error) {
      console.error('Error updating student fee:', error);
      setUpdateError('An error occurred while updating student fee.');
    }
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
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


  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Update Student Fee
      </Typography>
      {updateError && <Alert severity="error">{updateError}</Alert>}
      <TextField
        label="Search by Student ID or Name"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginBottom: '10px' }}>
        Search
      </Button>
      <Button variant="contained" color="primary" onClick={handleDownload} style={{ marginBottom: '10px', marginLeft: isSmallScreen ? '10px' : '0' }}>
        Download Students Data
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Parent Names</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Fee Paid</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.Studentid}</TableCell>
                <TableCell>{student.Studentname}</TableCell>
                <TableCell>{student.parentNames}</TableCell>
                <TableCell>{student.mobileNumber}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>{student.fee}</TableCell>
                <TableCell>{student.feepaid}</TableCell>
                <TableCell>{student.fee - student.feepaid}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateFee(student)}
                  >
                    Update Fee
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleUpdateFormSubmit}>
          <DialogTitle id="form-dialog-title">Update Fee</DialogTitle>
          <DialogContent>
            <div className={classes.formContainer}>
              <TextField
                className={classes.formInput}
                label="Amount Paid"
                name="amountPaid"
                value={updateFormData.amountPaid}
                onChange={handleUpdateFormChange}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default UpdateStudentFee;
