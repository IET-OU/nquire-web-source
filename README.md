
[![Build status — Travis-CI][travis-icon]][travis] [![License][gpl-icon]][gpl.txt]
[![Translation status][weblate-icon]][weblate]


# nQuire-it

nQuire-it is a web application that allows users to create, manage and complete
scientific projects based on their interests. It is linked with Sense-it, an Android
app to collect data from Android device sensors.

* <http://www.nquire-it.org>


Requirements
------------

This app is build on Spring 4.0 and AngujarJS.
Other dependencies are listed in the file app/pom.xml

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

nQuire-it is released under the GPLv3 licence. See [gpl.txt][] for more details.

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


---
[nQuire-it][]: © 2014-2016 [The Open University][ou]. ([Institute of Educational Technology][iet])


[`Gruntfile.js`]: https://github.com/IET-OU/nquire-web-source/blob/greek/Gruntfile.js#L55-L59
[`static/src/js/app/config.js`]: https://github.com/IET-OU/nquire-web-source/blob/greek/static/src/js/app/config.js.DIST.html#L25-L49
[nQuire-it]: https://github.com/IET-OU/nquire-web-source
[eloy]: https://github.com/evilfer
[iet]: http://iet.open.ac.uk/
[ou]: http://www.open.ac.uk/
[funding]: http://www.nquire-it.org/#/about "Research funding: Nominet Trust"
[gpl]: https://gnu.org/licenses/gpl.html
[gpl.txt]: https://github.com/IET-OU/nquire-web-source/blob/master/gpl.txt
    "GNU General Public License 3.0 onwards [GPL-3.0+]"
[gpl-icon]: https://img.shields.io/badge/license-GLP--3.0%2B-blue.svg
[travis]:  https://travis-ci.org/IET-OU/nquire-web-source
[travis-icon]: https://api.travis-ci.org/IET-OU/nquire-web-source.svg
    "Build status – Travis-CI (Node/Npm + Java/Maven)"
[weblate]: http://weblate.iet.open.ac.uk/projects/nquire-it?utm_source=widget "Translation status"
[weblate-icon]: http://weblate.iet.open.ac.uk/widgets/nquire-it/-/shields-badge.svg

[End]: //end.
