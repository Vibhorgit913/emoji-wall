const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let reactions = [];

app.get('/', (req, res) => {
  res.send('Emoji Wall Server is running!');
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.emit('load_reactions', reactions);

  socket.on('send_reaction', (emoji) => {
    const reaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 70) + 10
    };

    reactions.push(reaction);
    io.emit('new_reaction', reaction);
  });

  socket.on('clear_wall', () => {
    reactions = [];
    io.emit('wall_cleared');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});