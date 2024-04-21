const handleConnection = (socket) => {
    
    //const address = socket.handshake.headers['x-forwarded-for'];
    console.log("user connected");
    const query = socket.handshake['query'];
    if(query['room'] !== undefined) {
        console.log("joined room: ", query['room']);
        socket.join(query['room']);
    }
    socket.on('disconnect', () => {
        console.log("user disconnected");
        if(query['room'] !== undefined) {
            socket.leave(query['room']);
        }
    });

}
module.exports = handleConnection;