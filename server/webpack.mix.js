const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */


mix.js('resources/assets/js/web/app.js', 'public/js/web')
  .postCss('resources/assets/css/web/app.css', 'public/css/web',[
      require('autoprefixer')({
        browsers: ['last 40 versions']
      })
  ]);

// mix.js('resources/assets/js/admin/app.js', 'public/js/admin')
//   .sass('resources/assets/sass/admin/app.scss', 'public/css/admin',[
//     require('autoprefixer')({
//       browsers: ['last 40 versions']
//     })
//   ]).sourceMaps();

mix.version();
