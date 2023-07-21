import { useState } from "react";
import './App.css'
import Homepage from './Dashboard/Homepage'
import { CssBaseline, ThemeProvider, Tooltip, Fab, PaletteMode, } from "@mui/material";
import theme from './utils/theme';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from "@mui/icons-material";

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");

  const handleModeChange = () => {
    setMode((prevMode: string) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme(mode)}>
      <CssBaseline />
      <Homepage />
      <Tooltip title={`Switch to ${mode === "light" ? "Dark" : "Light"} Mode`} placement="left">
        <Fab
          color={mode === "light" ? "primary" : "secondary"}
          onClick={handleModeChange}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 10,
            color: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </Fab>
      </Tooltip>
    </ThemeProvider>
  )
}

export default App;
