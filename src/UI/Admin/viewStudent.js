import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const ViewAllStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://akash-school.onrender.com/api/Addstudent');
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearch = (query) => {
    const filteredStudents = students.filter((student) => {
      const studentId = student.Studentid ? student.Studentid.toLowerCase() : '';
      const studentName = student.Studentname ? student.Studentname.toLowerCase() : '';
      return studentId.includes(query.toLowerCase()) || studentName.includes(query.toLowerCase());
    });
    setFilteredStudents(filteredStudents);
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setUpdateFormData({ ...student });
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://akash-school.onrender.com/api/Addstudent/${id}`);
      const updatedStudents = students.filter((student) => student._id !== id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setDeleteConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
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
      await axios.put(`https://akash-school.onrender.com/api/Addstudent/${selectedStudent._id}`, updateFormData);
      const updatedStudents = students.map((student) =>
        student._id === selectedStudent._id ? { ...student, ...updateFormData } : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setUpdateDialogOpen(false);
      setUpdateError(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  const handleCloseDeleteConfirmDialog = () => {
    setDeleteConfirmDialogOpen(false);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(({ _id, __v, ...rest }) => rest));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students.xlsx');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        All Students Information
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
      <Button variant="contained" color="primary" onClick={downloadExcel}>
        Download Excel
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
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(student)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setSelectedStudent(student);
                      setDeleteConfirmDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <form onSubmit={handleUpdateFormSubmit}>
          <DialogTitle>Update Student</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="Studentname"
              value={updateFormData.Studentname}
              onChange={handleUpdateFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Parent Names"
              name="parentNames"
              value={updateFormData.parentNames}
              onChange={handleUpdateFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={updateFormData.mobileNumber}
              onChange={handleUpdateFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Class"
              name="class"
              value={updateFormData.class}
              onChange={handleUpdateFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={updateFormData.address}
              onChange={handleUpdateFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fee"
              name="fee"
              value={updateFormData.fee}
              onChange={handleUpdateFormChange}
              fullWidth
              margin="normal"
            />
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
      <Dialog open={deleteConfirmDialogOpen} onClose={handleCloseDeleteConfirmDialog}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this student?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(selectedStudent._id)}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewAllStudents;