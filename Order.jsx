import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

function Order() {
  const location = useLocation();
  const { cart, pickupStore, pickupDate, pickupTime, subtotal, orderNumber } = location.state;

  return (
    <Container sx={{ marginTop: 4 }}>

      {/* Order Summary Title */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
        Order Summary
      </Typography>
      <Box sx={{ width: '20%', height: '5px', backgroundColor: '#bd9479', margin: '0 auto' }} />

      {/* Display Order Number */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: '30px' }}>
        Order Number: {orderNumber}
      </Typography>

      {/* Cart Items */}
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>Cart Items</Typography>
        {cart.map((item) => (
          <Box key={item.cartItemID} sx={{ marginBottom: 2 }}>
            <Typography variant="body1">{item.productName} x{item.quantity} - ${item.productPrice?.toFixed(2)}</Typography>
          </Box>
        ))}
      </Box>

      {/* Pickup Details */}
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>Pickup Details</Typography>
        <Typography variant="body1">Store: {pickupStore}</Typography>
        <Typography variant="body1">Date: {pickupDate}</Typography>
        <Typography variant="body1">Time: {pickupTime}</Typography>
      </Box>

      {/* Subtotal */}
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>Subtotal: ${subtotal}</Typography>
      </Box>
    </Container>
  );
}

export default Order;
