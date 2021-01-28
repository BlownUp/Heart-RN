const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.resolve(__dirname, './public/index.html'),
  filename: 'index.html',
  inject: 'body',
})

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/build'),
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|ts)$/,
        exclude: /node_modules\/(?!()\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 25000
          }
        }
      },
      {
        test: /\.ttf$/,
        loader: "url-loader", // or directly file-loader
        include: [
          path.resolve(__dirname, "node_modules/react-native-vector-icons"),
          path.resolve(__dirname, "src/assets/fonts"),
          path.resolve(__dirname, "src/assets/fonts/raleway"),
        ],
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            "@babel/preset-react",
            {
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          ]
        },
      },
    ],
  },
  plugins: [HTMLWebpackPluginConfig],
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true,
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    fallback: {
      "util": require.resolve("util/"),
    },
  },
}