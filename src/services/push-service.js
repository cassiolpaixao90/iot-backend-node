
/**
* Register user in connections. This method must be executed as first in whole registration process.
* @param userId id of user.
* @param connectionId id of connection.
*/
const connections = {};
exports.registerUser = function( userId, connectionId ){
    if (connections[userId] === undefined) {
        connections[userId] = {};
    }

    connections[userId][connectionId] = null;
    console.log('Registered connection ' + connectionId.substring(0, 4) + '*** for user ' + userId);
}

/**
 * Register socket to communication. Must be executed after registerUser.
 * Modify socket object and set field userId and connectionId.
 * @param userId id of user.
 * @param connectionId id of connection.
 * @param socket socket.
 * @returns {boolean} if socket was registered or not, if false then you have to do everything again.
 */
exports.registerSocket = function(userId, connectionId, socket) {
	if (connections[userId] != null && connections[userId][connectionId] == null) {
		socket.userId = userId;
		socket.connectionId = connectionId;
		connections[userId][connectionId] = socket;
		console.log('Registered socket for connection ' + connectionId.substring(0, 4) + '*** and  user ' + userId);
		return true;
	} else {
		console.log('Not found empty conn for connection ' + connectionId.substring(0, 4) + '*** and  user ' + userId);
		return false;
	}
}

/**
 * Remove connection.
 * @param socket socket to remove.
 */
exports.removeConnection = function(socket) {
	const userId = socket.userId;
	const connectionId = socket.connectionId;
	if (userId && connectionId && connections[userId] && connections[userId][connectionId]) {
		console.log('Removed socket for user ' + userId + ' and connection: ' + connectionId.substring(0, 4) + '***');
		delete connections[socket.connectionId];
	}
}

/**
 * Send notification to user.
 * @param userId id of user.
 * @param message message.
 */
exports.pushMessage = function(userId, message) {
	let userConnections = connections[userId];
	if (userConnections) {
		for (let connectionId in  userConnections) {
			if (userConnections.hasOwnProperty(connectionId)) {
				let socket = userConnections[connectionId];
				if (socket != null) {
					socket.emit('message', message);
				}
			}
		}
	}
}
