/* Zenodo lookup and CSV parsing, independent of the creator UI. */
(function (root) {
    'use strict';

    const API = 'https://zenodo.org/api/records';
    const MAX_BYTES = 50 * 1024 * 1024;

    function normalizeDoi(value) {
        let doi = value.trim().replace(/^doi:\s*/i, '');
        if (/^https?:\/\/(dx\.)?doi\.org\//i.test(doi)) {
            doi = decodeURIComponent(new URL(doi).pathname.slice(1));
        }
        if (!/^10\.\d{4,9}\/[^\s"<>]+$/i.test(doi)) {
            throw new Error('Enter a DOI such as 10.5281/zenodo.15099149 or its https://doi.org/ link.');
        }
        return doi.toLowerCase();
    }

    function zenodoUrl(value) {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.hostname !== 'zenodo.org' || url.username || url.password) {
            throw new Error('The record returned an unsupported file URL.');
        }
        return url.href;
    }

    async function request(url, signal) {
        let response;
        try {
            response = await fetch(zenodoUrl(url), {signal, credentials: 'omit'});
        } catch (error) {
            if (signal && signal.aborted) throw error;
            throw new Error('Could not reach Zenodo. Check your connection and try again.');
        }
        if (response.status === 429) throw new Error('Zenodo is receiving too many requests. Wait a minute and try again.');
        if (response.status === 401 || response.status === 403) throw new Error('This record or file is restricted and cannot be loaded publicly.');
        if (response.status === 404) throw new Error('This Zenodo record or file was not found.');
        if (!response.ok) throw new Error('Zenodo could not complete the request (HTTP ' + response.status + '). Try again.');
        return response;
    }

    async function search(field, doi, signal, allVersions) {
        const url = new URL(API);
        // Escape Elasticsearch query-string syntax inside the quoted DOI.
        const escaped = doi.replace(/([\\"])/g, '\\$1');
        url.searchParams.set('q', field + ':"' + escaped + '"');
        url.searchParams.set('size', '1');
        if (allVersions) url.searchParams.set('all_versions', 'true');
        const response = await request(url.href, signal);
        const result = await response.json();
        if (!result.hits || !Array.isArray(result.hits.hits)) throw new Error('Zenodo returned an unexpected record response.');
        return result.hits.hits[0];
    }

    async function findRecord(value, signal) {
        const doi = normalizeDoi(value);
        // Preserve an exact version DOI, including older versions.
        let record = await search('doi', doi, signal, true);
        if (!record) {
            record = await search('conceptdoi', doi, signal, false);
            if (record && record.links && record.links.latest) {
                record = await (await request(record.links.latest, signal)).json();
            }
        }
        if (!record) throw new Error('No published Zenodo record was found for this DOI.');
        return record;
    }

    function csvFiles(record) {
        const entries = Array.isArray(record.files) ? record.files : Object.values((record.files || {}).entries || {});
        return entries.filter(file => /\.csv$/i.test(file.key || file.filename || '')).map(file => {
            const name = file.key || file.filename;
            const links = file.links || {};
            return {
                name,
                size: Number(file.size || file.filesize || 0),
                url: zenodoUrl(links.content || links.self ||
                    'https://zenodo.org/records/' + encodeURIComponent(record.id) + '/files/' + encodeURIComponent(name) + '?download=1')
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }

    function parseCsv(text, parser) {
        if (!text.trim()) throw new Error('This CSV is empty.');
        if (/^\s*(<!doctype\s+html|<html|<\?xml)/i.test(text)) throw new Error('Zenodo returned a web page instead of a CSV file.');
        const parsed = parser.parse(text.replace(/^\uFEFF/, ''), {skipEmptyLines: 'greedy'});
        const errors = parsed.errors.filter(error => error.code !== 'UndetectableDelimiter');
        if (errors.length) throw new Error('The CSV could not be parsed: ' + errors[0].message);
        const headers = (parsed.data.shift() || []).map(value => value.trim());
        if (!headers.length || headers.some(header => !header)) throw new Error('The CSV needs a non-empty name for every column in its first row.');
        if (new Set(headers).size !== headers.length) throw new Error('The CSV contains duplicate column names. Give each column a unique name.');
        if (headers.some(header => ['__proto__', 'constructor', 'prototype'].includes(header))) throw new Error('The CSV contains a reserved column name. Rename it before importing.');
        if (!parsed.data.length) throw new Error('This CSV contains column names but no data rows.');
        return parsed.data.map((values, index) => {
            if (values.length !== headers.length) throw new Error('CSV row ' + (index + 2) + ' has a different number of columns than the header.');
            const row = {};
            headers.forEach((header, column) => { row[header] = values[column]; });
            return row;
        });
    }

    async function loadCsv(file, signal, parser) {
        if (file.size > MAX_BYTES) throw new Error('This file exceeds the 50 MB limit for browser-based creation.');
        const response = await request(file.url, signal);
        if (Number(response.headers.get('Content-Length')) > MAX_BYTES) throw new Error('This file exceeds the 50 MB limit for browser-based creation.');
        // Enforce the limit even when Content-Length is missing or compressed.
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        try {
            while (true) {
                const part = await reader.read();
                if (part.done) break;
                size += part.value.byteLength;
                if (size > MAX_BYTES) throw new Error('This file exceeds the 50 MB limit for browser-based creation.');
                chunks.push(part.value);
            }
        } finally {
            await reader.cancel();
            reader.releaseLock();
        }
        const blob = new Blob(chunks);
        return parseCsv(await blob.text(), parser);
    }

    root.ZenodoAPI = {normalizeDoi, findRecord, csvFiles, parseCsv, loadCsv, MAX_BYTES};
})(globalThis);
