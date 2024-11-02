import React, { useEffect, useState } from 'react';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState(''); // State to hold the input message
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:1234');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        // Convert Blob to text
        event.data.text().then((text) => {
          console.log('Received message:', text);
          setMessages((prevMessages) => [...prevMessages, text]);
        });
      } else {
        // If it's not a Blob, handle it as a regular string
        console.log('Received message:', event.data);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const sendObject = {
        user: userName,
        body: message
      };
      const outputMessage = JSON.stringify(sendObject);
      console.log(outputMessage);

      socket.send(outputMessage + '\n'); // adds new line at the end
      setInputMessage(''); // Clear the input field after sending the message
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    sendMessage(inputMessage); // Send the input message
  };

  return (
    <div>
      <h1>Simple Chat</h1>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)} // Update inputMessage state on change
          placeholder="Enter username"
        />
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)} // Update inputMessage state on change
          placeholder="Enter message"
        />
        <button type="submit">Send Message</button>
      </form>
      <div>
        <ul>
          {messages.map((msg, index) => {
            const msgObject = JSON.parse(msg);
            return <li key={index}><strong>{msgObject.user}:</strong><em>{ msgObject.body }</em></li>
          })}    
        </ul>
        </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <WebSocketComponent />
    </div>
  );
}

export default App;
