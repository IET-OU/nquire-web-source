/*!
  Output version.JSON containing Git commit & other version info.

  @copyright Nick Freear, 22 March 2016.
  @see https://gist.github.com/nfreear/be980ef2491b3e2a74c3
  @see https://github.com/IET-OU/open-media-player-core/blob/master/src/Gitlib.php
*/

// `npm install simple-git --save-dev`

var directory = __dirname + '/..'
  , json_file = directory + '/static/src' + '/version.json'
  , git = require('simple-git')(directory)
  , fs = require('fs')
  , execSync = require('child_process').execSync
  , version = {
    '#': 'ok',
    file_date: new Date().toISOString(),
    lib: 'simple-git.js'
  };

if (process.argv[ process.argv.length - 1 ] === '--all') {
  version.npm_version = exec('npm --version');
  version.mvn_version = exec('mvn --version', true);
  version.node_version = process.version;
}
version.describe = exec('git describe --all --tags');
version.branch = exec('git symbolic-ref --short HEAD');


git.log([ '-1' ], function (err, data) {
  handleError(err, 'git.log');

  var log = data.latest;

  version.commit = log.hash;
  version.date = log.date;
  version.message = log.message;
  version.author = '%s <%m>'.replace(/%s/, log.author_name).replace(/%m/, log.author_email);
})
.listRemote([ '--get-url' ], function (err, data) {
  handleError(err, 'git.listRemote');

  version.origin = data.replace(/\n/, '');
})
.then(function () {
  fs.writeFileSync(json_file, JSON.stringify(version, null, '\t'));
  console.log('File written: version.json');
});


// === Utilities ===

function exec(command, split) {
  var out = execSync(command).toString('utf-8').replace(/\n$/, '');
  return split ? out.split(/\n/) : out;
}

function handleError(err, where) {
  if (err) {
    console.log("ERROR! Where: " + (where || '?'));
    console.log(err);
    process.exit(1);
  }
}

//End.
