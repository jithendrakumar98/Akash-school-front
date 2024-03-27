import React, { useState, useEffect } from 'react';
import Footer from '../footer';
import { Grid, Button, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../UI/logo.jpg';

export default function MainHome() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowWelcome(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      setShowDescription(true);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: 'aqua',
          padding: '50px',
          boxSizing: 'border-box',
         // backgroundImage:'radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 30% 60%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1), transparent 50%)',
          backgroundPosition: '50px 10px, calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 10px, 10px calc(100% - 10px)',
          backgroundSize: '20px 20px',
        }}
      >
        <Typography
          variant="h5"
          style={{
            fontSize:'30px',
            fontWeight: 'bold',
            color: 'yellow',
            marginBottom: '20px',
            animation: 'pulse 2s infinite',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          Welcome to Akash School – Where Dreams Take Flight!
        </Typography>
        <Paper
        elevation={3}
        style={{
          backgroundColor: 'rgba(66, 66, 66, 0.8)',
          padding: '40px',
          marginBottom: '40px',
          maxWidth: '800px',
          textAlign: 'center',
          borderRadius: '20px', 
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', 
          backgroundColor:'tomato'
        }}
      >
          {showWelcome && (
            <Typography
              variant="body1"
              style={{
                fontSize: '18px',
                color: '#fff',
                marginBottom: '20px',
                textAlign: 'justify',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                fontFamily:'lucida'
              }}
            >
              At Akash School, we believe in nurturing young minds to soar to new heights. Our commitment lies in fostering a learning environment where every student's potential is unlocked and their dreams take flight. With a rich tapestry of knowledge, innovation, and compassion, we shape the leaders of tomorrow.
            </Typography>
          )}
          {showDescription && (
            <>
              <Typography
                variant="body1"
                style={{
                  fontSize: '18px',
                  color: '#fff',
                  marginBottom: '20px',
                  textAlign: 'justify',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                  fontFamily:'lucida'
                }}
              >
                Our holistic approach to education goes beyond textbooks. We empower our students with not just knowledge, but also the skills, values, and resilience needed to thrive in an ever-evolving world. Through personalized attention and cutting-edge resources, we inspire curiosity, creativity, and critical thinking.
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontSize: '18px',
                  color: '#fff',
                  marginBottom: '20px',
                  textAlign: 'justify',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                  fontFamily:'lucida'
                }}
              >
                At Akash School, excellence is not just a goal; it's our way of life. Our dedicated faculty, passionate staff, and supportive community work hand-in-hand to create an environment where every student can excel. Together, we celebrate diversity, cultivate talent, and build lifelong connections.
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontSize: '18px',
                  color: '#fff',
                  marginBottom: '40px',
                  textAlign: 'justify',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                  fontFamily:'lucida'
                }}
              >
                Whether you're taking your first steps into education or seeking new horizons, Akash School welcomes you to join us on this extraordinary journey. Together, let's explore, learn, and grow as we embark on the adventure of education, discovery, and fulfillment.
              </Typography>
            </>
          )}
        </Paper>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Button
            to="/AdminLogin"
            component={Link}
            variant="contained"
            style={{
              backgroundColor: '#673ab7',
              color: '#fff',
              marginRight: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Admin
          </Button>
          <Button
            to="/studentlogin"
            component={Link}
            variant="contained"
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              marginRight: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Student
          </Button>
          <Button
            to="/teacherlogin"
            component={Link}
            variant="contained"
            style={{
              backgroundColor: '#ff5722',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Teacher
          </Button>
        </div>
        <img
          src={logo}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '100px',
            height: '100px', // To make it a circle, set width and height to the same value
            borderRadius: '60%', // Makes the image round (circle)
  }}
/>
      </div>
      <Footer />

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}