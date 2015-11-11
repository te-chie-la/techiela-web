+++
menu = "main"
title = "Create Blog using Pelican and deploy in github pages"
date = "2014-07-07T18:30:00Z"
Description = "How to create your Pelican Blog and deploy on github pages"
Tags = ["pelican"]
Categories = ["python"]

+++

This website has been created using pelican. 
[Pelican](http://pelican.readthedocs.org/) is static site 
generator written in Python.

Basically the needs for the project were:

* Easy deployment and mantainance
* Write articles using Markdown
* Code syntax highlighting

After a quick research in order to select the framework 
to use in order to keep things simple, Pelican had all the features needed.

## Generation of website 

Pelican is really easy to start with. You just need to create your project and 
install pelican:

```console  
$ pip install pelican
```

If you want to use markdown you will need to install it as a dependency also:

```console
$ pip install markdown
```

Once you have installed pelican the only thing you need to do is generate the 
skeleton of the blog:

```console 
$ pelican-quickstart
```

It will prompt several questions about your site. Pelican automatically 
generates some files as a fabric script and a Makefile to make even easiers 
your deployments.

Once this is done you will need to start writing your content under the 
content folder. You can add subfolders to the content folder and the names 
of the subfolders will be used as categories for your blogs.

Once you have your article generated ([sample file](https://github.com/raulcd/fonti/blob/master/content/articles/generate_pelican_blog.md)) is time to generate 
your site. There are several ways to generate your code:

```console 
$ pelican content
# Or you can use the generated Makefile
$ make html
```

The next Exception was raised because my locale settings were 
not set:

```python
File ".../lib/python2.7/locale.py", line 443, in _parse_localename
    raise ValueError, 'unknown locale: %s' % localename
ValueError: unknown locale: UTF-8
```

You can set your locale for your user (modifying your .bash_profile) or 
for the session:

```console 
$ export LC_ALL=en_UK.UTF-8
$ export LANG=en_UK.UTF-8
```

Once you have generated your content you can run a Development server 
to see the result:

```console
$ make serve
```

And you will be able to access localhost on the port 8000 by default 
to see the result.

## Deployment in github pages

There are 
[two types of github pages](https://help.github.com/articles/user-organization-and-project-pages). 
Project and user ones. If you want 
to deploy to your project you can use the *github* target on the Makefile:

```console
$ make github
```

This will post to the github pages branch of your repository.

But if you want to use the github pages under ***username.github.com*** you 
will need to do something more.

First of all you need to have a repository with your username at github. The 
repository needs to be called ***username.github.io*** in my case 
***raulcd.github.io***.

In order to make the process easier you can use the 
[GitHub Pages Import](https://github.com/davisp/ghp-import). You can install 
it using pip:

```console
$ pip install ghp-import
```

And to deploy you will need to run the next commands:

```console
$ make html
$ ghp-import output
$ git push git@github.com:username/username.github.io.git gh-pages:master
```

You can also modify your Makefile to run the github target executing the 
previous commands.

Your code will be deployed and after some minutes it will be availabe at 
***http://username.github.com***.

If you have your own domain and want it to be redirected to your github pages 
you will need to create a `CNAME` file and deploy on github pages.

Create a directory `content/extra` and a file named `CNAME` (upper case) with 
the domain you want to redirect:

```console
$ cat CNAME
yourdomain.com
```

The you can use the `STATIC_PATHS` on the `pelicanconf.py` file to tell pelican 
to deploy the `CNAME` file in the root directory when generating the content:

```python
STATIC_PATHS = ['extra/CNAME']
EXTRA_PATH_METADATA = {'extra/CNAME': {'path': 'CNAME'},}
```

You will need to configure an `A`, an `ALIAS` or a `CNAME` record on your DNS 
provider to do the DNS redirection. You can see more info on the 
[github pages domain configuration](https://help.github.com/articles/adding-a-cname-file-to-your-repository).
