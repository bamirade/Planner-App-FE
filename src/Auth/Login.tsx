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
  ThemeProvider,
} from "@mui/material";
import TaskAlt from "@mui/icons-material/TaskAlt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import theme from "../Misc/Theme";
import { loginUser } from "../api/auth";

interface LoginProps {
  handleLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username && !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    if (!username) {
      setErrorMessage("Please enter your email");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await loginUser({ email: username, password });
      localStorage.setItem("token", response.token);
      handleLogin();
    } catch (error) {
      setErrorMessage("Invalid email or password");
    }
  };

  const handleSignUp = () => {
    setShowSignUp(false);
    handleLogin();
  };

  const handleShowSignUp = () => {
    setShowSignUp(true);
  };

  const handleBack = () => {
    setShowSignUp(false);
    setErrorMessage(null);
  };

  return (
    <ThemeProvider theme={theme}>
      {showSignUp ? (
        <SignUp
          handleSignUp={handleSignUp}
          handleBack={handleBack}
          errorMessage={errorMessage}
        />
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              "@media(max-width:769px)": { marginTop: 8 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <TaskAlt />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {errorMessage && (
              <Typography color="error" variant="subtitle1" align="center">
                {errorMessage}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    variant="outlined"
                    label="Email"
                    name="username"
                    autoComplete="username"
                    fullWidth
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errorMessage}
                    inputProps={{ "aria-label": "Enter your email" }}
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
                    inputProps={{ "aria-label": "Enter your password" }}
                    aria-labelledby="password-input"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    onClick={handleShowSignUp}
                    fullWidth
                    variant="outlined"
                  >
                    Create an Account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
};

export default Login;
