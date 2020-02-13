import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class TreemapDatalet extends BaseDatalet
{
    constructor()
    {
        super('treemap-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior, {transformData: this.transformData}], [0,0,0,1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        return this.create_node('');
    }

    transformData(data, selectedFields)
    {
        if (data.length === 0)
            return;

        let _data = [];
        let colors = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];
        let cat;

        for(let i = 0; i < data.length; i++) {
            cat = [];
            for(let j = 0; j < data[i].data.length; j++) { //max 1000
                let catIndex = cat.indexOf(data[i].data[j]);
                if(catIndex == -1) {
                    cat.push(data[i].data[j]);
                    _data.push({
                        parent: (i > 0) ? data[i-1].data[j] : null,
                        id: data[i].data[j],
                        name: data[i].data[j],
                        color: colors[(cat.length-1) % colors.length],
                        value: 0
                    })
                } else {
                    _data[catIndex].value++;
                }
            }
        }

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

        return {data:_data};
    };

    async render(data)
    {
        //console.log('RENDER - treemap-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highcharts/treemap.js');

        let options = await builder.build('heatmap', this, data);

        let dataLabels = (this.getAttribute("data-labels") == "true");

        delete options.tooltip;

        // options.series = [{
        //     type: "treemap",
        //     layoutAlgorithm: 'stripes',
        //     alternateStartingDirection: true,
        //     levels: [{
        //         level: 1,
        //         layoutAlgorithm: 'sliceAndDice',
        //         dataLabels: {
        //             enabled: dataLabels,
        //             align: 'left',
        //             verticalAlign: 'top',
        //             style: {
        //                 fontSize: '15px',
        //                 fontWeight: 'bold'
        //             }
        //         }
        //     }],
        //     data: data.data
        // }];

        options.series = [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            allowDrillToNode: true,
            animationLimit: 1000,
            dataLabels: {
                enabled: dataLabels
            },
            levelIsConstant: false,
            levels: [{
                level: 1,
                dataLabels: {
                    enabled: dataLabels
                },
                borderWidth: 3
            }],
            data: data.data
        }];

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}

const FrozenTreemapDatalet = Object.freeze(TreemapDatalet);
window.customElements.define('treemap-datalet', FrozenTreemapDatalet);
















