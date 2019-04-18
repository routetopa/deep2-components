export const transformData = function (data, selectedFields)
{
    if(data.length === 0)
        return;

    let series = [], arr = [];
    for (let j = 0; j < data[0].data.length; j++) {
        arr = [];
        for (let i=0; i < data.length; i++)
            arr.push(data[i].data[j]);
        series.push(arr);
    }

    selectedFields = JSON.parse(selectedFields);

    let inputs = [];
    for (let i = 0; i < selectedFields.length; i++)
        if (selectedFields[i])
            inputs.push(selectedFields[i].field);

    let categories = null;
    let cat_index = inputs.indexOf("Categories");

    if (cat_index != -1)
    {
        categories =  data[cat_index].data;

        categories = categories.filter(function(value, index) {
            return categories.indexOf(value) === index
        });
    }

    return {data:data, categories:categories, series:series};
};