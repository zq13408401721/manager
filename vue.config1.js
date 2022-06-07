module.exports = {
    devServer:{
        port:12001,
        proxyTable:{
            '/apis':{
                target:'http://res.yimios.com:9060/',
                changeOrigin:true,
                pathRewrite:{
                    '^/apis':'/apis',
                }
            }
            
        }
    },
    configureWebpack:{
        devtool:'source-map'
    }
};