import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';

class MediaSliderDatalet extends BaseDatalet
{
    constructor()
    {
        super('mediaslider-datalet');
    }

    handle_behaviour() {

        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        return this.create_node(`
            <link title="timeline-styles" rel="stylesheet" href="./js/camera.css">
        `);
    }

    async render(data)
    {
        //console.log('RENDER - mediaslider-datalet');

        if(!this.thereis_jQuery())
            await this.import_module('../lib/vendors/jquery/jquery.js');

        await this.import_module('./js/camera.min.js');
        await this.import_module('./js/jquery.easing.1.3.js');
        await this.import_module('./js/jquery.easing.compatibility.js');

        if(!data || data[0] === undefined) return;

        let pagination = true;
        if(data[0].data.length > 16)
            pagination = false;

        let html = '';

        for(let i = 0; i < data[0].data.length; i++) {
            html += '<div data-src="' + data[0].data[i] + '">';

            if(data[1] && data[1].data[i] && data[1].data[i] !== "") {
                html += '<div class="camera_caption fadeFromBottom media_title">';
                html += '<span style="font-weight: 700; color: #2196F3;">' + data[1].data[i] + '</span>';
                if (data[2] && data[2].data[i] && data[2].data[i] !== "")
                    html += '</br><span style="font-style: italic">' + data[2].data[i] + '</span>';
                html += '</div>';
            } else if (data[2] && data[2].data[i] && data[2].data[i] !== "") {
                html += '<div class="camera_caption fadeFromBottom media_title">';
                html += '<span style="font-style: italic">' + data[2].data[i] + '</span>';
                html += '</div>';
            }

            html += '</div>';
        }

        //random name?
        let h = $(this.shadow_root.querySelector('#datalet_container')).height();
        h = Math.max(h, 482);
        h -= 82;
        let w = 0;
        if(pagination)
            w = (h - 60) * 2;
        else
            w = h * 2;


        html = '<div id="camera_wrap" style="display:block; width: ' + w + 'px;">' + html + '</div>';
        $(this.shadow_root.querySelector('#datalet_container')).html(html);

        $(this.shadow_root.querySelector('#camera_wrap')).camera({
            height: '50%',
            loader: 'none',
            playPause: false,
            pagination: pagination,
            fx: this.getAttribute("animation"),
            slideOn: 'next'
        });
    }
}

const FrozenMediaSliderDatalet = Object.freeze(MediaSliderDatalet);
window.customElements.define('mediaslider-datalet', FrozenMediaSliderDatalet);