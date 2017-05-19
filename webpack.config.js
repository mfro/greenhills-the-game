const path = require('path');

module.exports = {
    entry: './src/index',

    output: {
        path: path.join(__dirname, "build"),
        filename: "bundle.js"
    },

    resolve: {
        modules: [
            "node_modules",
            path.join(__dirname, "src"),
        ],
        
        alias: {
            'pixi.js': 'pixi.js/dist/pixi.min.js',
            'resources': path.join(__dirname, 'resources')
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
