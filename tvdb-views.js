/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 * @version 0.1
 */

(function() {
    // Store session for easy access
    var tvdbSession = Meteor.TVDBSession;

    // Register our tvdbStatus helper
    Handlebars.registerHelper(
        "tvdbStatus",
        function() {
            return new Handlebars.SafeString(Template._tvdbStatus())
    });

    // --- Start tvdbStatus events and methods
    Template._tvdbStatus.events({
        "click .configure-button": function() {
            tvdbSession.configure();
        }
    });

    Template._tvdbStatus.configured = function() {
        return Meteor.TVDB().isConfigured();
    };

    Template._tvdbStatus.hasWorkingQueue = function() {
        return Meteor.TVDB().isWorking();
    };
    // --- End tvdbStatus

    // --- Start tvdbConfigureDialog events and methods
    Template._tvdbConfigureDialog.events({
        "click .configure-login-service-dismiss-button": function() {
            tvdbSession.set('configureDialogVisible', false);
        },
        'click #configure-login-service-dialog-save-configuration': function () {
            if (tvdbSession.get('configureDialogVisible') &&
                ! tvdbSession.get('configureDialogSaveDisabled')) {

                var configuration = {};
                configuration.apikey = document.getElementById(
                        'configure-login-service-dialog-apikey').value
                        .replace(/^\s*|\s*$/g, ""); // trim;

                // Configure
                Meteor.call("tvdbConfigure", configuration, function(error) {
                    if (error) {
                        Meteor._debug("Error configurating tvdb server " + error.reason);
                    } else {
                        tvdbSession.set('configureDialogVisible', false);
                    }
                });
            }
        },
        "input, keyup input": function() {
            var empty = document.getElementById("configure-login-service-dialog-apikey").value === "";
            tvdbSession.set('configureDialogSaveDisabled', empty);
        }
    });

    Template._tvdbConfigureDialog.visible = function() {
        return tvdbSession.get('configureDialogVisible');
    };

    Template._tvdbConfigureDialog.saveDisabled = function() {
        return tvdbSession.get('configureDialogSaveDisabled');
    };
    // --- End tvdbConfigureDialog
})();
