import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip,
  CircularProgress, 
  Grid, 
  IconButton, 
  TextField, 
  Typography,
} from '@mui/material';
import { PhotoCamera, Add } from '@mui/icons-material';
import Parse from '../../parseConfig';
import { SnackbarAlert } from '../../components';

const UserProfile = () => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        setSnackbar({ open: true, message: 'Image size should be less than 5MB', severity: 'error' });
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setSnackbar({ open: true, message: 'Only JPEG and PNG images are allowed', severity: 'error' });
        return;
      }
      setImage(file);
    }
  };

  const handleAddSkill = () => {
    if (skill.trim() !== '') {
      setSkills([...skills, skill]);
      setSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((s) => s !== skillToDelete));
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
      setUsername(user.get('username'));
      setPhoneNumber(user.get('phoneNumber'));
      setSkills(user.get('skills') ? user.get('skills').split(', ') : []);
      setProfilePicture(user.get('profileImage'));
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 2 }}>
      <Card sx={{ width: 600, padding: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', marginBottom: 2 }}>
            User Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={image ? URL.createObjectURL(image) : profilePicture ? profilePicture.url() : ''}
                  alt="Profile Picture"
                  sx={{ width: 150, height: 150 }}
                />
                <label htmlFor="upload-photo">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <input
                  accept="image/*"
                  id="upload-photo"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                  label="Add Skill"
                  variant="outlined"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  sx={{ width: '80%' }}
                />
                <IconButton onClick={handleAddSkill}>
                  <Add />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((s) => (
                  <Chip key={s} label={s} onDelete={() => handleDeleteSkill(s)} />
                ))}
              </Box>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleProfileUpdate}
                disabled={loading}
                sx={{
                  padding: '10px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textTransform: 'none',
                  marginTop: 2,
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default UserProfile;