import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader = ({ loading }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {loading && <CircularProgress size={20} />}
    </div>
  );
};

export default Loader;