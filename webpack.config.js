"use strict";

let webpack = require("webpack");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        "index":[
            "./src/public/app.js",
            "./src/less/index.less"
        ]
    },
    output: {
        path: `${__dirname}/built`,
        publicPath: "/",
        filename: "./js/[name].js"
    },
    devtool: "source-map",
    module:{
        rules:[
            {
                test: /\.less$/, 
                use:[MiniCssExtractPlugin.loader,"css-loader","less-loader"]
            },
            {
                test:/\.js$/,
                exclude: /(node_modules|bower_components)/,
                use:{
                    loader:'babel-loader'
                }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
                // use:{
                //     loader:'vue-loader'
                // }
            },
            {
                test:require.resolve("ip"),
                use:[{
                    loader: "expose-loader",
                    options:"_IP"
                }] 
            },
            {
                test:/\.gif|png|jpg|jpeg|svg|woff|ttf|woff2?|eot/,
                use:[{
                    loader:"file-loader",
                    options:{
                        name:"img/[name].[ext]"
                    }
                }]
            },
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [path.resolve(__dirname, 'src/public')], // 指定检查的目录
                //exclude: [path.resolve(__dirname, 'src/public/frontweb/store/front'),path.resolve(__dirname, 'src/public/dashboard/store')], // 指定检查的目录
                options:{
                    failOnWarning: true, // eslint报warning了就终止webpack编译
                    failOnError: true, // eslint报error了就终止webpack编译,
                    //formatter: require("eslint-friendly-formatter")
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js', // 用 webpack 1 时需用 'vue/dist/vue.common.js'
            '@':path.resolve(__dirname, 'src'),
            '@view':path.resolve(__dirname, './src/public/view')
        }
    },
    plugins: [
        new MiniCssExtractPlugin({filename:"./css/[name].css"}),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
                from:"src/config/",
                to:"js/"
            },
            {
                from:"src/images/static/",
                to:"img/"
            }
        ]),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8889,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: false,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
          }),
    ],
    devServer: {
        port: 10099,
        disableHostCheck: true,
        compress: false,
        contentBase: `${__dirname}/src`
    }
};