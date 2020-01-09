const path = require('path');
module.exports = {
    entry: path.join(__dirname, 'src/js', 'App.js'),
    devServer: {
        contentBase: path.join(__dirname, 'src'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [/src/, /node_modules/]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },

            {
                test: /\.json$/,
                loader: 'json-loader',
                include: '/build/contracts/'
            }
        ]
    }
}
