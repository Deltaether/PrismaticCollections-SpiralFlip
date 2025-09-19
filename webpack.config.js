/**
 * Custom Webpack Configuration for Production Optimization
 * Enhances Angular's default webpack config for maximum performance
 */

const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, options) => {
  // Only apply optimizations in production
  if (options.configuration === 'production') {

    // Advanced chunk splitting for better caching
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 20,
        maxAsyncRequests: 20,
        cacheGroups: {
          // Vendor chunk for third-party libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 20,
            chunks: 'all'
          },
          // Angular framework chunks
          angular: {
            test: /[\\/]node_modules[\\/]@angular[\\/]/,
            name: 'angular',
            priority: 30,
            chunks: 'all'
          },
          // Three.js and graphics libraries
          graphics: {
            test: /[\\/]node_modules[\\/](three|gsap|@tweenjs)[\\/]/,
            name: 'graphics',
            priority: 25,
            chunks: 'all'
          },
          // Audio libraries
          audio: {
            test: /[\\/]node_modules[\\/](howler)[\\/]/,
            name: 'audio',
            priority: 25,
            chunks: 'all'
          },
          // Common utilities
          common: {
            name: 'common',
            minChunks: 2,
            priority: 10,
            chunks: 'all',
            enforce: true
          }
        }
      }
    };

    // Add compression plugin for gzip
    config.plugins.push(
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8
      })
    );

    // Add Brotli compression
    config.plugins.push(
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        threshold: 8192,
        minRatio: 0.8
      })
    );

    // Tree shaking optimization
    config.plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin()
    );

    // Bundle analyzer (enable only when needed)
    if (process.env.ANALYZE_BUNDLE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false
        })
      );
    }

    // Minimize CSS
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
      })
    );

    config.optimization.minimizer = [
      ...config.optimization.minimizer,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              colormin: true,
              convertValues: true,
              discardDuplicates: true,
              discardEmpty: true,
              discardOverridden: true,
              discardUnused: true,
              mergeLonghand: true,
              mergeRules: true,
              minifyFontValues: true,
              minifyGradients: true,
              minifyParams: true,
              minifySelectors: true,
              normalizeCharset: true,
              normalizeDisplayValues: true,
              normalizePositions: true,
              normalizeRepeatStyle: true,
              normalizeString: true,
              normalizeTimingFunctions: true,
              normalizeUnicode: true,
              normalizeUrl: true,
              orderedValues: true,
              reduceIdents: true,
              reduceInitial: true,
              reduceTransforms: true,
              svgo: true,
              uniqueSelectors: true
            }
          ]
        }
      })
    ];

    // Optimize asset handling
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 75
            },
            optipng: {
              enabled: true,
              optimizationLevel: 7
            },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4
            },
            gifsicle: {
              interlaced: false
            },
            webp: {
              quality: 75
            },
            svgo: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false
                },
                {
                  name: 'removeEmptyAttrs',
                  active: false
                }
              ]
            }
          }
        }
      ]
    });

    // Performance hints
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 2500000, // 2.5MB
      maxAssetSize: 1500000       // 1.5MB
    };

    // Advanced minification options
    if (config.optimization.minimizer) {
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: true,      // Remove console.log in production
              drop_debugger: true,     // Remove debugger statements
              pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          parallel: true,
          extractComments: false
        }),
        ...config.optimization.minimizer
      ];
    }
  }

  return config;
};