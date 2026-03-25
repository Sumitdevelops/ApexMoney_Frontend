import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./routes/AppRoute";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./components/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <AppRoute />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;