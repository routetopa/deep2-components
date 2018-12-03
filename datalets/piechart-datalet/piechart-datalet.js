import BaseDatalet from '../base-datalet/base-datalet.js';

class PiechartDatalet extends BaseDatalet
{
    constructor()
    {
        super('piechart-datalet');
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
        const template = this.currentDocument.querySelector('#piechart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - piechart-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('../lib/vendors/highstock/themes/themes.js');

        let series = [{"name": data.data[1].name, "data": []}];

        let sum = 0;
        for(let i = 0; i < data.data[0].data.length; i++)
            sum += data.data[1].data[i];

        let other = ['other', 0];
        for(let i = 0; i < data.data[0].data.length; i++) {
            if (data.data[0].data.length <= 20 || data.data[1].data[i] / sum >= 0.02) {
                let slice = ['' + data.data[0].data[i], data.data[1].data[i]];
                series[0].data.push(slice);
            }
            else {
                other[1] += data.data[1].data[i];
            }
        }

        if(other[1] > 0)
            series[0].data.push(other);

        let innerSize = 0;
        if(this.getAttribute("donut") === "true")
            innerSize = 100;

        let options = {
            chart: {
                type: 'pie',
                zoomType: 'xy',
            },
            title: {
                text: ''
            },
            tooltip: {
                valueSuffix: ' ' + this.getAttribute("suffix")
            },
            plotOptions: {
                pie: {
                    innerSize: innerSize,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: this.getAttribute("dataLabels"),
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts[this.getAttribute("theme")] && Highcharts[this.getAttribute("theme")].contrastTextColor) || 'black'
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: series
        };

        if(this.getAttribute("legend") === "topRight") {
            options.legend = {
                layout: 'vertical',
                verticalAlign: 'top',
                align: 'right',
                x: -4,
                y: 4,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts[this.getAttribute("theme")] && Highcharts[this.getAttribute("theme")].legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            };
            options.plotOptions.pie.showInLegend = true;
        }
        else if(this.getAttribute("legend") === "bottom") {
            options.legend = {
                enabled: true
            };
            options.plotOptions.pie.showInLegend = true;
        }
        else
            options.legend ={
                enabled: false
            };

        //if(this.getAttribute("theme") !== "themeBase" && this.getAttribute("theme") !== "")
            //Object.assign(options, Highcharts[context.getAttribute("theme")]);

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenPiechartDatalet = Object.freeze(PiechartDatalet);
window.customElements.define('piechart-datalet', FrozenPiechartDatalet);