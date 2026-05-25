import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('https://emoji-wall-server.onrender.com');

function App() {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err.message);
    });

    socket.on('load_reactions', (oldReactions) => {
      setReactions(oldReactions);
    });

    socket.on('new_reaction', (reaction) => {
      setReactions((prev) => [...prev, reaction]);
    });

    socket.on('wall_cleared', () => {
      setReactions([]);
    });

    return () => {
      socket.off('load_reactions');
      socket.off('new_reaction');
      socket.off('wall_cleared');
      socket.off('connect');
      socket.off('connect_error');

    };
  }, []);

  const sendReaction = (emoji) => {
    socket.emit('send_reaction', emoji);
  };

  const clearWall = () => {
    socket.emit('clear_wall');
  };

  return (
    <div className="app">
      <h1>Live Emoji Wall</h1>
      <p>Click an emoji and watch it appear for everyone!</p>

      <div className="controls">
        <button onClick={() => sendReaction('😀')}>😀</button>
        <button onClick={() => sendReaction('🚀')}>🚀</button>
        <button onClick={() => sendReaction('🔥')}>🔥</button>
        <button onClick={() => sendReaction('🎉')}>🎉</button>
        <button onClick={() => sendReaction('👾')}>👾</button>
        <button className="clear-btn" onClick={clearWall}>Clear Wall</button>
      </div>

      <div className="wall">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="emoji"
            style={{
              left: `${reaction.x}%`,
              top: `${reaction.y}%`
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;