export const transformData = function (data)
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

    return {data:data, series:series};
};