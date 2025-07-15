
import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import AddPost from "./AddPost.jsx";
import Profile from "./Profile.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import PostForm from "./PostForm.jsx";
import PostCard from "./PostCard";
import ContactPage from "./ContactPage";
import About from "./About.jsx";


const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-post" element={<AddPost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/post-form" element={<PostForm />} />
      <Route path="/post-form/:id" element={<PostForm />} />
      <Route path="/post/:postId" element={<PostCard />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<About />} />
    
      
      
    </Routes>
  );
};

export default AllRoutes;
