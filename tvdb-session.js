/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 */

// Small session helper class to be able to communicate some information between client and server.
(function () {
    var VALID_KEYS = [
        'configured',
        'configureDialogVisible',
        'configureDialogSaveDisabled'
    ];

    var validateKey = function (key) {
        if (!_.contains(VALID_KEYS, key))
            throw new Error("Invalid key in tvdbSession: " + key);
    };

    var KEY_PREFIX = "TVDB.session.";

    // XXX we should have a better pattern for code private to a package like this one
    // Copied from login_buttons_session.js
    Meteor.TVDBSession = {
        set: function(key, value) {
            validateKey(key);
            if (_.contains(['errorMessage', 'infoMessage'], key))
                throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");

            this._set(key, value);
        },

        _set: function(key, value) {
            Session.set(KEY_PREFIX + key, value);
        },

        get: function(key) {
            validateKey(key);
            return Session.get(KEY_PREFIX + key);
        },

        configure: function() {
            this.set('configureDialogVisible', true);
            this.set('configureDialogSaveDisabled', true);
        }
    };
})();
