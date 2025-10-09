import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import Background from '../assets/home1.jpg';
import Homein from '../assets/homein.png';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wellnessScore, setWellnessScore] = useState(45);
  const [appointments, setAppointments] = useState([]);
  const [healthHistory, setHealthHistory] = useState([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState('');
  const [newEntrySummary, setNewEntrySummary] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    else setUser(null);
  }, []);

  useEffect(() => {
  if (!user) return;

  fetch(`http://localhost:5000/api/appointments?userId=${user.id || user._id}`)
    .then((res) => res.json())
    .then((data) => {
      // Map or transform if needed
      const mappedAppointments = data.map(appt => ({
        id: appt._id,
        date: appt.date,
        doctor: appt.name,
        issue:appt.issue// or update your frontend logic depending on data
      }));
      setAppointments(mappedAppointments);
    })
    .catch((err) => {
      console.error('Failed to fetch appointments:', err);
    });

  fetchHealthHistory(); // keep fetching health history as before
}, [user]);


  const fetchHealthHistory = () => {
    fetch('http://localhost:5000/api/health-history')
      .then(res => res.json())
      .then(data => {
        const mappedHealthHistory = data.map(entry => ({
          id: entry._id,
          date: new Date(entry.date).toLocaleDateString(),
          summary: entry.summary,
        }));
        setHealthHistory(mappedHealthHistory);
      })
      .catch(error => console.error('Failed to fetch health history:', error));
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/health-history/${id}`, { method: 'DELETE' });
      fetchHealthHistory();
    } catch (error) {
      console.error('Failed to delete history:', error);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntryDate || !newEntrySummary) return;
    try {
      const res = await fetch('http://localhost:5000/api/health-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newEntryDate,
          summary: newEntrySummary,
          userId: user.id || 'guest',
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowAddEntry(false);
      setNewEntryDate('');
      setNewEntrySummary('');
      fetchHealthHistory();
    } catch (error) {
      console.error('Failed to add health history entry:', error);
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
    <div
      className="max-h-screen flex items-center justify-center px-8 py-10"
      style={{ backgroundColor: '#151730',scrollbar:'none' }}
    >
      <div className="flex flex-row gap-8 w-full max-w-5xl">
        {/* Left Section: History & Appointments */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Health History */}
          <section className="rounded-xl bg-yellow-50 shadow-lg p-7 min-w-[340px]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-yellow-900">Previous Health History</h2>
              <button
                onClick={() => setShowAddEntry(!showAddEntry)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {showAddEntry ? 'Cancel' : 'Add Entry'}
              </button>
            </div>
            {showAddEntry && (
              <div className="mb-7 space-y-4">
                <input
                  type="date"
                  value={newEntryDate}
                  onChange={e => setNewEntryDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <textarea
                  value={newEntrySummary}
                  onChange={e => setNewEntrySummary(e.target.value)}
                  placeholder="Description"
                  rows={4}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntryDate || !newEntrySummary}
                  className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                    newEntryDate && newEntrySummary
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-yellow-300 cursor-not-allowed'
                  }`}
                >
                  Add Entry
                </button>
              </div>
            )}
            <ul className="space-y-3 max-h-56 overflow-y-auto">
              {healthHistory.length === 0 && (
                <p className="text-gray-500">No health history entries.</p>
              )}
              {healthHistory.map(entry => (
                <li
                  key={entry.id}
                  className="flex justify-between items-center bg-yellow-100 p-4 rounded shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-yellow-900">{entry.date}</p>
                    <p className="text-gray-700 mt-1">{entry.summary}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {/* Appointments */}
          <section className="rounded-xl bg-blue-50 shadow-lg p-7 min-w-[340px]">
            <h2 className="text-xl font-bold text-blue-800 mb-5">Upcoming Appointments</h2>
            <ul className="space-y-3 max-h-40 overflow-y-auto">
              {appointments.map(appt => (
                <li key={appt.id} className="bg-blue-100 text-blue-700 p-4 rounded shadow-sm">
                  <p className="font-semibold">{appt.date}</p>
                  <p className="mt-1 text-gray-700">for {appt.issue}</p>
                </li>
              ))}
              {appointments.length === 0 && (
                <p className="text-gray-500">No upcoming appointments.</p>
              )}
            </ul>
          </section>
        </div>
        {/* Right Section: Greeting & Image */}
        <div className="w-[400px] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center py-10 px-8">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-6">
            Hello, {user.fullName || user.name || user.email} <span className="ml-2">👋</span>
          </h1>
          <img
            src={Homein}
            alt="Profile"
            className="w-72 h-72 object-contain"
            style={{ maxHeight: '320px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

