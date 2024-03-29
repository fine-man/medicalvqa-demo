import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import config from './config';
import subpath from './subpath';

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="/">
//         Medical VQA App
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    }
    console.log({
      email: email,
      password: password
    });

    // just like we did in signupside.js, we need to make a fetch request to our backend to login the user
    const login = async () => {
      const url = `${config.backendUrl}/api/user/login`;
      console.log(url, "urlhsdlk");
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json();
      console.log(res, "res");
      if (response.status === 200) {
        const token = res.token;
        console.log(token, "token");
        // store the token in localStorage

        localStorage.setItem('token', token);
        setErrMsg('');
        setEmail('');
        setPassword('');
        
        window.location.href = `${subpath}/home`
      } else {
        setEmail('');
        setPassword('');
        setErrMsg(res.error);
        console.log(errMsg, "errMsg");
      }
    }

    login();
    

  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `${subpath}/home`
    }
  }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(' + require('./background/dark.webp') + ')',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            // backgroundPosition: 'center',
            minHeight: '100vh',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={
          {
            backgroundColor: 'rgb(75 85 86 / 49%)',
          }
        }>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Typography variant="body2" color="error" align="center" fontSize={'1.1rem'}>
                {errMsg}
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                {/* <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid> */}
                <Grid item>
                  <Link href={`/medical-vqa/signup`} variant="body2" fontSize='1.1rem'>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}