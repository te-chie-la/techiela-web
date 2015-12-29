+++
title = "How Python caches compiled bytecode."
date = "2015-03-17T11:30:00Z"
Description = "How is Python using the bytecode files and why?"
Tags = ["bytecode"]
Categories = ["python"]
author = "Raul Cumplido"

+++

While reading an email at the Python developers mailing list about PEP-488 (which is not yet approved and is under discussion) I wondered how bytecode files works in Python.

The purpose of this post is to take some notes for myself and share what I find.

## PEP-3147

While I was reading the proposed PEP-488 (which will be explained later) there was several references to [PEP-3147](https://www.python.org/dev/peps/pep-3147).

Before PEP-3147 was implemented, files were saved with the format `'{filename}.pyc'` (or .pyo) in the same directory where the source code was stored.

PEP-3147 was created as an extension to the Python import mechanism in order to improve sharing of compiled Python bytecode for different distributions with the sourcecode.

CPython compiles its source code into `bytecode`. For performance reasons Python doesn't recompile every time, so it caches the content of the compiled code. Python only recompiles when it realizes the source code file has changed. Python stores in the cached compiled file two 32bit big-endian digits which represents a ***magic number*** and a timestamp. The magic number changes every time the Python distribution changes the bytecode (for example adding new bytecode instructions to the virtual machine). This prevents causing problems when trying to execute compiled code for different virtual machines.

As some distributions have different versions of Python installed and users can install their different versions the previous mechanism doesn't allow to reuse the compiled files.

PEP-3147 extended this by creating on every package a `__pycache__` directory which can contain different versions of the compiled files. The format of the names is now `{filename}.{tag}.pyc`. The tag can be seen on the `imp module`:

```python
>>> import imp
>>> imp.get_tag()
'cpython-34'
```

The magic number used on the pyc files can also be found on this module:

```python
>>> imp.get_magic()
b'\xee\x0c\r\n'
```

As expected when using another version of Python the magic numbers change:

```python
Python 3.5.0a0 (default:c0d25de5919e, Jan 30 2015, 22:23:54)
[GCC 4.2.1 Compatible Apple LLVM 6.0 (clang-600.0.56)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import imp
>>> imp.get_tag()
'cpython-35'
>>> imp.get_magic()
b'\xf8\x0c\r\n'
```

PEP-3147 was introduced on python 3.2 if we try with Python 2.7.9 we can verify that `get_magic()` exists but not `get_tag()`:

```python
Python 2.7.9 (v2.7.9:648dcafa7e5f, Dec 10 2014, 10:10:46)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import imp
>>> imp.get_magic()
'\x03\xf3\r\n'
>>> imp.get_tag()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'module' object has no attribute 'get_tag'
```

This is why if we use Python2 we still see the `.pyc` or `.pyo` files amongst with our code:

```console
.
|-- __init__.py
|-- __init__.pyc
|-- api.py
|-- api.pyc
|-- module
|   |-- __init__.py
|   |-- __init__.pyc
|   |-- raul.py
|   |-- raul.pyc
```

If the PEP has been implemented we can see something like this:

```console
|-- meteora
|   |-- __init__.py
|   |-- __pycache__
|   |   |-- __init__.cpython-35.pyc
|   |   |-- __init__.cpython-34.pyc
|   |   |-- utils.cpython-35.pyc
|   |   `-- utils.cpython-34.pyc
|   `-- utils.py
```

## To recompile or not to recompile

The next diagram has been extracted directly from the PEP-3147 which explains clearly what is the workflow to load/compile the bytecode when importing:

![PEP 3147 Workflow](/blog/img/pep-3147-1.png)

As previously explained the `pyc` file matches when both the magic number and the timestamp of the source file matches exactly in the compiled file.

When Python is asked to `import foo` it searches on `sys.path` if the file exists. If it is not found it checks whether there is a `foo.pyc` file. In case the `foo.pyc` file exists it will load it. Otherwise it will raise an ImportError.

If the file `foo.py` exists Python will check if there is a `__pycache__/foo.{magic}.pyc` file that matches the source file. In the case of match it will load it.

If the `__pycache__/foo.{magic}.pyc` doesn't exist or doesn't match (timestamp changed) it checks whether the `__pycache__` directory has been created or not, and if it's not created it creates it.

Finally it compiles the `foo.py` file and it generates the `__pycache__/foo.{magic}.pyc` file. 

## PEP-488

The purpose of the (not yet approved) PEP is to remove the PYO files which are Python Bytecode Optimized files.

### Current behaviour:

Currently bytecode files can be PYC and PYO. A PYC file is a bytecode file when no optimization level has been applied on startup.
PYO files are files that are generated when optimization has been specified (`-O` or `-OO`).

In order to test the different levels of optimizations I've created the next simple test:

```console
.
|-- api
    |-- __init__.py
```

My `__init__.py` file consists of:

```python
def test():
    """
    This is my test function
    """
    assert False == True
```

If we execute python without any optimization we can see that the docstring of our function is there and the assertion fails as it's executed:

```console
raulcd@test  $ python3
Python 3.4.2 (v3.4.2:ab2c023a9432, Oct  5 2014, 20:42:22)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import api
>>> api.test.__doc__
'\n    This is my test function\n    '
>>> api.test()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/Users/raulcd/test/api/__init__.py", line 5, in test
    assert False == True
AssertionError
>>>
```

We can also verify that the compiled bytecode is:

```console
.
`-- api
    |-- __init__.py
    `-- __pycache__
        `-- __init__.cpython-34.pyc
```

When we execute with `-O` we can see that assertion doesn't fail as this optimization removes the assertions from our code:

```console
raulcd@test  $ python3 -O
Python 3.4.2 (v3.4.2:ab2c023a9432, Oct  5 2014, 20:42:22)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import api
>>> api.test.__doc__
'\n    This is my test function\n    '
>>> api.test()
>>>
```

We can also see that the compiled file generated is:

```console
.
`-- api
    |-- __init__.py
    `-- __pycache__
        |-- __init__.cpython-34.pyc
        `-- __init__.cpython-34.pyo

2 directories, 3 files
raulcd@test  $ ls -lrt api/__pycache__/
total 16
-rw-r--r--  1 raulcd  staff  280 Mar 17 11:19 __init__.cpython-34.pyc
-rw-r--r--  1 raulcd  staff  247 Mar 17 11:23 __init__.cpython-34.pyo
```

If we execute Python with `-OO` we can see that both the assertion and the docstring have disappeared. Note that I need to manually remove the `.pyo` file as Python import mechanism will not recompile (as per the workflow explained before, file has not changed and already exists the `.pyo` file):

```console
raulcd@test  $ rm api/__pycache__/__init__.cpython-34.pyo
raulcd@test  $ python3 -OO
Python 3.4.2 (v3.4.2:ab2c023a9432, Oct  5 2014, 20:42:22)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import api
>>> api.test.__doc__
>>> api.test()
>>>
```
The generated `.pyo` file has the same name but we can see that the content is different and the size:

```console
.
`-- api
    |-- __init__.py
    `-- __pycache__
        |-- __init__.cpython-34.pyc
        `-- __init__.cpython-34.pyo

2 directories, 3 files
raulcd@test  $ ls -lrt api/__pycache__/
total 16
-rw-r--r--  1 raulcd  staff  280 Mar 17 11:19 __init__.cpython-34.pyc
-rw-r--r--  1 raulcd  staff  211 Mar 17 11:28 __init__.cpython-34.pyo
```

Currently there is no way to know whether a PYO file has been executed with different levels of optimization. So when a new level of optimization wants to be applied all PYO files need to be removed and regenerated.

### PEP-488 Proposal

The PEP proposes to remove PYO files by adding the optimization level applied to the PYC file incorporating it to the file name.

Currently bytecode files names are created by ```importlib.util.cache_from_source()``` using the expression defined on PEP 3147:

```python
{name}.{cache_tag}.pyc.format(name=module_name, cache_tag=sys.implemenetation.cache_tag)
```

The PEP proposes to add the optimization level by modifiying the name to:
```python
{name}.{cache_tag}.opt-{optimization}.pyc'.format(
    name=module_name, cache_tag=sys.implementation.cache_tag,
    optimization=str(sys.flags.optimize)
)
```

The "opt-" prefix was choosen to provide a visual separator from the cache tag.

And that's all for today :)
