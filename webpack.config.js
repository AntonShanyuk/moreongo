var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    debug: true,
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ["client/bower_components"]
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "html" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] }
        ]
    },
    htmlLoader: {
        ignoreCustomFragments: [/\{\{.*?}}/]
    },
    entry: {
        'vendor-bundle': ['lodash', 'angular', 'angular-simple-logger', 'angular-google-maps', 'angular-ui-router'],
        'app-bundle': './client/app/app.js'
    },
    output: {
        path: './client/app',
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/app/index.template.html'
        }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new ngAnnotatePlugin({
            add: true
        })
    ]
}