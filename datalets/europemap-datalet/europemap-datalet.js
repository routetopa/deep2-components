import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighMapsBehavior from '../lib/modules/HighMapsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class EuropeMapDatalet extends BaseDatalet
{
    constructor()
    {
        super('europemap-datalet');
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
        return this.create_node('');
    }

    async render(data)
    {
        //console.log('RENDER - italymap-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highmaps/js/map.js');
        await this.import_module('../lib/vendors/highmaps/themes/themes.js');

        const test = [
            ['dk', 10], ['fo', 11], ['hr', 12], ['nl', 13], ['ee', 14], ['bg', 15],
            ['es', 16], ['it', 17], ['sm', 18], ['va', 19], ['tr', 20], ['mt', 21],
            ['fr', 22], ['no', 23], ['de', 24], ['ie', 25], ['ua', 26], ['fi', 27],
            ['se', 28], ['ru', 29], ['gb', 30], ['cy', 31], ['pt', 32], ['gr', 33],
            ['lt', 34], ['si', 35], ['ba', 36], ['mc', 37], ['al', 38], ['cnm', 39],
            ['nc', 40], ['rs', 41], ['ro', 42], ['me', 43], ['li', 44], ['at', 45],
            ['sk', 46], ['hu', 47], ['ad', 48], ['lu', 49], ['ch', 50], ['be', 51],
            ['kv', 52], ['pl', 53], ['mk', 54], ['lv', 55], ['by', 56], ['is', 57],
            ['md', 58], ['cz', 59]
        ];

        let map;
        await this.import_module('./maps/europe.js');
        map = "custom/europe";

        let arrayMap = Highcharts.maps[map].features;
        let obj;
        for(let i=0; i < data.series.length; i++){
            if(data.series[i][0].trim() == 'Czechia')
                data.series[i][0] = 'Czech Republic'
            if(data.series[i][0].trim() == 'The Netherlands')
                data.series[i][0] = 'Netherlands'
        }
        for (let i=0; i < data.series.length; i++) {
            obj =  arrayMap.find(x => x.properties["name"].toLowerCase() === data.series[i][0].trim().toLowerCase());
            if(obj)
                data.series[i][0] =  obj.properties["hc-key"];
            else
                data.series[i] = undefined;
        }


        data.series = data.series.filter(function(n){ return n !== undefined });
        const pointsInfo = JSON.parse(JSON.stringify(data.data));

        let options = await builder.build('map', this, data);

        let suffix = this.getAttribute("suffix");

        // delete options.chart;
        delete options.xAxis;
        delete options.yAxis;
        delete options.plotOptions;
        delete options.navigator;

        options.chart.map = map;

        options.mapNavigation = {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        };

        if(data.categories != null) {

            //todo BUG : with "transparent trick" only last serie tooltips works

            options.series = [];
            for(let i=0; i<data.categories.length; i++)
            {
                options.series.push(
                    {

                        data: data.series.filter(function(value) {return value[1] === data.categories[i]}),
                        nullColor: 'transparent',
                        dataLabels: {
                            enabled:  this.getAttribute("dataLabels"),
                            format: '{point.name}'
                        }
                    }
                );
            }

        } else {

            let min = 0, max = 0;
            for (let i in data.series) {
                min = Math.min(data.series[i][1], min);
                max = Math.max(data.series[i][1], max);
            }

            if (min < 0) {
                min = -Math.max(Math.abs(min), Math.abs(max));
                max = Math.max(Math.abs(min), Math.abs(max));
            }

            options.series = [{
                data: data.series,
                dataLabels: {
                    enabled:  this.getAttribute("dataLabels"),
                    format: '{point.name}'
                }
            }];

            options.colorAxis = {
                // stops
                min: min,
                max: max,
                minColor: "#FFFFFF",
                stops: [
                    [0, '#EFEFFF'],
                    [0.02, Highcharts.getOptions().colors[0]],
                    [
                        1,
                        Highcharts.color(Highcharts.getOptions().colors[0])
                            .brighten(-0.7).get()
                    ]
                ],
                maxColor: options.colors ? options.colors[0] : Highcharts.getOptions().colors[0]
            };
        }
        options.tooltip = {
            useHTML: true,
            shared: true,
            formatter: function() {
                let name = this.point ? this.point["name"] : '';
                for(let i = 0; i<pointsInfo[0].data.length; i++){
                    if(pointsInfo[0].data[i] == 'Czechia')
                        pointsInfo[0].data[i] = 'Czech Republic'
                    if(pointsInfo[0].data[i] == 'The Netherlands')
                        pointsInfo[0].data[i] = 'Netherlands'
                }
                let index = pointsInfo[0].data.findIndex(x => x.trim().toLowerCase() === name.trim().toLowerCase());

                let s = "";
                for (let i=0; i < pointsInfo.length; i++) {
                    if (pointsInfo[i].data[index] && pointsInfo[i].data[index].toString().match(new RegExp("(https?:\/\/.*\.(?:png|jpg|jpeg|gif))", 'i')))
                        s += '<image height="124" width="124" style="object-fit: contain;" src="' + pointsInfo[i].data[index] + '" /><br>';
                    else
                        s += '<span  style="color: #7cb5ec;">\u25CF</span> ' + pointsInfo[i].name + ': <b>' + pointsInfo[i].data[index] + ' ' + (i == 1 ? suffix : '') + '</b><br>';
                }
                return s;
            }
        };

        Highcharts.mapChart(this.shadowRoot.querySelector('#datalet_container'), options);

        //todo
        // colorAxis: {
        //     dataClasses: [{
        //         to: 3
        //     }, {
        //         from: 3,
        //         to: 10
        //     }, {
        //         from: 10,
        //         to: 30
        //     }, {
        //         from: 30,
        //         to: 100
        //     }, {
        //         from: 100,
        //         to: 300
        //     }, {
        //         from: 300,
        //         to: 1000
        //     }, {
        //         from: 1000
        //     }]
        // },
    }
}
const FrozenEuropemapDatalet = Object.freeze(EuropeMapDatalet);
window.customElements.define('europemap-datalet', FrozenEuropemapDatalet);