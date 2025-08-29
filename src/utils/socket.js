
const socket = require('socket.io');
const crypto = require('crypto');


const getSecretRoomId = (userId,targetUserId) => {
    return crypto
    .createHash("sha256")
    .update([userId,targetUserId].sort().join("_"))
    .digest("hex")
}

const initializeSocket = (server) => {

    const io = socket(server,{
        cors: {
            origin: "http://localhost:5173",
        }
    });

        io.on("connection",(socket)=>{

            //Handle events
            socket.on("joinChat",({userId,targetUserId})=>{
                const roomId = getSecretRoomId(userId,targetUserId);
                console.log("joined room : "+ roomId);
                socket.join(roomId);

            })

            socket.on("sendMessage",({userName,userId,targetUserId,text})=>{

                const roomId = getSecretRoomId(userId,targetUserId);
                console.log(userName + " : " + text)
                io.to(roomId).emit("messageReceived",{userName,text})

            })

            socket.on("disconnect",()=>{})

        })
 }

 module.exports = initializeSocket;