import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import ChatBot from '../pages/ChatBot';

export default function Layout() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // Chat sessions state: array of { id, title, messages }
  const [chatSessions, setChatSessions] = useState([]);
  // Selected chat session id, null means new chat
  const [selectedChatId, setSelectedChatId] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Fetch chat sessions on mount
  useEffect(() => {
    const fetchChatSessions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/chat/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Since no sessions endpoint, treat all messages as one session
          setChatSessions([{ id: 'all', title: 'All Messages', messages: data.messages }]);
        }
      } catch (err) {
        console.error('Failed to fetch chat sessions', err);
      }
    };
    fetchChatSessions();
  }, []);

  // Handler to select a chat session
  const handleSelectChat = (id) => {
    setSelectedChatId(id);
  };

  // Handler to start a new chat
  const handleNewChat = () => {
    setSelectedChatId(null);
  };

  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {isSidebarVisible && (
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          chatSessions={chatSessions}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          selectedChatId={selectedChatId}
        />
      )}
      <main className="flex-1 bg-secondary min-h-screen p-6">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="mt-6">
          {location.pathname === '/chatbot' ? (
            <ChatBot
              selectedChatId={selectedChatId}
              key={selectedChatId || 'new'}
            />
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
