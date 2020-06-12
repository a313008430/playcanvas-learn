const gulp = require("gulp"),
  ts = require("rollup-plugin-typescript2"),
  rollup = require("rollup");

gulp.task("ts", () => {
  return rollup
    .rollup({
      input: "./src/app.ts",
      plugins: [
        ts({
          tsconfig: "./tsconfig.json",
        }),
      ],
    })
    .then((e) => {
      return e.write({
        file: "./dist/index.js",
        format: "umd",
        name: "Game",
      });
    });
});

gulp.task("watch", () => {
  gulp.watch("./src/**/*.ts", gulp.parallel("ts"));
});
