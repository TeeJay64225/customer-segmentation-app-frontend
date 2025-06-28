// src/pages/Campaigns.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Campaigns() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Marketing Campaigns
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          📧 Campaigns page coming soon!
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          This will contain targeted marketing campaign features.
        </Typography>
      </Paper>
    </Box>
  );
}