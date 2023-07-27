import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#050404',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fbbe25',
      contrastText: '#050404',
    },
    background: {
      paper: '#FFFFFF',
      default: '#FAFAFA',
      success: '#E5FCEC',
      warning: '#FFF9E8',
      error: '#FFEBEE',
      info: '#E3F2FD',
    },
    text: {
      primary: '#050404',
      secondary: '#757575',
      disabled: '#bdbdbd',
      hint: '#9B9B9B',
    }
  },  shape: {
    borderRadius: '12px',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          boxShadow: 'none',
        },
        outlinedPrimary: {
          color: '#1a1a1a',
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #eeeeee',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
        color: 'primary',
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#050404',
          fontWeight: 500,
          borderRadius: '8px',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
        },
        message: {
          padding: '0',
        },
        action: {
          marginLeft: '12px',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '52px',
      letterSpacing: '-1.5px',
    },
    h2: {
      fontWeight: 600,
      fontSize: '36px',
      lineHeight: '40px',
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '28px',
    },
    h4: {
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '0.25px',
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '20px',
      borderRadius: '8px',
      padding: '12px 24px',
    },
    caption: {
      fontSize: '12px',
      lineHeight: '14px',
      fontWeight: 400,
      letterSpacing: '0.4px',
    },
    overline: {
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '1.5px',
      lineHeight: '12px',
      textTransform: 'uppercase',
    },
  },
});

export default theme;
