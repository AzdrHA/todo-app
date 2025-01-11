module.exports = {
    devServer: {
        port: 80,
        proxy: {
            '/api': {
                target: 'http://backend:5000',
                changeOrigin: true
            }
        }
    }
};