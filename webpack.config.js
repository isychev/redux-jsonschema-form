const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const NODE_ENV = process.env.NODE_ENV || 'development';

const __DEV__ = NODE_ENV === 'development';
const __PROD__ = NODE_ENV === 'production';
const __TEST__ = NODE_ENV === 'test';
const __SERVER__ = NODE_ENV === 'server';

const pathResources = path.join(__dirname, 'src/');
const jsSrcPath = pathResources;

const entriesClient = {
  app: [
    path.join(__dirname,'./demo.jsx'),
  ],
};
process.noDeprecation = true;

const alias = {
  _app: jsSrcPath,
  _components: path.join(jsSrcPath, 'components/'),
  _pages: path.join(jsSrcPath, 'pages/'),
  _actions: path.join(jsSrcPath, 'actions/'),
  _constants: path.join(jsSrcPath, 'constants/'),
  _utils: path.join(jsSrcPath, 'utils/'),
  _sagas: path.join(jsSrcPath, 'sagas/'),
  _services: path.join(jsSrcPath, 'services/'),
  _decorators: path.join(jsSrcPath, 'decorators/'),
  _router: path.join(jsSrcPath, 'router/'),
  _reducer: path.join(jsSrcPath, 'reducer/'),
  _store: path.join(jsSrcPath, 'store/'),
  _middlewares: path.join(jsSrcPath, 'middlewares/'),
  _selectors: path.join(jsSrcPath, 'selectors/'),
  _scss: path.join(pathResources, 'scss/'),
  _node_modules: path.join(__dirname, 'node_modules/'),
};

const config = {
  entry: entriesClient,
  devtool: 'source-map',
  output: {
    path: path.join(__dirname),
    publicPath: '/dist/',
    filename: 'scripts/[name].js',
    libraryTarget: 'var'
  },
  resolve: {
    modules: [jsSrcPath, alias._node_modules],
    extensions: ['*', '.js', '.jsx', '.json'],
    alias: alias,
  },
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) },
    }),
    //new BundleAnalyzerPlugin({generateStatsFile: true}),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
  ]
};

if (__SERVER__){
  config.output = {
    path: path.join(__dirname, 'var/node-server/scripts'),
    publicPath: '/scripts/',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  }
}else{
  // config.plugins.push( new ManifestPlugin({
  //   fileName: 'manifest.json',
  //   basePath: 'dist/'
  // }));
}

// JavaScript
// ------------------------------------
config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        plugins: [
          'babel-plugin-transform-class-properties',
          'babel-plugin-syntax-dynamic-import',
          [
            'babel-plugin-transform-object-rest-spread',
            {
              useBuiltIns: true // we polyfill Object.assign in src/normalize.js
            },
          ],
        ],
        presets: [
          [
            'babel-preset-env',
            {
              modules: false,
              targets: {
                ie9: true,
              },
              uglify: true,
            },
          ],
        ],
      },
    },
  ],
});

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
  filename: __PROD__?'stylesheets/[name].[hash].css':'stylesheets/[name].css',
});

config.module.rules.push({
  test: /\.(sass|scss|css)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          minimize: {
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll: true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: true,
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [pathResources],
        },
      },
    ],
  }),
});
config.plugins.push(extractStyles);

// Images
// ------------------------------------
config.module.rules.push({
  test: /\.(png|jpg|gif)$/,
  loader: 'url-loader',
  options: {
    limit: 8192,
  },
});

// Fonts
// ------------------------------------
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0];
  const mimetype = font[1];

  config.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype,
    },
  });
});


// Tests Tools
// ------------------------------------
if (__TEST__) {
  config.devtool= false;
}


// Development Tools
// ------------------------------------
if (__DEV__) {
  config.entry.app.push(
    'webpack-dev-server/client?http://0.0.0.0:8888',
    'webpack/hot/only-dev-server'
  );
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );
}

// Production Optimizations
// ------------------------------------
if (__PROD__) {
  for (let i=0;i<=config.module.rules.length;i++){
    if (config.module.rules[i].use && config.module.rules[i].use[0].loader==='babel-loader'){
      config.module.rules[i].use[0].query.plugins.push(["react-remove-properties", {"properties": ["data-qa"]}]);
      break;
    }
  }
  config.output.filename= 'scripts/[name].[hash].js';
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        cssProcessor: require('cssnano'),
        discardComments: {
          removeAll: true,
        },
      },
      canPrint: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: true,
      sourceMap: true,
      comments: false,
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
      }
    })
  );
}

module.exports = config;
