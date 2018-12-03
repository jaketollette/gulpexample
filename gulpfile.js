/// <binding BeforeBuild='default' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream");

var paths = {
    webroot: "./wwwroot/"
};

var deps = {
    "jquery": {
        "dist/*": ""
    },
    "bootstrap": {
        "dist/**/*": ""
    },
    "@fortawesome/fontawesome-free": {
        "css/*": "css",
        "js/*": "js",
        "sprites/*": "sprites",
        "webfonts/*": "webfonts"
    },
    "jquery-validation": {
        "dist/*": ""
    },
    "jquery-validation-unobtrusive": {
        "dist/*": ""
    }
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "js/site.min.css";

gulp.task("minify",
    function () {
        var streams = [
            gulp.src(["wwwroot/js/*.js"])
                .pipe(uglify())
                .pipe(concat("site.min.js"))
                .pipe(gulp.dest("wwwroot/js")),
            gulp.src(["wwwroot/css/*.css"])
                .pipe(cssmin())
                .pipe(concat("site.min.css"))
                .pipe(gulp.dest("wwwroot/css"))
        ];

        return merge(streams);
    });

gulp.task("clean",
    function (cb) {
        return rimraf("wwwroot/lib/", cb);
    });

gulp.task("scripts", function () {
    var streams = [];

    for (var prop in deps) {
        console.log("Prepping scripts for " + prop);

        if (prop === "@fortawesome/fontawesome-free") {
            console.log("Special stuff for fontawesome");
            for (var itemProp in deps[prop]) {
                streams.push(gulp.src("node_modules/" + prop + "/" + itemProp)
                    .pipe(gulp.dest("wwwroot/lib/fontawesome/" + deps[prop][itemProp])));
            }
        } else {
            for (var itemProp in deps[prop]) {
                streams.push(gulp.src("node_modules/" + prop + "/" + itemProp)
                    .pipe(gulp.dest("wwwroot/lib/" + prop + "/" + deps[prop][itemProp])));
            }
        }
    }

    return merge(streams);
});

gulp.task("default", gulp.series('clean', 'scripts', 'minify'));