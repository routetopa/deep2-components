import BaseDatalet from '../base-datalet/base-datalet.js';

class PolarspiderDatalet extends BaseDatalet
{
    constructor()
    {
        super('polarspider-datalet');
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
        const template = this.currentDocument.querySelector('#polarspider-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - polarspider-datalet');

        // await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('https://code.highcharts.com/stock/highstock.js');
        await this.import_module('https://code.highcharts.com/highcharts-more.js');
        // alert("aggiorna tutte le librerie");

        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

        // let options = await builder.build('polar', this, data);
        //
        // let suffix = this.getAttribute("suffix");
        // let dataLabels = this.getAttribute("data-labels");
        // let theme = this.getAttribute("theme");
        //
        // options.chart = {
        //     polar: true,
        //     type: 'line'
        // };
        //
        // options.pane = {
        //     size: '80%'
        // };
        //
        // options.xAxis = {
        //     categories: data.categories,
        //     title: {
        //         text: this.getAttribute("x-axis-label")
        //     },
        //     labels: {
        //         formatter: function () {
        //             let value = this.value;
        //             if (value && value.length > 10)
        //                 value = value.substring(0, 10) + '...';
        //             return value;
        //         }
        //     },
        //     tickmarkPlacement: 'on',
        //     lineWidth: 0
        // };
        //
        // options.yAxis = {
        //     title: {
        //         text: this.getAttribute("y-axis-label"),
        //     },
        //     gridLineInterpolation: 'polygon',
        //     lineWidth: 0,
        //     min: 0
        // };
        //
        // options.plotOptions.column = {
        //     dataLabels: {
        //         formatter: function() {
        //             return this.y + ' ' + suffix;
        //         },
        //         enabled: dataLabels
        //     }
        // };

        let options = {

            chart: {
                polar: true,
                type: 'line'
            },

            title: {
                text: 'Budget vs spending',
                x: -80
            },

            pane: {
                size: '80%'
            },

            xAxis: {
                categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
                    'Information Technology', 'Administration'],
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },

            series: [{
                name: 'Allocated Budget',
                data: [43000, 19000, 60000, 35000, 17000, 10000],
                pointPlacement: 'on'
            }, {
                name: 'Actual Spending',
                data: [50000, 39000, 42000, 31000, 26000, 14000],
                pointPlacement: 'on'
            }]

        }

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenPolarspiderDatalet = Object.freeze(PolarspiderDatalet);
window.customElements.define('polarspider-datalet', FrozenPolarspiderDatalet);