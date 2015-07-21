'use strict';

function SDK() {
	this.isAuthed = false;
};

SDK.prototype = {
    constructor: SDK,
    auth: function (email, password) {
    },
    authed: function () {

    },
    rate: function (ssid, unrate) {
        var type = unrate ? 'u' : 'r';

    },
    update: function (type) {
    	type = type || 'n';
    },
    listAlbums: function () {

    }
}

var sdk = new SDK();
