module.exports = function setupSocket(io) {
    io.on('connection', (socket) => {
      console.log('User connected');
      socket.on('disconnect', () => console.log('User disconnected'));
    });
  
    // Function to emit announcements
    global.sendAnnouncement = (message) => {
      io.emit('announcement', message);
    };
  };