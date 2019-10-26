const { src, dest, series, parallel, watch, task } = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const del = require('del');
const browserSync = require('browser-sync').create();
const tailwindcss = require('tailwindcss');

function clean() {
    return del(['docs/**', '!docs'])
}

function html() {
    return src('src/*.html').pipe(dest('docs/'))
}

function css() {
    return src('tailwind.css').pipe(
        postcss([
            tailwindcss,
            cssnano({
                preset: 'default',
            }),
            purgecss({
                content: ['src/*.html'],
                extractors: [
                    {
                        extractor: class {
                            static extract(content) {
                                return content.match(/[\w-/:]+(?<!:)/g) || []
                            }
                        },
                        extensions: ['html']
                    }
                ]
            }),
            require('autoprefixer'),
            require('cssnano'),
        ])
    )
    .pipe(rename('style.css'))
    .pipe(dest('docs/'))
}

function jpg() {
    return src('src/asset/*.jpg').pipe(imagemin([imageminMozjpeg()])).pipe(dest('docs/asset/'));
}

function serve() {
    return browserSync.init({ server: { baseDir: 'src' } });	
}

exports.default = series(clean, parallel(html, css, jpg));
exports.dev = () => {
	serve();
	watch('src/*.html', { events: 'all' }, (done) => { browserSync.reload(); done(); });
};

