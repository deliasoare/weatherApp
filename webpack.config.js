const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]'
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        open: true,
        compress: true,
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/i,
                exclude: /node-modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {targets: "defaults"}]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            name: 'Webpack App',
            template: 'src/template.html'
        })
    ]
}