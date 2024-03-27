import { AppBar, Button, Toolbar, Typography, Box, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import JSA from './logo.jpg';
const logoStyles = {
  width: '50px',
  height: '50px',
  marginRight: '10px',
  borderRadius: '50%',
};

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Box display="flex" alignItems="center">
            <img src={JSA} alt="Logo" styles={logoStyles} width={30} height={30} style={{ marginRight: '10px' }} />
            <Typography variant="h6">Akash Schools</Typography>
          </Box>
          <Box>
            <Button color="inherit" to="/homepage" component={Link}>
              <HomeTwoToneIcon />
            </Button>
            <Button color="inherit" aria-controls="student-menu" aria-haspopup="true" onClick={handleClick}>
              Students
            </Button>
            <Menu id="student-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose} to="/Addstudent" component={Link}>
                Add Student
              </MenuItem>
              <MenuItem onClick={handleClose} to="/viewstudents" component={Link}>
                View All Students
              </MenuItem>
            </Menu>
            <Button color="inherit" aria-controls="teacher-menu" aria-haspopup="true" onClick={handleClick}>
              Teachers
            </Button>
            <Menu id="teacher-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose} to="/Addteacher" component={Link}>
                Add Teacher
              </MenuItem>
              <MenuItem onClick={handleClose} to="/viewteachers" component={Link}>
                View All Teachers
              </MenuItem>
            </Menu>
            <Button color="inherit" aria-controls="bus-menu" aria-haspopup="true" onClick={handleClick}>
              Buses
            </Button>
            <Menu id="bus-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose} to="/addbus" component={Link}>
                Add Bus
              </MenuItem>
              <MenuItem onClick={handleClose} to="/viewbuses" component={Link}>
                View All Buses
              </MenuItem>
            </Menu>
            <Button color="inherit" to="/updatefee" component={Link}>
              Fee Update
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit">
            Logout <LogoutIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}