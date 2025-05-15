import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Chip,
  Autocomplete,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import Parse from '../../parseConfig';
import { SnackbarAlert } from '../../components';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const UpdateProfile = () => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setSnackbar({ open: true, message: 'Image size should be less than 5MB', severity: 'error' });
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setSnackbar({ open: true, message: 'Only JPEG and PNG images are allowed', severity: 'error' });
      return;
    }
    setImage(file);
  };

  const handleProfileUpdate = async () => {
    if (!image && !profilePicture) {
      setSnackbar({ open: true, message: 'Please upload an image.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const user = Parse.User.current();
      if (image) {
        const parseFile = new Parse.File(image.name, image);
        await parseFile.save();
        user.set('profileImage', parseFile);
      }
      user.set('username', username);
      user.set('phoneNumber', phoneNumber);
      user.set('skills', skills.join(', '));
      await user.save();
      setProfilePicture(user.get('profileImage'));
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Error updating profile: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const user = Parse.User.current();
    if (user) {
      setUsername(user.get('username') || '');
      setPhoneNumber(user.get('phoneNumber') || '');
      setSkills(user.get('skills') ? user.get('skills').split(', ') : []);
      setProfilePicture(user.get('profileImage'));
    }
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        py: 6,
        px: 4,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 'none',
        color: 'text.primary',
      }}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        mb={5}
        textAlign="center"
        letterSpacing={0.7}
        color="text.primary"
      >
        Update Profile
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5, position: 'relative' }}>
        <Avatar
          src={image ? URL.createObjectURL(image) : profilePicture?.url() || ''}
          alt="Profile Picture"
          sx={{ width: 130, height: 130, boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}
        />
        <label htmlFor="upload-photo" style={{ cursor: 'pointer' }}>
          <IconButton
            component="span"
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 'calc(50% - 65px)',
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              boxShadow: 2,
            }}
            aria-label="upload picture"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <input
          accept="image/jpeg,image/png"
          id="upload-photo"
          type="file"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </Box>

      <TextField
        label="Username"
        fullWidth
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{ sx: { fontSize: 16 } }}
      />

      <TextField
        label="Phone Number"
        fullWidth
        variant="outlined"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mb: 5 }}
        InputProps={{ sx: { fontSize: 16 } }}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={skills}
        onChange={(event, newValue) => setSkills(newValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
              sx={{
                fontWeight: 500,
                bgcolor: 'action.selected',
                color: 'text.primary',
                borderColor: 'primary.main',
                '& .MuiChip-deleteIcon': { color: 'primary.main' },
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Skills"
            placeholder="Type and press Enter"
            InputProps={{
              ...params.InputProps,
              sx: { fontSize: 16, bgcolor: 'background.default' },
            }}
          />
        )}
        sx={{ mb: 6 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleProfileUpdate}
        disabled={loading}
        size="large"
        sx={{
          fontWeight: 600,
          letterSpacing: 0.5,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' },
          py: 1.8,
        }}
      >
        {loading ? <CircularProgress size={26} color="inherit" /> : 'Update Profile'}
      </Button>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default UpdateProfile;
