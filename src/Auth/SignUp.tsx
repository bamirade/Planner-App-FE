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
  IconButton,
  ThemeProvider,
} from "@mui/material";
import TaskAlt from "@mui/icons-material/TaskAlt";
import theme from "../Misc/Theme";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser } from "../api/auth";

interface SignUpProps {
  handleSignUp: (
    email: string,
    password: string,
    passwordConfirmation: string
  ) => void;
  handleBack: () => void;
  errorMessage: string | null;
}

const SignUp: React.FC<SignUpProps> = ({
  handleSignUp,
  handleBack,
  errorMessage,
}) => {
  const [email, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let errors = false;
    if (password !== passwordConfirmation || password.length === 0) {
      setPasswordError("Passwords do not match");
      errors = true;
    }
    if (!password.length) {
      setPasswordError("Password Invalid");
      errors = true;
    }
    if (!email.length || email.includes(" ")) {
      setUsernameError("Email Invalid");
      errors = true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUsernameError("Please enter a valid email address");
      errors = true;
    }
    if (!errors) {
      try {
        const response = await registerUser({
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        localStorage.setItem("token", response.token);
        handleSignUp(email, password, passwordConfirmation);
      } catch (error) {
        setUsernameError("Email invalid or taken");
      }
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
            <TaskAlt />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an Account
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
                  value={email}
                  onChange={(e) => setUsername(e.target.value)}
                  inputProps={{ "aria-label": "Enter your Email" }}
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
                  autoComplete="new-password"
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
                  inputProps={{ "aria-label": "Enter your password" }}
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
                  value={passwordConfirmation}
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
                  inputProps={{ "aria-label": "Confirm your password" }}
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
