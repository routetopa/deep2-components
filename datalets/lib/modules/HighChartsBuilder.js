export const build = async function(type, context, data) {

    if(!data.series) {
        return {
            title: {
                text: '' //context.getAttribute("datalettitle")
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        };
    }

    let min = 0;
    for (let i in data.series.value)
        min = Math.min(Math.min.apply(Math, data.series.value[i].data), min);

    let suffix = context.getAttribute("suffix");
    let legend = context.getAttribute("legend");
    let theme = context.getAttribute("theme");

    // OPTIONS

    let options = {
        chart: {
            type: type,
            zoomType: 'xy'
        },
        title: {
            text: '' //context.getAttribute("datalettitle")
        },
        series: data.series,
        xAxis: {
            categories: data.categories,
            title: {
                text: context.getAttribute("x-axis-label")
            },
            labels: {
                formatter: function () {
                    let value = this.value;
                    if (value && value.length > 10)
                        value = value.substring(0, 10) + '...';
                    return value;
                }
            }
        },
        yAxis: {
            min: min,
            title: {
                text: context.getAttribute("y-axis-label"),
            }
        },
        plotOptions: {
            series: {
                stacking: (context.getAttribute("stack") == "false") ? false : context.getAttribute("stack"),
                showInNavigator: true
            }
        },
        tooltip: {
            formatter: function () {
                let s = '<b>' + this.x + '</b>';
                this.points.forEach(function (point) {
                    s += '<br/><span style="color: ' + point.color + ';">\u25CF</span> ' + point.series.name + ': <b>' + point.y + ' ' + suffix + '</b> ';
                });
                return s;
            },
            shared: true
        },
        navigator: {
            series: {
                enabled: false,
                dataLabels: {
                    enabled: false
                }
            }
        },
        exporting: {
            enabled: false
        },
        // credits: {
            // enabled: false
        // },
        legend: {
            enabled: false
        }
    };

    // HIGHSTOCK

    if(['area','bar','column','line'].indexOf(type) > -1 && data.series[0].data.length > 20) { // stockLimit
        let l = data.series[0].data.length;
        options.rangeSelector = {
            selected: 0,
            inputEnabled: false,
            buttons: [
                {
                    type: 'millisecond',
                    count: parseInt(l / 100),
                    text: '1%'
                }, {
                    type: 'millisecond',
                    count: parseInt(l / 10),
                    text: '10%'
                }, {
                    type: 'millisecond',
                    count: parseInt(l / 4),
                    text: '25%'
                }, {
                    type: 'millisecond',
                    count: parseInt(l / 2),
                    text: '50%'
                }, {
                    type: 'all',
                    text: '100%'
                }],
            buttonTheme: {
                width: 60
            }
        };

        options.xAxis.labels = {
            formatter: function () {
                let value = data.categories[this.value];
                if (value && value.length > 10)
                    value = value.substring(0, 10) + '...';
                return value;
            }
        };

        options.tooltip = {
            formatter: function () {
                let s = '<b>' + data.categories[this.x] + '</b>';
                this.points.forEach(function (point) {
                    s += '<br/><span style="color: ' + point.color + ';">\u25CF</span> ' + point.series.name + ': <b>' + point.y + ' ' + suffix + '</b> ';
                });
                return s;
            },
            shared: true
        };

        options.navigator.xAxis = {
            tickWidth: 0,
                lineWidth: 0,
                gridLineWidth: 1,
                tickPixelInterval: 200,
                labels: {
                    align: 'left',
                        style: {
                        color: '#888'
                    },
                    x: 3,
                    y: -4
                },
            // showFirstLabel: false,
            // showLastLabel: false,
            labels: false
        };
    }

    // LEGEND

    if (legend === "bottom") {
        options.legend = {
            enabled: true
        };
    }
    else if (legend === "topRight") {
        options.legend = {
            layout: 'vertical',
            verticalAlign: 'top',
            align: 'right',
            x: -4,
            y: 4,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        };
    }

    // THEME

    if(theme && theme !== "" && theme !== "themeBase") {
        await context.import_module('../lib/vendors/highcharts/themes/themes.js');
        options = context.merge_deep(options, Highcharts[theme]);
        options.legend.backgroundColor = Highcharts[theme].legendBackgroundColor || '#FFFFFF';
    }

    return options;
};