import axios from 'axios';
import React, { useRef, useState } from 'react';

const Advisory = () => {
  const [desire, setDesire] = useState('');
  const [display, setDisplay] = useState('none');
  const [messages, setMessages] = useState([]);  
  const [isLoading,setIsLoading] = useState(false)

  const handleChat = async (e) => {
    setIsLoading(true)
    e.preventDefault(); 

    setMessages((prevMessages) => [
      { text: desire, sender: 'user' },...prevMessages
    ]);
    
    const response = await axios.post('http://localhost:3000/chat', { data: desire });

    const summResponse = (await response).data
    
    
    setMessages((prevMessages) => [
      { text: summResponse, sender: 'server' },...prevMessages,
    ]);

    setDesire('');
    
    setIsLoading(false)
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>LET ME BE YOUR GUIDE</div>

      <button onClick={() => setDisplay(display === 'block' ? 'none' : 'block')}>
        GUIDE
      </button>

      <div style={{ display: display, marginTop: '20px' }}>
        {/* Chatbox container */}
        <div style={{
          width: '400px',
          height: '500px',
          border: '1px solid #ccc',
          padding: '10px',
          overflowY: 'scroll',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column-reverse' 
        }}>
          {messages.map((message, index) => (
            <div key={index} style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? '#4CAF50' : '#f1f1f1',
              color: message.sender === 'user' ? 'white' : 'black',
              padding: '10px',
              borderRadius: '10px',
              margin: '5px 0',
              maxWidth: '80%',
              fontSize: '10px'
            }}>
              {message.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleChat} style={{ display: 'flex', alignItems: 'center' }}>
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
              backgroundColor: '#4CAF50',
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
