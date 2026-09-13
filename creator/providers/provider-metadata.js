/* Render public metadata as text, never as executable provider-supplied HTML. */
var CreatorProviderMetadata = {
    render: function (container, file, rows, language) {
        const italian = language === 'it';
        const labels = italian ? {
            title: 'Dataset', resource: 'Risorsa', description: 'Descrizione', resourceDescription: 'Descrizione della risorsa',
            authors: 'Autori', publisher: 'Organizzazione', doi: 'DOI', published: 'Pubblicato', updated: 'Aggiornato',
            license: 'Licenza', keywords: 'Parole chiave', format: 'Formato', size: 'Dimensione', rows: 'Righe',
            record: 'Pagina del dataset', download: 'Risorsa originale'
        } : {
            title: 'Dataset', resource: 'Resource', description: 'Description', resourceDescription: 'Resource description',
            authors: 'Authors', publisher: 'Organization', doi: 'DOI', published: 'Published', updated: 'Updated',
            license: 'License', keywords: 'Keywords', format: 'Format', size: 'Size', rows: 'Rows',
            record: 'Dataset page', download: 'Original resource'
        };
        const metadata = file.metadata || {};
        container.textContent = '';
        const details = document.createElement('dl');
        details.style.cssText = 'margin:12px; overflow-wrap:anywhere;';
        function add(key, value, link) {
            if (value === undefined || value === null || value === '') return;
            const term = document.createElement('dt');
            term.textContent = labels[key];
            term.style.cssText = 'font-weight:700; margin-top:10px;';
            const definition = document.createElement('dd');
            definition.style.cssText = 'margin:2px 0 0; white-space:pre-wrap;';
            if (link) {
                let url;
                try { url = new URL(value); } catch (_) { return; }
                if (!['https:', 'http:'].includes(url.protocol)) return;
                const anchor = document.createElement('a');
                anchor.href = url.href;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.textContent = labels[key];
                definition.appendChild(anchor);
            } else if (key === 'description' || key === 'resourceDescription') {
                // A template is inert; extract readable text from Zenodo's HTML descriptions.
                const template = document.createElement('template');
                template.innerHTML = String(value);
                template.content.querySelectorAll('script,style').forEach(node => node.remove());
                template.content.querySelectorAll('p,div,br,li').forEach(node => node.appendChild(document.createTextNode('\n')));
                definition.textContent = template.content.textContent.trim();
            } else definition.textContent = String(value);
            details.append(term, definition);
        }
        add('title', metadata.title);
        add('resource', file.name);
        ['description', 'resourceDescription', 'authors', 'publisher', 'doi', 'published', 'updated', 'license', 'keywords', 'format']
            .forEach(key => add(key, metadata[key]));
        if (file.size > 0) add('size', (file.size / 1024 / 1024).toFixed(2) + ' MB');
        add('rows', rows);
        add('record', metadata.recordUrl, true);
        add('download', file.url, true);
        container.appendChild(details);
    }
};
