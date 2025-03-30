import axios from 'axios';
import React, { useState } from 'react';

const Advisory = () => {
  const [desire, setDesire] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [display, setDisplay] = useState('none');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    setMessages((prevMessages) => [
      { text: desire, sender: 'user' },
      ...prevMessages,
    ]);

    try {
      const response = await axios.post('http://localhost:3000/chat', { data: desire });
      const summResponse = response.data;

      setMessages((prevMessages) => [
        { text: summResponse, sender: 'server' },
        ...prevMessages,
      ]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }

    setDesire('');
    setIsLoading(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', paddingBottom:'400px'}}>
      {/* Floating Guide Button */}
      <div
        className="flex flex-col items-start justify-center"
        style={{
          paddingRight: '420px', // Add padding to prevent overlap with the chatbox
          paddingLeft: '20px', // Add padding for consistent alignment
        }}
      >
        <h1 className="text-3xl font-bold">Travel Safety Tips</h1>
        <ul className="list-disc pl-5">
          <li className="font-medium">
            Get a comprehensive travel insurance that covers health, theft, and travel delays.
          </li>
          <li className="font-medium">
            Share your itinerary with a trusted friend or family member and keep copies of your important documents.
          </li>
          <li className="font-medium">
            Research and follow the local laws and cultural practices of your destination.
          </li>
          <li className="font-medium">
            Keep your emergency contacts easily accessible and familiarize yourself with the nearest embassy or consulate.
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          setDisplay('block');
          setIsChatOpen(true);
        }}
        style={{
          position: 'fixed',
          bottom: '350px',
          right: '20px',
          backgroundColor: 'rgb(22, 78, 30)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          fontSize: '16px',
        }}
      >
        GUIDE
      </button>

      {/* Chatbox */}
      <div
        style={{
          position: 'fixed',
          top: '60px', // Adjusted to account for the navbar height
          right: isChatOpen ? '20px' : '-420px', // Smooth slide-in and slide-out
          width: '400px',
          height: 'calc(100% - 80px)', // Adjusted to avoid overlapping the navbar
          background: 'linear-gradient(to bottom, #6a11cb, #2575fc)', // Gradient background
          borderRadius: '15px', // Rounded corners
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Shadow for floating effect
          transition: 'right 0.6s ease-in-out', // Smooth animation
          display: display,
          flexDirection: 'column', // Ensure the chatbox is a column layout
          padding: '0',
          zIndex: 1000, // Ensure it stays on top of other elements
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 15px',
            background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Gradient for header
            color: 'white',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Your Chatbot Assistant!</span>
          <button
            onClick={() => {
              setDisplay('none');
              setIsChatOpen(false);
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✖
          </button>
        </div>

        {/* Messages container */}
        <div
          style={{
            flex: 1,
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column-reverse',
            padding: '10px',
            backgroundColor: 'white', // White background for messages
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: message.sender === 'user' ? '#4CAF50' : '#f1f1f1',
                color: message.sender === 'user' ? 'white' : 'black',
                padding: '10px',
                borderRadius: '10px',
                margin: '5px 0',
                maxWidth: '80%',
                fontSize: '12px',
              }}
            >
              {message.text}
            </div>
          ))}
        </div>

        {/* Chat input field */}
        <form
          onSubmit={handleChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderTop: '1px solid #ccc',
            backgroundColor: 'white',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
          }}
        >
          <input
            type="text"
            value={desire}
            onChange={(e) => setDesire(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              marginRight: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#6a11cb',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Advisory;