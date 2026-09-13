/* Only step one is Zenodo-specific. Steps two and three reuse existing controllets. */
Polymer({
    is: 'zenodo-data-sevc-controllet',
    properties: {
        deepUrl: String,
        componentsUrl: String,
        dataletsListUrl: String,
        localization: {type: String, value: 'en'}
    },
    listeners: {
        'page-slider-controllet_selected': '_updateSlider',
        'select-fields-controllet_selected-fields': '_fieldsChanged',
        'filters-controllet_filters': '_fieldsChanged',
        'aggregators-controllet_aggregators': '_fieldsChanged'
    },
    ready: function () {
        ln.localization = this.localization;
        this._files = [];
        this._datasetReady = false;
    },
    attached: function () {
        this._updateSlider({detail: {selected: 0}});
        const doi = new URL(location.href).searchParams.get('doi');
        if (doi) { this.$.doi.value = doi; this._findRecord(); }
    },
    detached: function () { this._cancelRequest(); },

    _status: function (message, error) {
        this.$.status.textContent = message;
        this.$.status.toggleAttribute('data-error', !!error);
    },
    _cancelRequest: function () {
        if (this._request) this._request.abort();
        this._request = null;
        clearTimeout(this._timeout);
    },
    _startRequest: function () {
        this._cancelRequest();
        const controller = new AbortController();
        this._request = controller;
        this._timeout = setTimeout(() => {
            controller.abort();
            this._status('Zenodo took too long to respond. Please try again.', true);
            this.$.use_csv.disabled = this._selectedFile === undefined;
        }, 60000);
        return controller;
    },
    _clearWorkflow: function () {
        this._datasetReady = false;
        this.$.slider.chevronRight(false);
        this.$.select_data.reset();
        this.$.select_visualization.init();
        this.fire('select-inputs_isReady', {isReady: false});
    },
    _inputChanged: function () {
        this._cancelRequest();
        this._clearWorkflow();
        this._files = [];
        this._selectedFile = undefined;
        this.$.record.hidden = true;
        this.$.use_csv.disabled = true;
        this._status('');
    },
    _findRecord: async function (event) {
        if (event) event.preventDefault();
        this._clearWorkflow();
        this._selectedFile = undefined;
        this.$.record.hidden = true;
        this.$.use_csv.disabled = true;
        const request = this._startRequest();
        this._status('Looking up the Zenodo record…');
        try {
            const record = await ZenodoAPI.findRecord(this.$.doi.value, request.signal);
            if (request.signal.aborted) return;
            this._files = ZenodoAPI.csvFiles(record);
            this.$.record_title.textContent = record.metadata.title;
            this.$.record_link.href = 'https://zenodo.org/records/' + encodeURIComponent(record.id);
            this.$.record_doi.textContent = 'Record DOI: ' + (record.doi || (record.pids && record.pids.doi.identifier) || 'Unavailable');
            this.$.file_list.textContent = '';
            this._files.forEach((file, index) => {
                const label = document.createElement('label');
                label.className = 'file';
                const radio = document.createElement('input');
                radio.type = 'radio'; radio.name = 'zenodo_csv'; radio.value = index;
                radio.disabled = file.size > ZenodoAPI.MAX_BYTES;
                const name = document.createElement('span');
                name.textContent = file.name;
                const size = document.createElement('small');
                size.textContent = file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Size unknown';
                if (radio.disabled) size.textContent += ' — too large';
                label.append(radio, name, size);
                this.$.file_list.appendChild(label);
            });
            this.scopeSubtree(this.$.file_list);
            this.$.record.hidden = false;
            this._status(this._files.length ? this._files.length + ' CSV file(s) found. Select one to continue.' :
                'No publicly available CSV files were found. Files inside ZIP archives are not listed.');
        } catch (error) {
            if (!request.signal.aborted) this._status(error.message, true);
        } finally {
            if (this._request === request) clearTimeout(this._timeout);
        }
    },
    _selectFile: function (event) {
        this._cancelRequest();
        this._clearWorkflow();
        this._selectedFile = Number(event.target.value);
        this.$.use_csv.disabled = false;
        this._status('Selected ' + this._files[this._selectedFile].name + '.');
    },
    _useCsv: async function () {
        const file = this._files[this._selectedFile];
        if (!file) return;
        this._clearWorkflow();
        const request = this._startRequest();
        this.$.use_csv.disabled = true;
        this._status('Loading ' + file.name + '…');
        try {
            const rows = await ZenodoAPI.loadCsv(file, request.signal, Papa);
            if (request.signal.aborted) return;
            // Give the standard field selector parsed rows, avoiding another download.
            this.$.select_data.dataUrl = undefined;
            this.$.select_data.data = rows;
            this.$.select_data.init();
            this.$.select_visualization.dataUrl = file.url;
            this._datasetReady = true;
            this._status(file.name + ' loaded (' + rows.length + ' rows).');
            this.$.slider._onNextClick();
        } catch (error) {
            if (!request.signal.aborted) this._status(error.message, true);
        } finally {
            if (this._request === request) {
                clearTimeout(this._timeout);
                this.$.use_csv.disabled = false;
            }
        }
    },
    _updateSlider: function (event) {
        const step = event.detail.selected;
        const slider = this.$.slider;
        if (step === 0) {
            slider.setTitle('SELECT A ZENODO CSV', 'Find a record by DOI, then choose a CSV file.');
            slider.chevronLeft('invisible');
            slider.chevronRight(!!this._datasetReady);
        } else {
            slider.setTitle(ln['slide' + (step + 1) + 'Title_' + this.localization], ln['slide' + (step + 1) + 'Subtitle_' + this.localization]);
            slider.chevronLeft(true);
            slider.chevronRight(step === 2 ? 'invisible' : this.$.select_data.getSelectedFields().length > 0);
        }
    },
    _fieldsChanged: function () {
        if (!this._datasetReady) return;
        const data = this.$.select_data;
        const visualization = this.$.select_visualization;
        const fields = data.getSelectedFields();
        this.$.slider.chevronRight(fields.length > 0);
        visualization.init();
        if (!fields.length) return;
        visualization.setSelectedFields(fields);
        visualization.setFilters(data.getFilters());
        visualization.setAggregators(data.getAggregators());
        visualization.setData(data.getData());
    }
});
