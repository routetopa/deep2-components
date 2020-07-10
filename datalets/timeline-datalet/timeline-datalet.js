import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';

class TimelineDatalet extends BaseDatalet {
    constructor() {
        super('timeline-datalet');
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
            <style>
                #datalet_container
                {
                    display: block !important;
                }
            </style>             
            <link title="timeline-styles" rel="stylesheet" href="./css/timeline.css">
        `);
    }

    loadDynamicScript(callback) {
        /**/
        let newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
            @font-face {
                font-family:tl-icons;
                src:url(https://cdn.knightlab.com/libs/timeline3/latest/css/icons/tl-icons.eot);
                src:url(https://cdn.knightlab.com/libs/timeline3/latest/css/icons/tl-icons.eot?#iefix) format('embedded-opentype'),
                url(https://cdn.knightlab.com/libs/timeline3/latest/css/icons/tl-icons.ttf) format('truetype'),
                url(https://cdn.knightlab.com/libs/timeline3/latest/css/icons/tl-icons.woff2) format('woff2'),
                url(https://cdn.knightlab.com/libs/timeline3/latest/css/icons/tl-icons.woff) format('woff'),
                url(https://cdn.knightlab.com/libs/timeline3/latest/css/icons/tl-icons.svg#tl-icons) format('svg');
                font-weight:400;
                font-style:normal
            }
        `));
        document.head.appendChild(newStyle);
        /**/

        const existingScript = document.getElementById('timeline_id');

        if (!existingScript) {
            const script = document.createElement('script');
            //local
            // script.src = './timeline-datalet/js/timeline.js';
            //creator
            // script.src = './datalets/timeline-datalet/js/timeline.js';
            //spod
            if(typeof ODE !== 'undefined')
                script.src = ODE.deep_components + 'datalets/timeline-datalet/js/timeline.js';
            else //more
                script.src = 'http://deep.routetopa.eu/deep2t/COMPONENTS/datalets/timeline-datalet/js/timeline.js'
            script.id = 'timeline_id';
            document.body.appendChild(script);

            script.onload = () => {
                if (callback) callback();
            };
        }

        if (existingScript && callback) callback();
    };

    async render(data)
    {
        let that = this;
        console.log('RENDER - timeline-datalet');

        let _toDate = function (startDateString, endDateString)
        {
            let s = _format(startDateString);
            let string_1 = s[0];
            let sign_1 = s[1];

            s = _format(endDateString);
            let string_2 = s[0];
            let sign_2 = s[1];

            let startDate = _dateStringToObject(string_1);
            let endDate = _dateStringToObject(string_2);

            if (startDate && _isRoman(string_1)) {

                if (sign_1 === 1)
                    startDate = {
                        "year": (startDate.year - 1) * 100,
                    };
                else
                    startDate = {
                        "year": startDate.year * 100 * sign_1 + 1,
                    }
            }

            if (endDate && _isRoman(string_2)) {
                if (sign_2 === 1)
                    endDate = {
                        "year": endDate.year * 100 - 1,
                    };
                else
                    endDate = {
                        "year": (endDate.year - 1) * 100 * sign_2,
                    }
            }

            if (startDate && !endDate) {
                endDate = startDate;

                if (_isRoman(string_1))
                    endDate = {
                        "year": startDate.year + 99,
                    }
            }

            if (startDate)
                startDate.display_date = startDateString;
            if (endDate)
                endDate.display_date = endDateString;

            return [startDate, endDate];
        };

        let _dateStringToObject = function (dateString)
        {
            dateString = dateString.trim();

            if (dateString === "")
                return null;

            let date = null;

            if (_isInt(dateString)) {
                date = {
                    "year": dateString,
                }
            }
            else if (_isRoman(dateString)) {
                date = {
                    "year": (_fromRoman(dateString)),
                }
            }
            else {
                try {
                    if (that.getAttribute('date-format') === "DMY") {
                        let dateParts = dateString.split("/");
                        if (dateParts.length !== 3)
                            dateParts = dateString.split("-");
                        if (dateParts[1] > 12)
                            date = null;
                        else
                            date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based
                    }
                    else
                        date = new Date(dateString); //https://www.w3schools.com/js/js_date_formats.asp
                    if (isNaN(date.getFullYear()))
                        return null;
                    date = {
                        "year": date.getFullYear(),
                        "month": date.getUTCMonth() + 1,
                        "day": date.getUTCDate() + 1,
                        "hour": date.getHours(),
                        "minute": date.getUTCMinutes(),
                        "second": date.getUTCSeconds(),
                        "millisecond": date.getUTCMilliseconds(),
                    }
                }
                catch (e) {
                    date = null
                }
            }

            return date;
        };

        let _isInt = function (value)
        {
            return !isNaN(value) && parseInt(Number(value)) === value && !isNaN(parseInt(value, 10));
        };

        let _format = function (str)
        {
            str = ('' + str).trim().toUpperCase();
            let sign = 1;
            if (str.indexOf('BCE') > -1 || str.indexOf('B.C.E.') > -1 || str.indexOf('BC') > -1 || str.indexOf('B.C.') > -1) {
                str = str.replace('BCE', '').replace('B.C.E.', '').replace('BC', '').replace('B.C.', '').trim();
                sign = -1;
            }
            return [str, sign];
        };

        let _isRoman = function (value)
        {
            return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(value);
        };

        let _fromRoman = function (str)
        {
            let result = 0;
            // the result is now a number, not a string
            let decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
            let roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
            for (let i = 0; i <= decimal.length; i++) {
                while (str.indexOf(roman[i]) === 0) {
                    result += decimal[i];
                    str = str.replace(roman[i], '');
                }
            }
            return result;
        };

        let events = [];

        if (!data || data[0] === undefined) return;

        let selectedFields = JSON.parse(this.selected_fields);
        let inputs = [];

        for (let i = 0; i < selectedFields.length; i++)
            if (selectedFields[i])
                inputs.push(selectedFields[i].field);

        let text_i = inputs.indexOf("EventDescription");
        let url_i = inputs.indexOf("MediaUrl");
        let background_i = inputs.indexOf("Background");

        for (let i = 0; i < data[0].data.length; i++)
        {
            let date = _toDate(data[0].data[i], data[1].data[i]);
            let start_date = date[0];
            let end_date = date[1];
            let headline = data[2] ? data[2].data[i] : '';

            /*******************/

            let text = '', url = '', background = '';
            let j = 3;

            if (text_i > -1) {
                while (inputs[j] === "EventDescription") {
                    text += "<p><b>" + data[j].name + "</b></p>" +
                        "<p>" + data[j].data[i] + "</p>";
                    j++;
                }
            }

            if (url_i > -1) {
                url = data[j].data[i];
                j++;

            }
            if (background_i > -1) {
                background = data[j].data[i];
            }


            if (start_date)
                events.push({
                    "start_date": start_date,
                    "end_date": end_date,
                    "text": {
                        "headline": '' + headline,
                        "text": '' + text
                    },
                    "media": {
                        "url": url
                    },
                    "background": {
                        "opacity": "50",
                        "url": background,
                        "color": background
                    },
                })
        }

        let _json = {
            "title": {
                "text": {
                    "headline": this.datalettitle ? this.datalettitle : '',
                    "text": this.description ? this.description : ''
                }
            },
            "events": events
        };

        let options = {};

        this.loadDynamicScript(()=>{
            new TL.Timeline(this.shadowRoot.querySelector('#datalet_container'), _json, options);
        })
    }
}


const FrozenTimelineDatalet = Object.freeze(TimelineDatalet);
window.customElements.define('timeline-datalet', FrozenTimelineDatalet);