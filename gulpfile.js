/**
 * Created by caotao on 2019/9/4.
 */
const gulp = require("gulp");
const sftp = require("gulp-sftp");

/**
 * 发布代码到开发服务器上
 * **/
gulp.task('deploy', function () {
    return gulp.src('dist/**')
        .pipe(sftp({
            host: '49.235.64.70',
            user: 'root',
            pass:'liding2019@root',
            remotePath : '/usr/share/nginx/html/'
        }))
})

gulp.task("default", ["deploy"]);