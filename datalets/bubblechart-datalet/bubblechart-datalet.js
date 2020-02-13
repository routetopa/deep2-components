import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class BubblechartDatalet extends BaseDatalet
{
    constructor()
    {
        super('bubblechart-datalet');
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
        //console.log('RENDER - bubblechart-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highcharts/highcharts-more.js');
        await this.import_module('../lib/vendors/highcharts/themes/themes.js');

        let properties_series;

        if(data.data.length === 5) {// multiseries
            let x = data.data[4]["data"];

            let categories = x.filter(function (item, pos) {
                return x.indexOf(item) === pos;
            });

            let bubbleSeries = [];
            let series = [];
            let point = [];

            for (let i = 0; i < categories.length; i++) {
                for (let j = 0; j < x.length; j++) {
                    if (data.data[4].data[j] === categories[i]) {
                        point = {x: data.data[0].data[j], y: data.data[1].data[j], z: data.data[2].data[j], content: data.data[3].data[j]};
                        series.push(point);
                    }
                }

                bubbleSeries.push({name: categories[i], data: series});
                series = [];
            }

            properties_series = bubbleSeries;

        }
        else {// == 4
            let bubbleSeries = [];
            let series = [];
            let point = [];

            for (let j = 0; j < data.data[0]["data"].length; j++) {
                point = {x: data.data[0].data[j], y: data.data[1].data[j], z: data.data[2].data[j], content: data.data[3].data[j]};
                series.push(point);
            }

            bubbleSeries.push({data: series});
            properties_series = bubbleSeries;
        }

        let options = await builder.build('bubble', this, data);

        let dataLabels = (this.getAttribute("data-labels") == "true");

        options.series = properties_series;
        options.plotOptions = {
            bubble: {
                dataLabels: {
                    enabled: dataLabels
                }
            },
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.content}'
                }
            }
        };

        delete options.tooltip;

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);

    }
}


const FrozenBubblechartDatalet = Object.freeze(BubblechartDatalet);
window.customElements.define('bubblechart-datalet', FrozenBubblechartDatalet);