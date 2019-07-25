/* eslint no-console:0 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const os = require('os');
const config = {
    entry: require.resolve('./form'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'form.js'
    },
    mode: 'production',
    plugins: [new HtmlWebpackPlugin({
        title: 'form',
        template: path.join(__dirname, 'form', 'index.html'),
        filename: 'form.html'
    }), new CompressionPlugin()],
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules[\\/](?!(impl|ut)-)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-transform-runtime',
                        ['@babel/plugin-proposal-class-properties', {
                            loose: true
                        }]
                    ],
                    sourceType: 'unambiguous', // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
                    babelrc: false,
                    cacheCompression: false,
                    cacheDirectory: path.resolve(os.homedir(), '.ut', 'ut-front', 'cache')
                }
            }]
        }]
    }
};

webpack(config, (err, stats) => {
    stats && console.log(stats.toString({
        colors: true
    }));
    if (err) {
        throw err;
    } else {
        console.dir((stats.endTime - stats.startTime) / 1000, 's');
    }
});
