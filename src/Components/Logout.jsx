import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../Store-Redux/authSlice';
import authService from '../Appwrite/auth';
import { set } from 'react-hook-form';

function Logout() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);


  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      dispatch(logout());
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded transition duration-300 
        ${isLoading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-black hover:bg-gray-800 text-white'}`}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}

export default Logout;
