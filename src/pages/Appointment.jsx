import { useState,useEffect } from 'react';
import emailjs from '@emailjs/browser';
import AppointmentImg from '../assets/appointment.jpg';

const SERVICE_ID = 'service_rqldqfa';
const TEMPLATE_ID = 'template_0y7jj1x';
const PUBLIC_KEY = 'b39AT1wb403jjy_HD';
import { Link } from 'react-router-dom';
import Background from '../assets/home1.jpg';

const Appointment = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    date: '',
    time: '',
    issue: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Send email as you already do
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        user_name: formData.name,
        user_email: formData.email,
        user_age: formData.age,
        user_gender: formData.gender,
        appointment_date: `${formData.date} at ${formData.time}`,
        issue: formData.issue || 'Not specified',
      },
      PUBLIC_KEY
    );

    // Save appointment to backend
    const userId = user?.id || user?._id; // depending on your user object
    const res = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, userId }),
    });
    if (!res.ok) throw new Error('Failed to save appointment');
    
    alert('Appointment booked and reminder sent!');
    
    // Clear form data
    setFormData({
      name: '',
      email: '',
      age: '',
      gender: '',
      date: '',
      time: '',
      issue: ''
    });

    // Optionally navigate home after booking
    // navigate('/home'); // Make sure to import and use useNavigate

  } catch (err) {
    console.error('Booking error:', err);
    alert('Appointment booked but failed to send email or save.');
  }
};


  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center pt-0 m-0 pb-80"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow justify-center items-center pt-0">
          MediAssist AI
        </h1>
        <div className="flex gap-8">
          <Link to="/login">
            <button className="px-7 py-3 bg-blue-900 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-7 py-3 bg-white border border-blue-900 text-blue-900 rounded-xl font-semibold text-lg hover:bg-blue-100 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" h-160 mt-15 bg-gray-50 flex flex-col items-center pt-5 pb-10 px-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 pt-0 mt-0">Book an Appointment</h2>
      <div className="flex flex-row gap-8 justify-center w-full max-w-4xl">

      <form
        onSubmit={handleSubmit}
        className="bg-blue-100 shadow-md text-gray-800 rounded-lg p-6 w-250 h-auto max-w-md space-y-4"
      >
        {/* Name Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="flex-1 border text-gray-800 p-2 rounded"
            required
          />
        </div>

        {/* Email Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="flex-1 border text-gray-800 p-2 rounded"
            required
          />
        </div>

        {/* Age Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Your age"
            className="flex-1 border text-gray-800 p-2 rounded"
            required
          />
        </div>

        {/* Gender Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="flex-1 border text-gray-800 p-2 rounded"
            required
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Date Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="flex-1 border text-gray-800 p-2 rounded"
            required
          />
        </div>

        {/* Time Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="flex-1 border text-gray-800 p-2 rounded"
            required
          />
        </div>

        {/* Issue Field */}
        <div className="flex items-center gap-4">
          <label className="w-24">Issue:</label>
          <textarea
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            placeholder="Describe your issue"
            className="flex-1 border text-gray-800 p-2 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </form>
    

    <div className=" flex flex-col justify-center items-center w-full max-w-4xl">
      <img
            src={AppointmentImg}
            alt="Book Appointment"
            className="max-w-md max-h-[440px] rounded-xl object-cover"
            style={{ objectFit: 'contain' }}
          />
        {/* You can place any content here */}
        {/* <h3 className="text-lg font-semibold text-blue-700 mb-4 text-center">Other Information</h3>
        <p className="text-gray-700 text-center">You can use this space for instructions, contact info, a summary, or anything else you need beside the booking form.</p> */}
        {/* Add more elements as needed, eg. an image, links, etc. */}
      </div>
    </div>
  </div>

  );
};

export default Appointment;
