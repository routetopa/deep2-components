import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighMapsBehavior from '../lib/modules/HighMapsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

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
        return this.create_node('');
    }

    async render(data)
    {
        //console.log('RENDER - italymap-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');
        await this.import_module('../lib/vendors/highmaps/js/map.js');
        await this.import_module('../lib/vendors/highmaps/themes/themes.js');

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

        for(let i=0; i<data.series.length; i++) {
            data.series[i][0] = _calculateRegion(data.series[i][0]);
            data.data[0].data[i] = _calculateRegion(data.data[0].data[i]);
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
                        name: data.categories[i],
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
                maxColor: options.colors ? options.colors[0] : Highcharts.getOptions().colors[0]
            };
        }

        options.tooltip = {
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

        function _calculateRegion(sigla) {
            sigla = sigla.toUpperCase();
            for (let i in campania_labels)
                for (let j in campania_labels[i])
                    if(campania_labels[i][j].sigla == sigla)
                        return campania_labels[i][j].nome;

            return sigla;
        }
    }
}

const campania_labels = {
    "regioni": ["Sicilia", "Piemonte", "Marche", "Valle d'Aosta", "Toscana", "Campania", "Puglia", "Veneto", "Lombardia", "Emilia-Romagna", "Trentino-Alto Adige", "Sardegna", "Molise", "Calabria", "Abruzzo", "Lazio", "Liguria", "Friuli-Venezia Giulia", "Basilicata", "Umbria"],
    "Sicilia": [{
        "nome": "Agrigento ",
        "sigla": "AG"
    }, {
        "nome": "Caltanissetta ",
        "sigla": "CL"
    }, {
        "nome": "Catania ",
        "sigla": "CT"
    }, {
        "nome": "Enna ",
        "sigla": "EN"
    }, {
        "nome": "Messina ",
        "sigla": "ME"
    }, {
        "nome": "Palermo ",
        "sigla": "PA"
    }, {
        "nome": "Ragusa ",
        "sigla": "RG"
    }, {
        "nome": "Siracusa ",
        "sigla": "SR"
    }, {
        "nome": "Trapani ",
        "sigla": "TP"
    }],
    "Piemonte": [{
        "nome": "Alessandria ",
        "sigla": "AL"
    }, {
        "nome": "Asti ",
        "sigla": "AT"
    }, {
        "nome": "Biella ",
        "sigla": "BI"
    }, {
        "nome": "Cuneo ",
        "sigla": "CN"
    }, {
        "nome": "Novara ",
        "sigla": "NO"
    }, {
        "nome": "Torino ",
        "sigla": "TO"
    }, {
        "nome": "Verbano-Cusio-Ossola ",
        "sigla": "VB"
    }, {
        "nome": "Vercelli ",
        "sigla": "VC"
    }],
    "Marche": [{
        "nome": "Ancona ",
        "sigla": "AN"
    }, {
        "nome": "Ascoli Piceno ",
        "sigla": "AP"
    }, {
        "nome": "Macerata ",
        "sigla": "MC"
    }, {
        "nome": "Pesaro e Urbino ",
        "sigla": "PU"
    }],
    "Valle d'Aosta": [{
        "nome": "Aosta ",
        "sigla": "AO"
    }],
    "Toscana": [{
        "nome": "Arezzo ",
        "sigla": "AR"
    }, {
        "nome": "Firenze ",
        "sigla": "FI"
    }, {
        "nome": "Grosseto ",
        "sigla": "GR"
    }, {
        "nome": "Livorno ",
        "sigla": "LI"
    }, {
        "nome": "Lucca ",
        "sigla": "LU"
    }, {
        "nome": "Massa-Carrara ",
        "sigla": "MS"
    }, {
        "nome": "Pisa ",
        "sigla": "PI"
    }, {
        "nome": "Pistoia ",
        "sigla": "PT"
    }, {
        "nome": "Prato ",
        "sigla": "PO"
    }, {
        "nome": "Siena ",
        "sigla": "SI"
    }],
    "Campania": [{
        "nome": "Avellino ",
        "sigla": "AV"
    }, {
        "nome": "Benevento ",
        "sigla": "BN"
    }, {
        "nome": "Caserta ",
        "sigla": "CE"
    }, {
        "nome": "Napoli ",
        "sigla": "NA"
    }, {
        "nome": "Salerno ",
        "sigla": "SA"
    }],
    "Puglia": [{
        "nome": "Bari ",
        "sigla": "BA"
    }, {
        "nome": "Brindisi ",
        "sigla": "BR"
    }, {
        "nome": "Foggia ",
        "sigla": "FG"
    }, {
        "nome": "Lecce ",
        "sigla": "LE"
    }, {
        "nome": "Taranto ",
        "sigla": "TA"
    }],
    "Veneto": [{
        "nome": "Belluno ",
        "sigla": "BL"
    }, {
        "nome": "Padova ",
        "sigla": "PD"
    }, {
        "nome": "Rovigo ",
        "sigla": "RO"
    }, {
        "nome": "Treviso ",
        "sigla": "TV"
    }, {
        "nome": "Venezia ",
        "sigla": "VE"
    }, {
        "nome": "Verona ",
        "sigla": "VR"
    }, {
        "nome": "Vicenza ",
        "sigla": "VI"
    }],
    "Lombardia": [{
        "nome": "Bergamo ",
        "sigla": "BG"
    }, {
        "nome": "Brescia ",
        "sigla": "BS"
    }, {
        "nome": "Como ",
        "sigla": "CO"
    }, {
        "nome": "Cremona ",
        "sigla": "CR"
    }, {
        "nome": "Lecco ",
        "sigla": "LC"
    }, {
        "nome": "Lodi ",
        "sigla": "LO"
    }, {
        "nome": "Mantova ",
        "sigla": "MN"
    }, {
        "nome": "Milano ",
        "sigla": "MI"
    }, {
        "nome": "Pavia ",
        "sigla": "PV"
    }, {
        "nome": "Sondrio ",
        "sigla": "SO"
    }, {
        "nome": "Varese ",
        "sigla": "VA"
    }],
    "Emilia-Romagna": [{
        "nome": "Bologna ",
        "sigla": "BO"
    }, {
        "nome": "Ferrara ",
        "sigla": "FE"
    }, {
        "nome": "Forl\u002d0043esena ",
        "sigla": "FC"
    }, {
        "nome": "Modena ",
        "sigla": "MO"
    }, {
        "nome": "Parma ",
        "sigla": "PR"
    }, {
        "nome": "Piacenza ",
        "sigla": "PC"
    }, {
        "nome": "Ravenna ",
        "sigla": "RA"
    }, {
        "nome": "Reggio Emilia ",
        "sigla": "RE"
    }, {
        "nome": "Rimini ",
        "sigla": "RN"
    }],
    "Trentino-Alto Adige": [{
        "nome": "Bolzano ",
        "sigla": "BZ"
    }, {
        "nome": "Trento ",
        "sigla": "TN"
    }],
    "Sardegna": [{
        "nome": "Cagliari ",
        "sigla": "CA"
    }, {
        "nome": "Carbonia-Iglesias ",
        "sigla": "CI"
    }, {
        "nome": "Nuoro ",
        "sigla": "NU"
    }, {
        "nome": "Olbia-Tempio ",
        "sigla": "OT"
    }, {
        "nome": "Oristano ",
        "sigla": "OR"
    }, {
        "nome": "Medio Campidano ",
        "sigla": "VS"
    }, {
        "nome": "Sassari ",
        "sigla": "SS"
    }, {
        "nome": "Ogliastra ",
        "sigla": "OG"
    }],
    "Molise": [{
        "nome": "Campobasso ",
        "sigla": "CB"
    }, {
        "nome": "Isernia ",
        "sigla": "IS"
    }],
    "Calabria": [{
        "nome": "Catanzaro ",
        "sigla": "CZ"
    }, {
        "nome": "Cosenza ",
        "sigla": "CS"
    }, {
        "nome": "Crotone ",
        "sigla": "KR"
    }, {
        "nome": "Reggio Calabria ",
        "sigla": "RC"
    }, {
        "nome": "Vibo Valentia ",
        "sigla": "VV"
    }],
    "Abruzzo": [{
        "nome": "Chieti ",
        "sigla": "CH"
    }, {
        "nome": "L'Aquila ",
        "sigla": "AQ"
    }, {
        "nome": "Pescara ",
        "sigla": "PE"
    }, {
        "nome": "Teramo ",
        "sigla": "TE"
    }],
    "Lazio": [{
        "nome": "Frosinone ",
        "sigla": "FR"
    }, {
        "nome": "Latina ",
        "sigla": "LT"
    }, {
        "nome": "Rieti ",
        "sigla": "RI"
    }, {
        "nome": "Roma ",
        "sigla": "RM"
    }, {
        "nome": "Viterbo ",
        "sigla": "VT"
    }],
    "Liguria": [{
        "nome": "Genova ",
        "sigla": "GE"
    }, {
        "nome": "Imperia ",
        "sigla": "IM"
    }, {
        "nome": "La Spezia ",
        "sigla": "SP"
    }, {
        "nome": "Savona ",
        "sigla": "SV"
    }],
    "Friuli-Venezia Giulia": [{
        "nome": "Gorizia ",
        "sigla": "GO"
    }, {
        "nome": "Pordenone ",
        "sigla": "PN"
    }, {
        "nome": "Trieste ",
        "sigla": "TS"
    }, {
        "nome": "Udine ",
        "sigla": "UD"
    }],
    "Basilicata": [{
        "nome": "Matera ",
        "sigla": "MT"
    }, {
        "nome": "Potenza ",
        "sigla": "PZ"
    }],
    "Umbria": [{
        "nome": "Perugia ",
        "sigla": "PG"
    }, {
        "nome": "Terni ",
        "sigla": "TR"
    }]
}

const FrozenItalymapDatalet = Object.freeze(ItalymapDatalet);
window.customElements.define('italymap-datalet', FrozenItalymapDatalet);