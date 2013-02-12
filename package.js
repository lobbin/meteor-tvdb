/**
 * A meteor library for communicating with thetvdb.com
 *
 * @author Robin Helgelin <lobbin@gmail.com>
 * @version 0.1
 */

// Package description
Package.describe({
    summary: 'A meteor library for communicating with thetvdb.com'
});

// Package usage
Package.on_use(function(api) {
    // Deps
    api.use(["less", "templating"], "client");

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
