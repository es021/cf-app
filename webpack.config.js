/*
 * This configuration works for react-router-dom setup
 * use npm run dev to development (hotload- webpack)
 * npm run build to build
 * npm run serve to serve the built directory --- (server.js)
 * 
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'app');
const CSS_DIR = "asset/css/";
const JS_DIR = "asset/js/";

var isProd = false;
if (process.env.NODE_ENV === "production") {
    isProd = true;
}

var entry;
if (isProd) {
    entry = ['./app/index.jsx'];
} else {
    entry = [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        APP_DIR + '/index.jsx'
    ];
}

module.exports = {
    entry: entry,
    devtool: (false && isProd) ? false : 'source-map', // false

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // 'NODE_ENV': JSON.stringify((isProd) ? 'production' : 'development')
                'NODE_ENV': JSON.stringify((process.env.NODE_ENV))
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors'),
        new ExtractTextPlugin(CSS_DIR + "[name].bundle.css")
    ],
    module: {
        loaders: [
            {test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: (isProd) ? 'babel-loader' : 'react-hot-loader!babel-loader'
            },
            //{test: /\.js$/, loader: "babel?presets[]=es2015&presets[]=react", exclude: /node_modules/},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            //{test: /\.scss$/, loader:  "style-loader!css-loader!sass-loader"},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: BUILD_DIR,
        publicPath: '/',
        filename: JS_DIR + '[name].bundle.js'
    },
    devServer: {
        // this is for react-router-dom
        historyApiFallback: true,
        contentBase: './public',
        hot: true
    }
};
