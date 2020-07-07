var gulp = require("gulp"),
	sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssnano = require("cssnano"),
	sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();
var paths = {
	styles: {
		// By using styles/**/*.sass we're telling gulp to check all folders for any sass file
		src: "src/sass/*.sass",
		// Compiled files will end up in whichever folder it's found in (partials are not compiled)
		dest: "src/css"
	},
}

function style() {
	return (
		gulp
			.src(paths.styles.src)
			.pipe(sourcemaps.init())
			.pipe(sass())
			.on("error", sass.logError)
			.pipe(postcss([autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}), cssnano()]))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.styles.dest))
			// Add browsersync stream pipe after compilation
			.pipe(browserSync.stream())
	);
}
function reload() {
	browserSync.reload();
}
// Add browsersync initialization at the start of the watch task
function watch() {
	browserSync.init({
		// You can tell browserSync to use this directory and serve it as a mini-server
		server: {
			baseDir: "./src"
		}
		// If you are already serving your website locally using something like apache
		// You can use the proxy setting to proxy that instead
		// proxy: "yourlocal.dev"
	});
	gulp.watch(paths.styles.src, style);
	// gulp.watch("src/*.html", reload);
	gulp.watch("src/*.html").on('change', reload);
}

exports.watch = watch;