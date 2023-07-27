import React, { useState } from "react";
import SignUp from "./SignUp";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import BoltIcon from '@mui/icons-material/Bolt';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import theme from '../Misc/Theme';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username && !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }
    if (!username) {
      setErrorMessage("Please enter your username");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password");
      return;
    }
    try {
      await handleLogin(username, password);
    } catch (error) {
      setErrorMessage("Invalid username or password");
    }
  };

  const handleSignUp = async (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const alreadyExists = users.some((user) => user.username === username);
    if (alreadyExists) {
      setErrorMessage("Username already exists");
    } else {
      users.push({ username, password, balance: 0 });
      localStorage.setItem("users", JSON.stringify(users));
      setShowSignUp(false);
      await handleLogin(username, password);
    }
  };

  const handleShowSignUp = () => {
    setShowSignUp(true);
  };

  const handleBack = () => {
    setShowSignUp(false);
    setErrorMessage(null);
  };

  if (showSignUp) {
    return <SignUp handleSignUp={handleSignUp} handleBack={handleBack} errorMessage={errorMessage} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            "@media(max-width:769px)": {marginTop: 8},
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <BoltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {errorMessage && (
            <Typography color="error" variant="subtitle1" align="center">
              {errorMessage}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="username"
                  variant="outlined"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  fullWidth
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errorMessage}
                  inputProps={{ 'aria-label': 'Enter your username' }}
                  aria-labelledby="username-input"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  variant="outlined"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errorMessage}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ 'aria-label': 'Enter your password' }}
                  aria-labelledby="password-input"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
                  Sign In
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button type="button" onClick={handleShowSignUp} fullWidth variant="outlined">
                  Create an Account
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
