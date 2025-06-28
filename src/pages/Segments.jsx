// src/pages/Segments.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Segments() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Customer Segments
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          🚧 Segments page coming soon!
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          This will contain AI-powered customer segmentation features.
        </Typography>
      </Paper>
    </Box>
  );
}