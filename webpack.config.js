var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    debug: true,
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ["client/bower_components"]
    },
    entry: './client/app/app.js',
    output: {
        path: './client/app',
        filename: 'index_bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({title: 'Moreongo - запись онлайн'}),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
}