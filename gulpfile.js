// Require dependencies.
const gulp = require('gulp');
const util = require('debug-tool-express');
const git = require('gulp-git');
const gitignore = require('gulp-gitignore');
const argv = require('yargs').argv;
const fs = require('fs');
const runSequence = require('run-sequence');

// Task Global Vars.
const src = gulp.src('./*').pipe(gitignore());  // Git files without .gitignore files.
const pkg = JSON.parse(fs.readFileSync('./package.json')); // Package.JSON file contents.

gulp.task('add', () => src.pipe(git.add())); // Task to dd all changed files to git.

gulp.task('commit', () => { // Task to commit all files to get. Passing -m with a string adds a
// message.
  if (argv.m) { // If -m is passed use it.
    src.pipe(git.commit(argv.m));
    return `Commit successful with message ${argv.m}`;
  } // Otherwise use the default message.
  src.pipe(git.commit('Revisions added.'));
  return 'Commit successful without message.';
});

gulp.task('updateVer', () => { // Task to update the version in the package.JSON file.
  // Run with -r to pass the release type to the update function.
  // Create the new version with the update ver util using the -r passed to the task.
  const newVer = util.updateVer.updateManual(pkg.version, argv.r);
  if (newVer !== 'Invalid release type.') { // If the invalid release type error was not returned.
    pkg.version = newVer; // Set the version to the new version.

    const updatedPackage = JSON.stringify(pkg, null, '  '); // Stringify the pkg contents.
    fs.writeFile('./package.json', updatedPackage); // Write the stringified JSON to the package.json file.
  } else { // If the invalid release type error was returned throw an error.
    throw new Error('Invalid release type');
  }
});

gulp.task('addCommit', ['add', 'commit']); // Task to add and commit all files. -m can be used to
// pass a message here.

gulp.task('tag', () => { // Task to tag the current state with the version number. Can be passed a
// -vm version message.
  if (argv.vm) { // If there was a -vm version message passed use it.
    // Tag git with the version and the -vm message.
    git.tag(pkg.version, argv.vm, (err) => { if (err) throw err; });
    return `Added tag ${pkg.version} with message ${argv.vm}.`;
  } else if (argv.m) { // If there was a -m message passed use it.
    // Tag git with the version and the -m message.
    git.tag(pkg.version, argv.m, (err) => { if (err) throw err; });
    return `Added tag ${pkg.version} with message ${argv.m}.`;
  }
  // If there was no -vm or -m message then tag with the default message.
  git.tag(pkg.version, `Added version ${pkg.version} tag.`, (err) => { if (err) throw err; });
  return `Added tag ${pkg.version}`;
});

gulp.task('push', () => { // Task to push to git. Must pass a -b value to specify the branch.
  git.push('origin', argv.b, { args: ' --tags' }, (err) => { if (err) throw err; });
});

gulp.task('release', () => { // Creates a tagged push.
// Must pass a -b value to specify the branch. Must pass -r to determine the release and version
// incrementation. Can pass -vm for a version message and a -m for a commit message.
  runSequence('updateVer', 'addCommit', 'tag', 'push');
});
