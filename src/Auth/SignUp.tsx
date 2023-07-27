import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import BoltIcon from '@mui/icons-material/Bolt';
import theme from '../Misc/Theme';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignUp = ({ handleSignUp, handleBack, errorMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = false;
    if (password !== confirmPassword || password.length === 0) {
      setPasswordError("Passwords do not match");
      errors = true;
    }
    if (!password.length ) {
      setPasswordError("Password Invalid");
      errors = true;
    }
    if (!username.length|| username.includes(" ")) {
      setUsernameError(
        "Username invalid"
      );
      errors = true;
    }
    if (!errors) {
      handleSignUp(username, password);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "@media(max-width:769px)": { marginTop: 8 },
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <BoltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an Account
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
                  inputProps={{ 'aria-label': 'Enter your username' }}
                  aria-labelledby="username-input"
                  error={!!usernameError}
                  helperText={usernameError}
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
                <TextField
                  id="confirmPassword"
                  variant="outlined"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  inputProps={{ 'aria-label': 'Confirm your password' }}
                  aria-labelledby="confirm-password-input"
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={handleBack}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
