/* Public CKAN discovery. Zenodo lookup and CSV validation reuse ZenodoAPI. */
var CreatorProviderAPI = (function () {
    function ckanLocation(value) {
        const url = new URL(value.trim());
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
            throw new Error('Enter a public CKAN portal URL.');
        const match = url.pathname.match(/^(.*?)\/dataset\/([^/]+)/);
        const base = match ? match[1] : url.pathname.replace(/\/api\/3\/action(?:\/.*)?$/, '').replace(/\/$/, '');
        return {base: url.origin + base, dataset: match ? decodeURIComponent(match[2]) : null};
    }
    async function request(url, signal) {
        let response;
        try { response = await fetch(url, {signal, credentials: 'omit'}); }
        catch (error) {
            if (signal.aborted) throw error;
            throw new Error('Cannot reach this provider. Check the URL and whether it allows browser access (CORS).');
        }
        if (!response.ok) throw new Error('Provider returned HTTP ' + response.status + '. The resource may not be public.');
        return response;
    }
    function zenodoFiles(record) {
        const metadata = record.metadata || {};
        return ZenodoAPI.csvFiles(record).map(file => Object.assign(file, {
            p: 'suggested', csv: true, zenodo: true,
            metadata: {
                title: metadata.title,
                description: metadata.description,
                authors: (metadata.creators || []).map(creator => creator.name).filter(Boolean).join(', '),
                publisher: 'Zenodo',
                doi: record.doi || (record.pids && record.pids.doi && record.pids.doi.identifier),
                published: metadata.publication_date,
                updated: record.updated,
                license: typeof metadata.license === 'string' ? metadata.license : (metadata.license || {}).id,
                licenseUrl: (metadata.license || {}).url,
                keywords: (metadata.keywords || []).join(', '),
                format: 'CSV',
                recordUrl: 'https://zenodo.org/records/' + encodeURIComponent(record.id)
            }
        }));
    }
    async function ckan(value, signal) {
        const location = ckanLocation(value);
        const resources = [];
        let start = 0;
        while (true) {
            const url = new URL(location.base + '/api/3/action/' + (location.dataset ? 'package_show' : 'package_search'));
            if (location.dataset) url.searchParams.set('id', location.dataset);
            else { url.searchParams.set('rows', '100'); url.searchParams.set('start', start); url.searchParams.set('sort', 'id asc'); }
            const body = await (await request(url.href, signal)).json();
            if (!body.success || !body.result) throw new Error('This URL did not return a valid CKAN catalog.');
            const packages = location.dataset ? [body.result] : body.result.results;
            if (!Array.isArray(packages)) throw new Error('CKAN returned an unexpected catalog response.');
            packages.forEach(dataset => (dataset.resources || []).forEach(resource => {
                const csv = /^csv$/i.test(resource.format || '') || /\.csv(?:[?#]|$)/i.test(resource.url || '');
                if (!csv && !resource.datastore_active) return;
                const url = resource.datastore_active ? location.base + '/api/3/action/datastore_search?resource_id=' + encodeURIComponent(resource.id) : new URL(resource.url, location.base + '/').href;
                if (!/^https?:\/\//.test(url)) return;
                resources.push({name: (dataset.title || dataset.name) + ' — ' + (resource.name || resource.id), url,
                    size: Number(resource.size || 0), csv: !resource.datastore_active, p: 'suggested',
                    metadata: {
                        title: dataset.title || dataset.name,
                        description: dataset.notes,
                        resourceDescription: resource.description,
                        authors: dataset.author || dataset.maintainer,
                        publisher: (dataset.organization || {}).title || (dataset.organization || {}).name,
                        published: dataset.metadata_created,
                        updated: resource.last_modified || dataset.metadata_modified,
                        license: dataset.license_title || dataset.license_id,
                        licenseUrl: dataset.license_url,
                        keywords: (dataset.tags || []).map(tag => tag.display_name || tag.name).filter(Boolean).join(', '),
                        format: resource.format || (resource.datastore_active ? 'DataStore' : 'CSV'),
                        recordUrl: location.base + '/dataset/' + encodeURIComponent(dataset.name || dataset.id)
                    }});
            }));
            start += packages.length;
            if (location.dataset || !packages.length || start >= body.result.count) break;
        }
        return resources;
    }
    async function datastore(file, signal) {
        const rows = [];
        let bytes = 0;
        while (true) {
            const url = new URL(file.url);
            url.searchParams.set('limit', '1000');
            url.searchParams.set('offset', String(rows.length));
            const body = await (await request(url.href, signal)).json();
            if (!body.success || !body.result || !Array.isArray(body.result.records))
                throw new Error('CKAN returned an invalid DataStore response.');
            const page = body.result.records;
            bytes += new Blob([JSON.stringify(page)]).size;
            if (bytes > ZenodoAPI.MAX_BYTES) throw new Error('This resource exceeds the 50 MB browser import limit.');
            rows.push(...page);
            if (!page.length || rows.length >= body.result.total) break;
        }
        if (!rows.length) throw new Error('This resource contains no data rows.');
        return rows;
    }
    async function csv(file, signal) {
        if (file.zenodo) return ZenodoAPI.loadCsv(file, signal, Papa);
        if (file.size > ZenodoAPI.MAX_BYTES) throw new Error('This CSV exceeds the 50 MB browser import limit.');
        const response = await request(file.url, signal);
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        try {
            while (true) {
                const part = await reader.read();
                if (part.done) break;
                size += part.value.byteLength;
                if (size > ZenodoAPI.MAX_BYTES) throw new Error('This CSV exceeds the 50 MB browser import limit.');
                chunks.push(part.value);
            }
        } finally { await reader.cancel(); reader.releaseLock(); }
        return ZenodoAPI.parseCsv(await new Blob(chunks).text(), Papa);
    }
    return {ckanLocation, ckan, csv, datastore, zenodoFiles};
})();
