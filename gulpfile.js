const gulp = require('gulp');
const util = require('debug-tool-express');
const git = require('gulp-git');
const gitignore = require('gulp-gitignore');
const argv = require('yargs').argv;
const fs = require('fs');

const src = gulp.src('./*').pipe(gitignore());
const pkg = JSON.parse(fs.readFileSync('./package.json'));

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
  const newVer = util.updateVer.updateManual(pkg.version, argv.r);
  if (newVer !== 'Invalid release type.') {
    pkg.version = newVer;

    const updatedPackage = JSON.stringify(pkg, null, '  ');
    fs.writeFile('./package.json', updatedPackage);
  } else {
    throw new Error('Invalid release type');
  }
});

gulp.task('addCommit', ['add', 'commit']);

gulp.task('tag', () => {
  if (argv.m) {
    git.tag(pkg.version, argv.m, (err) => { if (err) throw err; });
    return `Added tag ${pkg.version} with message ${argv.v}.`;
  } else if (argv.vm) {
    git.tag(pkg.version, argv.vm, (err) => { if (err) throw err; });
    return `Added tag ${pkg.version} with message ${argv.vm}.`;
  }
  git.tag(pkg.version, `Added version ${pkg.version} tag.`, (err) => { if (err) throw err; });
  return `Added tag ${pkg.version}`;
});

gulp.task('push', () => {
  git.push('origin', argv.b, { args: ' --tags' }, (err) => { if (err) throw err; });
});

gulp.task('release', ['updateVer', 'addCommit', 'tag', 'push']);
