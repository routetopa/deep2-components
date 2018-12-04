import BaseDatalet from '../base-datalet/base-datalet.js';

class ColumnchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('columnchart-datalet');
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
        const template = this.currentDocument.querySelector('#columnchart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - columnchart-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

        let options = await builder.build('column', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = this.getAttribute("data-labels");

        options.plotOptions.column = {
            dataLabels: {
                formatter: function() {
                    return this.y + ' ' + suffix;
                },
                enabled: dataLabels
            }
        };

        if(data.series[0].data.length > 20)
            Highcharts.stockChart(this.shadowRoot.querySelector('#datalet_container'), options);
        else
            Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenColumnchartDatalet = Object.freeze(ColumnchartDatalet);
window.customElements.define('columnchart-datalet', FrozenColumnchartDatalet);