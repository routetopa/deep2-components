import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import './leafletjs/leaflet.js';

class LeafletGeoJsonDatalet extends BaseDatalet
{
    constructor()
    {
        super('leafletjs-geojson-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior]);
        } catch (e) {
            console.log(e);
        }
    }

    template()
    {
        return this.create_node(`
            <link rel="stylesheet" href="./leafletjs/leaflet.css">        
        `);
    }

    async render(data)
    {
        //console.log('RENDER - leaflet-geojson-datalet');

        try
        {
            let map = L.map(this.shadowRoot.querySelector('#datalet_container')).setView([0, 0], 13, {reset: true});

            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.Icon.Default.imagePath = `${this.baseUri}leafletjs/images/`;

            let geo_layer = L.geoJson();
            let geo;

            for (let i = 0; i < data[0].data.length; i++) {
                if (Array.isArray(data[0].data[i])) {
                    if (!isNaN(data[0].data[i][0]) && !isNaN(data[0].data[i][1])) {
                        //coordinates.push([parseFloat(t.data[0].data[i][0]), parseFloat(t.data[0].data[i][1])]);
                        geo_layer.addData({
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [parseFloat(data[0].data[i][0]), parseFloat(data[0].data[i][1])]
                            }
                        });
                    } else
                        continue;
                }
                else if (typeof data[0].data[i] === 'object') {
                    geo = L.geoJson(data[0].data[i]).addTo(map);
                    geo_layer.addData(data[0].data[i]);
                }
                else if (typeof data[0].data[i] === 'string' && data[0].data[i].startsWith('{"type":"')) {
                    try {
                        data[0].data[i] = JSON.parse(data[0].data[i]);
                        geo = L.geoJson(data[0].data[i]).addTo(map);
                        geo_layer.addData(data[0].data[i]);
                    } catch (e) {
                        continue;
                    }
                }
                else if (typeof data[0].data[i] === 'string' && data[0].data[i].indexOf(",")) {
                    let coords = data[0].data[i].split(",");
                    if (!isNaN(coords[0]) && !isNaN(coords[1])) {
                        //coordinates.push([parseFloat(coords[0]), parseFloat(coords[1])]);
                        geo_layer.addData({
                            "type": "Feature",
                            "geometry": {"type": "Point", "coordinates": [parseFloat(coords[0]), parseFloat(coords[1])]}
                        });
                        geo = L.marker([parseFloat(coords[0]), parseFloat(coords[1])]).addTo(map);
                        //coordinates_index++;
                    } else
                        continue;
                }

                if (data.length > 1) {
                    let popupText = "";
                    for (let j = 1; j < data.length; j++) {
                        if (data[j].data[i] && typeof data[j] !== 'undefined' && data[j].data[i] && typeof data[j].data[i] !== 'undefined') {
                            if (data[j].data[i].toString().match(new RegExp("(https?:\/\/.*\.(?:png|jpg|jpeg|gif))", 'i')))
                                popupText += '<image height="100" width="100" src="' + data[j].data[i] + '" /><br/>';
                            else if (data[j].data[i].toString().match(new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[0-9a-zA-Z]{1,3})+)(/(.)*)?(\\?(.)*)?")))
                                popupText += 'link : <a href="' + data[j].data[i] + '">' + data[j].name + '</a><br/>'
                            else
                                popupText += '<span>' + data[j].name + ' : ' + data[j].data[i] + '</span><br/>'
                        }
                    }

                    let popup = L.popup().setContent(popupText);
                    geo.bindPopup(popup);
                }
            }

            map._onResize();
            map.invalidateSize(false);
        } catch (e) {
            console.log()
        }
    }
}


const FrozenLeafletGeoJsonDatalet = Object.freeze(LeafletGeoJsonDatalet);
window.customElements.define('leafletjs-geojson-datalet', FrozenLeafletGeoJsonDatalet);