import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Payments() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Payment Management
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          💳 Payments page coming soon!
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          This will contain Paystack payment integration features.
        </Typography>
      </Paper>
    </Box>
  );
}