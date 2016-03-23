/*!
  Output version.JSON containing Git commit & other version info.

  @copyright Nick Freear, 22 March 2016.
  @see https://gist.github.com/nfreear/be980ef2491b3e2a74c3
  @see https://github.com/IET-OU/open-media-player-core/blob/master/src/Gitlib.php
*/

// USAGE:  npm install simple-git --save-dev && node bin/git-version.js --all

var directory = __dirname + '/..'
  , json_file = directory + '/static/src' + '/version.json'
  , git = require('simple-git')(directory)
  , fs = require('fs')
  , execSync = require('child_process').execSync
  , carryon = true
  , version = {
    '#': 'ok',
    file_date: new Date().toISOString(),
    lib: 'git-version.js'
  };

if (matchArgv('--all')) {
  version.extend = {
    node_version: process.version,
    npm_version: exec('npm --version', null, carryon),
    mvn_version: exec('mvn --version', true, carryon),
    git_version: exec('git --version').replace(/(git )?(version )?/, '')
  };
}
version.describe = exec('git describe --tags', null, carryon);
version.branch = exec('git rev-parse --abbrev-ref HEAD');
version.origin = exec('git config --get remote.origin.url');
version.url = version.origin.replace(/git@/, 'https://').replace('.com:', '.com/');

git.log([ '-1' ], function (err, data) {
  handleError(err, 'git.log');

  var log = data.latest;

  version.commit = log.hash;
  version.date = log.date;
  version.message = log.message;
  version.author = '%s <%m>'.replace(/%s/, log.author_name).replace(/%m/, log.author_email);
})
.then(function () {
  fs.writeFileSync(json_file, JSON.stringify(version, null, '\t'));
  console.error('File written: version.json');
});


// === Utilities ===

function exec(command, split, carryon) {
  var out;
  try {
    out = execSync(command).toString('utf-8').replace(/\n$/, '');
  } catch (ex) {
    console.error(ex.name + ': ' + ex.message);
    if (! carryon) {
      process.exit(1);
    }
  }
  return split && out ? out.split(/\n/) : out;
}

function handleError(err, where) {
  if (err) {
    console.error("ERROR! Where: " + (where || '?'));
    console.error(err);
    process.exit(1);
  }
}

function matchArgv(pattern) {
  var size = process.argv.length;
  return size > 2 && process.argv[ size - 1 ].match(pattern);
}

//End.
