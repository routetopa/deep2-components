import BaseDatalet from '../base-datalet/base-datalet.js';

class TreemapDatalet extends BaseDatalet
{
    constructor()
    {
        super('treemap-datalet');
        this.map = {name : '', children : []};
    }

    async handle_behaviour()
    {
        try
        {
            if(!this.thereis_jQuery())
                await this.import_module('../lib/vendors/jquery/jquery.js');

            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours(['../lib/modules/AjaxJsonAlasqlBehavior.js', {transformData: this.transformData}], [0,0,0,1]);
        } catch (e) {
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#treemap-datalet');
        return template.content.cloneNode(true);
    }

    transformData(data, fields)
    {
        let findChild = function(child, category)
        {
            let children = child.children;
            for (let i=0; i<children.length; i++) {
                if (children[i].name === category)
                    return children[i];
            }
            let nchild = {name : category , children : []};
            children.push(nchild);
            return nchild;
        };

        let checkAggragationField = function(object, levels, value_index, map)
        {
            let curchild = map;
            let keys = Object.keys(object);
            for(let level= 0; level < levels; level++)
            {
                let child = findChild(curchild, object[keys[level]]);
                curchild = child;
            }

            if (curchild.value === undefined)
                curchild.value = 0;

            let value = curchild.value + parseFloat(object[keys[value_index]]);
            curchild.children = null;
            curchild.value = value;
        };

        let treemapData = [];

        for (let i = 0; i < data.length; i++)
        {
            let propName = data[i].name;

            for (let j = 0; j < data[i].data.length; j++)
            {
                if (i === 0) treemapData[j] = {};
                let currObj = {};
                currObj[propName] = data[i].data[j];
                jQuery.extend(treemapData[j], currObj);
            }
        }

        this.map.children = [];

        for(let i = 0; i < treemapData.length; i++)
            checkAggragationField(treemapData[i], data.length , data.length - 1, this.map);
    };

    async render(data)
    {
        console.log('RENDER - treemap-datalet');

        this.map.name = this.getAttribute('datalettitle');

        let builder = await this.import_module('./js/buildtreemap.js');

        builder.default(this.map, this.shadowRoot.querySelector('#datalet_container'));
    }
}


const FrozenTreemapDatalet = Object.freeze(TreemapDatalet);
window.customElements.define('treemap-datalet', FrozenTreemapDatalet);