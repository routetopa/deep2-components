import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class WordcloudDatalet extends BaseDatalet
{
    constructor()
    {
        super('wordcloud-datalet');
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
        //console.log('RENDER - wordcloud-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highcharts/wordcloud.js');

        let options = await builder.build('wordcloud', this, data);

        let series = [];

        for(let i = 0; i < data.categories.length; i++)
            series.push({name: data.categories[i], weight: data.series[0].data[i]})

        data.series = series;

        options.series = [{
            type: 'wordcloud',
            data: data.series
        }];

        delete options.tooltip;
        delete options.legend;

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenWordcloudDatalet = Object.freeze(WordcloudDatalet);
window.customElements.define('wordcloud-datalet', FrozenWordcloudDatalet);