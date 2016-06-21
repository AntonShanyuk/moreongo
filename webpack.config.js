var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    debug: true,
    devtool: 'eval',
    resolve: {
        modulesDirectories: ["client/bower_components", 'node_modules']
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "html" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] },
            { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
            { test: /\.(ttf|eot)$/, loader: 'file' },
            { test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports?jQuery=jquery' },
            { test: /angular.js/, loader: 'exports?window.angular' }
        ],
    },
    htmlLoader: {
        ignoreCustomFragments: [/\{\{.*?}}/]
    },
    entry: {
        'vendor-bundle': ['jquery', 'lodash', 'angular', 'moment', 'angular-moment', 'angular-simple-logger', 'angular-bootstrap', 'angular-google-maps', 'angular-ui-router',
            'bootstrap-loader', 'angular-input-masks', 'ng-focus-on', 'angular-resource', 'ng-debounce', 'angular-scroll', 'angular-i18n/angular-locale_ru-ru.js', 
            'angular-click-outside'],
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