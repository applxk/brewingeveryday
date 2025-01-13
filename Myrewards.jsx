import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box, Modal, IconButton, LinearProgress  } from '@mui/material';
import { useLocation } from "react-router-dom";
import http from '../../http';
import CloseIcon from '@mui/icons-material/Close';
import background from '../../images/Rewards/modalbg.jpg';
import leafIcon from '../../images/Icons/Eco.png';

function MyRewards() {
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
const [points, setPoints] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const memberID = queryParams.get('memberID'); // Extract memberID from query parameters

   useEffect(() => {
    const fetchRedeemedRewards = async () => {
      setLoading(true);  // Start loading

      try {
        // Fetch pointsAccumulated
        const pointsResponse = await http.get(`/api/Membership/pointsAccumulated/${memberID}`);
        setPoints(pointsResponse.data.pointsAccumulated);  // Store the pointsAccumulated from the response

        // Fetch redeemed rewards
        const rewardsResponse = await http.get(`/redeemRecords/${memberID}`);
        const rewards = rewardsResponse.data || [];
        setRedeemedRewards(rewards);  // Store redeemed rewards

        // Calculate progress based on the redeemed rewards
        const greenVoucherCount = rewards.filter(
          (reward) => reward.rewardChoice.choiceName === '$30 VoucherGreenCollective'
        ).length;
        setProgress(greenVoucherCount * 20);  // Increment progress by 20% per voucher
      } catch (error) {
        setError("No rewards Available");
        console.error("Failed to fetch redeemed rewards:", error);
      } finally {
        setLoading(false);  // End loading
      }
    };

    if (memberID) fetchRedeemedRewards();

    // Set background styles
    document.body.style.backgroundImage = `url(${background})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, [memberID]);

  if (loading) {
    return <CircularProgress sx={{ color: '#553929', marginTop: 4 }} />;
  }

 const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  // Handle when memberID is not available
  if (!memberID) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
          You must be logged in to view your redeemed rewards.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Container sx={{ marginTop: 4, textAlign: 'center', minHeight: '100vh', paddingBottom: 4, zIndex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            color: '#FFF',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '15px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#3E2723',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
          }}
        >
          Welcome, Member ID: {memberID}
        </Typography>


{/* Display Points */}
          <Typography variant="h6" sx={{ color: 'white', textAlign: 'left', paddingLeft: '20px', backgroundColor: '#553929', width: '30%',fontWeight:'bold' }}>
            Points Accumulated: {points !== null ? points : 'Not Available'}
          </Typography>

        {/* Sustainability progress bar */}
        <Typography variant="h6" sx={{ color: 'green', marginBottom: 1, fontWeight: 'bold', textAlign: 'left' }}>
          Sustainability Progress Tracker
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <img src={leafIcon} alt="Leaf Icon" style={{ width: '32px', height: '32px', marginRight: '8px' }} />
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 20,
                width: '600px',
                borderRadius: 5,
                backgroundColor: 'white',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'green',
                },
              }}
            />
          </Box>
        </Box>

        {/* Rewards Table */}
        <Typography variant="h6" sx={{ marginBottom: 3, color: 'black', fontWeight: 'bold' }}>
          Rewards You Have Redeemed:
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer
          component={Paper}
          sx={{
            marginTop: 4,
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#6D4C41' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#FFF', fontFamily: 'Roboto, sans-serif', fontSize: '16px', width: '100px', textAlign: 'center' }}><strong>Name</strong></TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#FFF', fontFamily: 'Roboto, sans-serif', fontSize: '16px', width: '100px', textAlign: 'center' }}><strong>Redeem ID</strong></TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#FFF', fontFamily: 'Roboto, sans-serif', fontSize: '16px', width: '100px', textAlign: 'center' }}><strong>Reward Choice Name</strong></TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#FFF', fontFamily: 'Roboto, sans-serif', fontSize: '16px', width: '100px', textAlign: 'center' }}><strong>Points to Redeem</strong></TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#FFF', fontFamily: 'Roboto, sans-serif', fontSize: '16px', width: '100px', textAlign: 'center' }}><strong>Reward Image</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {redeemedRewards.length > 0 ? (
                redeemedRewards.map((reward) => (
                  <TableRow key={reward.redeemID} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#F1E0C5' } }}>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', width: '100px', textAlign: 'center' }}>{reward.membership.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', width: '100px', textAlign: 'center', fontWeight: 'bold' }}>{reward.redeemID}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', width: '100px', textAlign: 'center', fontWeight: 'bold' }}>{reward.rewardChoice.choiceName}</TableCell>
                    <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', width: '100px', textAlign: 'center' }}>{reward.rewardChoice.pointsToRedeem}</TableCell>
                    <TableCell>
                      {reward.rewardChoice.imageName ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 1,
                            borderRadius: '8px',
                            border: '2px solid #DDD',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
                            }
                          }}
                        >
                          <img
                            src={`https://localhost:7004/images/rewardchoices/${reward.rewardChoice.imageName}`}
                            alt={reward.rewardChoice.choiceName}
                            onClick={() => handleImageClick(`https://localhost:7004/images/rewardchoices/${reward.rewardChoice.imageName}`)}
                            style={{
                              width: '100%',
                              maxWidth: '150px',
                              maxHeight: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">No image available</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ padding: 2 }}>
                    No redeemed rewards found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for image zoom */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: 24,
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: '#000',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '50%',
              }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={selectedImage}
              alt="Reward"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}

export default MyRewards;
