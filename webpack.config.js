/*
 * This configuration works for react-router-dom setup
 * use npm run dev to development (hotload- webpack)
 * npm run build to build
 * npm run serve to serve the built directory --- (server.js)
 * 
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'app');
const CSS_DIR = "asset/css/";
const JS_DIR = "asset/js/";

var allowProdMap = false;
var isProd = false;
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "production-local") {
    isProd = true;
}
console.log("isProd", isProd);

// create Entry --------------------------------------
var buildDevEntryPoint = function (entryPoint) {
    return [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        entryPoint
    ];
};

const entryPoint = {
    //main: ['babel-core/polyfill', APP_DIR + "/index.jsx"] 
    main: APP_DIR + "/index.jsx"
    //,loading: APP_DIR + "/loading.jsx"
};


var entry;
if (isProd) {
    entry = entryPoint;
} else {
    entry = {
        main: buildDevEntryPoint(entryPoint.main)
        //,loading: buildDevEntryPoint(entryPoint.loading)
    };
}

// create Plugins --------------------------------------
var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            // 'NODE_ENV': JSON.stringify((isProd) ? 'production' : 'development')
            'NODE_ENV': JSON.stringify((process.env.NODE_ENV))
        }
    }),
    //new webpack.optimize.CommonsChunkPlugin('vendors'),
    // remove this to fix webpackJson not defined
    //new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', minChunks: Infinity }),
    new ExtractTextPlugin(CSS_DIR + "[name].bundle.css", {
        allChunks: false
    })
];

// Optimize and Minimize for Production
if (isProd && !allowProdMap) {
    plugins = plugins.concat([
        //new webpack.optimize.DedupePlugin(), //deprecated
        //,new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
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
        new CompressionPlugin({  //need to configure express
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]);
}

var jsxLoader = {
    test: /\.jsx?$/,
    exclude: /node_modules/
};
if (isProd) {
    jsxLoader.loader = 'babel-loader';
    jsxLoader.query = {
        presets: ["es2015", "react", "modern-browsers"],
        plugins: ["transform-es2015-modules-commonjs"]
    };
} else {
    jsxLoader.loader = 'react-hot-loader!babel-loader';
    // jsxLoader.rules = [{
    //     "no-use-before-define": "error"
    // }]
    //     "no-use-before-define": "error"
    // };
    // jsxLoader.query = {
    //     rules: {
    //         "no-use-before-define": "error"
    //     },
    // };
}

// create Moduile --------------------------------------
module.exports = {
    entry: entry,
    devtool: (isProd && !allowProdMap) ? false : 'source-map', // false -- bigger
    //devtool: 'source-map', // false -- bigger
    plugins: plugins,
    module: {
        loaders: [jsxLoader,
            /*{test: /\.jsx?$/,
             exclude: /node_modules/,
             loader: (isProd) ? 'babel-loader' : 'react-hot-loader!babel-loader',
             query: {}
             //query: {presets: ["es2015", "react", "modern-browsers"]}
             },*/
            //{test: /\.js$/, loader: "babel?presets[]=es2015&presets[]=react", exclude: /node_modules/},
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
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