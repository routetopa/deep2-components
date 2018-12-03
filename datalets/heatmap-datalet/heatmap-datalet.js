import BaseDatalet from '../base-datalet/base-datalet.js';

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
            this.set_behaviours(['../lib/modules/AjaxJsonAlasqlBehavior.js', '../lib/modules/HighChartsBehavior.js'], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#heatmap-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - heatmap-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('../lib/vendors/highstock/heatmap.js');
        await this.import_module('../lib/vendors/highstock/themes/themes.js');

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

        let stockLimit = 20;
        let l = data.series[0].data.length;
        let borderWidth = 1;
        if (l > 20) {
            //this._component.dataLabels = false;
            borderWidth = 0;
        }

        let suffix = this.getAttribute("suffix");

        let options = {
            chart: {
                type: 'heatmap',
                zoomType: 'xy'
            },

            boost: {
                useGPUTranslations: true
            },

            title: {
                text: ''
            },

            xAxis: {
                categories: Xcategories,
                title: {
                    text: this.getAttribute("xAxisLabel")
                }
            },

            yAxis: {
                categories: Ycategories,
                title: {
                    text: this.getAttribute("yAxisLabel")
                }
            },

            colorAxis: {
                stops: stops,
                min: min,
                max: max,
            },

            tooltip: {
                formatter: function() {
                    let s = '<span  style="color: #7cb5ec;">\u25CF</span> (' + this.series.yAxis.categories[this.point.y] + ', ' + this.series.xAxis.categories[this.point.x] + '): <b>' +  this.point.value + ' ' + suffix + '</b>';
                    return s;
                },
                shared: true
            },

            series: [{
                data: series,
                boostThreshold: 100,
                borderWidth: borderWidth,
                nullColor: '#EFEFEF',
//                        colsize: 100, // one day
                dataLabels: {
                    enabled:  this.getAttribute("dataLabels"),
                    formatter: function() {
                        return this.point.value + ' ' + suffix;
                    }
                },
                turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
            }],

            credits: {
                enabled: false
            }
        };

        if(this.getAttribute("legend") === "topRight")
            options.legend = {
                layout: 'vertical',
                verticalAlign: 'top',
                align: 'right',
                margin: 8,
                y: 28,
                symbolHeight: 280
            };
        else if(this.getAttribute("legend") === "bottom")
            options.legend = {
                enabled: true
            };
        else
            options.legend ={
                enabled: false
            };

        //if(this.getAttribute("theme") !== "themeBase" && this.getAttribute("theme") !== "")
            //jQuery.extend(true, options, Highcharts[this.getAttribute("theme")]);

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);

    }
}


const FrozenHeatpmapDatalet = Object.freeze(HeatpmapDatalet);
window.customElements.define('heatmap-datalet', FrozenHeatpmapDatalet);