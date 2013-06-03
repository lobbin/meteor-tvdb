/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 */

(function() {
    var Future = Npm.require('fibers/future');
    var NonEmptyString = Match.Where(function(x) {
        check(x, String);
        return x.length > 0;
    });
    var PositiveInt = Match.Where(function(x) {
        check(x, Number);
        return parseInt(x) > 0;
    });

    // Announcing the different methods available to the client
    Meteor.methods({
        "tvdbConfigure": function(options) {
            check(options, {apikey: NonEmptyString});

            Meteor.TVDB().setConfiguration(options);
            return true;
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
            check(name, NonEmptyString);

            var future = new Future();
            Meteor.TVDB().tvdb.findTvShow(name, function(err, tvShows) {
                if (err) {
                    future.ret(new Meteor.Error(4104, err));
                } else {
                    future.ret(tvShows);
                }
            });
            return future.wait();
        },
        "tvdbGetInfo": function(tvShowId, language) {
            check(tvShowId, PositiveInt);
            check(language, NonEmptyString);

            var future = new Future;
            Meteor.TVDB().tvdb.getInfo(tvShowId, function(err, tvShowInfo) {
                if (err) {
                    future.ret(new Meteor.Error(4105, err));
                } else {
                    future.ret(tvShowInfo);
                }
            }, language);
            return future.wait();
        },
        "tvdbGetInfoTvShow": function(tvShowId, language) {
            check(tvShowId, PositiveInt);
            check(language, NonEmptyString);

            var future = new Future;
            Meteor.TVDB().tvdb.getInfoTvShow(tvShowId, function(err, tvShowInfo) {
                if (err) {
                    future.ret(new Meteor.Error(4106, err));
                } else {
                    future.ret(tvShowInfo);
                }
            }, language);
            return future.wait();
        },
        "tvdbGetInfoEpisode": function(episodeId, language) {
            check(episodeId, PositiveInt);
            check(language, NonEmptyString);

            var future = new Future;
            Meteor.TVDB().tvdb.getInfoEpisode(episodeId, function(err, episodeInfo) {
                if (err) {
                    future.ret(new Meteor.Error(4107, err));
                } else {
                    future.ret(episodeInfo);
                }
            }, language);
            return future.wait();
        },
        "tvdbGetUpdates": function(period) {
            check(period, NonEmptyString);

            var future = new Future;
            Meteor.TVDB().tvdb.getUpdates(period, function(err, updates) {
                if (err) {
                    future.ret(new Meteor.Error(4108, err));
                } else {
                    future.ret(updates);
                }
            });
            return future.wait();
        }
    });
})();
