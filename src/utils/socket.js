
const socket = require('socket.io');

const initializeSocket = (server) => {

    const io = socket(server,{
        cors: {
            origin: "http://localhost:5173",
        }
    });

        io.on("connection",(socket)=>{

            //Handle events
            socket.on("joinchat",()=>{})

            socket.on("sendmessage",()=>{})

            socket.on("disconnect",()=>{})

        })
 }

 module.exports = initializeSocket;