import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import api from '../services/api';

export default function ApiTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await api.get('/health');
      setResult(`✅ Health Check Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Health Check Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        firstName: 'Test',
        lastName: 'User',
        email: 'test' + Date.now() + '@example.com',
        password: 'Password123!'
      });
      setResult(`✅ Registration Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Registration Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>API Test</Typography>
      <Box mb={2}>
        <Button variant="contained" onClick={testHealthCheck} disabled={loading} sx={{ mr: 2 }}>
          Test Health Check
        </Button>
        <Button variant="contained" onClick={testRegistration} disabled={loading}>
          Test Registration
        </Button>
      </Box>
      {result && (
        <Alert severity={result.includes('✅') ? 'success' : 'error'}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{result}</pre>
        </Alert>
      )}
    </Box>
  );
}