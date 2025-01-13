import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';

import Logo from '../src/images/icons/PrimaryLogov3.png';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './themes/MyTheme';

//Front-End
import Homes from './pages/Home';
import AboutUs from './pages/About';
import Rewards from './pages/Rewards/Rewards';
import Campaigns from './pages/Campaigns/Campaigns';
import MenuPage from './pages/Menu/Menu';
import IndividualMenu from './pages/Menu/IndividualMenu.jsx';
import Cart from './pages/Cart.jsx';
import Order from './pages/Order.jsx'
import MyRewards from './pages/Profile/Myrewards.jsx';
import ContactForm from './pages/ContactForm/Form';
import MembershipForm from './pages/Rewards/membershipForm';
import UserMember from './pages/Profile/Member.jsx';
import Footer from './Footer';


import StaffBackend from './pages/BackendStaff/Staff';


//payment & newsletter
import PaymentsBackend from './pages/BackendStaff/Payments';
import Contact_SupportBackend from './pages/BackendStaff/Contact_Support';
import NewslettersBackend from './pages/BackendStaff/Newsletters';

//Products/orders
import OrdersBackend from './pages/BackendStaff/Orders';
import ProductsBackend from './pages/BackendStaff/Products/Products.jsx';
import ProdCategoryBackend from './pages/BackendStaff/Products/ProdCategory.jsx';
import AddProduct from './pages/BackendStaff/Products/AddProduct.jsx';

//sustainability dashboard 
import DashboardBackend from './pages/BackendStaff/Dashboard';

// Rewards
import RewardsBackend from './pages/BackendStaff/Rewards/Rewards';
import RewardLogin from './pages/BackendStaff/Rewards/DailyLogin.jsx';
import RewardSupply from './pages/BackendStaff/Rewards/Supplier.jsx';
import RewardItems from  './pages/BackendStaff/Rewards/RewardItems.jsx';
import MembersRewards from  './pages/BackendStaff/Rewards/ManageMembers.jsx';
import RedemptionMember from  './pages/BackendStaff/Rewards/RedemptionMember.jsx';

//Campaigns
import CampaignsBackend from './pages/BackendStaff/Campaigns';
import OrderForm from './pages/Order.jsx';



