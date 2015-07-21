var path = require('path');

module.exports = {
    entry: {
        'app': './src/js/App.jsx'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    externals: {
        'react': 'window.React'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loader: "style!css!autoprefixer?safe=true!sass?outputStyle=expanded"
            }
        ]
    }
};
