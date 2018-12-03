import DataTypeConverter from '../../vendors/jsdatachecker/jsdatacheckermodule.js';

export default (function () {

    let generic_Provider = function(){};

    generic_Provider.prototype.selectData = function (data) {
        if (data.result && data.result.records)//ckan like
            return data.result.records;

        if (data instanceof Array)
            return data;
        if (_isGEOJSON(data))
            return [{"GEOJSON": data}];
        if (data instanceof Object)
            return [{"JSON": data}];
    };

    generic_Provider.prototype.addLimit = function (url) {
        return url;
    };

    let _isGEOJSON = function (data) {
        let dt = new DataTypeConverter();
        return (dt.inferDataSubTypeOfValue(data) && dt.inferDataSubTypeOfValue(data).name == DataTypeConverter.SUBTYPES.GEOJSON.name);
    };

    return generic_Provider;

})();