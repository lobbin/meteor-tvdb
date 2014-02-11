/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 */

// Package description
Package.describe({
    summary: 'A meteor library for communicating with thetvdb.com'
});

Npm.depends({tvdb: "0.0.12"});

// Package usage
Package.on_use(function(api) {
    // Deps
    api.use(["less", "templating"], "client");
    api.use(["check"], "server");

    // Add files
    api.add_files([
        "tvdb-session.js",
        "tvdb.js"], ['client', 'server']);
    api.add_files(
        "tvdb-server.js", 'server');
    api.add_files([
        "tvdb-views.html",
        "tvdb-views.less",
        "tvdb-views.js"], 'client');
});
