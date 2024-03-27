import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent, TextField, Button, Typography, Grid, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import studentImage from './student.jpg';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
}));

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

const AddStudent = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    Studentid: '',
    Studentname: '',
    parentNames: '',
    mobileNumber: '',
    class: '',
    address: '',
    password: '',
    confirmPassword: '',
    fee: '',
    feepaid: '',
    balance: '',
    csvFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'fee' || name === 'feepaid') {
      const fee = parseInt(name === 'fee' ? value : formData.fee) || 0;
      const feepaid = parseInt(name === 'feepaid' ? value : formData.feepaid) || 0;
      const balance = fee - feepaid;
      updatedFormData = { ...updatedFormData, balance: balance.toString() };
    }

    setFormData(updatedFormData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('https://akash-school.onrender.com/api/Addstudent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Student added successfully');
          toast.success('Student added successfully');
          setFormData({
            Studentid: '',
            Studentname: '',
            parentNames: '',
            mobileNumber: '',
            class: '',
            address: '',
            password: '',
            confirmPassword: '',
            fee: '',
            feepaid: '',
            balance: '',
            csvFile: null,
          });
        } else {
          console.error('Failed to add student');
          toast.error(data.message || 'Failed to add student');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        toast.error('An error occurred while adding student');
      }
    }
  };

  const validateForm = () => {
    const {
      Studentid,
      Studentname,
      parentNames,
      mobileNumber,
      class: studentClass,
      address,
      password,
      confirmPassword,
      fee,
      feepaid
    } = formData;

    if (!Studentid.trim() || !Studentname.trim() || !parentNames.trim() || !mobileNumber.trim() || !studentClass.trim() || !address.trim() || !password.trim() || !confirmPassword.trim() || !fee.trim() || !feepaid.trim()) {
      toast.error('All fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
      toast.error('Invalid mobile number format');
      return false;
    }
    const feeNumber = parseInt(fee);
    const feepaidNumber = parseInt(feepaid);
    if (isNaN(feeNumber) || feeNumber < 0 || isNaN(feepaidNumber) || feepaidNumber < 0) {
      toast.error('Fee and fee paid must be positive integers');
      return false;
    }

    return true;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${studentImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <Grid container justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" align="center">
                Add Student to our School
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormCard label="ID" name="Studentid" value={formData.Studentid} onChange={handleChange} />
                <FormCard label="Name" name="Studentname" value={formData.Studentname} onChange={handleChange} />
                <FormCard label="Parent Names" name="parentNames" value={formData.parentNames} onChange={handleChange} />
                <FormCard label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                <div style={{ marginBottom: '20px' }}>
                  <Typography variant="subtitle1" gutterBottom>Class:</Typography>
                  <Select
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="nursery">Nursery</MenuItem>
                    <MenuItem value="klg">KLG</MenuItem>
                    <MenuItem value="ukg">UKG</MenuItem>
                    <MenuItem value="1A">1st A</MenuItem>
                    <MenuItem value="1B">1st B</MenuItem>
                    <MenuItem value="2A">2nd A</MenuItem>
                    <MenuItem value="2B">2nd B</MenuItem>
                    <MenuItem value="3A">3rd A</MenuItem>
                    <MenuItem value="3B">3rd B</MenuItem>
                    <MenuItem value="4A">4th A</MenuItem>
                    <MenuItem value="4B">4th B</MenuItem>
                    <MenuItem value="5A">5th A</MenuItem>
                    <MenuItem value="5B">5th B</MenuItem>
                    <MenuItem value="6A">6th A</MenuItem>
                    <MenuItem value="6B">6th B</MenuItem>
                    <MenuItem value="7A">7th A</MenuItem>
                    <MenuItem value="7B">7th B</MenuItem>
                    <MenuItem value="8A">8th A</MenuItem>
                    <MenuItem value="8B">8th B</MenuItem>
                    <MenuItem value="9A">9th A</MenuItem>
                    <MenuItem value="9B">9th B</MenuItem>
                    <MenuItem value="10A">10th A</MenuItem>
                    <MenuItem value="10B">10th B</MenuItem>
                  </Select>
                </div>
                <FormCard label="Address" name="address" value={formData.address} onChange={handleChange} />
                <FormCard label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
                <FormCard label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />
                <FormCard label="Fee" name="fee" value={formData.fee} onChange={handleChange} />
                <FormCard label="Fee Paid" name="feepaid" value={formData.feepaid} onChange={handleChange} />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="balance"
                  label="Balance"
                  name="balance"
                  autoComplete="balance"
                  autoFocus
                  value={formData.balance}
                  disabled
                />
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Add Student
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

export default AddStudent;
