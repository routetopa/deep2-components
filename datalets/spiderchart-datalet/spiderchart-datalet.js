import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class SpiderchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('spiderchart-datalet');
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
        const template = this.currentDocument.querySelector('#spiderchart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        //console.log('RENDER - spiderchart-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highcharts/highcharts-more.js');

        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

        let options = await builder.build('spider', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = (this.getAttribute("data-labels") == "true");

        options.chart = {
            polar: true,
            type: 'line'
        };

        options.plotOptions.line = {
            dataLabels: {
                formatter: function() {
                    return this.y + ' ' + suffix;
                },
                enabled: dataLabels
            }
        };

        // options.pane = {
        //     size: '80%'
        // };

        options.xAxis = {
            categories: data.categories,
            tickmarkPlacement: 'on',
            lineWidth: 0
        };

        options.yAxis = {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        };

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenSpiderchartDatalet = Object.freeze(SpiderchartDatalet);
window.customElements.define('spiderchart-datalet', FrozenSpiderchartDatalet);