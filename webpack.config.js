const path = require('path');

module.exports = {
    entry: './src/index',

    output: {
        path: path.join(__dirname, "build"),
        filename: "bundle.js"
    },

    resolve: {
        modules: [
            path.join(__dirname, "src"),
            "node_modules",
        ],
        
        alias: {
            'pixi.js': 'pixi.js/dist/pixi.min.js',
            'resources': path.join(__dirname, 'resources'),
            'eventemitter3': path.join(__dirname, 'include/eventemitter3'),
        },

        extensions: ['.js', '.ts']
    },
    
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'file-loader',
                options: { name: '[name].[ext]' },
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015'] }
                    },
                    'ts-loader'
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015'] }
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.png$/,
                loader: 'file-loader',
                options: { name: 'images/[hash].[ext]' },
            }
        ]
    }
}
