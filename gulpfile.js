const gulp = require('gulp');
const util = require('debug-tool-express');
const git = require('gulp-git');
const gitignore = require('gulp-gitignore');
const argv = require('yargs').argv;
const fs = require('fs');

const src = gulp.src('./*').pipe(gitignore());
const package = JSON.parse(fs.readFileSync('./package.json'));
const version = package.version;

gulp.task('release', () => {
  return src.pipe(git.add());

  util.updateVer.updateAuto('patch');
});

gulp.task('add', () => src.pipe(git.add()));

gulp.task('commit', () => {
  if (argv.m) {
    src.pipe(git.commit(argv.m));
    return `Commit successful with message ${argv.m}`;
  }
  src.pipe(git.commit('Revisions added.'));
  return 'Commit successful without message.';
});

gulp.task('updateVer', () => {
  newVer = util.updateVer.updateManual(version, argv.r);
  if (newVer !== 'Invalid release type.') {
    package.version = newVer;
    updatedPackage = JSON.stringify(package, null, '  ');
    fs.writeFile('./package.json', updatedPackage)
  } else {
    throw 'Invalid release type';
  }
});

gulp.task('addCommit', ['add', 'commit']);

gulp.task('tag', () => {
  if (argv.m) {
    git.tag(version, argv.v, (err) => { if (err) throw err; });
    return `Added tag ${version} with message ${argv.v}.`;
  } else if (argv.vm) {
    git.tag(version, argv.vm, (err) => { if (err) throw err; });
    return `Added tag ${version} with message ${argv.vm}.`;
  }
  git.tag(version, `Added version ${version} tag.`, (err) => { if (err) throw err; });
  return `Added tag ${version}`;
});

gulp.task('push', () => {
  git.push('origin', argv.b);
})

gulp.task('release', ['updateVer', 'addCommit', 'tag','push']);
