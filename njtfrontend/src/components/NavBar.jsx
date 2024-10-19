import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const NavBar = ({ logout, kolicina, tokenData }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Stilovi za aktivno dugme
  const activeButtonStyle = {
    backgroundColor: '#3498db', // Elegantna plava boja za aktivno dugme
    color: '#fff', // Bela boja teksta
    borderRadius: '20px', // Zaobljene ivice za moderniji izgled
    padding: '8px 20px', // Udobniji padding
    fontWeight: 'bold', // Podebljan font za aktivno dugme
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Blaga senka
    transition: 'background-color 0.3s ease', // Glatka animacija prilikom prelaska
  };

  // Stilovi za neaktivno dugme
  const inactiveButtonStyle = {
    backgroundColor: '#e0e0e0', // Svetlo siva pozadina za neaktivna dugmad
    color: '#333', // Tamno siva boja teksta
    borderRadius: '20px', // Zaobljene ivice
    padding: '8px 20px',
    fontWeight: 'normal', // Normalan font za neaktivna dugmad
    transition: 'background-color 0.3s ease', // Animacija za hover
    '&:hover': {
      backgroundColor: '#cccccc', // Svetlija nijansa na hover
    },
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333', padding: '10px 0' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
          Online Store
        </Typography>

        {tokenData.tipKupca && (
        <Link to="/myprofile" style={{ textDecoration: 'none' }}>
          <Button sx={isActive('/myprofile') ? activeButtonStyle : inactiveButtonStyle}>
            My Profile
          </Button>
        </Link>
      )}

        {tokenData.tipAdmina && (
          <Link to="/addproizvod" style={{ textDecoration: 'none' }}>
            <Button sx={isActive('/addproizvod') ? activeButtonStyle : inactiveButtonStyle}>
              Add Product
            </Button>
          </Link>
        )}

        {tokenData.tipAdmina === "HIGHADMIN" && (
          <Link to="/nepotvrdjeneporudzbine" style={{ textDecoration: 'none' }}>
            <Button
              sx={isActive('/nepotvrdjeneporudzbine') ? activeButtonStyle : inactiveButtonStyle}
            >
              Orders
            </Button>
          </Link>
        )}

        <Link to="/products/knjige" style={{ textDecoration: 'none' }}>
          <Button
            sx={
              isActive('/products/knjige') || isActive('/products/kancelarijskiProizvodi')
                ? activeButtonStyle
                : inactiveButtonStyle
            }
          >
            Products
          </Button>
        </Link>

        <Button color="inherit" onClick={logout} sx={{ fontWeight: 'bold' }}>Logout</Button>

        {tokenData.tipKupca && (
          <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
            <IconButton sx={isActive('/cart') ? activeButtonStyle : inactiveButtonStyle}>
              <Badge badgeContent={kolicina} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;


