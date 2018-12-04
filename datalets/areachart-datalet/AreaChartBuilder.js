export const build = function(type, context, data) {
    let min = 0;
    for (let i in data.series) {
        min = Math.min(Math.min.apply(Math, data.series[i].data), min);
    }

    let stockLimit = 20;
    let C = data.categories;
    let l = data.series[0].data.length;

    let suffix = context.getAttribute("suffix");

    let options = {
        chart: {
            type: 'area',
            zoomType: 'xy'
        },
        rangeSelector: {
            selected: 4,
            inputEnabled:false,

            buttons: [
                {
                    type: 'millisecond',
                    count: parseInt(l/100),
                    text: '1%'
                }, {
                    type: 'millisecond',
                    count: parseInt(l/10),
                    text: '10%'
                }, {
                    type: 'millisecond',
                    count: parseInt(l/4),
                    text: '25%'
                }, {
                    type: 'millisecond',
                    count: parseInt(l/2),
                    text: '50%'
                }, {
                    type: 'all',
                    text: '100%'
                }],

            buttonTheme: {
                width: 60
            }

        },

        navigator: {
            series: {
                enabled: false,
                dataLabels: {
                    enabled:false
                }
            }
        },

        exporting: {
            enabled: false
        },
        title: {
            text: '' // context.getAttribute("suffix");
        },
        xAxis: {
            categories: data.categories,
            title: {
                text: context.getAttribute("xAxisLabel")
            },
            labels: {
                formatter: function () {
                    let value;
                    if(l > stockLimit)
                        value = C[this.value];
                    else
                        value = this.value;

                    if (value && value.length > 10)
                        value = value.substring(0, 10) + '...';

                    return value;
                }
            }
        },
        yAxis: {
            min: min,
            title: {
                text: context.getAttribute("yAxisLabel")
            }
        },
        tooltip: {
            formatter: function() {
                let s = '';
                if(l > stockLimit)
                    s = '<b>' + C[this.x] + '</b>';
                else
                    s = '<b>' + this.x + '</b>';

                $.each(this.points, function(i, point) {
                    s += '<br/><span style="color: ' + point.color + ';">\u25CF</span> ' + point.series.name + ': <b>' + point.y + ' ' + suffix + '</b> ';
                });
                return s;
            },
            shared: true
        },
        plotOptions: {
            series: {
                stacking: context.getAttribute("stack"),
                showInNavigator: true
            },
            area: {
                dataLabels: {
                    formatter: function() {
                        return this.y + ' ' + suffix;
                    },
                    enabled: context.getAttribute("dataLabels")
                },
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: data.series
    };

    if(context.getAttribute("legend") == "topRight")
        options.legend = {
            layout: 'vertical',
            verticalAlign: 'top',
            align: 'right',
            x: -4,
            y: 4,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts[context.getAttribute("theme")] && Highcharts[context.getAttribute("theme")].legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        };
    else if(context.getAttribute("legend") == "bottom")
        options.legend = {
            enabled: true
        };
    else
        options.legend ={
            enabled: false
        };

    // THEME
    if(context.getAttribute("theme") != "themeBase" && context.getAttribute("theme") != "")
        options = context.merge_deep(options, Highcharts[context.getAttribute("theme")]);


    if(l > stockLimit)
        Highcharts.stockChart(context.shadowRoot.querySelector('#datalet_container'), options);
    else
        Highcharts.chart(context.shadowRoot.querySelector('#datalet_container'), options);
};