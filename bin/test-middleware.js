/*!
  Mock API for testing ('npm start' / live-server)

  @copyright Nick Freear, 2019.

  Inspiration! ~~ https://github.com/tapio/live-server/blob/master/middleware/spa-ignore-assets.js
*/

const API_REGEX = /\/api\/(security\/status|filter|text)/;

const API_PAYLOAD = {
  "security\/status": { "logged": false, "profile": null, "connections": {}, "token": null, "responses": {} },
  'filter': [
    { "id":4292636, "label":"Virtual Microscope", "query":"virtual-microscope", "isoDate":"2017-10-25T15:30:07Z" },
    { "id":4259840, "label":"Weather", "query":"weather-it", "isoDate":"2017-10-16T07:32:19Z" }
  ],
  'text': {
    about: "<p>Please send your comments and suggestions for improving this site to: ... <p>Our aim is to help you explore your world <p> ...",
    about_el: "<p>Για σχόλια και εισηγήσεις για τη βελτίωση της πλατφόρμας μπορείτε να επικοινωνήσετε μαζί μας στο: <p> ...",
    about_es: "<p>Por favor envíen sus comentarios y sugerencias para mejorar este sitio a: <p> ... ",

    createSenseIt: "<ul><li>Is there something you are curious about? Do you seek answers to who, what, when, where and how?</li>",

    headerSubtitle: "Join missions to explore your world...",
    headerSubtitle_el: "Γίνετε μέλη σε αποστολές για να εξερευνήσετε τον κόσμο σας...",
    headerSubtitle_es: "Unirse a las misiones para explorar el mundo...",

    notepad: "<p>Today's maintenance is complete — thanks for your patience! ... <p>Για σχόλια και εισηγήσεις για τη ...",

    nquireTeaser: "<p>View the video to get  started!</p> <p>...",
    nquireTeaser_el: "<p>Δείτε το βίντεο προτού ξεκινήσετε!</p> <p> ...",
    nquireTeaser_es: "<p>Ver el video para comenzar</p> <p> ...",

    nquireVideo: "https://www.youtube.com/watch?v=wmdxny0cuwk",
    nquireVideo_es: "https://www.youtube.com/watch?v=jx2ArOMlmf8",

    siteMessage: "TESTING ... TESTING ...",
    X_siteMessage_el: ""
  }
};

// ---------------------------------------------------------------------------

module.exports = function(req, res, next) {

  let urlMatches = req.url.match(API_REGEX);

  res.setHeader('X-test-middleware-00', urlMatches ? 'match=' + urlMatches[ 1 ] : 'PASS');

  if (urlMatches) {
    res.statusCode = 200;
    // res.setHeader('X-test-middleware-01', 'handling');
    res.setHeader('Content-Type', 'application/json');

    res.write(getResponseJson(urlMatches[ 1 ]), 'utf8');
    res.end();

    // res.status(200).json(getResponseJson()).end()

  } else {
    next();
  }

  function getResponseJson (path) {
    if (API_PAYLOAD[ path ]) { // path in API_PAYLOAD) {
      return JSON.stringify(API_PAYLOAD[ path ]);
    }
  }

	/* if (req.method !== "GET" && req.method !== "HEAD")
		next();
	if (req.url !== '/') {
		var route = req.url;
		req.url = '/';
		res.statusCode = 302;
		res.setHeader('Location', req.url + '#' + route);
		res.end();
	}
	else next(); */

};
