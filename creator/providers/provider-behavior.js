/* Optional discovery for the original creator; inactive in other entry pages. */
var CreatorProviderBehavior = {
    properties: {
        externalProviders: {type: Boolean, value: false},
        externalProvider: {type: String, value: ''},
        providerInput: {type: String, value: ''},
        providerLabel: String,
        providerStatus: String
    },
    detached: function () { this._cancelProviderRequest(); },
    _cancelProviderRequest: function () {
        if (this._providerRequest) this._providerRequest.abort();
        this._providerRequest = null;
        clearTimeout(this._providerTimeout);
    },
    _providerRequestStart: function () {
        this._cancelProviderRequest();
        const request = new AbortController();
        this._providerRequest = request;
        this._providerTimeout = setTimeout(() => {
            request.abort();
            this.providerStatus = 'The provider took too long to respond. Please try again.';
        }, 60000);
        return request;
    },
    _chooseExternalProvider: function (provider) {
        this._cancelProviderRequest();
        this.externalProvider = provider;
        this.providerInput = '';
        this.providerStatus = '';
        this.providerLabel = provider === 'zenodo' ? 'Zenodo DOI or doi.org link' : 'CKAN portal or dataset URL';
        this.$.selected_url.readonly = !!provider;
        this.$.datasets_list_container.style.height = provider ? 'calc(100% - 280px)' : '';
        this._providerInputChanged();
    },
    _providerInputChanged: function () {
        this._cancelProviderRequest();
        this._providerFiles = [];
        this.providerStatus = '';
        this.dataUrl = '';
        this.$.datasets_list.setDatasets([]);
        this.fire('provider-reset');
    },
    _providerKey: function (event) { if (event.key === 'Enter') this._findProviderFiles(); },
    _findProviderFiles: async function () {
        if (!this.externalProvider) return;
        this._providerInputChanged();
        const request = this._providerRequestStart();
        this.providerStatus = 'Loading available resources…';
        try {
            let files;
            if (this.externalProvider === 'zenodo') {
                const record = await ZenodoAPI.findRecord(this.providerInput, request.signal);
                files = CreatorProviderAPI.zenodoFiles(record);
            } else files = await CreatorProviderAPI.ckan(this.providerInput, request.signal);
            if (request.signal.aborted) return;
            this._providerFiles = files;
            this.$.datasets_list.setDatasets(files);
            this.providerStatus = files.length ? files.length + ' resources found. Select one from the list.' : 'No public CSV or DataStore resources found.';
        } catch (error) {
            if (!request.signal.aborted) this.providerStatus = error.message;
        } finally { if (this._providerRequest === request) clearTimeout(this._providerTimeout); }
    },
    _showProviderMetadata: function (file, rows) {
        CreatorProviderMetadata.render(this.$.datasets_list.$.info_body, file, rows, ln.localization);
        this.showDatasetInfo();
    },
    _loadProviderFile: async function (url) {
        if (!url) return;
        const file = (this._providerFiles || []).find(file => file.url === url);
        if (!file) return;
        this.fire('provider-reset');
        this.dataUrl = url;
        const request = this._providerRequestStart();
        this.providerStatus = 'Loading ' + file.name + '…';
        this._showProviderMetadata(file);
        try {
            const rows = file.csv ? await CreatorProviderAPI.csv(file, request.signal) : await CreatorProviderAPI.datastore(file, request.signal);
            if (request.signal.aborted) return;
            this.fire('provider-data', {url, rows, metadata: file.metadata || {}});
            this.providerStatus = rows.length + ' rows loaded. Use the right arrow to select fields.';
            this._showProviderMetadata(file, rows.length);
            this.showDatasetInfo();
        } catch (error) {
            if (!request.signal.aborted) this.providerStatus = error.message;
        } finally {
            if (this._providerRequest === request) { clearTimeout(this._providerTimeout); this.showDatasetInfo(); }
        }
    }
};
