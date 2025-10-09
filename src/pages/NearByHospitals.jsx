import React, { useState, useRef,useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Link } from "react-router-dom";
import Background from '../assets/home1.jpg';
import hosbg from '../assets/nbh.jpg';

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: "8px",
  background: "linear-gradient(90deg,#06beb6,#48b1f3)",
  color: "white",
  border: "none",
  marginRight: "12px",
  fontSize: "1rem",
  cursor: "pointer",
  marginBottom: "16px",
};

const listContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "18px",
  marginTop: "24px",
  justifyContent: "center",
  overflowY: "auto",
};

const cardStyle = {
  flex: "1 1 280px",
  minWidth: "250px",
  maxWidth: "340px",
  borderRadius: "10px",
  background: "#f6f9fa",
  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.13)",
  padding: "18px 22px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

function openRoute(userPos, hospital) {
  const origin = `${userPos[0]},${userPos[1]}`;
  const destination = `${hospital.lat},${hospital.lon}`;
  window.open(
    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`,
    "_blank"
  );
}

const HospitalMarker = ({ hospital, userPos, selected, onClick }) => {
  const markerRef = useRef(null);
  const map = useMap();

  React.useEffect(() => {
    if (selected && markerRef.current) {
      map.setView([hospital.lat, hospital.lon], 16, { animate: true });
      markerRef.current.openPopup();
    }
  }, [selected, hospital, map]);

  return (
    <Marker
      position={[hospital.lat, hospital.lon]}
      ref={markerRef}
      eventHandlers={{
        click: () => onClick(),
      }}
    >
      <Popup>
        <strong>{hospital.tags.name || "Unnamed Hospital"}</strong>
        <br />
        Distance: {getDistance(userPos[0], userPos[1], hospital.lat, hospital.lon)} km
        <br />
        <button onClick={() => openRoute(userPos, hospital)} style={{ marginTop: 8, cursor: "pointer" }}>
          Get Directions
        </button>
      </Popup>
    </Marker>
  );
};

const NearbyHospitals = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    }, []);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHospitals = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPos([latitude, longitude]);
        const query = `
          [out:json];
          node(around:5000,${latitude},${longitude})["amenity"="hospital"];
          out;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            setShowList(true);
            if (data.elements && data.elements.length > 0) {
              setHospitals(data.elements);
              setError("");
            } else {
              setHospitals([]);
              setError("No hospitals found nearby.");
            }
          })
          .catch(() => {
            setHospitals([]);
            setError("Failed to fetch hospital data.");
          });
      },
      () => setError("Location permission denied.")
    );
  };

  // Sort hospitals by distance
  const sortedHospitals = userPos
    ? [...hospitals].sort((a, b) => {
        const distA = parseFloat(getDistance(userPos[0], userPos[1], a.lat, a.lon));
        const distB = parseFloat(getDistance(userPos[0], userPos[1], b.lat, b.lon));
        return distA - distB;
      })
    : hospitals;

  // Filter hospitals by search term (only in fullscreen, so UI is not confusing)
  const filteredHospitals =
    searchTerm.trim().length > 0
      ? sortedHospitals.filter(
          h =>
            h.tags.name && h.tags.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : sortedHospitals;

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
    <div style={{ padding: 25,marginTop:50,alignItems:"center",justifyContent:"center",textAlign:"center",
          backgroundImage: `url(${hosbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width:'100%',height:'100vh',
          backgroundRepeat:'repeat'
       }}>
      <button style={buttonStyle} onClick={fetchHospitals}>
        Find Nearby Hospitals
      </button>
      <button style={buttonStyle} onClick={() => setFullscreen(true)} disabled={!userPos}>
        View Map Fullscreen
      </button>
      <button style={buttonStyle} onClick={() => setShowList(!showList)} disabled={hospitals.length === 0}>
        {showList ? "Hide Hospital List" : "Show Hospital List"}
      </button>
      {error && (
        <div style={{ color: "red", marginTop: 10 }}>
          {error}
        </div>
      )}

      {showList && sortedHospitals.length > 0 && (
        <div style={listContainerStyle}>
          {sortedHospitals.map((hospital) => (
            <div
              key={hospital.id}
              style={{
                ...cardStyle,
                border: hospital.id === selectedHospitalId ? "2px solid #2563eb" : undefined,
                cursor: "pointer",
              }}
              onClick={() => setSelectedHospitalId(hospital.id)}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#2563eb",
                  height: "40px",
                  fontSize: "1.1rem",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hospital.tags.name || "Unnamed Hospital"}
              </h3>
              <div>
                <p style={{ margin: "4px", color: "navy" ,textAlign:"center"}}>
                  Distance:
                  <span style={{ color: "#16a34a" }}>
                    {" "}
                    {getDistance(userPos[0], userPos[1], hospital.lat, hospital.lon)} km
                  </span>
                </p>
                <center><button
                  style={{ marginTop: 10, cursor: "pointer", textAlign:"center",backgroundColor:"#06beb6",color:"white",border:"none",padding:"6px 12px",borderRadius:7}} 
                  onClick={e => {
                    e.stopPropagation();
                    openRoute(userPos, hospital);
                  }}
                >
                  Get Directions
                </button></center>
              </div>
            </div>
          ))}
        </div>
      )}

      {fullscreen && userPos && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 1000,
            touchAction: "auto",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: 14,
            right: 18,
            zIndex: 1100,
            display: "flex",
            alignItems: "center"
          }}>
            <input
              type="text"
              placeholder="Search hospital name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "2px solid black",
                fontSize: "1rem",
                marginRight: 8,
                width: 180,
                color:'black'
              }}
            />
            <button
              onClick={() => setFullscreen(false)}
              style={{
                fontSize: "1rem",
                ...buttonStyle,
                background: "#c026d3",
                marginRight: 0,
                marginTop:13
              }}
            >
              Close Map
            </button>
          </div>
          <MapContainer
            center={userPos}
            zoom={13}
            scrollWheelZoom={true}
            dragging={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={userPos}>
              <Popup>Your Location</Popup>
            </Marker>
            {filteredHospitals.map((hospital) => (
              <HospitalMarker
                key={hospital.id}
                hospital={hospital}
                userPos={userPos}
                selected={hospital.id === selectedHospitalId}
                onClick={() => setSelectedHospitalId(hospital.id)}
              />
            ))}
            <Circle center={userPos} radius={5000} color="blue" />
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default NearbyHospitals;
