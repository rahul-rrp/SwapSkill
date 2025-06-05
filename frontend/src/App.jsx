import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashbord";
import HeroSection from "./pages/HeroSection";
import SignInForm from "./Component/SignInForm";
import SignUpForm from "./Component/SignUpForm";
import { useNavigate } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={isAuthenticated ? <Dashboard /> : <HeroSection />}
        />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/signin"
          element={<SignInForm setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </>
  );
}

export default App;
