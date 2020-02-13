import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class ScatterchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('scatterchart-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior, HighChartsBehavior], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        return this.create_node('');
    }

    async render(data)
    {
        //console.log('RENDER - scatterchart-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');

        let properties_series;

        if (data.data.length === 3) {// multiseries
            let x = data.data[2]["data"];

            let categories = x.filter(function (item, pos) {
                return x.indexOf(item) === pos;
            });

            let scatterSeries = [];
            let series = [];
            let point = [];

            for (let i = 0; i < categories.length; i++) {
                for (let j = 0; j < x.length; j++) {
                    if (data.data[2].data[j] === categories[i]) {
                        point = [data.data[0].data[j], data.data[1].data[j]];
                        series.push(point);
                    }
                }

                scatterSeries.push({name: categories[i], data: series});
                series = [];
            }

            properties_series = scatterSeries;
        }
        else {// == 2
            let scatterSeries = [];
            let series = [];
            let point = [];

            for (let j = 0; j < data.data[0]["data"].length; j++) {
                point = [data.data[0].data[j], data.data[1].data[j]];
                series.push(point);
            }

            scatterSeries.push({data: series});

            properties_series = scatterSeries;
        }

        let options = await builder.build('scatter', this, data);

        let dataLabels = (this.getAttribute("data-labels") == "true");

        options.series = properties_series;
        options.plotOptions = {
            scatter: {
                dataLabels: {
                    enabled: dataLabels
                }
            },
        };

        delete options.tooltip;

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenScatterchartDatalet = Object.freeze(ScatterchartDatalet);
window.customElements.define('scatterchart-datalet', FrozenScatterchartDatalet);