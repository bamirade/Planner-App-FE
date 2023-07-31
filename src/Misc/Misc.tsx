import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div">
          FIND TITLE!!!! AND DESIGN!!!
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="body1" color="inherit" align="center">
          Copyright © {new Date().getFullYear()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export { Header, Footer };