import BaseDatalet from '../base-datalet/base-datalet.js';

class BarchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('barchart-datalet');
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
        const template = this.currentDocument.querySelector('#barchart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - barchart-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('../lib/vendors/highstock/themes/themes.js');
        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

        builder.build('bar', this, data);
    }
}

const FrozenBarchartDatalet = Object.freeze(BarchartDatalet);
window.customElements.define('barchart-datalet', FrozenBarchartDatalet);