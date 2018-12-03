import * as alasql_utility   from '../vendors/alasql/alasql-utility.js';
import ckan_Provider         from './providers-utility-controllet/ckan.js';
import dkan_Provider         from './providers-utility-controllet/dkan.js';
import generic_Provider      from './providers-utility-controllet/generic.js';
import SPOD_Provider         from './providers-utility-controllet/spod.js';
import SPARQL_Provider       from './providers-utility-controllet/sparql.js';
import openDataSoft_Provider from './providers-utility-controllet/openDataSoft.js';
import DataTypeConverter     from '../vendors/jsdatachecker/jsdatacheckermodule.js';

export const requestData = function(data_url)
{
    return new Promise((res, rej) =>
    {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function()
        {
            if (this.readyState === 4 )
            {
                if(this.status === 200)
                    res(JSON.parse(this.responseText));
                else
                    rej(this);
            }
        };

        xhttp.open("GET", data_url, true);
        xhttp.send();
    });
};

export const selectData = function(json_results, data_url)
{
    let f = Object.create(providerFactory);
    let provider = f.getProvider(data_url);
    let data = provider.selectData(json_results);

    let converter = new DataTypeConverter();

    let result = converter.inferJsonDataType(data, ["*"]);
    result = converter.cast(result);
    return result.dataset;
};

export const filterData = function(data, selected_fields, filters, aggregators, orders)
{
    let selectedFields = JSON.parse(selected_fields);
    filters = JSON.parse(filters);
    aggregators = JSON.parse(aggregators);
    orders = JSON.parse(orders);
    let converter = new DataTypeConverter();

    let fields = [];
    for (let i=0; i < selectedFields.length; i++)
        if (selectedFields[i])
            fields.push(selectedFields[i].value);

    let result = [];

    if(filters && filters.length) {
        data = alasql_utility.alasql_QUERY(data, "*", filters, null, null);
        result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        data = result.dataset;
    }

    if(aggregators && aggregators.length) {
        data = alasql_utility.alasql_QUERY(data, null, null, aggregators, orders);
        result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        data = result.dataset;
    }
    else {
        data = alasql_utility.alasql_QUERY(data, fields, null, null, orders);
        result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        data = result.dataset;
    }

    return alasql_utility.alasql_transformData(data, fields, true);

};

export const transformData = function(data, fields)
{
    return data;
};

let providerFactory =
{
    getProvider: function(dataUrl) {
        if (dataUrl.indexOf("datastore_search?resource_id") > -1)
            return new ckan_Provider();
        else if (dataUrl.indexOf("search.json&resource_id") > -1)
            return new dkan_Provider();
        else if (dataUrl.indexOf("search?dataset") > -1 || dataUrl.indexOf("search/?dataset") > -1)
            return new openDataSoft_Provider();
        else if (dataUrl.indexOf("eurostat") > -1)
            return new eurostat_Provider();
        else if (dataUrl.indexOf("datiopen.istat.it") > -1)
            return new istat_Provider();
        else if (dataUrl.indexOf("ODataApi") > -1)
            return new OData_Provider();
        else if (dataUrl.indexOf("sparql?") > -1 )
            return new SPARQL_Provider();
        else if (dataUrl.indexOf("get-dataset-by-room-id-and-version") > -1 )
            return new SPOD_Provider();
        else if (dataUrl.search(/\Wwms\W?/gi) > -1)
            return new WMS_Provider();
        else if (dataUrl.search(/\Wkml\W?/gi) > -1)
            return new KML_Provider();
        else if (dataUrl.search(/\Wjson|geojson\W?/gi) > -1)
            return new KML_Provider();
        else
            return new generic_Provider();//dkan and mysir --> ckan like
    }
};