# Zenodo creator

Open `COMPONENTS/creator_zenodo.html` through your web server. Paste a Zenodo DOI (or a `https://doi.org/…` link), click **Find CSV files**, select a file, then click **Use selected CSV**. The next pages use the existing field selection, filters, aggregations, visualization preview and export controls.

For Live Server, supply a running DEEP service because Live Server cannot execute PHP:

```
http://127.0.0.1:5500/COMPONENTS/creator_zenodo.html?deep-url=https://deep.routetopa.eu/deep2t/DEEP/
```

Optional query parameters:

- `doi=10.5281/zenodo.15099149` pre-fills and looks up a record.
- `deep-url=…` selects the DEEP service, defaulting to sibling `../DEEP/`.
- `ln=en` selects the language of the existing workflow. The new lookup panel uses English.

An exact version DOI loads that version; a concept DOI resolves to the latest published version. The lookup uses Zenodo's public REST API without authentication. It lists directly attached `.csv` files, including uppercase extensions, and does not unpack archives. Restricted files report an error when downloaded. Files larger than 50 MB are disabled, and the same limit is enforced during download.

CSV files must be UTF-8 with unique, non-empty column names in the first row and at least one data row. Comma, semicolon and tab delimiters are detected by the existing Papa Parse dependency. Parsed values pass through the existing creator's type conversion. Unsupported column names and malformed rows produce an error before advancing.

## Files

- `../../creator_zenodo.html`: entry page and existing export toolbar.
- `zenodo-api.js`: DOI normalization, record lookup, file listing, bounded download and CSV parsing. Independent of Polymer.
- `zenodo-controllet.html`: lookup panel and the three workflow pages.
- `zenodo-controllet.js`: UI state and handoff to the existing controllets.

The shared `creator.js` accepts an optional controllet tag; the original creator keeps its default. The shared chart loader also rejects non-JSON responses correctly, allowing CSV previews and embeds to use the selected data cached in the datalet. Zenodo source links point to the record landing page. No DEEP backend changes are required. A separate-origin DEEP service must allow CORS, as with the original creator.

## Tests

With Node.js 18 or newer:

```
cd COMPONENTS/creator/zenodo/tests
npm install
npm test
```

The tests use mocked API responses and the same Papa Parse version as the creator. They cover version/concept lookups, empty file lists, CSV validation, HTTP errors, download limits and cancellation. For a browser smoke test, open the example DOI above, select a CSV, choose fields and a visualization, and check the preview.
