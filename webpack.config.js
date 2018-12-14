"use strict";

let webpack = require("webpack");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path');
module.exports = {
	context: __dirname,
	entry: {
		"index":[
			"./src/public/frontweb/app.js",
			"./src/less/index.less"
		],
        "common": [
            "./src/public/frontweb/main.js"
        ],
		"awui": [
			"./src/component/index.js"
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
            }
        ]
    },
	plugins: [
		new MiniCssExtractPlugin({filename:"./css/[name].css"}),
        new CopyWebpackPlugin([{
          from:"src/public/frontweb/md/",
          to:"md/"
        }])
	],
    resolve:{
        alias:{
            "@":path.resolve(__dirname, 'src/component')
        }
    },
	devServer: {
		port: 23333,
        disableHostCheck: true,
        compress: false,
		contentBase: `${__dirname}/src`
	}
};