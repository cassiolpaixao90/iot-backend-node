
module.exports = function (app) {

    app.get("io").on('connection', function (socket) {

        socket.on('register', function (userId, connectionId) {
            
            pushService.registerSocket(userId, connectionId, socket);

        });


        socket.on('disconnect', function () {

            pushService.removeConnection(socket);

        });

    });
};
