import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class PiechartDatalet extends BaseDatalet
{
    constructor()
    {
        super('piechart-datalet');
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
        //console.log('RENDER - piechart-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highcharts/highcharts-more.js');

        let series = [{"name": data.data[1].name, "data": []}];

        let sum = 0;
        for(let i = 0; i < data.data[0].data.length; i++)
            sum += data.data[1].data[i];

        let other = ['other', 0];
        for(let i = 0; i < data.data[0].data.length; i++) {
            if (data.data[0].data.length <= 20 || data.data[1].data[i] / sum >= 0.02) {
                let slice = ['' + data.data[0].data[i], data.data[1].data[i]];
                series[0].data.push(slice);
            }
            else {
                other[1] += data.data[1].data[i];
            }
        }

        if(other[1] > 0)
            series[0].data.push(other);

        let innerSize = 0;
        if(this.getAttribute("donut") === "true")
            innerSize = 100;

        data.series = series;

        let options = await builder.build('pie', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = (this.getAttribute("data-labels") == "true");
        let theme = this.getAttribute("theme");

        options.tooltip = {
            valueSuffix: ' ' + suffix
        };
        options.plotOptions.pie = {
            innerSize: innerSize,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: dataLabels,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                color: (Highcharts[theme] && Highcharts[theme].contrastTextColor) || 'black',
            },
            showInLegend: true
        };

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenPiechartDatalet = Object.freeze(PiechartDatalet);
window.customElements.define('piechart-datalet', FrozenPiechartDatalet);