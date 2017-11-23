/*
 * This configuration works for react-router-dom setup
 * use npm run dev to development (hotload- webpack)
 * npm run build to build
 * npm run serve to serve the built directory --- (server.js)
 * 
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin")
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


// Entry Helpers
var buildDevEntryPoint = function (entryPoint) {
    return [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        entryPoint
    ];
};


const entryPoint = {
    main: APP_DIR + "/index.jsx",
    loading: APP_DIR + "/loading.jsx"
};

// create Entry
var entry;
if (isProd) {
    entry = entryPoint;
} else {
    entry = {
        main: buildDevEntryPoint(entryPoint.main),
        loading: buildDevEntryPoint(entryPoint.loading)
    };
    /*
     entry = [
     'webpack-dev-server/client?http://localhost:8080',
     'webpack/hot/only-dev-server',
     //APP_DIR + '/index.jsx'
     ];
     */

}


const productionPlugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify((process.env.NODE_ENV))
        }
    }),
    //new ExtractTextPlugin("bundle.css", {allChunks: false}),
    new ExtractTextPlugin("[name].css", {allChunks: false}),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true
        },
        output: {
            comments: false
        },
        exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]), //https://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0
    })
];


module.exports = {
    entry: entry,
    //devtool: (false && isProd) ? false : 'source-map', // false
    devtool: (isProd) ? false : 'source-map', // false -- bigger

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // 'NODE_ENV': JSON.stringify((isProd) ? 'production' : 'development')
                'NODE_ENV': JSON.stringify((process.env.NODE_ENV))
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors'),
        new ExtractTextPlugin(CSS_DIR + "[name].bundle.css", {allChunks: false}),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        //new webpack.optimize.DedupePlugin(), //deprecated
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            output: {
                comments: false
            },
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        //need to configure express
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0
        })
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
            {test: /\.scss$/, loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])}
            //,{test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"}
            //,{test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
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

