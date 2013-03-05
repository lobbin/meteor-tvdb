/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 */

(function() {
    var require = __meteor_bootstrap__.require;
    Future = require('fibers/future');

    // Announcing the different methods available to the client
    Meteor.methods({
        "tvdbConfigure": function(options) {
            Meteor.TVDB().setConfiguration(options);
            Meteor.TVDBSession.set('configured', true);
        },
        "tvdbGetLanguages": function() {
            var future = new Future;
            Meteor.TVDB().tvdb.getLanguages(function(err, languages) {
                Meteor.TVDB().decWorkers();
                if (err) {
                    future.ret(new Meteor.Error(4101, err));
                } else {
                    future.ret(languages);
                }
            });
            return future.wait();
        },
        "tvdbGetMirrors": function() {
            var future = new Future;
            Meteor.TVDB().tvdb.getMirrors(function(err, mirrors) {
                if (err) {
                    future.ret(new Meteor.Error(4102, err));
                } else {
                    future.ret(mirrors);
                }
            });
            return future.wait();
        },
        "tvdbGetServerTime": function() {
            var future = new Future;
            Meteor.TVDB().tvdb.getServerTime(function(err, serverTime) {
                if (err) {
                    future.ret(new Meteor.Error(4103, err));
                } else {
                    future.ret(serverTime);
                }
            });
            return future.wait();
        },
        "tvdbFindTvShow": function(name) {
            if (name && name.length > 0) {
                var future = new Future();
                Meteor.TVDB().tvdb.findTvShow(name, function(err, tvShows) {
                    if (err) {
                        future.ret(new Meteor.Error(4104, err));
                    } else {
                        future.ret(tvShows);
                    }
                });
                return future.wait();
            } else {
                throw new Meteor.Error(4001, 'Not a valid show name');
            }
        },
        "tvdbGetInfo": function(tvShowId) {
            if (tvShowId && parseInt(tvShowId) > 0) {
                var future = new Future;
                Meteor.TVDB().tvdb.getInfo(tvShowId, function(err, tvShowInfo) {
                    if (err) {
                        future.ret(new Meteor.Error(4105, err));
                    } else {
                        future.ret(tvShowInfo);
                    }
                });
                return future.wait();
            } else {
                throw new Meteor.Error(4002, 'Not a valid tv show id')
            }
        },
        "tvdbGetUpdates": function(period) {
            if (period) {
                var future = new Future;
                Meteor.TVDB().tvdb.getUpdates(period, function(err, updates) {
                    if (err) {
                        future.ret(new Meteor.Error(4106, err));
                    } else {
                        future.ret(updates);
                    }
                });
                return future.wait();
            }
        }
    });
})();
