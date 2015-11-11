Installation
============

* Install dependencies for grunt

```
npm install
```

* Install python dependencies for jinja2

```
pip install -r requirements.txt
```

* Install bower dependencies

```
bower install
```

* And run it!

```
grunt
```



Development
==========

* Install the liveReload plugin for your browser
* Type `grunt` to start watching
* Add any new html templates into `app/src/templates/`, see changes happen live
* `app/src/templates/common/base.html` contains the general template for the whole site
* Add any css changes into `app/src/stylesheets/main.scss`, see changes happen live
* You may want to place your variables in `app/src/stylesheets/_variables.scss`
* Generate the site using `grunt dev`
* ...
* Profit!



Production
==========

Run:

```
grunt prod
```

Collect your site code in `app/public/`
