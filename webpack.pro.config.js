/**
 * Created by Veket on 2019/10/6.
 */
const env = process.env.NODE_ENV;  //环境变量
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成一个HTML文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const buildPath = path.resolve(__dirname,'dist');
const nodeModulesPath = path.resolve(__dirname,'node_modules');
const srcDir = path.resolve(process.cwd(),'src');
const glob = require('glob');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**考虑多页面应用，多个入口文件**/
const _entries = {};
const fileNames=[];
const entryDir = path.resolve(srcDir,'core/entry');
const entryFiles = glob.sync(`${entryDir}/*.js`);
entryFiles.forEach((filePath) => {
    const filename = filePath.substring(filePath.lastIndexOf('/')+1,filePath.lastIndexOf('.'));
    _entries[filename] = filePath;
    fileNames.push(filename);
});

const htmlPlugins = () => {
    const entryHtml = glob.sync(`${entryDir}/*.html`);
    const rtn = [];
    entryHtml.forEach((filePath) => {
        const filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
        const cfg = {
            template:`${filePath}`,
            filename:`${filename}.html`,
            favicon:`${srcDir}/img/favicon.ico`,
            chunksSortMode:'dependency'
        };
        if(filename in _entries){
            cfg.inject = 'body';
            cfg.chunks = ['vendor','common',filename];
        }
        rtn.push(new HtmlWebpackPlugin(cfg));
    });
    return rtn;
};

const config={
    mode:'production',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor:{
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    priority:10,
                    enforce:true
                },
                common: {
                    name: "common",
                    minChunks: 2
                },
            },
            chunks:'all',
            minSize:40000
        },
    },
    resolve:{
        extensions:['.js', '.vue','.css', '.png', '.jpg'],
        alias:{
            vue$:`${nodeModulesPath}/vue/dist/vue.js`,
            img:`${srcDir}/img`,
            fonts:`${srcDir}/fonts`,
            apputil:`${srcDir}/core/util/main.js`,
            "@":`${srcDir}/core`
        }
    },
    entry:Object.assign(_entries, { vendor: ['vue','vue-router'] }),
    output:{
        path:buildPath,
        publicPath:'',
        filename:'js/[hash:8].[name].min.js'
    },
    /*devtool: '#source-map',*/
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            __DEV__: env === 'development',
            __PROD__: env === 'production'
        }),
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename: 'css/[hash].[name].min.css',
            allChunks: false
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: { safe: true, map: false }
        }),
        new webpack.ProvidePlugin({'_': "underscore",'Vue':'vue','AppUtil':'apputil',})
    ].concat(htmlPlugins()),
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options:{
                    loaders:{
                        css:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use:'css-loader',
                            fallback:'vue-style-loader',
                            publicPath: '../'
                        })),
                        less:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use:['css-loader','postcss-loader','less-loader'],
                            fallback:'vue-style-loader',
                            publicPath: '../'
                        })),
                        postcss:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                            use:['css-loader','postcss-loader'],
                            fallback:'vue-style-loader',
                            publicPath: '../'
                        })),
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [nodeModulesPath],
            },
            {
                test: /\.css$/,
                use:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use:['css-loader','postcss-loader'],
                    fallback:'style-loader',
                    publicPath: '../'
                }))
            },
            {
                test: /\.(less)$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'less-loader'],
                    fallback: 'style-loader',
                    publicPath: '../'
                }))
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
                exclude: [path.resolve(__dirname,'src/js/icons')],
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:10000,
                        name:'img/[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:10000,
                        name:'fonts/[name].[ext]'
                    }
                }]
            },
        ]
    },
};

module.exports = (() => { return config })();