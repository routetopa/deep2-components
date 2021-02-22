CREATE_CACHE = {}

CREATE_CACHE.init = async () => {
    let providersDatasets = {};
    providers.forEach(p => {
        let start = 0;
        let count = 0;
        let provider = {};
        provider['p_name'] = p.name;
        provider['p_url'] = p.url;
        provider['p_datasets'] = [];
        providersDatasets[p.id] = provider;
        while(count < max) {
            try{
                //Try CKAN
                let url = p.url + "/api/3/action/package_search?start=" + start + "&rows=" + step;
                let data = CREATE_CACHE.httpGet(url);
                let datasets = data.result.results;
                if (datasets.length) {
                    providersDatasets[p.id]['p_datasets'].push(...CREATE_CACHE.getCkanDatasets(datasets, p.id));
                    start += step;
                    count += datasets.length;
                } else {
                    break;
                }
            } catch (e) {
                console.error(e.message);
                break;
            }
        }
    })
    return providersDatasets;
}

CREATE_CACHE.getCkanDatasets = (_datasets, providerId) => {
    let filter = ['csv', 'ods', 'xls', 'xlsx'];
    let datasets = [];
    _datasets.forEach(d => {
        let resources = [];
        for (let j = 0; j < d.resources.length; j++) {
            if(filter.includes(d.resources[j].format.toLowerCase()))
                resources.push(d.resources[j].name);
            else
                resources.push([d.resources[j].name, 'disabled']);
        }
        let dataset = {};
        dataset['name'] = d.title ? d.title : d.name;
        dataset['id'] = d.id;
        dataset['p'] = 'CKAN_' + providerId;
        if(resources.length > 1)
            dataset['resources'] = resources;
        datasets.push(dataset);
    })
    return datasets;
}

CREATE_CACHE.httpGet = (url) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}