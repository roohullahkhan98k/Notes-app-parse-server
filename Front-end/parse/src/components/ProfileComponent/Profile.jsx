import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import Parse from '../../parseConfig';
import Modal from '../Modal/Modal';

const SkillTag = ({ label }) => (
  <Box
    sx={{
      px: 2,
      py: 0.5,
      borderRadius: '12px',
      bgcolor: '#e0e0e0',
      color: '#333',
      fontWeight: 500,
      fontSize: 14,
      userSelect: 'none',
      cursor: 'default',
      whiteSpace: 'nowrap',
      boxShadow: 'none',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        bgcolor: '#d5d5d5',
      },
    }}
  >
    {label}
  </Box>
);

const ProfileSection = ({ title, children }) => (
  <Box
    sx={{
      mb: 6,
      p: 4,
      backgroundColor: '#fff',
      borderRadius: 2,
      boxShadow: '0 1px 6px rgba(0, 0, 0, 0.08)',
      width: '100%',
      maxWidth: 720,
    }}
  >
    <Typography
      variant="h6"
      fontWeight={700}
      sx={{ mb: 3, borderBottom: '1.5px solid #ccc', pb: 1, color: '#222' }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const Profile = () => {
  const [fetchedUser, setFetchedUser] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const user = Parse.User.current();
    if (user) {
      const fetched = {
        username: user.get('username'),
        phoneNumber: user.get('phoneNumber'),
        skills: user.get('skills') ? user.get('skills').split(', ') : [],
        profileImage: user.get('profileImage')?.url(),
      };
      setFetchedUser(fetched);
    }
  }, []);

  if (!fetchedUser) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#fafafa',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafafa',
        py: 8,
        px: { xs: 3, md: 0 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        {/* Basic Information */}
        <ProfileSection title="Basic Information">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Avatar
              src={fetchedUser.profileImage}
              alt={fetchedUser.username}
              sx={{
                width: 130,
                height: 130,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
              }}
              onClick={() => setZoomOpen(true)}
            />
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" fontWeight={700} color="#111" gutterBottom>
                {fetchedUser.username}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#555', fontSize: 17, userSelect: 'text' }}
              >
                Phone Number:{' '}
                <Box component="span" sx={{ fontWeight: 600, color: '#444' }}>
                  {fetchedUser.phoneNumber || 'Not Provided'}
                </Box>
              </Typography>
            </Box>
          </Box>
        </ProfileSection>

        {/* Skills */}
        <ProfileSection title="Skills">
          {fetchedUser.skills.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              {fetchedUser.skills.map((skill, index) => (
                <SkillTag key={index} label={skill} />
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: '#888', fontStyle: 'italic' }}
            >
              No skills added yet.
            </Typography>
          )}
        </ProfileSection>
      </Box>

      {/* Zoom Modal */}
      <Modal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        content={
          <Box
            component="img"
            src={fetchedUser.profileImage}
            alt={fetchedUser.username}
            sx={{
              maxHeight: '80vh',
              maxWidth: '90vw',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'block',
              margin: 'auto',
              userSelect: 'none',
            }}
          />
        }
        // No title or actions needed for zoom
        maxWidth="lg"
        // You can add hideCloseButton={false} to show close icon if you added that prop in Modal
      />
    </Box>
  );
};

export default Profile;
