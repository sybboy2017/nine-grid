const webpack = require('webpack');
const merge = require('webpack-merge');
const {
    baseConfig,
    resources,
} = require('./webpack.base');


/**
 * 入口文件增加热加载
 */
Object.keys(resources.entries)
    .forEach((key) => {
        resources.entries[key].unshift('webpack-hot-middleware/client');
    });

module.exports = merge(baseConfig, {

    entry: resources.entries,
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `img/[name].[hash:8].[ext]?_bid=0`
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
});
