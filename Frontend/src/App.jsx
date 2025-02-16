import { useState, useEffect } from "react";
import './App.css';
export default function GoogleGeminiChat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:3000/api", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Not logged in");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("User not logged in:", error.message);
      }
    }
    fetchUser();
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth";
  };

  const handleLogout = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "GET",
      credentials: "include",
    });
    setUser(null);
  };

  const handlePrompt = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "You", text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      const aiMessage = { sender: "AI", text: data.text };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
    }
    setMessage("");
  };

  return (
    <div className="container">
      <nav className="navbar">
        {user ? (
          <h1 className="title">Logged in as {user.name}</h1>
        ) : (
          <h1 className="title">Chat with Gemini AI</h1>
        )}
        <div>
          {user ? (
            <button onClick={handleLogout} className="button logout-btn">
              Logout
            </button>
          ) : (
            <button onClick={handleLogin} className="button login-btn">
              Login with Google
            </button>
          )}
        </div>
      </nav>

      {user && (
        <div>
          <div className="chat-box">
            {chatHistory.map((msg, index) => (
              <p key={index} className={`chat-message ${msg.sender === "You" ? "user-message" : ""}`}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>

          <div className="input-container">
            <textarea
              className="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={handlePrompt}
              className="button send-btn"
            >
              ➝
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

