var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
// 有了它就可以将你的样式提取到单独的css文件里，
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// webpack中生成HTML的插件，
var HtmlWebpackPlugin = require('html-webpack-plugin');
var hostMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var _path = {
    js : 'src/js/page/',
    html : 'src/view/'
};

var entries = getEntry( _path.js + '**/*.js', _path.js, hostMiddlewareScript);
var chunks = Object.keys(entries);

var config = {
    // 'eventsource-polyfill',
    entry : entries,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js?[chunkhash]'
    },
    debug: true,
    devtool: 'source-map',
    plugins: [
        // new webpack.ProvidePlugin({ //加载jq
		// 	$: 'jquery'
		// }),
        new webpack.optimize.CommonsChunkPlugin({
			name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
			chunks: chunks, //提取哪些模块共有的部分
			minChunks: chunks.length // 提取至少3个模块共有的部分
		}),
		new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
        // {
        //     test: /\.js$/,
        //     exclude: /node_modules/,
        //     loaders: ['babel-loader']
        // }],
        // postLoaders: [{
        //     test: /\.js$/,
        //     loaders: ['es3ify-loader']
        // },
        {
            test: /\.css$/,
            //配置css的抽取器、加载器。'-loader'可以省去
            loader: ExtractTextPlugin.extract('style','css')
        }, {
            test: /\.less$/,
            //配置less的抽取器、加载器。中间!有必要解释一下，
            //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
            //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
            // loader: ExtractTextPlugin.extract('css!less')
            loader: ExtractTextPlugin.extract('css!less')
        },{
            //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
            //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
            test: /\.html$/,
            loader: "html?-minimize"
        }, {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=fonts/[name].[ext]'
        }, {
            //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            //如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url-loader?limit=8192&name=imgs/[name]-[hash].[ext]'
        }
        ]
    }

};
//设置html模板信息
var pages = Object.keys(getEntry(_path.html + '**/*.html', _path.html));
pages.forEach(function(pathname) {
    var conf = {
        filename: './view/' + pathname + '.html', //生成的html存放路径，相对于path
        template: './'+ _path.html + pathname + '.html', //html模板路径
        inject: false,  //js插入的位置，true/'head'/'body'/false
        /*
        * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
        * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
        * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
        * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        // minify: { //压缩HTML文件
        //  removeComments: true, //移除HTML中的注释
        //  collapseWhitespace: false //删除空白符与换行符
        // }
    };
    if (pathname in config.entry) {
        conf.inject = 'body';
        conf.chunks = ['vendors', pathname];
        conf.hash = true;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;

function getEntry(globPath, pathDir, hotReload) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = dirname + '/' + basename;
        pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
        entries[pathname] = hotReload ? ['./' + entry, hotReload] : ['./' + entry];
    }
    return entries;
}
