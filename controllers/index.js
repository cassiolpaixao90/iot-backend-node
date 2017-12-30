
module.exports = app => {

    app.get('/api/status/ping', function (req, res) {
        res.send('pong')
    });

    app.get('/api/status/info', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var info = {
            'name': "io",
            'version': "1"
        };
        res.send(info)
    });

};