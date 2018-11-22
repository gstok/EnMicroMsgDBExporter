
const webpack = require("webpack");

module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery",
            }),
        ],
    },
    devServer: {
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:10241/',
                changeOrigin: true,
                secure: false,
            },
        },
    },
};