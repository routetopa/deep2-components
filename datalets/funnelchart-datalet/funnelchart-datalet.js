import BaseDatalet from '../base-datalet/base-datalet.js';

class FunnelchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('funnelchart-datalet');
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
        const template = this.currentDocument.querySelector('#funnelchart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - funnelchart-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('https://code.highcharts.com/modules/funnel.js');
        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

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

        data.series = series;

        let options = await builder.build('funnel', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = this.getAttribute("data-labels");
        let theme = this.getAttribute("theme");

        options.tooltip = {
            valueSuffix: ' ' + suffix
        };

        options.plotOptions = {
            series: {
                dataLabels: {
                    enabled: dataLabels,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    color: (Highcharts[theme] && Highcharts[theme].contrastTextColor) || 'black',
                    softConnector: true
                },
                center: ['40%', '50%'],
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%'
            }
        };

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenFunnelchartDatalet = Object.freeze(FunnelchartDatalet);
window.customElements.define('funnelchart-datalet', FrozenFunnelchartDatalet);