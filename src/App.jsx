import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./Store-Redux/authSlice";
import authService from "./Appwrite/auth";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import AllRoutes from "./Components/Routes";
import { useLocation } from "react-router-dom"; // ✅ Import this

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ Get current location

  // ✅ Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getUser();
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error checking user:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              NF
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-wide">Welcome to Notform</h2>
          <p className="text-base text-gray-600 animate-pulse">
            Shaping thoughts into words...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        <AllRoutes />
      </main>
      <Footer />
    </>
  );
}

export default App;
