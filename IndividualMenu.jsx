import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';  // Import CloseIcon
import http from '../../http';

function IndividualMenu({ onAddToCart }) {
  const { prodID } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ open: false, message: '', image: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await http.get(`https://localhost:7168/Product/${prodID}`);
        if (response.status === 200) {
          setProduct(response.data);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [prodID]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        // Make an API call to add the product to the cart
        const response = await http.post(
          `https://localhost:7168/Cart/AddToCart?productId=${product.prodID}&quantity=${quantity}`
        );
        if (response.status === 200) {
          // Update cart in App.jsx
          onAddToCart({
            id: product.prodID,
            name: product.prodName,
            quantity: quantity,
            image: `https://localhost:7168/uploads/products/${product.prodImg}`,
          });

          // Trigger the notification
          setNotification({
            open: true,
            message: `${product.prodName} has been added to your cart`,
            image: `https://localhost:7168/uploads/products/${product.prodImg}`,
          });
        } else {
          console.error('Failed to add product to cart');
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    }
  };

  const totalAmount = product ? (product.price * quantity).toFixed(2) : 0;

  return (
    <Container sx={{ marginTop: 4 }}>
      {product ? (
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Link to="/Menu">
              <IconButton
                sx={{
                  position: 'absolute',
                  backgroundColor: '#bd9479',
                  '&:hover': {
                    backgroundColor: '#a17e63',
                  },
                }}
              >
                <ArrowBackIcon sx={{ color: 'white' }} />
              </IconButton>
            </Link>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={`https://localhost:7168/uploads/products/${product.prodImg}`}
              alt={product.prodName}
              sx={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: 3,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
              {product.prodName}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 4 }}>
              {product.description}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 6 }}>
              ${parseFloat(product.price).toFixed(2)}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', marginBottom: 2 }}>
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
              <Button
                onClick={decreaseQuantity}
                sx={{
                  backgroundColor: 'transparent',
                  border: '2px solid #bd9479',
                  color: '#bd9479',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderColor: '#a17e63',
                    color: '#a17e63',
                  },
                }}
              >
                -
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px' }}>
                <TextField
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  type="number"
                  inputProps={{ min: 1 }}
                  sx={{ textAlign: 'center' }}
                />
              </Box>
              <Button
                onClick={increaseQuantity}
                sx={{
                  backgroundColor: 'transparent',
                  border: '2px solid #bd9479',
                  color: '#bd9479',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderColor: '#a17e63',
                    color: '#a17e63',
                  },
                }}
              >
                +
              </Button>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3 }}>
              Total: ${totalAmount}
            </Typography>

            <Button
              onClick={handleAddToCart}
              sx={{
                marginTop: 1,
                backgroundColor: '#bd9479',
                color: 'white',
                width: '100%',
                padding: '12px 0',
                '&:hover': { backgroundColor: '#a17e63' },
              }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6">Loading product details...</Typography>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Top-center position
      >
        <Alert
          severity="success"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            color: 'black',
            boxShadow: 2,
            padding: '8px 16px',
            borderRadius: '8px',
            width: 'auto',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1, color: 'black', textAlign: 'center' }}>
            Item(s) Added
          </Typography>

          {/* Centered Image */}
          <Box
            component="img"
            src={notification.image}
            alt={product?.prodName}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '4px',
              marginBottom: 2,
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />

          <Typography variant="body2" sx={{ color: 'black', textAlign: 'center' }}>
            {notification.message}
          </Typography>

          {/* Close Button */}
          <IconButton
            onClick={() => setNotification({ ...notification, open: false })}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              color: 'black',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default IndividualMenu;
