export const transformData = function (data, selectedFields) {

    if (data.length === 0)
        return;

    let categories;
    let series;

    selectedFields = JSON.parse(selectedFields);

    let inputs = [];
    if (selectedFields) { /*if deprecated*/
        for (let i = 0; i < selectedFields.length; i++)
            if (selectedFields[i])
                inputs.push(selectedFields[i].field);
    }

    let cat_index = inputs.indexOf("Categories");

    if (cat_index === -1)
    {
        categories = data[0].data;
        series = [];
        for (let i = 1; i < data.length; i++)
            series.push(data[i]);
    } else {
        let x = data[0]["data"];
        let y = data[1]["data"];
        let cat = data[cat_index]["data"];

        categories = x.filter(function (item, pos) {
            return x.indexOf(item) === pos;
        });

        let s = cat.filter(function (item, pos) {
            return cat.indexOf(item) === pos;
        });

        series = [];
        for (let i = 0; i < s.length; i++) {
            series.push({name: s[i], data: new Array(categories.length + 1).join('0').split('').map(parseFloat)});
        }

        for (let i = 0; i < y.length; i++) {
            let index = categories.indexOf(x[i]);
            let s = series.filter(function (obj) {
                return obj.name === cat[i];
            });
            s[0]["data"][index] = y[i];
        }
    }

    return {data:data, categories:categories, series:series};
};