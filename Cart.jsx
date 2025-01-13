import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import { Link, useNavigate } from 'react-router-dom';
import http from '../http'

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pickupStore, setPickupStore] = useState('');
  const [pickupStoreAddress, setPickupStoreAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupStores, setPickupStores] = useState([]); // Store pickup options
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize navigate function
  const navigate = useNavigate();

  // Generate time slots from 10:00 AM to 10:00 PM with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
        const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const handleProceedToOrder = () => {
    // Generate a random 6-digit order number
    const orderNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  
    // Pass the order number along with cart data and pickup details
    navigate('/Order', {
      state: {
        cart: cart, 
        pickupStore: pickupStore, 
        pickupDate: pickupDate, 
        pickupTime: pickupTime, 
        subtotal: subtotal,
        orderNumber: orderNumber,  // Pass the order number
      }
    });
  };
  
  
  
  // Set default time to the nearest available time (30-minute interval)
  const setDefaultTime = () => {
    const currentTime = new Date();
    let nextAvailableTime;

    // If current time is before 10:00 AM, set to 10:00 AM
    if (currentTime.getHours() < 10 || (currentTime.getHours() === 10 && currentTime.getMinutes() < 30)) {
      nextAvailableTime = "10:00";
    } else if (currentTime.getHours() >= 22) {
      // If it's after 10 PM, set the time to 10:00 AM tomorrow
      nextAvailableTime = "10:00";
    } else {
      // Otherwise, adjust to the next 30-minute slot
      let nextMinute = currentTime.getMinutes() < 30 ? 30 : 0;
      let nextHour = currentTime.getMinutes() < 30 ? currentTime.getHours() : currentTime.getHours() + 1;

      nextAvailableTime = `${nextHour < 10 ? `0${nextHour}` : nextHour}:${nextMinute === 0 ? '00' : '30'}`;
    }

    setPickupTime(nextAvailableTime);
  };



  // Set default date based on current date and time
  const setDefaultDate = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // If it's after 10:00 PM, set the default date to tomorrow
    if (currentHour >= 22) {
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    // Set the pickup date in YYYY-MM-DD format
    setPickupDate(currentDate.toISOString().split('T')[0]);
  };

  // Disable past dates and disable the current date if it's past 10 PM
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const currentTime = new Date();

    // Check if the selected date is the current day and time is past 10 PM
    if (selectedDate === today && (currentTime.getHours() >= 22 || (currentTime.getHours() === 22 && currentTime.getMinutes() > 0))) {
      setDateError('Today is unavailable because it is already past 10:00 PM.');
      return;
    }

    // Prevent selecting past dates
    if (selectedDate < today) {
      setDateError('Pickup date cannot be in the past.');
      return;
    }

    setDateError('');
    setPickupDate(selectedDate);
  };

  const handleTimeChange = (event) => {
    const selectedTime = event.target.value;
    const [hour, minute] = selectedTime.split(':').map(Number);

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (hour < 10 || (hour === 10 && minute < 0)) {
      setTimeError('Pickup time cannot be before 10:00 AM.');
      return;
    }

    if (hour > 22 || (hour === 22 && minute > 0)) {
      setTimeError('Pickup time cannot be after 10:00 PM.');
      return;
    }

    const nextAvailableDateTime = getNextAvailableDateTime(); // Helper function to get next available date and time
    const [nextAvailableDate, nextAvailableTime] = nextAvailableDateTime.split(' ');
    const selectedTimeFormatted = `${pickupDate} ${selectedTime}:00`; // Format the selected time with the date

    // Ensure that the selected time is not earlier than the next available time
    if (selectedTimeFormatted < nextAvailableDateTime) {
      setTimeError('Pickup time cannot be earlier than the next available time.');
      return;
    }

    setTimeError('');
    setPickupTime(selectedTime);
  };

  // Helper function to get the next available date and time
  const getNextAvailableDateTime = () => {
    const currentDateTime = new Date();
    const nextAvailableTime = new Date();

    // If current time is before 10:00 AM, set to 10:00 AM
    if (currentDateTime.getHours() < 10 || (currentDateTime.getHours() === 10 && currentDateTime.getMinutes() < 30)) {
      nextAvailableTime.setHours(10, 0, 0); // Set to 10:00 AM
    } else {
      // Adjust to the next 30-minute slot
      let nextMinute = currentDateTime.getMinutes() < 30 ? 30 : 0;
      let nextHour = currentDateTime.getMinutes() < 30 ? currentDateTime.getHours() : currentDateTime.getHours() + 1;

      nextAvailableTime.setHours(nextHour, nextMinute, 0);
    }

    // Return date and time in the format "YYYY-MM-DD HH:MM"
    return `${nextAvailableTime.toISOString().split('T')[0]} ${nextAvailableTime.getHours()}:${nextAvailableTime.getMinutes() < 10 ? '0' + nextAvailableTime.getMinutes() : nextAvailableTime.getMinutes()}`;
  };

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const pickupStoresResponse = await fetch('https://localhost:7168/Cart/GetPickupStores');
        const pickupStoresData = await pickupStoresResponse.json();
        console.log('Pickup Store Data:', pickupStoresData);

        // Set the pickup stores in state
        setPickupStores(pickupStoresData);

        const response = await fetch('https://localhost:7168/Cart');
        const cartData = await response.json();

        if (cartData.cartItems) {
          setCart(cartData.cartItems);
        } else {
          setCart([]); // Empty cart if no items are found
        }

        // Set pickup date and time if available, otherwise fallback to default
        setPickupDate(cartData.pickupDate || new Date().toISOString().split('T')[0]); // Default to today
        setPickupTime(cartData.pickupTime || '10:00'); // Default to 10:00 AM

      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
    setDefaultTime();
    setDefaultDate();
  }, []); // Empty dependency array ensures this runs once on component mount

  // Function to handle item removal
  const handleRemoveItem = async (cartItemID) => {
    try {
      // Make API call to remove the item
      const response = await fetch(`https://localhost:7168/Cart/RemoveItem?cartItemId=${cartItemID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove item from the UI
        const updatedCart = cart.filter(item => item.cartItemID !== cartItemID);
        setCart(updatedCart);
      } else {
        setError('Failed to remove item. Please try again.');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Loading Cart...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  // Show empty cart message if no items
  if (!cart.length) {
    return (
      <Container sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: '-20px' }}
        >
          Shopping Cart
        </Typography>
        <Box
          sx={{
            width: '20%',
            height: '5px',
            backgroundColor: '#bd9479',
            margin: '0 auto',
          }}
        />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '30px' }}>
          Oops, it seems like your cart is currently empty.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginTop: '20px' }}>
          Click below to shop now!
        </Typography>
        <Link to="/menu">
          <Button variant="contained" sx={{ marginTop: 3, backgroundColor: '#bd9479' }}>
            Continue Shopping
          </Button>
        </Link>
      </Container>
    );
  }

  // Calculate the total subtotal
  const subtotal = cart.reduce((total, item) => total + (item.subTotal || 0), 0).toFixed(2);

  const handleStoreChange = (event) => {
    const selectedStoreId = event.target.value;
    setPickupStore(selectedStoreId);

    // Find the selected store in the pickupStores array and update the address
    const selectedStore = pickupStores.find((store) => store.id === selectedStoreId);
    setPickupStoreAddress(selectedStore ? selectedStore.address : '');
  };

  const handleClearCart = async () => {
    try {
      // Make the API call to clear the cart
      const response = await fetch('https://localhost:7168/Cart/ClearCart?cartId=1', {
        method: 'POST', // Assuming POST is the method to clear the cart
      });

      if (response.ok) {
        // After clearing the cart, reset the cart state
        setCart([]);
        alert('Cart has been cleared!');
      } else {
        alert('Failed to clear the cart. Please try again.');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear the cart. Please try again.');
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    try {
      const url = `https://localhost:7168/Cart/SetPickupDetails?cartId=1&pickupStore=${encodeURIComponent(pickupStore)}&pickupDate=${encodeURIComponent(pickupDate)}&pickupTime=${encodeURIComponent(pickupTime)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.Message || 'Failed to save the details. Please try again.');
        return;
      }

      const savedData = await response.json();
      const updatedCart = savedData.cart;

      setPickupStore(updatedCart.pickupStore);
      setPickupDate(updatedCart.pickupDate);
      setPickupTime(updatedCart.pickupTime);
      setIsEditing(false);

      alert(savedData.message);

    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while saving the details. Please try again.');
    }
  };

  // Function to reset pickup date and time
  const handleRefreshPickupDetails = () => {
    setDefaultDate();
    setDefaultTime();
    alert("Pickup details have been reset to the next available date and time.");
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      {/* Styled title with line underneath */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: '-20px' }}
      >
        Shopping Cart
      </Typography>
      <Box
        sx={{
          width: '20%',
          height: '5px',
          backgroundColor: '#bd9479',
          margin: '0 auto',
        }}
      />

      {/* Grid layout for left and right sections */}
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {/* Left side: Cart Items Table */}
        <Grid item xs={8}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Quantity</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Remove</th>
              </tr>
            </thead>
          </table>

          {/* Divider Line between header and cart items */}
          <Box sx={{ width: '100%', height: '3px', backgroundColor: '#bd9479', marginTop: '-1px' }} />

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {cart.map((item) => (
                <>
                  <tr key={item.cartItemID}>
                    <td style={{ padding: '10px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                      {/* Enlarged image */}
                      <img
                        src={`https://localhost:7168/uploads/products/${item.productImage}`}
                        alt={item.productName}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px', marginRight: '10px' }}
                      />
                      {item.productName}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{item.quantity}</td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>${item.productPrice?.toFixed(2)}</td>
                    {/* Add a delete icon */}
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <IconButton onClick={() => handleRemoveItem(item.cartItemID)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                  {/* Divider Line between each cart item */}
                  <tr>
                    <td colSpan="4">
                      <Box sx={{ width: '100%', height: '1px', backgroundColor: '#ddd', marginTop: '2px' }} />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>

          {/* Continue Shopping Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            {/* Continue Shopping Button */}
            <Link to="/menu">
              <Button variant="contained" sx={{ backgroundColor: '#bd9479' }}>
                Continue Shopping
              </Button>
            </Link>

            {/* Clear Cart Button */}
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', marginTop: -1 }}
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>

        {/* Right side: Summary */}
        <Grid item xs={4}>
          <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
              Summary
            </Typography>
            {/* Divider Line */}
            <Box sx={{ marginTop: 1, borderBottom: '3px solid #bd9479', marginBottom: 3 }} />

            <Box sx={{ padding: 2, backgroundColor: '#f1f1f1', borderRadius: '8px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: '10px' }}>
                Pickup Details
              </Typography>

              <Box sx={{ marginTop: 2 }}>
                {isEditing ? (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
                      Pickup Store:
                    </Typography>
                    <Select
                      value={pickupStore}
                      onChange={handleStoreChange}
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Pickup Store</MenuItem>
                      {pickupStores.map((store) => (
                        <MenuItem key={store.name} value={store.name}>
                          {store.name}
                        </MenuItem>
                      ))}
                    </Select>

                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', marginTop: '10px' }}>
                      Pickup date:
                    </Typography>
                    <TextField
                      type="date"
                      value={pickupDate}
                      onChange={handleDateChange}
                      fullWidth
                      error={!!dateError}
                      helperText={dateError}
                    />

                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', marginTop: '10px' }}>
                      Pickup time:
                    </Typography>
                    <Select
                      value={pickupTime}
                      onChange={handleTimeChange}
                      fullWidth
                      displayEmpty
                    >
                      {generateTimeSlots().map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>

                    <Button
                      onClick={handleSaveClick}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: '20px' }}
                    >
                      Save Pickup Details
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body1">Store: {pickupStore}</Typography>
                    <Typography variant="body1">Date: {pickupDate}</Typography>
                    <Typography variant="body1">Time: {pickupTime}</Typography>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="contained"
                      color="secondary"
                      fullWidth
                      sx={{ marginTop: '20px' }}
                    >
                      Edit Pickup Details
                    </Button>
                  </>
                )}
              </Box>
              {/* Add Refresh Button */}
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleRefreshPickupDetails}
                sx={{ marginTop: 3 }}
              >
                Refresh Pickup Details
              </Button>
            </Box>



            {/* Divider Line */}
            <Box sx={{ marginTop: 1, borderBottom: '3px solid #bd9479', marginBottom: 3 }} />

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                Subtotal: ${subtotal}
              </Typography>
            </Box>

            {/* Proceed to Payment Button */}
            <Box sx={{ textAlign: 'center' }}>
              {/* <Link to="/Order"> */}
              <Button variant="contained" onClick={handleProceedToOrder} color="primary" sx={{ marginTop: 3, width: '100%' }}>
                Proceed to Order
              </Button>
              {/* </Link> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;
