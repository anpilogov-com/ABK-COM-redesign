//Подключаем gulp
const gulp = require("gulp");
//Для препроцессоров стилей
const sourcemaps = require("gulp-sourcemaps");
//Обозреватель изменений
const watch = require("gulp-watch");
//Объединение файлов
const concat = require("gulp-concat");
//Sass препроцессор
const sass = require("gulp-sass")(require("sass"));
//Модуль переименовывания файлов
const rename = require("gulp-rename");
//Удаление файлов
const del = require("del");
//Оптимизация векторных изображений
const svgo = require("gulp-svgo");
//Оптимизация скриптов
const modernizr = require("gulp-modernizr");
//Оптимизация разметки
const htmlmin = require("gulp-htmlmin");
//Оптимизация стилей
const cssmin = require("gulp-cssmin");
//Преобразователь шрифтов
const fonter = require("gulp-fonter");
//Конветация в woff
const ttf2woff = require("gulp-ttf2woff");
//Конвертация в woff2
const ttf2woff2 = require("gulp-ttf2woff2");
const { async } = require("q");

//--------------------------------------------------------
//  Пути ветки SOURCE
//--------------------------------------------------------

//Директории стилей
const srcStyleFiles = [
   "./src/styles/scss/color.scss",
   "./src/styles/scss/style.scss",
   "./src/styles/scss/font.scss",
   "./src/styles/scss/**/*.scss",
];

//Директории шрифтов и начертаний
const srcFontsOtfFiles = "./src/fonts/origin/**/*.otf";
const srcFontsTtfFiles = "./src/fonts/origin/**/*.ttf";

//Директория векторной графики
const srcSVGFiles = "./src/img/origin/**/*.svg";

//Директория стилей (минификация)
const srcMinStyleFiles = "./src/styles/css/**/*.css";

//Директория скриптов (минификация)
const srcMinJsFiles = "./src/js/**/*.js";

//Директория разметки (минификация)
const srcMinHtmlFiles = ["./src/**/*.html", "./src/pages/**/*.html"];

//Конечная директория стилей
const srcStyleDestination = "./src/styles/css/";

//Конечная директория шрифтов
const srcFontsDestination = "./src/fonts/";

//Конечная директория векторной графики
const srcSVGDestination = "./src/img/squoosh/";

//--------------------------------------------------------
//  Пути ветки PUBLIC
//--------------------------------------------------------

//Конечная директория стилей
const publicStyleDestination = "./public/styles/css/";

//Конечная директория шрифтов
const publicFontsDestination = "./public/fonts/";

//Конечная директория векторной графики
const publicSVGDestination = "./public/img/squoosh/";

//Конечная директория стилей (минификация)
const publicMinStyleFiles = "./public/styles/css/";

//Конечная директория скриптов (минификация)
const publicMinJsFiles = "./public/js/";

//Конечная директория разметки (минификация)
const publicMinHtmlFiles = ["./public/"];

//--------------------------------------------------------
//  Автономные задачи для однократного выполнения
//--------------------------------------------------------

/** Препроцессор SCSS и задачи конвертации в CSS */

//Задача для разработки
gulp.task("s-gen-scss", () => {
   return gulp
      .src(srcStyleFiles)
      .pipe(sourcemaps.init())
      .pipe(concat("index.css"))
      .pipe(sass().on("Error: ", sass.logError))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(srcStyleDestination));
});

//Задача для публикации
gulp.task("p-gen-scss", () => {
   return gulp
      .src(srcStyleFiles)
      .pipe(sourcemaps.init())
      .pipe(concat("index.css"))
      .pipe(sass().on("Error: ", sass.logError))
      .pipe(cssmin())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(publicStyleDestination));
});

/** Преобразование файлов шрифтов в woff* */

//Задачи для разработки
gulp.task("s-gen-ttf", () => {
   return gulp
      .src(srcFontsOtfFiles)
      .pipe(fonter({ formats: ["ttf"] }))
      .pipe(gulp.dest(srcFontsDestination));
});

gulp.task("s-gen-font", async () => {
   await gulp
      .src([srcFontsTtfFiles])
      .pipe(ttf2woff())
      .pipe(gulp.dest(srcFontsDestination));
   return gulp
      .src([srcFontsTtfFiles])
      .pipe(ttf2woff2())
      .pipe(gulp.dest(srcFontsDestination));
});

//Задача для публикации
gulp.task("p-gen-font", async () => {
   await gulp
      .src(srcFontsOtfFiles)
      .pipe(fonter({ formats: ["ttf"] }))
      .pipe(gulp.dest(publicFontsDestination));
   await gulp
      .src([srcFontsTtfFiles])
      .pipe(ttf2woff())
      .pipe(gulp.dest(publicFontsDestination));
   await gulp
      .src([srcFontsTtfFiles])
      .pipe(ttf2woff2())
      .pipe(gulp.dest(publicFontsDestination));
});

/** Оптимизация векторной графики */

//Задачи для разработки
gulp.task("s-gen-svgo", async () => {
   return gulp.src(srcSVGFiles).pipe(svgo()).pipe(gulp.dest(srcSVGDestination));
});

//Задача для публикации
gulp.task("p-gen-svgo", async () => {
   return gulp
      .src(srcSVGFiles)
      .pipe(svgo())
      .pipe(gulp.dest(publicSVGDestination));
});

/** Минификация фалов проекта */

//Минификация JS файлов
gulp.task("min-js", async () => {
   return gulp
      .src(srcMinJsFiles)
      .pipe(modernizr())
      .pipe(gulp.dest(publicMinJsFiles));
});

//Минификация HTML файлов
gulp.task("min-html", async () => {
   return gulp
      .src(srcMinHtmlFiles)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(publicMinHtmlFiles));
});

//Минификация СSS файлов
gulp.task("min-css", async () => {
   gulp
      .src(srcMinStyleFiles)
      .pipe(cssmin())
      .pipe(rename({ suffix: ".min" }))
      .pipe(gulp.dest(publicMinStyleFiles));
});

//Таск для очистки папки build
gulp.task("p-clear", async () => {
   return del(["./public/*"]);
});

//--------------------------------------------------------
//  Задачи обозреватели. Отслеживают изменяемые файлы.
//--------------------------------------------------------

gulp.task("observe", () => {
   gulp.watch("./src/styles/scss/**/*.scss", gulp.series("s-gen-scss"));
   gulp.watch("./source/img/basic/icons/**/*.svg", gulp.series("s-gen-svgo"));
});

gulp.task("observe-scss", () => {
   gulp.watch("./src/styles/scss/**/*.scss", gulp.series("s-gen-scss"));
});

gulp.task("observe-svgo", () => {
   gulp.watch("./src/img/origin/**/*.svg", gulp.series("s-gen-svgo"));
});

//--------------------------------------------------------
//  Команды по умолчанию. Создание/Отслеживание/Публикация
//--------------------------------------------------------
gulp.task(
   "default",
   gulp.series("p-clear", gulp.parallel("s-gen-scss", "s-gen-svgo"), "observe")
);

gulp.task(
   "build",
   gulp.series(
      "p-clear",
      gulp.parallel("p-gen-scss", "p-gen-font", "p-gen-svgo"),
      "min-js",
      "min-html"
   )
);
