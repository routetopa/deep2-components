import BaseDatalet from '../base-datalet/base-datalet.js';

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
            this.set_behaviours(['../lib/modules/AjaxJsonAlasqlBehavior.js', '../lib/modules/HighChartsBehavior.js'], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#wordcloud-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - wordcloud-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('https://code.highcharts.com/modules/wordcloud.js');

        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

        let options = await builder.build('wordcloud', this, data);

        let series = [];

        for(let i = 0; i < data.categories.length; i++)
            series.push({name: data.categories[i], weight: data.series[0].data[i]})

        data.series = series;


        options.series = [{
            type: 'wordcloud',
            data: data.series
        }];

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenWordcloudDatalet = Object.freeze(WordcloudDatalet);
window.customElements.define('wordcloud-datalet', FrozenWordcloudDatalet);