import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import './leafletjs/leaflet.js';

class LeafletDatalet extends BaseDatalet
{
    constructor()
    {
        super('leafletjs-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior]);
            // this.export_to_img_doc = false;
            this.map = null;
        } catch (e) {
            console.log(e);
        }
    }

    template()
    {
        return this.create_node(`
            <link rel="stylesheet" href="./leafletjs/leaflet.css">
            <link rel="stylesheet" href="./leafletjs/marker_cluster/dist/MarkerCluster.css">
            <link rel="stylesheet" href="./leafletjs/marker_cluster/dist/MarkerCluster.Default.css">          
        `);
    }

    async render(data)
    {
        //console.log('RENDER - leafletjs-datalet');

        await this.import_module('./leafletjs/marker_cluster/dist/leaflet.markercluster.js');
        await this.import_module('./leafletjs/easy_print/dist/bundle.js');
        await this.import_module('./leafletjs/providers/leaflet-providers.js');

        //let map;
        let categories;

        L.Icon.Default.imagePath = `${this.baseUri}leafletjs/images/`;

        let blueIcon   = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-blue.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
        let redIcon    = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-red.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
        let greenIcon  = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-green.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
        let orangeIcon = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-orange.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]});
        let yellowIcon = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-yellow.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
        let violetIcon = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-violet.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
        let greyIcon   = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-grey.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
        let blackIcon  = new L.Icon({iconUrl: L.Icon.Default.imagePath + 'marker-icon-2x-black.png', shadowUrl: L.Icon.Default.imagePath + 'marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

        let icons = [blueIcon, redIcon, greenIcon, orangeIcon, yellowIcon, violetIcon, greyIcon, blackIcon];

        let selectedFields = JSON.parse(this.selected_fields);

        let cat_index = -1;
        let cat_counter = 0;
        for (let i=0; i < selectedFields.length; i++)
        {
            if (selectedFields[i]) {
                if(selectedFields[i].field === "Categories")
                    cat_index = cat_counter;
                cat_counter++;
            }
        }

        if(cat_index > -1) {
            categories = [];
            let cat, catIndex;

            for(let i=0; i<data[cat_index].data.length; i++)
            {
                cat = data[cat_index].data[i];
                catIndex = -1;

                for(let j=0; j<categories.length; j++)
                {
                    if(categories[j].name === cat)
                    {
                        catIndex = j;
                        break;
                    }
                }

                if (catIndex === -1)
                {
                    categories.push({name: cat, frequency: 1});
                }
                else
                {
                    categories[catIndex].frequency++;
                }

            }

            categories.sort(function(a,b) {return (a.frequency < b.frequency) ? 1 : ((b.frequency < a.frequency) ? -1 : 0);} );

            for(let i=0; i<data[cat_index].data.length; i++)
            {
                cat = data[cat_index].data[i];

                catIndex = -1;
                for(let j=0; j<categories.length; j++)
                {
                    if(categories[j].name === cat)
                    {
                        catIndex = j;
                        break;
                    }
                }
                if (catIndex >= 8) {
                    data[cat_index].data[i] = 7;
                }
                else {
                    data[cat_index].data[i] = catIndex;
                }
            }

            if(categories.length > 8)
                categories[7].name = '...';

        }

        try{
            this.map = L.map(this.shadowRoot.querySelector('#datalet_container')).setView([0, 0], 13, {reset:true});
        }catch(e){}

        // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 18,
        //     attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        // }).addTo(this.map);

        let layer = this.getAttribute("layer");
        if(!layer || layer == "")
            layer = "OpenStreetMap";

        let tiles = L.tileLayer.provider(layer).addTo(this.map);

        let coordinates = [];
        let coordinates_index  = 0;
        let isArray = data[0].data[0] ? data[0].data[0].constructor === Array : false;
        let geo;
        let markers_cluster = L.markerClusterGroup({ disableClusteringAtZoom: 17 });

        this.printer = L.easyPrint({
            tileLayer: tiles,
            // sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
            // filename: 'myMap',
            exportOnly: true,
            hideControlContainer: false,
            hidden: true
        }).addTo(this.map);

        for(let i=0; i<data[0].data.length; i++)
        {
            if(isArray)
            {
                if(!isNaN(data[0].data[i][0]) && !isNaN(data[0].data[i][1])) {
                    coordinates.push([parseFloat(data[0].data[i][0]), parseFloat(data[0].data[i][1])]);
                    geo = L.marker([coordinates[coordinates_index][0], coordinates[coordinates_index][1]], {icon: categories ? icons[data[cat_index].data[i]] : icons[0]});//.addTo(t._component.map);
                    markers_cluster.addLayer(geo);
                    coordinates_index++;
                }
                else
                    continue;
            }
            else if(typeof data[0].data[i] === 'string' && data[0].data[i].indexOf('{"type":"') === 0)
            {
                try
                {
                    data[0].data[i] = JSON.parse(data[0].data[i]);
                    geo = L.geoJson(data[0].data[i]).addTo(this.map);
                }catch(e) {continue;}
            }
            else if(typeof data[0].data[i] === 'string' && data[0].data[i].indexOf(","))
            {
                let coords = data[0].data[i].split(",");
                if(!isNaN(coords[0]) && !isNaN(coords[1])) {
                    coordinates.push([parseFloat(coords[0]), parseFloat(coords[1])]);
                    geo = L.marker([coordinates[coordinates_index][0], coordinates[coordinates_index][1]], {icon: categories ? icons[data[cat_index].data[i]] : icons[0]});//.addTo(t._component.map);
                    markers_cluster.addLayer(geo);
                    coordinates_index++;
                }else
                    continue;
            }
            else
            {
                if( (!isNaN(data[0].data[i]) && !isNaN(data[1].data[i])) && (data[0].data[i] && data[1].data[i]) ) {
                    coordinates.push([parseFloat(data[0].data[i]), parseFloat(data[1].data[i])]);
                    geo = L.marker([coordinates[coordinates_index][0], coordinates[coordinates_index][1]], {icon: categories ? icons[data[cat_index].data[i]] : icons[0]});//.addTo(t._component.map);
                    markers_cluster.addLayer(geo);
                    coordinates_index++;
                }else
                    continue;
            }


            let l = data.length;
            if(cat_index > -1) l--;

            if(l > 2)
            {
                let popupText = "";

                for(let j=2; j<l; j++) /* -1 IF CAT INDEX*/
                {
                    if(typeof data[j] !== 'undefined' && typeof data[j].data[i] !== 'undefined' && data[j].data[i] !== null)
                    {
                        if (data[j].data[i].toString().match(new RegExp("(https?:\/\/.*\.(?:png|jpg|jpeg|gif))", 'i')))
                            popupText += '<image height="100" width="100" src="' + data[j].data[i] + '" /><br/>';
                        else if (data[j].data[i].toString().match(new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[0-9a-zA-Z]{1,3})+)(/(.)*)?(\\?(.)*)?")))
                            popupText += 'link : <a href="' + data[j].data[i] + '">' + data[j].name + '</a><br/>';
                        else
                            popupText += '<span>' + data[j].name + ' : ' + data[j].data[i] + '</span><br/>'
                    }
                }

                let popup = L.popup().setContent(popupText);
                geo.bindPopup(popup);
            }
        }

        if(cat_index > -1) {
            let legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {

                let div = L.DomUtil.create('div', 'info legend');

                for (let i = 0; i < Math.min(categories.length, 8); i++) {
                    div.innerHTML += '<div> <img src=' + icons[i].options.iconUrl + '> ' + categories[i].name + '</div>';
                }

                return div;
            };

            legend.addTo(this.map);
        }

        try
        {
            this.coordinates = coordinates;
            this.map._onResize();
            this.map.invalidateSize(false);
            this.map.fitBounds(coordinates);
            this.map.addLayer(markers_cluster);
        }catch (e){
            console.log(e);
        }
    }

    save_as_png() {
        let component = this.shadow_root.querySelector('#img-iframe').contentWindow.document.querySelector(this.component);
        this._save_as_png(component);
    }

    _save_as_png(component) {
        let container = component.shadowRoot.querySelector('#datalet_container');
        let controlContainer = container.getElementsByClassName("leaflet-control-container")[0];

        component.map.on("easyPrint-finished", ()=>{
            container.style.width = '100%';
            container.style.height = '100%';
            controlContainer.style.display = 'block';
        });

        container.style.width = container.clientWidth + 'px';
        container.style.height = container.clientHeight + 'px';
        controlContainer.style.display = 'none';

        component.printer.printMap('CurrentSize', `${this.component}`);
    }

    create_image() {
        return new Promise((res, rej) =>
        {
            this.map.on("easyPrint-finished", (e)=>{
                var reader = new FileReader();
                reader.readAsDataURL(e.blob);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    res(base64data);
                }
            });

            this._save_as_png(this);
        });
    }

    redraw () {debugger
        try {
            this.map._onResize();
            this.map.invalidateSize(false);
            this.map.fitBounds(this.coordinates);
        } catch (e) {
            console.log(e);
        }
    }
}


const FrozenLeafletDatalet = Object.freeze(LeafletDatalet);
window.customElements.define('leafletjs-datalet', FrozenLeafletDatalet);