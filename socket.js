const handleConnection = (socket) => {
    
    const query = socket.handshake['query'];
    if(query['room'] !== undefined) {
        socket.join(query['room']);
    }
    socket.on('disconnect', () => {
        if(query['room'] !== undefined) {
            socket.leave(query['room']);
        }
    });

}
module.exports = handleConnection;