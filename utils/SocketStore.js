// socketStore.js
class SocketStore {
    constructor() {
        this.userToSocket = {}; // Stores user tokens mapped to socket IDs
        this.socketToUser = {}
    }

    addUser(userId,socketId) {
        this.userToSocket[userId] = socketId;
        this.socketToUser[socketId] = userId

    }

    getSocketOfUser(userId) {
        return this.userToSocket[userId]
    }

    getUserIdBySocket(socketId) {
        return this.socketToUser[socketId]
    }

    removeUser(socketId) {
        const userId = this.socketToUser[socketId];
        delete this.socketToUser[socketId];
        delete this.userToSocket[userId]
    }

    getAllUsers() {
        return this.userToSocket;
    }
}

module.exports = new SocketStore();
