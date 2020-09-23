// Modify configuration for webpack
const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            extensions: ['.js'],
            alias: {
                fs: path.resolve(__dirname, 'src/mock-fs.js')
            }
        }
    }
}