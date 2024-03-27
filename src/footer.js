import React from 'react';

function Footer() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#31363F',
      color: 'white',
      textAlign: 'center',
      padding: '1px 0',
      borderTop: '1px solid #ccc', 
      fontSize: '14px', 
    }}>
      <div style={{ marginBottom: '5px' }}>
        © Copyright 2024 by Akash Schools. All Rights Reserved. (-jithendra kumar Arthimalla)
      </div>
    </div>
  );
}

export default Footer;
