// import React, { useState, useEffect } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Grid,
//   IconButton,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { PhotoCamera, Add } from '@mui/icons-material';
// import Parse from '../../parseConfig';
// import { SnackbarAlert } from '../../components';

// const UserProfile = () => {
//   const [image, setImage] = useState(null);
//   const [username, setUsername] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [skill, setSkill] = useState('');
//   const [skills, setSkills] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const [fetchedUser, setFetchedUser] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 1024 * 1024 * 5) {
//         setSnackbar({ open: true, message: 'Image size should be less than 5MB', severity: 'error' });
//         return;
//       }
//       if (!['image/jpeg', 'image/png'].includes(file.type)) {
//         setSnackbar({ open: true, message: 'Only JPEG and PNG images are allowed', severity: 'error' });
//         return;
//       }
//       setImage(file);
//     }
//   };

//   const handleAddSkill = () => {
//     if (skill.trim() !== '') {
//       setSkills([...skills, skill]);
//       setSkill('');
//     }
//   };

//   const handleDeleteSkill = (skillToDelete) => {
//     setSkills(skills.filter((s) => s !== skillToDelete));
//   };

//   const handleProfileUpdate = async () => {
//     if (!image && !profilePicture) {
//       setSnackbar({ open: true, message: 'Please upload an image.', severity: 'error' });
//       return;
//     }

//     setLoading(true);
//     try {
//       const user = Parse.User.current();
//       if (image) {
//         const parseFile = new Parse.File(image.name, image);
//         await parseFile.save();
//         user.set('profileImage', parseFile);
//       }
//       user.set('username', username);
//       user.set('phoneNumber', phoneNumber);
//       user.set('skills', skills.join(', '));
//       await user.save();
//       setProfilePicture(user.get('profileImage'));
//       setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });

//       // Refresh fetched profile after update
//       setFetchedUser({
//         username,
//         phoneNumber,
//         skills,
//         profileImage: image ? URL.createObjectURL(image) : profilePicture?.url(),
//       });
//     } catch (error) {
//       console.error(error);
//       setSnackbar({ open: true, message: 'Error updating profile: ' + error.message, severity: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   useEffect(() => {
//     const user = Parse.User.current();
//     if (user) {
//       const fetched = {
//         username: user.get('username'),
//         phoneNumber: user.get('phoneNumber'),
//         skills: user.get('skills') ? user.get('skills').split(', ') : [],
//         profileImage: user.get('profileImage')?.url(),
//       };
//       setFetchedUser(fetched);

//       // Only update input fields once
//       setUsername('');
//       setPhoneNumber('');
//       setSkills([]);
//       setProfilePicture(user.get('profileImage'));
//     }
//   }, []);

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Grid container spacing={4}>
//         {/* Update Profile Section */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ padding: 3, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>
//                 Update User Profile
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
//                 <Box sx={{ position: 'relative' }}>
//                   <Avatar
//                     src={image ? URL.createObjectURL(image) : profilePicture?.url() || ''}
//                     alt="Profile"
//                     sx={{ width: 120, height: 120 }}
//                   />
//                   <label htmlFor="upload-photo">
//                     <IconButton
//                       component="span"
//                       sx={{
//                         position: 'absolute',
//                         bottom: 0,
//                         right: 0,
//                         backgroundColor: 'primary.main',
//                         color: 'white',
//                       }}
//                     >
//                       <PhotoCamera />
//                     </IconButton>
//                   </label>
//                   <input
//                     accept="image/*"
//                     id="upload-photo"
//                     type="file"
//                     style={{ display: 'none' }}
//                     onChange={handleImageChange}
//                   />
//                 </Box>
//               </Box>

//               <TextField
//                 label="Username"
//                 fullWidth
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />
//               <TextField
//                 label="Phone Number"
//                 fullWidth
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 sx={{ marginBottom: 2 }}
//               />

//               <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
//                 <TextField
//                   label="Add Skill"
//                   value={skill}
//                   onChange={(e) => setSkill(e.target.value)}
//                   sx={{ flexGrow: 1 }}
//                 />
//                 <IconButton onClick={handleAddSkill}>
//                   <Add />
//                 </IconButton>
//               </Box>
//               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
//                 {skills.map((s) => (
//                   <Chip key={s} label={s} onDelete={() => handleDeleteSkill(s)} />
//                 ))}
//               </Box>

//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleProfileUpdate}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} /> : 'Update Profile'}
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Profile Details Section */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ padding: 3, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h5" gutterBottom>
//                 User Profile Details
//               </Typography>
//               {fetchedUser ? (
//                 <Box sx={{ textAlign: 'center' }}>
//                   <Avatar
//                     src={fetchedUser.profileImage}
//                     alt="User"
//                     sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
//                   />
//                   <Typography variant="h6">Username: {fetchedUser.username}</Typography>
//                   <Typography>Phone: {fetchedUser.phoneNumber}</Typography>
//                   <Box mt={2}>
//                     <Typography variant="subtitle1">Skills:</Typography>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
//                       {fetchedUser.skills.map((s, index) => (
//                         <Chip key={index} label={s} />
//                       ))}
//                     </Box>
//                   </Box>
//                 </Box>
//               ) : (
//                 <Typography>Loading profile...</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <SnackbarAlert
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={handleCloseSnackbar}
//       />
//     </Box>
//   );
// };

// export default UserProfile;

import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Profile,UpdateProfile } from '../../components';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 2 }}>
        User Profile
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Profile" />
        <Tab label="Update Profile" />
      </Tabs>
      {activeTab === 0 && <Profile />}
      {activeTab === 1 && <UpdateProfile />}
    </Box>
  );
};

export default UserProfile;