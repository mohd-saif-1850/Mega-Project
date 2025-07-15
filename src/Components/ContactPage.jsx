import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = {
      access_key: import.meta.env.VITE_WEB3FORM_ACCESS_KEY,
      name: form.name,
      email: form.email,
      message: form.message,
      subject: "New Contact Message from Notform",
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        console.error(result);
      }
    } catch (err) {
      console.error("Web3Forms error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your Name"
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Your Email"
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          placeholder="Your Message"
          className="w-full border border-gray-300 px-4 py-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-all"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-sm mt-2">Message sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm mt-2">Something went wrong. Try again.</p>
        )}
      </form>
    </div>
  );
};

export default Contact;
