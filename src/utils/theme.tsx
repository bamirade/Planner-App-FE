import { PaletteMode } from "@mui/material";
import { ThemeOptions, createTheme } from "@mui/material/styles";

const theme = (mode: PaletteMode | undefined = "light"): ThemeOptions => {
  const isLightMode = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLightMode ? "#fb5141" : "#fb5141",
      },
      secondary: {
        main: isLightMode ? "#fafecd" : "#2e3201",
      },
      info: {
        main: isLightMode ? "#fa1905" : "#fc7569",
      },
      text: {
        primary: isLightMode ? "#050505" : "#fafafa",
      },
      background: {
        default: isLightMode ? "#fafafa" : "#050505",
        paper: isLightMode ? "#fafafa" : "#050505",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      fontSize: 16,
      h1: {
        fontSize: "2.5rem",
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: "0.05em",
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: "0.05em",
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      caption: {
        fontSize: "0.8rem",
        fontWeight: 400,
        lineHeight: 1.2,
      },
    },
    spacing: 4,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    },
    shape: {
      borderRadius: 4,
      button: {
        borderRadius: 20,
      },
    },
    shadows: [
      "none",
      "0px 2px 4px rgba(0, 0, 0, 0.1)",
      "0px 4px 8px rgba(0, 0, 0, 0.2)",
      "0px 8px 16px rgba(0, 0, 0, 0.4)",
      "0px 16px 32px rgba(0, 0, 0, 0.8)",
    ],
    transitions: {
      easing: {
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      duration: {
        shortest: 150,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 0,
          },
          contained: {
            boxShadow: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
          },
        },
      },
    },
    overrides: {
      MuiButton: {
        root: {
          textTransform: "none",
        },
      },
    },
  });
};

export default theme;



//option 1

// const lightColors = {
//     primary: "#324852",
//     secondary: "#ccdae0",
//     accent: "#557a8b",
//     text: "#050505",
//     background: "#fafafa",
//   };

//   const darkColors = {
//     primary: "#324852",
//     secondary: "#131c20",
//     accent: "#a0b9c5",
//     text: "#fafafa",
//     background: "#202124",
//   };
