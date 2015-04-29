/// <reference path="../typings/tsd.d.ts" />
/// <reference path="amodro-trace.d.ts" />

var gulp = require('gulp');
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var amodroTrace = require('amodro-trace');
var allWriteTransforms = require('amodro-trace/write/all');

var PLUGIN_NAME = 'gulp-amodro';

// Create the writeTransform function by passing options to be used by the
// write transform factories:
var writeTransform = allWriteTransforms({
    // See the write transforms section for options.
});

interface IOptions {
    rootDir?: string;
}

// options { rootDir: absolute path to wwwroot }
var gulpAmodro = function(options: IOptions): NodeJS.ReadWriteStream {

    gutil.log(gutil.colors.green(PLUGIN_NAME));

    options = options || {};
    options.rootDir = options.rootDir || process.cwd();

    var firstFile;

    function bufferContents(file, enc, cb) {

        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // we dont do streams (yet)
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            cb();
            return;
        }

        // set first file if not already set
        if (!firstFile) {
            firstFile = file;
        }

        var mainFile = path.parse(file.path);
        var rootDir = path.relative(options.rootDir, mainFile.dir);
        var self = this;

        amodroTrace({
            // The root directory, usually the root of the web project, and what the
            // AMD baseUrl is relative to. Should be an absolute path.
            rootDir: rootDir,
            id: mainFile.name,
            includeContents: true,
            writeTransform: writeTransform,
            fileRead: function (defaultRead, id, filePath) {
                // performance, dont need to read again
                if (id === mainFile.name) {
                    return file.contents.toString();
                }
                return defaultRead(id, filePath);
            }
        }, {
            // The AMD loader config to use.
            baseUrl: '',
            paths: {
                // app: '../app'
            }
        }).then(function (traceResult) {

            if (traceResult.errors && traceResult.errors.length) {

                // throw to Promise.Catch()
                var errorMessage = traceResult.errors.map(function (error) {
                    return error.toString()
                }).join('\n');
                throw new Error(errorMessage);

            }

            // map each part
            return traceResult.traced.map(function (result) {
                return new gutil.File({ cwd: "", base: "", path: result.path, contents: new Buffer(result.contents) });
            });

        }).then(function (files) {
            files.forEach(function (f) {
                self.push(f);
            });
            cb();
        }).catch(function (error) {
            self.emit('error', new gutil.PluginError(PLUGIN_NAME,  error.toString()));
            cb();
        });
    }

    return through.obj(bufferContents);
}

export = gulpAmodro;
