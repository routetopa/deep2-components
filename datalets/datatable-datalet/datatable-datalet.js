import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';

class DatatableDatalet extends BaseDatalet
{
    constructor()
    {
        super('datatable-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior], [0, 0, 0, 0]);
            this.export_to_img_doc = false;
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        return this.create_node(`
            <link rel="stylesheet" type="text/css" href="./js/DataTables/datatables.css"/> 
        `);
    }

    async render(data)
    {
        //console.log('RENDER - datatable-datalet');

        if (!this.thereis_jQuery())
            await this.import_module('../lib/vendors/jquery/jquery.js');

        await this.import_module('./js/DataTables/datatables.js');

        let html = '<table id="datatable" class="stripe row-border" cellspacing="0" style="height: auto; width: auto;">';

        if (!data || data[0] === undefined) return;

        html += '<thead>' +
            '<tr>';
        for (let x = 0; x < data.length; x++) {
            html += '<th>' + data[x].name + '</th>';
        }
        html += '</tr>' +
            '</thead>' +
            '<tbody>';
        for (let i = 0; i < data[0].data.length; i++) {
            html += '<tr>';
            for (let x = 0; x < data.length; x++) {
                html += '<td>' + data[x].data[i] + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody>';

        html += '</table>';

        let container = this.shadowRoot.querySelector('#datalet_container');

        container.innerHTML = html;

        let h = $(container).height() - 120;
        h = Math.max(h, 280);

        //if <10 or seleziono un numero di righe tale che non c'è scrolling elimino paginazione
        let table = $(container).find('#datatable').DataTable({
            "order": [],
            "scrollY": h,
            "scrollX": true,
            "scrollCollapse": true,
        });
    }
}

const FrozenDatatableDatalet = Object.freeze(DatatableDatalet);
window.customElements.define('datatable-datalet', FrozenDatatableDatalet);