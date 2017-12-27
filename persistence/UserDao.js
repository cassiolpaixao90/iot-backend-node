function UserDao(connection) {
    this._connection = connection;
}

UserDao.prototype.save = function(user,callback) {
    this._connection.query('INSERT INTO users SET ?', user, callback);
}

UserDao.prototype.getByInstalacao = function (instalacao,callback) {
    this._connection.query("SELECT * FROM users WHERE instalacao = ?",[instalacao],callback);
}

module.exports = function(){
    return UserDao;
};
