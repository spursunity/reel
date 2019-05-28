const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
	entry: './src/ts/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname),
		compress: true,
		port: 9000,
		hot: true,
		//open: true,
		overlay: true,
		publicPath: '/dist/',
		watchContentBase: true
	},
	module: {
		rules: [
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            MiniCssExtractPlugin.loader,
                            'css-loader'
					    ]
					}, {
						test: /\.js$/,
						use: ["source-map-loader"],
						enforce: "pre"
                    }, {
                        test: /\.(png|jpe?g|gif)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    outputPath: 'images',
                                    name: '[path][name].[ext]'
                                }
                            }
                        ]
                    }, {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
			      	}
				]
	},
	resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.css'
		}),
		/*new webpack.ProvidePlugin({
			'$': 'jquery',
			'jQuery': 'jquery'
		}),*/
		new webpack.HotModuleReplacementPlugin()
	]
};
