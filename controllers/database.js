var USERS_ARRAY = new Array();

var DB = {
    add: function (user) {
        USERS_ARRAY.push(user);
        return true;
    },
    remove: function (property, value) {
        var newUserList = new Array();
        var found = false;
        for (var i = 0; i < USERS_ARRAY.length; i++) {
            if (USERS_ARRAY[i][property] == value)
                found = true;
            else
                newUserList.push(USERS_ARRAY[i])
        }

        if (found) USERS_ARRAY = newUserList;

        return found;
    },
    isExist: function (property, value) {
        for (var i = 0; i < USERS_ARRAY.length; i++) {
            if (USERS_ARRAY[i][property] == value)
                return true;
        }
        return false;
    },
    get: function (property, value) {
        var newUserList = new Array();
        for (var i = 0; i < USERS_ARRAY.length; i++) {
            if (USERS_ARRAY[i][property] == value)
                newUserList.push(USERS_ARRAY[i])
        }
        return newUserList;
    },
    getAll: function () {
        return USERS_ARRAY;
    }

}

module.exports = DB;