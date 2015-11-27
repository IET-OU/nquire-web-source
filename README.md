nQuire-it
=================

nQuire-it is a web application that allows users to create, manage and complete
scientific projects of their own interest. It is linked with Sense-it, an Android
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
* [`static/src/js/app/app.js`][]

It will then need to be added to our Weblate translation server.

Licence
-------

nQuire-it is released under the GPLV3 licence. See the file 'gpl.txt' for more details.

Releases
--------

16-03-2014
Added support for:
 - uploading data from Sense-it.
 - user-defined plots.
 - custom fields in data table.


[`Gruntfile.js`]: https://github.com/IET-OU/nquire-web-source/blob/greek/Gruntfile.js#L40-L42
[`static/src/js/app/app.js`]: https://github.com/IET-OU/nquire-web-source/blob/greek/static/src/js/app/app.js#L219-L223
