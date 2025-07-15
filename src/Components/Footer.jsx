import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORM_ACCESS_KEY,
          email,
          subject: "New Subscriber to Notform",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        throw new Error("Failed to subscribe");
      }
    } catch (err) {
      console.error("Subscribe error:", err);
      setStatus("error");
    }
  };

  return (
    <footer className="bg-gray-50 text-neutral-800 px-6 pt-20 pb-10 mt-20 relative rounded-t-3xl shadow-inner">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        {/* Subscribe */}
        <div className="-mt-24 mb-4 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-neutral-800">Stay Updated</h2>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 w-full sm:w-72 rounded-md bg-gray-100 border border-gray-300 placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 cursor-pointer text-black px-5 py-2 rounded-md text-sm font-semibold hover:bg-yellow-300 transition-all"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {status === "success" && <p className="text-green-600 text-sm mt-2">Thank you for subscribing!</p>}
          {status === "error" && <p className="text-red-500 text-sm mt-2">Something went wrong. Try again.</p>}
        </div>

        {/* Branding */}
        <h1 className="text-3xl font-extrabold tracking-tight text-yellow-500">Notform</h1>

        {/* Social Links */}
        <div className="flex justify-center gap-6 text-xl text-neutral-600">
          <a href="https://instagram.com/mohd_saif_1850" target="_blank" className="hover:text-pink-500"><FaInstagram /></a>
          <a href="https://wa.me/8218532681" target="_blank" className="hover:text-green-500"><FaWhatsapp /></a>
          <a href="https://www.facebook.com/share/1btZkKMBCm/" target="_blank" className="hover:text-blue-600"><FaFacebookF /></a>
          <a href="https://www.linkedin.com/in/mohd-saif-a85065261" target="_blank" className="hover:text-blue-500"><FaLinkedinIn /></a>
        </div>
        <div className="flex justify-center gap-6 text-sm text-gray-500">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
        <p className="text-xs text-gray-500 tracking-wide">
          © {new Date().getFullYear()} Notform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
