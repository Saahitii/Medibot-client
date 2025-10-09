import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import ChatBot from './pages/ChatBot';
import NearbyHospitals from './pages/NearByHospitals';
import Login from './pages/Login';
import Signup from './pages/Signup';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/nearByHospitals" element={<NearbyHospitals />} />
          <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
