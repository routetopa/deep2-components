export default (function () {

    function SPARQL_Provider() {}

    SPARQL_Provider.prototype.selectData = function (data) {
        return createJsonOutput(data.results.bindings);
    };

    function createJsonOutput(results) {
        var recordsObj = [];

        for (let index in results) {
            var element = results[index];

            var newElement = {};

            for (var field in element) {

                var label = field.replace('_', " ");

                let url = element[field].value;

                newElement[label] = url.substring(url.lastIndexOf("/") + 1, url.length).replace("_", " ");
                newElement[label + ' url'] = url;
            }

            recordsObj.push(newElement);
        }

        return recordsObj;
    }

    function isImage(url) {
        return ((url.toLowerCase()).match(/^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png|svg)/) != null);
    }

    return SPARQL_Provider;

})();