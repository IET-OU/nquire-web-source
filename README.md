
[![Build status — Travis-CI][travis-icon]][travis] [![License: GPL][gpl-icon]][LICENSE]
[![Code Climate][climate-icon]][climate]
[![Translation status][weblate-icon]][weblate]


# nQuire-it

nQuire-it is a web application that allows users to create, manage and complete
scientific projects based on their interests. It is linked with [Sense-it][], an Android
app to collect data from Android device sensors.

* <http://www.nquire-it.org>


Requirements
------------

This Web app is built on [Spring 4.0][] and [AngularJS][].
Other dependencies are listed in the file [`app/pom.xml`][].
Client-side & Javascript dependencies are listed in [`package.json`][].

* See the compiled Java: [`IET-OU/nquire-web-compiled`][]

I18N
----

Updating the .PO files requires grunt.

```
npm install -g grunt-cli
npm install grunt --save-dev
npm install grunt-angular-gettext --save-dev
```

To add a new user-interface language, ensure that it is listed in:

* [`Gruntfile.js`][]
* [`static/src/js/app/config.js`][]

It will then need to be added to our Weblate translation server.

Licence
-------

nQuire-it is released under the GPLv3 licence. See [LICENSE][] for more details.

Releases
--------

16-03-2014
Added support for:
 - uploading data from Sense-it.
 - user-defined plots.
 - custom fields in data table.


## Acknowledgements

* Original developer: [Eloy Villasclaras / @evilfer][eloy]
* Research [funding][]


<!-- [![Sense-it][sense-it-icon]][Sense-it] -->


---
[nQuire-it][]: © 2014-2017 [The Open University][ou]. ([Institute of Educational Technology][iet])


[`app/pom.xml`]: https://github.com/IET-OU/nquire-web-source/blob/1.2-branch/app/pom.TEMPLATE.xml
[`package.json`]: https://github.com/IET-OU/nquire-web-source/blob/1.2-branch/package.json#L20-L29
    "Client-side 'dependencies' in package JSON."
[`Gruntfile.js`]: https://github.com/IET-OU/nquire-web-source/blob/1.2-branch/Gruntfile.js#L107-L111
    "'locales' list in Gruntfile."
[`static/src/js/app/config.js`]: https://github.com/IET-OU/nquire-web-source/blob/1.2-branch/static/src/js/app/config.js.DIST.html#L33-L44
    "'langs' list in config.JS template."
[nQuire-it]: https://github.com/IET-OU/nquire-web-source
[`IET-OU/nquire-web-compiled`]: https://github.com/IET-OU/nquire-web-compiled
[Sense-it]: https://play.google.com/store/apps/details?id=org.greengin.sciencetoolkit "Android app"
[sense-it-icon]: https://lh5.ggpht.com/SN_LLof2UbhxolOJ6IwnjkOLYLVXTpY3CpIDHzEOBbqPH-xiECx26XftvRmlgqvRl2Q=w300-rw
[eloy]: https://github.com/evilfer
[iet]: http://iet.open.ac.uk/
[ou]: http://www.open.ac.uk/
[funding]: http://www.nquire-it.org/#/about "Research funding: Nominet Trust"
[gpl]: https://gnu.org/licenses/gpl.html
[LICENSE]: https://github.com/IET-OU/nquire-web-source/blob/master/LICENSE.txt
    "GNU General Public License 3.0 onwards [GPL-3.0+]"
[gpl-icon]: https://img.shields.io/badge/license-GLP--3.0%2B-blue.svg
[travis]:  https://travis-ci.org/IET-OU/nquire-web-source
[travis-icon]: https://api.travis-ci.org/IET-OU/nquire-web-source.svg
    "Build status – Travis-CI (Node/Npm + Java/Maven)"
[climate]: https://codeclimate.com/github/IET-OU/nquire-web-source
    "Code Climate score [GPA, out of 4]"
[climate-icon]: https://codeclimate.com/github/IET-OU/nquire-web-source/badges/gpa.svg
[weblate]: http://weblate.iet.open.ac.uk/projects/nquire-it?utm_source=widget
    "Translation status [percent]"
[weblate-icon]: http://weblate.iet.open.ac.uk/widgets/nquire-it/-/shields-badge.svg

[Spring 4.0]: http://projects.spring.io/spring-framework "Spring Java framework"
[AngularJS]: https://angularjs.org/


[End]: //end.
