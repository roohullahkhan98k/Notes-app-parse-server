import  { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Profile,UpdateProfile } from '../../components';

import './userProfile.scss';
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: 0}}>
      <div className="UserProfile-Title">User Profile</div>
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