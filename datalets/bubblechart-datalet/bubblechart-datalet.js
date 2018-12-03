import BaseDatalet from '../base-datalet/base-datalet.js';

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
            this.set_behaviours(['../lib/modules/AjaxJsonAlasqlBehavior.js', '../lib/modules/HighChartsBehavior.js'], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#bubblechart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - bubblechart-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('../lib/vendors/highstock/highcharts-more.js');
        await this.import_module('../lib/vendors/highstock/themes/themes.js');

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

        let options = {
            chart: {
                type: 'bubble',
                zoomType: 'xy',
                plotBorderWidth: 1
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: this.getAttribute("xAxisLabel")
                }
            },
            yAxis: {
                title: {
                    text: this.getAttribute("yAxisLabel")
                }
            },
            plotOptions: {
                bubble: {
                    dataLabels: {
                        enabled: this.getAttribute("dataLabels")
                    }
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.content}'
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: properties_series
        };

        if(this.getAttribute("legend") === "topRight")
            options.legend = {
                layout: 'vertical',
                verticalAlign: 'top',
                align: 'right',
                x: -4,
                y: 4,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts[this.getAttribute("theme")] && Highcharts[this.getAttribute("theme")].legendBackgroundColor) || '#FFFFFF'),
                shadow: true
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
            //Object.assign(options, Highcharts[this.getAttribute("theme")]);

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);

    }
}


const FrozenBubblechartDatalet = Object.freeze(BubblechartDatalet);
window.customElements.define('bubblechart-datalet', FrozenBubblechartDatalet);