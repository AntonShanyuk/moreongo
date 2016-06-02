var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    debug: true,
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ["client/bower_components", 'node_modules']
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "html" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] },
            { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
            { test: /\.(ttf|eot)$/, loader: 'file' },
            { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports?jQuery=jquery' }
        ],
    },
    htmlLoader: {
        ignoreCustomFragments: [/\{\{.*?}}/]
    },
    entry: {
        'vendor-bundle': ['jquery', 'lodash', 'angular', 'angular-simple-logger', 'angular-google-maps', 'angular-ui-router', 'bootstrap-loader', 'angular-tiny-eventemitter'],
        'app-bundle': './client/app/client-app.js'
    },
    output: {
        path: './client/app/build',
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/app/index.html',
            filename: 'index.html'
        }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new ngAnnotatePlugin({
            add: true
        })
    ]
}