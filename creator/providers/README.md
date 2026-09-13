# Providers in the original creator

`creator.html` enables the provider dropdown's Zenodo and CKAN options. Existing example providers, list search, pagination, field selection, filtering and chart controls remain available. `creator_zenodo.html` and its files are unchanged.

Select **Zenodo**, enter a DOI or doi.org link, and press Enter or the search icon. Select a CSV from the existing list; the next arrow becomes available after loading.

Select **CKAN**, enter a public portal URL (including an installation subdirectory if needed) or a `/dataset/name` URL, then search. The list shows CSV and DataStore resources, labelled with their dataset and resource names. Portal catalogs and DataStore rows are paginated; unsupported resource formats are omitted. A request times out after 60 seconds. For large portals, use a dataset URL to narrow discovery.

Both providers load parsed rows into the existing field selector. Their previews use those imported rows as cached data, so a subsequent DataStore request cannot silently replace them with the first page. The browser import limit remains 50 MB. CKAN must allow cross-origin browser requests; HTTP-only providers cannot be fetched from an HTTPS creator. Errors are shown in the lookup row.

The [CKAN Action API](https://docs.ckan.org/en/2.11/api/) provides `package_search`, `package_show` and `datastore_search`.

- `provider-api.js`: CKAN discovery and resource downloads; reuses the unchanged Zenodo API and CSV parser.
- `provider-behavior.js`: optional Polymer behavior for lookup and cancellation.
- The existing dataset selector template adds the two menu choices and a lookup row.
- The existing workflow controller receives parsed rows via `provider-data`.

Run the regression checks with Node.js 18+: `node COMPONENTS/creator/providers/tests.cjs`.

When using Live Server, use a running DEEP backend for the chart catalog:

```
http://127.0.0.1:5500/COMPONENTS/creator.html?deep-url=https://deep.routetopa.eu/deep2t/DEEP/
```
