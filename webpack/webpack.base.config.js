'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    output: {
      path: path.resolve(__dirname, '../app/dist'),
        filename: '[name].js',
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                },
            },
        ]
    },
    devtool: 'source-map',
    plugins: [],
};
