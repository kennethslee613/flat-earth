const { src, dest } = require('gulp');

function defaultTask() {
  return src('node_modules/three/build/three.js')
    .pipe(src('node_modules/three/examples/js/controls/OrbitControls.js'))
    .pipe(dest('build/'));
}

exports.default = defaultTask;