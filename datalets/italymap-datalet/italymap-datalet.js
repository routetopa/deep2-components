import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighMapsBehavior from '../lib/modules/HighMapsBehavior.js';
import '../lib/vendors/highcharts/highstock.js';
import '../lib/vendors/highmaps/js/map.js';
import '../lib/vendors/highmaps/themes/themes.js';

class ItalymapDatalet extends BaseDatalet
{
    constructor()
    {
        super('italymap-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior, HighMapsBehavior], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#italymap-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - italymap-datalet');

        let mapIndex = this.getAttribute("map").split("_")[0];
        let map;

        switch (mapIndex) {
            case "1":
                await this.import_module('./maps/it-region.js');
                map ="countries/it/it-region";
                break;
            case "2":
                await this.import_module('./maps/it-all.js');
                map = "countries/it/it-all";//it-province
                break;
            case "3":
                await this.import_module('./maps/it-campania-province.js');
                map = "countries/it/it-campania-province";
                break;
            case "4":
                await this.import_module('./maps/it-campania-municipality.js');
                map = "countries/it/it-campania-municipality";
                break;
        }

        let arrayMap = Highcharts.maps[map].features;
        let obj;
        for (let i=0; i < data.series.length; i++) {
            obj =  arrayMap.find(x => x.properties["name"].toLowerCase() === data.series[i][0].trim().toLowerCase());
            if(obj)
                data.series[i][0] =  obj.properties["hc-key"];
            else
                data.series[i] = undefined;
        }

        data.series = data.series.filter(function(n){ return n !== undefined });
        const pointsInfo = JSON.parse(JSON.stringify(data.data));

        let min = 0, max = 0;
        for (let i in data.series) {
            min = Math.min(data.series[i][1], min);
            max = Math.max(data.series[i][1], max);
        }

        let stops = false;
        if (min < 0) {

            min = -Math.max(Math.abs(min), Math.abs(max));
            max = Math.max(Math.abs(min), Math.abs(max));
        }
        else
            stops = [[0, '#FFFFFF'], [1, Highcharts.getOptions().colors[0]]];
        //stops = [[0, '#F44336'], [1, '#2196F3']];

        let suffix = this.getAttribute("suffix");

        let options = {
            chart: {
                map: map
            },

            title: false,

            exporting: {
                enabled: false
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            series: [{
                data: data.series,
                dataLabels: {
                    enabled:  this.getAttribute("dataLabels"),
                    format: '{point.name}'
                }
            }],

            colorAxis: {
                stops: stops,
                min: min,
                max: max,
            },

            tooltip: {
                useHTML: true,
                shared: true,
                formatter: function() {
                    let name = this.point ? this.point["name"] : '';
                    let index = pointsInfo[0].data.findIndex(x => x.trim().toLowerCase() === name.trim().toLowerCase());

                    let s = "";
                    for (let i=0; i < pointsInfo.length; i++) {
                        if (pointsInfo[i].data[index] && pointsInfo[i].data[index].toString().match(new RegExp("(https?:\/\/.*\.(?:png|jpg|jpeg|gif))", 'i')))
                            s += '<image height="124" width="124" style="object-fit: contain;" src="' + pointsInfo[i].data[index] + '" /><br>';
                        else
                            s += '<span  style="color: #7cb5ec;">\u25CF</span> ' + pointsInfo[i].name + ': <b>' + pointsInfo[i].data[index] + ' ' + (i == 1 ? suffix : '') + '</b><br>';
                    }
//                            var s = '<span  style="color: #7cb5ec;">\u25CF</span> ' + this.point.name + ': <b>' +  this.point.value + ' ' + suffix + '</b>';
                    return s;
                }
            },

            credits: {
                enabled: false
            }
        };

        if(this.getAttribute("legend") === "topRight")
            options.legend = {
                layout: 'vertical',
                verticalAlign: 'top',
                align: 'right',
                margin: 8,
                y: 28,
                symbolHeight: 280,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            };
        else if(this.getAttribute("legend") === "bottom")
            options.legend = {
                enabled: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
            };
        else
            options.legend ={
                enabled: false
            };

        //if(t.getAttribute("theme") !== "themeBase" && t.getAttribute("theme") !== "")
            //jQuery.extend(true, options, Highcharts[t.getAttribute("theme")]);

        Highcharts.mapChart(this.shadowRoot.querySelector('#datalet_container'), options);

    }
}


const FrozenItalymapDatalet = Object.freeze(ItalymapDatalet);
window.customElements.define('italymap-datalet', FrozenItalymapDatalet);