function App() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(max-width:960px) and (min-width:600px)');
  const [showScroll, setShowScroll] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Scroll handler
  const handleScroll = () => {
    setShowScroll(window.scrollY > 200);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dropdown menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add to cart
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity } 
            : cartItem
        );
      } else {
        return [...prevCart, item];
      }
    });
  };
  
  // Add User routes here
  const userRoutes = (
    <Routes>
      <Route path="/" element={<Homes />} />
      <Route path="/About" element={<AboutUs />} />
      <Route path="/Rewards" element={<Rewards />} />
      <Route path="/Campaigns" element={<Campaigns />} />
      <Route path="/Menu" element={<MenuPage />} />
      <Route path="/individual-menu/:prodID" element={<IndividualMenu onAddToCart={addToCart} />} />
      <Route path="/Cart" element={<Cart cart={cart} setCart={setCart} />} />
      <Route path="/Order" element={<OrderForm />} />
      <Route path="/Form" element={<ContactForm />} />
      <Route path="/UserMember" element={<UserMember />} />
      <Route path="/MembershipForm" element={<MembershipForm />} />
      <Route path="/myrewards" element={<MyRewards />} />
    </Routes>
  );

  // STAFF ROUTES BACKEND 
  // Staff routes start with "/staff-portal" (add /staff-portal in your individual staff page files)
  const staffRoutes = (
    <Routes>
      <Route path="/" element={<DashboardBackend />} />
      <Route path="/dashboard" element={<DashboardBackend />} />
      <Route path="/staff" element={<StaffBackend />} />
      <Route path="/payments" element={<PaymentsBackend />} />

      <Route path="/orders" element={<OrdersBackend />} />
      <Route path="/products" element={<ProductsBackend />} />
      <Route path="/product-categories" element={<ProdCategoryBackend />} />
      <Route path="/add-product" element={<AddProduct />} />

      <Route path="/rewards" element={<RewardsBackend />} />
      <Route path="/reward-dailylogin" element={<RewardLogin />} />
      <Route path="/rewardSupply" element={<RewardSupply />} />
      <Route path="/rewardItems" element={<RewardItems />} />
      <Route path="/manageMembers" element={<MembersRewards />} />
      <Route path="/redemptionMember" element={<RedemptionMember />} />


      <Route path="/campaigns" element={<CampaignsBackend />} />
      <Route path="/contact-support" element={<Contact_SupportBackend />} />
      <Route path="/newsletters" element={<NewslettersBackend />} />
    </Routes>
  );

  return (
    <Router>
      <ThemeProvider theme={Theme}>

        {/* Define routes */}
        <Routes>
          <Route path="*"
              element={
                <>
                  {/* Navigation */}
                  <AppBar position="static" className="AppBar" sx={{ backgroundColor: '#bd9479' }}>
                    <Toolbar
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: isMobile ? 1 : 3.5,
                        padding: isMobile ? 1 : 2,
                      }}
                    >
                      {/* Left Navigation Links */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 1 : 4.5,
                          alignItems: isMobile ? 'flex-start' : 'center',
                        }}
                      >
                        <Button component={Link} to="/About" color="inherit">
                          About
                        </Button>
                        <Button component={Link} to="/Rewards" color="inherit">
                          Rewards
                        </Button>
                        <Button component={Link} to="/Campaigns" color="inherit">
                          Campaign
                        </Button>
                      </Box>

                      {/* Center Logo */}
                      <Button
                        component={Link}
                        to="/"
                        sx={{
                          flexGrow: 1,
                          padding: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          margin: isMedium ? '0 20px' : '0', 
                          alignItems: 'center',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.3s ease-in-out',
                          },
                        }}
                      >
                        <img
                          src={Logo}
                          alt="Café Au Brew Logo"
                          style={{
                            width: isMobile ? '150px' : isMedium ? '170px' : '180px',
                            height: 'auto',
                            transition: 'transform 0.3s ease-in-out',
                            margin: isMedium ? '0 15px' : '0',
                            display: 'block', 
                          }}
                        />


                      </Button>

                      {/* Right Navigation Links */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 1 : 4.5,
                          alignItems: isMobile ? 'flex-start' : 'center',
                        }}
                      >
                        <Button component={Link} to="/Menu" color="inherit">
                          Menu
                        </Button>
                        <Button component={Link} to="/Form" color="inherit">
                          Contact
                        </Button>
                      </Box>
                      {/* Icons with Dropdown Menu */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: isMobile ? 2 : 1,
                          marginTop: isMobile ? 1 : 0,
                        }}
                      >
                        <IconButton component={Link} to="/Cart" sx={{ fontSize: 40, color: 'white' }}>
  <ShoppingBagIcon sx={{ fontSize: 40, color: 'white' }} />
</IconButton>


                        {/* Profile Dropdown */}
                        <IconButton onClick={handleMenuOpen}>
                          <AccountCircleIcon sx={{ fontSize: 40, color: 'white' }} />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          sx={{
                            '& .MuiPaper-root': {
                              borderRadius: '8px',
                              backgroundColor: '#553929',
                              color: 'white',
                              fontSize: '18px',
                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            },
                            '& .MuiMenuItem-root:hover': {
                              backgroundColor: '#d3b8a1',
                              color: '#553929',
                            },
                          }}
                        >
                          <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                            Profile
                          </MenuItem>
                          <MenuItem onClick={handleMenuClose} component={Link} to="/Usermember">
                            Rewards Catalogue 
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Toolbar>
                  </AppBar>


                  {/* News Ticker */}
                  <div className="news-ticker">
                    <div className="news-ticker-text">
                      <span>"Savor today, Sustain tomorrow"</span>
                      <span>Brewed with love and passion, for every sip!</span>
                      <span>Check out our latest Coffee - Brew Speciality!</span>
                    </div>
                  </div>

                  {/* Content */}
                  <Container sx={{ padding: isMobile ? 2 : 4 }}>
                    {userRoutes}
                  </Container>

                  {/* Back to Top Button */}
                  {showScroll && (
                    <IconButton
                      onClick={scrollToTop}
                      sx={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        background: 'linear-gradient(45deg, #bd9479, #a17e63)',
                        color: 'white',
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                        },
                      }}
                    >
                      <ArrowUpwardIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                  )}

                  {/* Footer */}
                  <Footer />
                </>
              }
            />

            {/* Staff routes start with "/staff-portal" */}
            <Route path="/staff-portal/*" 
              element={
                <>
                  
                  <Container sx={{ flexGrow: 1, 
                    marginTop: 7,
                    // marginLeft: 28.3,
                   }}>
                    {/* <Sidebar /> */}
                    {staffRoutes}
                  </Container>
                </>
              }
            />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
