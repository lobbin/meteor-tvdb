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
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            Meteor.TVDB().setConfiguration(options);
            return true;
        },
        "tvdbGetLanguages": function() {
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getLanguages(function(err, languages) {
                if (err) {
                    future.return(new Meteor.Error(4101, err));
                } else {
                    future.return(languages);
                }
            });
            return future.wait();
        },
        "tvdbGetMirrors": function() {
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getMirrors(function(err, mirrors) {
                if (err) {
                    future.return(new Meteor.Error(4102, err));
                } else {
                    future.return(mirrors);
                }
            });
            return future.wait();
        },
        "tvdbGetServerTime": function() {
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                console.log(e);
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getServerTime(function(err, serverTime) {
                if (err) {
                    future.return(new Meteor.Error(4103, err));
                } else {
                    future.return(serverTime);
                }
            });
            return future.wait();
        },
        "tvdbFindTvShow": function(name) {
            check(name, NonEmptyString);
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future();
            Meteor.TVDB().tvdb.findTvShow(name, function(err, tvShows) {
                if (err) {
                    future.return(new Meteor.Error(4104, err));
                } else {
                    future.return(tvShows);
                }
            });
            return future.wait();
        },
        "tvdbGetInfo": function(tvShowId, language) {
            check(tvShowId, PositiveInt);
            check(language, NonEmptyString);
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getInfo(tvShowId, function(err, tvShowInfo) {
                if (err) {
                    future.return(new Meteor.Error(4105, err));
                } else {
                    future.return(tvShowInfo);
                }
            }, language);
            return future.wait();
        },
        "tvdbGetInfoTvShow": function(tvShowId, language) {
            check(tvShowId, PositiveInt);
            check(language, NonEmptyString);
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getInfoTvShow(tvShowId, function(err, tvShowInfo) {
                if (err) {
                    future.return(new Meteor.Error(4106, err));
                } else {
                    future.return(tvShowInfo);
                }
            }, language);
            return future.wait();
        },
        "tvdbGetInfoEpisode": function(episodeId, language) {
            check(episodeId, PositiveInt);
            check(language, NonEmptyString);
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getInfoEpisode(episodeId, function(err, episodeInfo) {
                if (err) {
                    future.return(new Meteor.Error(4107, err));
                } else {
                    future.return(episodeInfo);
                }
            }, language);
            return future.wait();
        },
        "tvdbGetUpdates": function(period) {
            check(period, NonEmptyString);
            var e;
            if ((e = Meteor.TVDB().checkFilterFunction()) != true) {
                return e;
            }

            var future = new Future;
            Meteor.TVDB().tvdb.getUpdates(period, function(err, updates) {
                if (err) {
                    future.return(new Meteor.Error(4108, err));
                } else {
                    future.return(updates);
                }
            });
            return future.wait();
        }
    });
})();
