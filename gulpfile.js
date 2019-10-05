const { src, dest, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const del = require('del');
const tailwindcss = require('tailwindcss');

function clean() {
    return del(['live/**', '!live'])
}

function html() {
    return src('src/*.html').pipe(dest('live/'))
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
    .pipe(dest('live/'))
}

exports.default = series(clean, parallel(html, css));