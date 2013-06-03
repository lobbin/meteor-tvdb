/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 */

(function() {
    /**
     * @param {Object} [options]
     * @constructor
     */
    function TVDB(options) {
        this.init(options);
    }

    /**
     * Constructor init function
     * @param {Object} [options]
     */
    TVDB.prototype.init = function(options) {
        var self = this;

        // Handle settings
        this.collectionName = options && options.collectionName || 'tvdb';

        // Create collection
        this.collection = new Meteor.Collection(this.collectionName, {_preventAutopublish: true});

        if (Meteor.isServer) {
            this.createTVDBObject();

            Meteor.publish('tvdb_info', function() {
                return self.collection.find({name: 'configuration'}, {fields: {'options.apikey': 0}});
            });
        }

        if (Meteor.isClient) {
            this.workers = 0;
            this.workersDep = new Deps.Dependency;

            Meteor.autorun(function() {
                Meteor.subscribe('tvdb_info');
            });
        }
    };

    /**
     * Set tvdb module configuration settings
     * @param {Object} configuration
     * @throws Meteor.Error
     */
    TVDB.prototype.setConfiguration = function(configuration) {
        if (Meteor.isServer) {
            this.collection.insert({name: 'configuration', options: configuration});
            this.createTVDBObject();
        } else {
            throw new Meteor.Error(4110, 'Not callable from client');
        }
    };

    /**
     * Helper function for the ui to determine whether the tvdb module is correctly configured
     * @return {Boolean}
     */
    TVDB.prototype.isConfigured = function() {
        return (this.collection.findOne({name: 'configuration'}) !== undefined);
    };

    /**
     * Helper function for the ui to determine whether we are working at the moment or not
     * @return {Boolean}
     */
    TVDB.prototype.isWorking = function() {
        return this.getWorkers() > 0;
    };

    // @TODO: Handle more languages

    /**
     * thetvdb.com API done function
     * @name APIdone
     * @function
     * @param {Object} error
     * @param {Object} result
     */

    /**
     * thetvdb.com API get list of languages
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    TVDB.prototype.getLanguages = function(done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetLanguages", null, function(error, result) {
            done(error, result);
            self.decWorkers();
        })
    };

    /**
     * thetvdb.com API get list of mirrors
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    TVDB.prototype.getMirrors = function(done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetMirrors", null, function(error, result) {
            done(error, result);
            self.decWorkers();
        })
    };

    /**
     * thetvdb.com API get server time for later comparison
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    TVDB.prototype.getServerTime = function(done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetServerTime", null, function(error, result) {
            done(error, result);
            self.decWorkers();
        })
    };

    /**
     * thetvdb.com API GetSeries call
     * @see http://thetvdb.com/wiki/index.php/API:GetSeries
     * @param {String} name Show to find
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    TVDB.prototype.findTvShow = function(name, done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        if (typeof name !== 'string' || name.length < 1) {
            throw new Meteor.Error(4112, 'Invalid parameter "name"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbFindTvShow", name, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    /**
     * thetvdb.com API call for getting tv show information
     * @param {Number} tvShowId Unique show id
     * @param {APIdone} done Function called when we have a server result
     * @param {String} language
     * @throws Meteor.Error
     */
    TVDB.prototype.getInfo = function(tvShowId, done, language) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        tvShowId = parseInt(tvShowId);
        if (tvShowId <= 0) {
            throw new Meteor.Error(4113, 'Invalid parameter "tvShowId"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetInfo", tvShowId, language, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    TVDB.prototype.getInfoTvShow = function(tvShowId, done, language) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        tvShowId = parseInt(tvShowId);
        if (tvShowId <= 0) {
            throw new Meteor.Error(4113, 'Invalid parameter "tvShowId"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetInfoTvShow", tvShowId, language, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    TVDB.prototype.getInfoEpisode = function(episodeId, done, language) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        episodeId = parseInt(episodeId);
        if (episodeId <= 0) {
            throw new Meteor.Error(4114, 'Invalid parameter "episodeId"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetInfoEpisode", episodeId, language, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    /**
     * thetvdb.com API call for getting tv show update information
     * @param {String} period day, week or month
     * @param {APIdone} done Function called when we have a server result
     * @throws Meteor.Error
     */
    TVDB.prototype.getUpdates = function(period, done) {
        if (typeof done !== 'function') {
            throw new Meteor.Error(4111, 'Missing return function');
        }

        if (typeof period !== 'string' || period.length < 1) {
            throw new Meteor.Error(4115, 'Invalid parameter "period"');
        }

        var self = this; self.incWorkers();
        return Meteor.call("tvdbGetUpdates", period, function(error, result) {
            done(error, result);
            self.decWorkers();
        });
    };

    /*
     * Client side functions
     */

    /**
     * Helper function to increase the number of workers
     */
    TVDB.prototype.incWorkers = function() {
        this.setWorkers(this.getWorkers()+1);
    };

    /**
     * Helper function to decrease the number of workers
     */
    TVDB.prototype.decWorkers = function() {
        this.setWorkers(this.getWorkers()-1);
    };

    /**
     * Reactive function for getting the current number of workers
     * @return {Integer}
     */
    TVDB.prototype.getWorkers = function() {
        if (this.workersDep) {
            this.workersDep.depend();
        }
        return this.workers;
    };

    /**
     * Reactive function for setting the current number of workers
     * @param workers
     */
    TVDB.prototype.setWorkers = function(workers) {
        if (workers == this.workers) {
            return;
        }

        this.workers = workers;

        if (this.workersDep) {
            this.workersDep.changed();
        }
    };

    /*
     * Server side function from here
     */

    /**
     * Create the tvdb node module object.
     * @todo Needs to be cleaned up
     */
    TVDB.prototype.createTVDBObject = function() {
        var configuration = this.collection.findOne({name: 'configuration'});
        if (configuration && configuration.options && configuration.options.apikey) {
            var tvdb = Npm.require('tvdb');

            this.tvdb = new tvdb({apiKey: configuration.options.apikey});
        }
    };

    var instance = null;

    /**
     * Singleton
     * @see TVDB.prototype.init
     * @param {Object} [options]
     * @return {TVDB}
     * @constructor
     */
    Meteor.TVDB = function(options) {
        if (!instance) {
            instance = new TVDB(options);
        }
        return instance;
    };
})();
