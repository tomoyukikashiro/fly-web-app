/**
 *
 *  fly web app
 *  web starter kit using fly.js
 */

import browserSync from 'browser-sync'
const reload = browserSync.reload

/* ***************************************************
 * task sequence
 * **************************************************/

// Build all staff
export default function* () {
  yield this.start(["clean"])
  yield this.start(["eslint", "copy", "script", "style", "html"], {parallel: true})
}

// Watch files for changes & reload
export function* serve() {
  yield this.start(["default", "_serve", "_watch"])
}

//Build and serve the output from the dist build
export function* serve_dist() {
  yield this.start(["default", "_serve_dist"])
}

/* ***************************************************
 * tasks
 * **************************************************/

// Lint javascript
export function* eslint() {
  yield this.source("app/scripts/**/*.js").eslint()
}

// Copy all files at the root level (app)
export function* copy() {
  yield this.
    source([
      "app/images/*"
    ])
    .target("dist/images/")
}

// Scan your HTML for assets & optimize them
export function* html() {
  yield this
    .source("app/index.html")
    .useref() 
    .target("dist/");
}

// 
export function* script() {
  yield this
    .source([
      'app/scripts/main.js'
    ])
    .uglify()
    .concat("main.min.js")
    .target("dist/scripts/");
}

// Clean output directory
export function* clean() {
  yield this.clear([".tmp", "dist"]);
}

// Compile and automatically prefix stylesheets
export function* style() {
  const AUTOPREFIXER_BROWSERS = [
    "ie >= 10",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4.4",
    "bb >= 10"
  ];

  yield this
    .source("app/styles/main.scss")
    .sass({
      outputStyle: "compressed",
      includePaths: ["app/styles/imports/"],
    })
    .concat("main.css")
    .target([".tmp/styles/", "dist/styles/"]);
}

// Reload browser
export function* refresh() {
  reload()
}

// Launch loacl serve at develop directory
export function* _serve() {
  browserSync({
    notify: false,
    logPrefix: ' ✈ ',
    scrollElementMapping: ['main'],
    server: ['.tmp', 'app']
  });
}

// Launch loacl serve at built directory
export function* _serve_dist() {
  browserSync({
    notify: false,
    logPrefix: ' ✈ ',
    scrollElementMapping: ['main'],
    server: 'dist'
  });
}

// Watch files for changes
export function* _watch() {
  yield this.watch("app/index.html", "refresh")
  yield this.watch("app/styles/**/*.scss", ["style", "refresh"]);
}
