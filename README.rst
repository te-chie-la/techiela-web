Installation
============

* Install dependencies for npm

```
npm install
```

* Install python dependencies for jinja2

```
pip install -r requirements.txt
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
* You may want to place your variables in app/src/stylesheets/_variables.scss
* ...
* Profit!



Production
==========

* Use the contents of `app/public/`