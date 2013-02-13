# A meteor library for communicating with thetvdb.com Version 0.0.1

## How to install

1. Add the package `tvdb` to your `smart.json` file.
2. Run `mrt`

[meteor]: http://meteor.com

> meteor-tvdb currently also requires the [node-tvdb](https://github.com/enyo/node-tvdb) module
> to be installed in the server side of your [meteor] app.

## Usage

> First off, [get an API key from thetvdb](http://thetvdb.com/?tab=apiregister).
> Without an API key you won't be able to do anything with this library.

### Include and configure

    Client and server side:
    Add Meteor.TVDB() to your startup function.
    
    Client side:
    Add {{tvdbStatus}} to a template and it should give you a nice buttor to configure the rest.
    
### General API usage

All meteor-tvdb API calls requires a return function, that takes two parameters, `error` and `result`.

    Meteor.TVDB().getLangauges(function(error, languages) {
        console.log(languages);
    });
    
    // Also available
    Meteor.TVDB().getMirrors(donefunc)
    Meteor.TVDB().getServerTime(donefunc)
    Meteor.TVDB().findTvShow(name, donefunc)

## More information

http://github.com/lobbin/meteor-tvdb
