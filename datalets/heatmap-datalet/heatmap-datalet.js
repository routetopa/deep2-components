import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class HeatpmapDatalet extends BaseDatalet
{
    constructor()
    {
        super('heatmap-datalet');
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
        //console.log('RENDER - heatmap-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highcharts/heatmap.js');

        let Xcategories = data.categories;
        let Ycategories = [];
        let series = [];

        for (let i = 0; i < data.series.length; i++) {
            Ycategories.push(data.series[i].name);
            for (let j = 0; j < data.series[i].data.length; j++) {
                series.push([j, i, data.series[i].data[j]]);
            }
        }

        let min = 0, max = 0;
        for (let i in data.series) {
            min = Math.min(Math.min.apply(Math, data.series[i].data), min);
            max = Math.max(Math.max.apply(Math, data.series[i].data), max);
        }

        let stops = false;
        if (min < 0) {
            stops = [[0, '#F44336'], [1, '#2196F3']];
            min = -Math.max(Math.abs(min), Math.abs(max));
            max = Math.max(Math.abs(min), Math.abs(max));
        }
        else
            stops = [[0, '#FFFFFF'], [1, Highcharts.getOptions().colors[0]]];

        let borderWidth = 1;
        if(data.series[0].data.length > 20)
            borderWidth = 0;

        let options = await builder.build('heatmap', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = (this.getAttribute("data-labels") == "true");
        let legend = this.getAttribute("legend");

        options.boost = {
            useGPUTranslations: true
        };

        options.xAxis.categories = Xcategories;

        options.yAxis.categories = Xcategories;

        options.colorAxis = {
            stops: stops,
            min: min,
            max: max,
        };

        options.tooltip = {
            formatter: function() {
                let s = '<span  style="color: #7cb5ec;">\u25CF</span> (' + this.series.yAxis.categories[this.point.y] + ', ' + this.series.xAxis.categories[this.point.x] + '): <b>' +  this.point.value + ' ' + suffix + '</b>';
                return s;
            },
            shared: true
        };

        options.series = [{
            data: series,
            boostThreshold: 100,
            borderWidth: borderWidth,
            nullColor: '#EFEFEF',
            dataLabels: {
                enabled:  dataLabels,
                formatter: function() {
                    return this.point.value + ' ' + suffix;
                }
            },
            turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
        }];

        if (legend === "topRight") {
            options.legend = {
                layout: 'vertical',
                verticalAlign: 'top',
                align: 'right',
                margin: 8,
                y: 28,
                symbolHeight: 280
            };
        }

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}

const FrozenHeatpmapDatalet = Object.freeze(HeatpmapDatalet);
window.customElements.define('heatmap-datalet', FrozenHeatpmapDatalet);