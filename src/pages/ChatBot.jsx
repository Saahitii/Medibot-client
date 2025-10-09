import React, { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import AIBotIcon from "../assets/bot.png";

import { Link } from "react-router-dom";
import Background from '../assets/home1.jpg';

const ChatBot = ({ username = "Hiranya" }) => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello ${username} 👋, I am your paramedic assistant. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [chatId, setChatId] = useState(null);

  const scrollRef = useRef();

  
  useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showHistory]);

  async function fetchHistory() {
    try {
      const res = await fetch("http://localhost:5000/api/chat/history");
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to fetch history:", err.message);
    }
  }

  // Define startNewChat function here!
  async function startNewChat() {
    try {
      const res = await fetch("http://localhost:5000/api/chat/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "hiranya",
          username,
          messages: [
            {
              sender: "bot",
              text: `Hello ${username}! Can you describe your problem in one word?`,
            },
          ],
        }),
      });
      const data = await res.json();
      setChatId(data.chat._id);
      setMessages(data.chat.messages);
      fetchHistory();
    } catch (err) {
      console.error("Failed to start new chat:", err.message);
    }
  }

  const [awaitingDiseaseDescription, setAwaitingDiseaseDescription] = useState(false);
let title="";
async function sendMessage() {
  if (!input.trim() || sending) return;
  setSending(true);
  const userMessage = input.trim();
  setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
  setInput("");

  try {
    const res = await fetch("http://localhost:5000/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, username }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);

    if (data.response.includes("describe your problem in one word")) {
      setAwaitingDiseaseDescription(true);
      title=userMessage;
      return;
    } else{
      setAwaitingDiseaseDescription(false);
      if(title===""){
        title="General checkup";
      }
    }
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Failed to get a reply. Try again." },
    ]);
  } finally {
    setSending(false);
  }
}


 async function saveChat() {
  if (messages.length === 0) return;

  // Optional: Check if user described a problem before saving
  const userReplies = messages.filter(m => m.sender === "user" && m.text.trim());
  if (userReplies.length === 0) {
    alert("Please describe your problem before saving.");
  }

  try {
    const res = await fetch("http://localhost:5000/api/chat/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "hiranya",
        username,
        messages,
      }),
    });
    const data = await res.json();

    console.log("Saved chat title:", data.chat.title); // Should show disease/problem
    fetchHistory();
    setMessages([
      {
        sender: "bot",
        text: `👋 Hello ${username}! How can i help you today ? `,
      },
    ]);
  } catch (err) {
    alert("Failed to save conversation.");
  }
}



  async function deleteChat(id) {
    try {
await fetch(`http://localhost:5000/api/chat/delete-with-history/${id}`, { method: "DELETE" });
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete chat:", err.message);
    }
  }

  function loadChat(chat) {
    setMessages(chat.messages);
  }

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
    <div style={styles.mainContainer} ref={scrollRef}>
      {/* Header */}
      <div style={styles.header}>
        <FaBars
          size={20}
          style={{ cursor: "pointer", color: "grey" }}
          onClick={() => setShowHistory(!showHistory)}
        />
        <h3 style={{ margin: 0, color: "blue" }}>AI ChatBot</h3>
        <button style={styles.saveBtn} onClick={saveChat}>
          Save Chat
        </button>
      </div>
      {/* Main container */}
      <div style={styles.container}>
        {/* Sidebar */}
        {showHistory && (
          <div style={styles.sidebar} ref={scrollRef}>
            {/* New Chat Button */}
            <button style={styles.newChatBtn} onClick={startNewChat}>
              ➕ New Chat
            </button>

            {/* History List */}
            <div style={{ marginTop: 8 }}>
              {history.length === 0 ? (
                <p style={{ padding: 10, color: "#222" }}>No chats yet</p>
              ) : (
                history.map((h) => (
                  <div key={h._id} style={styles.historyItem}>
                    <div
                      onClick={() => loadChat(h)}
                      style={{ flex: 1, cursor: "pointer" }}
                    >
                      <strong>{h.title}</strong>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {new Date(h.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <MdClose
                      size={18}
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => deleteChat(h._id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div style={styles.chatContainer}>
          <div style={styles.messagesContainer} ref={scrollRef}>
  {messages.length === 0 ? (
    <p style={{ textAlign: "center", color: "#777", marginTop: "20px" }}>
      Start a new chat or continue from history.
    </p>
  ) : (
    messages.map((m, i) => (
      <div
        key={i}
        style={{
          ...styles.messageBase,
          justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
        }}
      >
        {m.sender === "bot" && (
          <img src={AIBotIcon} alt="bot" style={styles.botIconMini} />
        )}
        <span
          style={{
            ...styles.bubble,
            backgroundColor: m.sender === "user" ? "#7B61FF" : "#F2F2F2",
            color: m.sender === "user" ? "#fff" : "#000",
            borderBottomRightRadius: m.sender === "user" ? 7 : 20,
            borderBottomLeftRadius: m.sender === "user" ? 20 : 7,
            marginLeft: m.sender === "user" ? 12 : 3,
            marginRight: m.sender === "user" ? 3 : 12,
            maxWidth: "75%",
            padding: "12px 17px",
            fontSize: "17px",
            borderRadius: 20,
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          {m.text}
        </span>
      </div>
    ))
  )}
</div>


          {/* Input bar always visible */}
          <div style={styles.inputContainer}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={sending ? "Sending..." : "Type a message..."}
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              style={{ ...styles.sendBtn, opacity: sending ? 0.6 : 1 }}
              disabled={sending}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    width: "100%",
    maxWidth: "1200px",
    height: "630px",
    margin: "20px auto",
    marginTop: "55px",
    border: "1px solid #ddd",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  },
  header: {
  position: "sticky",        // or "fixed" for absolutely always on screen (at top: 0)
  top: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#f9f9f9",
  borderBottom: "1px solid #eee",
  height: "70px",
  padding: "0 14px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
},
  saveBtn: {
    backgroundColor: "#1877f2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "7px 14px",
    fontWeight: "bold",
    marginLeft: "auto",
    cursor: "pointer",
  },
  newChatBtn: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#7B61FF",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    position: "sticky",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  sidebar: {
    width: "250px",
    borderRight: "1px solid #ddd",
    backgroundColor: "#fff",
    color:"grey",
    fontWeight:"light",
    padding: "10px",
    overflowY: "auto",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "8px",
    backgroundColor: "#f2f2f2",
  },
  chatContainer: {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden", // prevent container overflow
  position: "relative",
},

messagesContainer: {
  flex: 1,
  overflowY: "auto",
  padding: "10px",
  backgroundColor: "#fff",
  marginBottom: "60px", // space for the fixed input area
},

inputContainer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "10px",
  borderTop: "1px solid #ddd",
  backgroundColor: "#f9f9f9",
  display: "flex",
  gap: "10px",
},

  messageBase: {
  display: "flex",
  alignItems: "flex-end",
  marginBottom: 13,
},
botIconMini: {
  width: 34,
  height: 34,
  borderRadius: "50%",
  marginRight: 6,
},
bubble: {
  display: "inline-block",
  lineHeight: 1.4,
},
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
    fontSize: "17px",
    color: "black",
  },
  sendBtn: {
    width: "50px",
    backgroundColor: "#7B61FF",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
};

export default ChatBot;
