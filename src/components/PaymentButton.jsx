import React, { useState } from 'react';
import { Button, CircularProgress, Alert } from '@mui/material';
import { usePaystackPayment } from 'react-paystack';
import api from '../services/api';

const PaymentButton = ({ amount, email, items, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // Convert to kobo
    currency: 'GHS',
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    channels: ['card', 'bank', 'mobile_money'],
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Initialize payment on backend
      const response = await api.post('/payments/initialize', {
        email,
        amount,
        items,
        metadata: {
          source: 'customer_segmentation_app'
        }
      });

      if (response.data.success) {
        // Use Paystack's payment initialization
        initializePayment(
          async (reference) => {
            // Payment successful, verify on backend
            try {
              const verifyResponse = await api.get(`/payments/verify/${reference.reference}`);
              if (verifyResponse.data.success) {
                onSuccess && onSuccess(verifyResponse.data.data);
              }
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          () => {
            // Payment closed
            onClose && onClose();
          }
        );
      }
    } catch (error) {
      setError('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : `Pay GH₵${amount}`}
      </Button>
    </>
  );
};

export default PaymentButton;