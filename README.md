# COMPONENTS

COMPONENTS is a repositiory of datalet and controllet, maintained by the [UNISA TEAM](http://www.isislab.it/) for the [ROUTE-TO-PA PROJECT](http://www.routetopa.eu/).


## Table of contents

* [Quick start](#quick-start)
* [Bugs and feature requests](#bugs-and-feature-requests)
* [Documentation](#documentation)
* [Versioning](#versioning)
* [Creators](#creators)
* [Copyright and license](#copyright-and-license)


## Quick start

Clone the repo: `git clone http://service.routetopa.eu:7480/WebCompDev/COMPONENTS.git`.

### Running the datalet creator locally

Serve the parent directory containing `COMPONENTS`, `DEEP`, and `DEEPCLIENT`, then open `COMPONENTS/creator.html`. The default backend is the sibling `DEEP/` directory and requires a PHP server with the DEEP routes enabled.

VS Code Live Server only serves static files. To use it with the existing hosted DEEP service, open:

```
http://127.0.0.1:5500/COMPONENTS/creator.html?deep-url=https://deep.routetopa.eu/deep2t/DEEP/
```

The `deep-url` parameter supplies the chart catalog and chart definitions; the creator and datalet components still load from your local checkout. You can replace it with your own DEEP service URL. A service on a different origin must allow CORS.

If navigation icons disappear under Live Server, check the console for a syntax error in `iron-iconset-svg`. Its inline JavaScript documentation must keep the closing SVG example escaped as `&lt;/svg&gt;`, because Live Server otherwise injects its reload script inside that comment.

### Choose a provider in the creator

`creator.html` includes **Zenodo** (enter a DOI) and **CKAN** (enter a portal or dataset URL) in the provider dropdown. Results use the existing dataset list and workflow. See [provider setup and tests](creator/providers/README.md).

### Create a datalet from Zenodo

Open `creator_zenodo.html` to look up a Zenodo DOI, choose an attached CSV, and continue with the existing creator workflow. See [Zenodo creator setup and implementation](creator/zenodo/README.md) for local URLs, supported files and tests.

### What's included

Within the download you'll find the following directories and files. You'll see something like this:

```
COMPONENTS/
├── bower_components/
│   ├── ...
├── controllets/
│   ├── ...
│   └── ...
├── datalets/
│   ├── ...
│   └── ...
└── docs/
    ├── docs.html
```

## Bugs and feature requests

Have a bug or a feature request? 
Send a mail to developers@routetopa.eu

## Documentation

Every datalet/controllet has a doc.html file in datalet/controllet root directory

## Versioning
v0.1

## Creators
UNISA Team - Dipartimento di Informatica - Università degli studi di Salerno - Italy

## Copyright and license

Code released under [the MIT license](https://opensource.org/licenses/MIT).
