#!/usr/bin/env node

/*!
  Update a "random" parameter for all <script> and CSS includes in "index.html". Plus, add version.

  @copyright Nick Freear, 15-November-2017.
  @link  http://www.nquire-it.org/version.json
*/

const replace = require('replace');
const version = require('./../static/src/version.json');
const INDEX_HTML = path('/../static/src/index.html');
const CONFIG_JS  = path('/../static/src/js/app/config.js');
const RAND = getRandomInt(11, 1000);

console.warn('Version.json ~ describe, rand:', version.describe, RAND);

replace({
  paths: [ INDEX_HTML ],
  regex: /\.(css|js)\?r=(_RAND_|[^\"]+)/g,
  replacement: '.$1?r=' + RAND,
  count: true,
  recursive: false
});

replace({
  paths: [ INDEX_HTML ],
  regex: /content="nQuire-it\/(_VERSION_|[^\"]+)"/,
  replacement: 'content="nQuire-it/%s"'.replace(/%s/, version.describe),
  count: true,
  recursive: false
});

replace({
  paths: [ CONFIG_JS ],
  regex: /version: ['"][\w_\.\-]+['"],/,
  replacement: 'version: "%s",'.replace(/%s/, version.describe),
  count: true,
  recursive: false
});

replace({
  paths: [ CONFIG_JS ],
  regex: /build_time: ['"][\w_\.\-:]+['"],/,
  replacement: 'build_time: "%s",'.replace(/%s/, new Date().toISOString()),
  count: true,
  recursive: false
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function path (file) {
  return require('path').join(__dirname, file);
}
