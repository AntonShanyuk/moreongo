var gulp = require('gulp');
var gutil = require("gulp-util");
var bower = require('gulp-bower');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

gulp.task('install', function () {
    return bower();
});

gulp.task('build', ['install'], function (callback) {
    var myConfig = Object.create(webpackConfig);
    delete webpackConfig.devtool;
    delete webpackConfig.debug;
    
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});