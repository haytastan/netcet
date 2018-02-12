function DB() {

    var users = new Array();

    this.add = function(user) {
        users.push(user);
        return true;
    };

    this.remove = function(property, value) {
        var newUserList = new Array();
        var found = false;
        for (var i = 0; i < users.length; i++) {
            if (users[i][property] == value)
                found = true;
            else
                newUserList.push(users[i])
        }

        if (found) users = newUserList;

        return found;
    };

    this.isExist = function(property, value) {
        for (var i = 0; i < users.length; i++) {
            if (users[i][property] == value)
                return true;
        }
        return false;
    };

    this.get = function(property, value) {
        var newUserList = new Array();
        for (var i = 0; i < users.length; i++) {
            if (users[i][property] == value)
                newUserList.push(users[i])
        }
        return newUserList;
    }

    this.getAll = function() {
        return users;
    }

}

module.exports = new DB();