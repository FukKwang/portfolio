const { src, dest, series, parallel } = require('gulp');
const postcss = require('gulp-postcss')
const purgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano')
const del = require('del')

function clean() {
    return del(['live/**', '!live'])
}

function copySrcToLive() {
    return src('src/*.html').pipe(dest('live/'))
}

function talwindCss() {
    return src('src/style.css').pipe(
        postcss([
            require('tailwindcss'),
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
    .pipe(dest('live/'))
}

exports.default = series(clean, parallel(copySrcToLive, talwindCss));