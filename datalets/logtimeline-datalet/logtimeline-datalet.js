/**
@license
    The MIT License (MIT)

    Copyright (c) 2022 Dipartimento di Informatica - Universit� di Salerno - Italy

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

/**
* Developed by :
* ROUTE-TO-PA Project - grant No 645860. - www.routetopa.eu
*
*/
import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import {LN_logtimeline} from './ln/logtimeline-datalet-ln.js';
/**
 * `logtimeline-datalet` is a particular timeline datalet optimized for network events.
 * Pass to this component a data url(CKAN api uri), a string in Json PATH format of Selected fields,
 * a string in datalettitle and a string in dataletdescription

     Example:

     <logtimeline-datalet
     data-url="http://ckan.routetopa.eu/api/action/datastore_search?resource_id=#"
     fields='["field1","field2"]'
     datalettitle = 'Title'
     description = 'Description'
     </logtimeline-datalet>

 @element logtimeline-datalet
 @status v0.1
 @demo demo/index.html
 @group datalets
 */
class LogtimelineDatalet extends BaseDatalet {

    constructor() {
        super('logtimeline-datalet');
    }

    handle_behaviour() {
        try {
            this.set_behaviours([AjaxJsonAlasqlBehavior]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        return this.create_node(`
            <style id="style">
                #datalet_container
                {
                    display: block !important;
                }
            </style>             
            <link id="light" title="timeline-styles" rel="stylesheet" href="./css/timeline.css">
            <link type="text/css" rel="stylesheet" href="./css/logtimeline.css">
            <head><script src="https://kit.fontawesome.com/f5cb14a92d.js" crossorigin="anonymous"></script></head>
            
        `);
    }

    addOffsetAttribute(offset){
        this.shadowRoot.querySelector('#datalet_container').setAttribute('offset', offset);
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
            if(typeof ODE !== 'undefined'){
                script.src = ODE.deep_components + 'datalets/logtimeline-datalet/js/timeline.js';
            }
            else{ //more
                script.src = 'http://deep.routetopa.eu/deep2t/COMPONENTS/datalets/logtimeline-datalet/js/timeline.js';
            }

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
        LN_logtimeline.init();
        console.log('RENDER - logtimeline-datalet');
        let offset = '';
        let showAlert = false;

        let _toDate = function (startDateString, endDateString)
        {

            let s = _format(startDateString);
            let string_1 = s[0];
            let sign_1 = s[1];

            s = _format(endDateString);
            let string_2 = s[0];
            let sign_2 = s[1];
            let arrayStartDate = _dateStringToObject(string_1, sign_1);
            let arrayEndDate = _dateStringToObject(string_2, sign_2);
            let startDate = arrayStartDate[0];
            startDateString = arrayStartDate[1];
            let endDate = arrayEndDate[0];
            endDateString = arrayEndDate[1];

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

            if (startDate) {
                if(sign_1 === 2){
                    startDateString = _displayDate(startDate);
                }
            }
            if (endDate){
                if(sign_2 === 2){
                    endDateString = _displayDate(endDate);
                }
            }

            let startDateYYMMDD = startDate.year + startDate.month + startDate.day;
            let startDateHHMMSSMS = startDate.hour + startDate.minute + startDate.second + startDate.millisecond;
            let endDateYYMMDD = endDate.year + endDate.month + endDate.day;
            let endDateHHMMSSMS = endDate.hour + endDate.minute + endDate.second + endDate.millisecond;

            /** This is the case when end date is the same of start date but
             * time is different and so endDateString is replaced by end time only*/
            if((startDateString + '').includes(":") && (endDateString + '').includes(":") && (startDateYYMMDD === endDateYYMMDD) && (endDateHHMMSSMS !== startDateHHMMSSMS)){
                let endStringMatch = endDateString.match(/[0-9]{2}[:.][0-9][0-9]([:.][0-9][0-9])?((:|.)[0-9][0-9]){0,2}[0-9]*( (a(.?)m(.?)|p(.?)m(.?))*)?( ?)((ad|pdt|Pacific Daylight Time)?)(([-+]?)((\d{4})?))/gi);
                endDateString = endStringMatch.length === 2 ? endStringMatch[1] : endStringMatch[0];
            }

            startDate.display_date = startDateString;
            endDate.display_date = endDateString;
            return [startDate, endDate];
        };

        /**
         *
         * @param elem is the number of hour, minutes, second or millisecond
         * @returns {*|string} 0 + elem if is only one number
         * @private
         */
        let _displayElem = function (elem){
            return (elem + "").length !== 1 ? elem : "0" + elem;
        }

        /**
         *
         * @param date is date object or undefined
         * @returns {string|null} date in format yy-mm-dd hh:mm:ss:ms if is object and not undefined
         * @private
         */
        let _displayDate = function (date){
            if(typeof date !== 'object' || date.year === undefined){
                return null;
            }
            return date.year + "-" + _displayElem(date.month) + "-" + _displayElem(date.day) + " " + _displayElem(date.hour) + ":" + _displayElem(date.minute) + ":" + _displayElem(date.second) + ":" + _displayElem(date.millisecond);
        }

        /**
         *
         * @param str is the string of time
         * @returns {RegExpMatchArray} array of insensitive occurrences of Pacific Daylight Time
         */
        let pacDelTime = function (str) {
            return (str + '').match(/Pacific Daylight Time/i);
        };

        /**
         *
         * @param dateElem is the string or number of date
         * @param sign is the number of a particular date format
         * @returns {({month: number, hour: number, year: number, millisecond: number, day: number, minute: number, second: number}|string|*)[]|null|{year: string}|{year: number}|{month: number, hour: number, year: number, millisecond: number, day: number, minute: number, second: number}|{month: number, hour: number, year: number, millisecond: number, day: number, minute: number, second: number}}
         *          the array with date object and dateElem for sign 6, 7 or 8, else the date object.
         * @private
         */
        let _dateStringToObject = function (dateElem, sign)
        {
            if (dateElem === "") return null;
            let date = null;
            if(typeof dateElem === "string"){
                dateElem = dateElem.trim();
            }

            let _isPm = (dateElem + '').match(/P(.?)M(.?)/i);
            let pacDelTIme = pacDelTime(dateElem);
            if(pacDelTIme)
                dateElem = dateElem.replace(pacDelTIme[0], 'PDT');


            /**
             *
             * @param date is the date object
             * @returns {boolean} true if date reading attribute is alternative mode (day before month)
             */
            let isAlternativeReading = function(date) {
                if(that.getAttribute('date-reading') === 'Alt') {
                    if(date.getDate() > 12) {
                        showAlert = true;
                    }
                    return true;
                }
                return false;
            }

            let offsetRgx = /(((GMT( *))?)[+-]((\d{4})|(\d+:\d+))|PDT)$/i;
            if((dateElem + '').match(offsetRgx)){
                offset = (dateElem + '').match(offsetRgx)[0];
                dateElem = (dateElem + '').replace(offset, '');
            }

            /** case format "WWW-date time", example: Wed-14-02-2018*/
            if(sign === 3){
                let weekDay = ((dateElem + '').match(/(-*)([a-zA-Z]{3})([a-zA-Z]{0,6})(-*)/g));
                dateElem = (dateElem + '').replace((weekDay + ''), '');
                let starWithYear = ((dateElem + '').match(/^([0-9]{4})/g));
                if(!starWithYear){
                    let day = dateElem.charAt(0) + dateElem.charAt(1);
                    let month = dateElem.charAt(3) + dateElem.charAt(4);
                    dateElem = dateElem.replace((day + "/" + month), (month + "/" + day));
                    dateElem = dateElem.replace((day + "-" + month), (month + "-" + day));
                }
            }

            /** case format "yyyy.MM.dd G 'at' HH:mm:ss z", example: 2001.07.04 AD at 12:08:56 PDT */
            if(sign === 4){
                dateElem = (dateElem + '').replace(_ad(dateElem)[0], '');
                let match = dateElem.match(/(at|in|on|the)/i);
                if(match){
                    dateElem = dateElem.replace(match[0], '');
                }
            }

            /** case format "hh-english_time a, zzzz", example: 12 o'clock PM */
            if(sign === 6){
                let hour, minutes;
                let _getSecondDigit = function (str, number){
                    return str.charAt(str.indexOf("#") + number);
                }
                if((dateElem + '').match(/O'CLOCK/i)){
                    let matchToRemove = dateElem.match(/(( ?)O'CLOCK([ \w,]*))$/i);
                    dateElem = (dateElem + '').replace(matchToRemove[0], '#');
                    if(_isPm){
                        let secondDigit = _getSecondDigit(dateElem, -1);
                        if(!Number.parseInt(secondDigit)){
                            hour = dateElem.charAt(dateElem.indexOf("#") - 2);
                        }else{
                            hour = dateElem.charAt(dateElem.indexOf("#") - 2) + secondDigit;
                        }
                        hour = Number.parseInt(hour) + 12;
                        dateElem = dateElem.replace(dateElem.match(/(\d{2})#/g) + '', '');
                        dateElem += hour;
                    }else{
                        dateElem = (dateElem + '').replace('#', '');
                    }
                    dateElem += ":00";
                }else{
                    let englishNumbers = {
                        names : ["one","two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
                            "eleven", "twelve", "thirteen", "fourteen", "a quarter", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
                            "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "half"],
                        numbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    }
                    if((dateElem + '').match(/PAST/i)){
                        for(let i = 0; i < englishNumbers.numbers.length; i++){
                            if((dateElem + '').includes(englishNumbers.names[i])){
                                minutes = englishNumbers.numbers[i];
                                dateElem = (dateElem + '').replace(englishNumbers.names[i], '');
                                dateElem = dateElem.replace(dateElem.match(/( ?)PAST( ?)/i)[0], '#');
                                let secondDigit = _getSecondDigit(dateElem, 2);
                                if(!Number.parseInt(secondDigit)){
                                    hour = dateElem.charAt(dateElem.indexOf("#") + 1);
                                }else{
                                    hour = dateElem.charAt(dateElem.indexOf("#") + 1) + secondDigit;
                                }
                                if(_isPm){
                                    hour = Number.parseInt(hour) + 12;
                                }
                                dateElem = dateElem.replace(dateElem.match(/#([\w .,]*)/g)[0], '');
                                dateElem += hour + ":" + minutes;
                            }
                        }
                    }else if((dateElem + '').match(/TO/i)){
                        for(let i = 0; i < englishNumbers.numbers.length; i++){
                            if((dateElem + '').includes(englishNumbers.names[i])){
                                minutes = (60 - englishNumbers.numbers[i]);
                                dateElem = (dateElem + '').replace(englishNumbers.names[i], '');
                                dateElem = dateElem.replace(dateElem.match(/( ?)TO( ?)/i)[0], '#');
                                let secondDigit = _getSecondDigit(dateElem, 2);
                                if(!Number.parseInt(secondDigit)){
                                    hour = dateElem.charAt(dateElem.indexOf("#") + 1);
                                }else{
                                    hour = dateElem.charAt(dateElem.indexOf("#") + 1) + secondDigit;
                                }
                                hour = Number.parseInt(hour) - 1;
                                if(_isPm){
                                    hour += 12;
                                }
                                dateElem = dateElem.replace(dateElem.match(/#([\w .,]*)/g)[0], '');
                                dateElem += hour + ":" + minutes;
                            }
                        }
                    }
                }
            }

            /** case format "dd-monthName-yyyy:HH:mm:ss SSSZ", example: 28/Jan/2022:00:06:59 +0000 */
            if(sign === 7){
                dateElem = (dateElem + '').replace(splitYearTime(dateElem)[0], ' ');
                //dateElem = _checkDMY(dateElem);
                date = new Date(dateElem);
            }
            /** case format "yyMMddHHmmssZ"	, example: 010704120856-0700 */
            if(sign === 8){
                let arrayDate = [];
                let milliSec = '', timeZone = '';
                let i;
                for(i = 0; i < 12; i+=2){
                    arrayDate.push((dateElem + '').charAt(i) + (dateElem + '').charAt(i + 1));
                }
                if(Number.parseInt((dateElem + '').charAt(12))){
                    milliSec = (dateElem + '').charAt(12) + (dateElem + '').charAt(13);
                    i+=2;
                    if(Number.parseInt((dateElem + '').charAt(14))){
                        milliSec += (dateElem + '').charAt(14);
                        i++;
                    }
                }
                if(i !== (dateElem + '').length){
                    while(i < (dateElem + '').length){
                        timeZone += (dateElem + '').charAt(i);
                        i++;
                    }
                }
                let j = 0;
                dateElem = arrayDate[j+1] + '/' + arrayDate[j+2] + '/' + arrayDate[j]; j+=2;
                dateElem += ' ';
                dateElem += arrayDate[++j] + ':' + arrayDate[++j] + ':' + arrayDate[++j] + (milliSec !== '' ? ':' + milliSec : '') + ' ' + timeZone;
            }

            if (_isInt(dateElem)) {
                date = {
                    "year": dateElem,
                }
            }
            else if (_isRoman(dateElem)) {
                date = {
                    "year": (_fromRoman(dateElem)),
                }
            }
            else {
                try {
                    /** case format "yyyy-MM-dd'T'HH:mm:ss.SSSZ", example: 2001-07-04T12:08:56.235-0700 */
                    if(sign === 5)
                        dateElem = (dateElem + '').replace('T', ' ');
                        dateElem = (dateElem + '').replace('Z', '');

                    if(_ad(dateElem))
                        dateElem = (dateElem + '').replace(_ad(dateElem)[0], '');

                    /** 1 VALUE IN TERNARY OPERATOR: case format "Unix Timestamp", example: 126.233491 */
                    date = sign === 2 ? new Date(dateElem * 1000) : new Date(dateElem); //https://www.w3schools.com/js/js_date_formats.asp
                    if (isNaN(date.getUTCFullYear()))
                        return null;

                    date = {
                        "year": date.getUTCFullYear(),
                        "month": isAlternativeReading(date) ? date.getDate() : (date.getUTCMonth() + 1),
                        "day": isAlternativeReading(date) ? (date.getUTCMonth() + 1) : date.getDate(),
                        "hour" : date.getHours(),
                        "minute": date.getUTCMinutes(),
                        "second": date.getUTCSeconds(),
                        "millisecond": date.getUTCMilliseconds()
                    }
                }
                catch (e) {
                    date = null;
                }
            }

            if(offset !== '')
                dateElem = (dateElem + '').endsWith(' ') ? dateElem + offset : dateElem + ' ' + offset;

            return [date, dateElem];
        };

        let _isInt = function (value)
        {
            return !isNaN(value) && parseInt(Number(value)) === value && !isNaN(parseInt(value, 10));
        };

        let _format = function (str)
        {
            if(_isUnixTimestamp(str)){
                return [str, 2];
            }
            if(_isFormatWithWeekDay(str)){
                return [str, 3];
            }
            if(_ad(str)){
                return [str, 4];
            }
            if(_isISOFormat(str)){
                return [str, 5];
            }
            if(_isWordEnglishTime(str)){
                return [str, 6];
            }
            if(splitYearTime(str)){
                return [str, 7];
            }
            if(_isyyMMddHHmmssmsZ(str)){
                return [str, 8];
            }
            str = ('' + str).trim().toUpperCase();
            let sign = 1;
            if (str.indexOf('BCE') > -1 || str.indexOf('B.C.E.') > -1 || str.indexOf('BC') > -1 || str.indexOf('B.C.') > -1) {
                str = str.replace('BCE', '').replace('B.C.E.', '').replace('BC', '').replace('B.C.', '').trim();
                sign = -1;
            }
            return [str, sign];
        };

        let splitYearTime = function (str) {
            if(isNaN((new Date((str + ''))).getTime()) && (str + '').match(/\d{4}:\d{2}/g)){
                let timeSplit = (str + '').match(/:/g);
                if(timeSplit){
                    let index = (str + '').indexOf(timeSplit[0]);
                    if((str + '').charAt(index - 3) !== timeSplit[0]){
                        return timeSplit[0];
                    }
                }
                return false;
            }
        }

        let _endsWithGMT = function (str){
            return (str + '').match(/GMT[ +0-9]+$/g);
        };

        let _isFormatWithWeekDay = function (str) {
            return ((str + '').match(/^([a-zA-Z]{3})([a-zA-Z]{0,6})(-| )([0-9]{2,4})-([0-9]{2})-([0-9]{2,4})([-0-9, :/_|()]*)$/g) ||
                    (str + '').match(/^([0-9]{2,4})-([0-9]{2})-([0-9]{2,4})(-| )([a-zA-Z]{3})([a-zA-Z]{0,6})([-0-9, :/_|()]*)$/g));
        };

        let _isISOFormat = function (str) {
            return ((str + '').match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([.:/_+-Z\d]*)$/g));
        };

        let _isyyMMddHHmmssmsZ = function (str) {
            return ((str + '').match(/\d{12}((\d{2,3})?)(([-+]\d{4})?)/g));
        };

        /*let _isFormatWithAD_PDT = function (str) {
            return ((str + '').match(/^(\d{4}).(\d{2}).(\d{2}) AD \w{2,3} (\d{2}):(\d{2}):(\d{2}) PDT$/g));
        }*/

        let _isUnixTimestamp = function (str) {
            if ((str + '').match(/^1((\d{2})|(\d{3})|(\d{4})).((\d{3}))(\d*)$/g) || (str + '').match(/^(1[0-9]{7,8})$/g)) return true;
            else return false;
        };

        let _ad = function (str) {
            return (str + '').match(/A(.?)D(.?)/gi);
        };

        let _isRoman = function (value)
        {
            return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(value);
        };

        let _isWordEnglishTime = function (str) {
            return (str + '').match(/O'CLOCK|A QUARTER|PAST|TO/i);
        };

        let _isHour = function (hour){
            return ('' + hour).match(/^[0-9]{1,2}(:|.)[0-9][0-9]((:|.)[0-9][0-9])?((:|.)[0-9][0-9]){0,2}[0-9]*( (a(.?)m(.?)|p(.?)m(.?))*)?( ?)((ad|pdt|Pacific Daylight Time)?)(([-+]?)((\d{4})?))$/gi) ||
                _isWordEnglishTime('' + hour);
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

        let links = [];

        if (!data || data[0] === undefined) return;

        let selectedFields = JSON.parse(this.selected_fields);
        let inputs = [];

        for (let i = 0; i < selectedFields.length; i++)
            if (selectedFields[i]) {
                inputs.push(selectedFields[i].field);
            }
        let text_i = inputs.indexOf("LOGTIMELINEEventDescription");
        let url_i = inputs.indexOf("LOGTIMELINEMediaUrl");
        let background_i = inputs.indexOf("LOGTIMELINEBackground");
        let initialHour_i = inputs.indexOf("LOGTIMELINEStartTime");
        let finalHour_i = inputs.indexOf("LOGTIMELINEFinishTime");
        let eventInfo1_i = inputs.indexOf("LOGTIMELINEEventInfo1");
        let eventInfo2_i = inputs.indexOf("LOGTIMELINEEventInfo2");
        let eventInfo3_i = inputs.indexOf("LOGTIMELINEEventInfo3");
        let link_i = inputs.indexOf("LOGTIMELINELink");

        let titleTooltip = '';
        for (let i = 0; i < data[0].data.length; i++)
        {
            let date = [], start_date = '', end_date = '';
            let initialHour = '', finalHour = '';
            if(initialHour_i > -1 && finalHour_i > -1){
                let h = 4;
                if(((url_i > -1) && (background_i <= -1)) || ((url_i <= -1) && (background_i > -1))){
                    h++;
                }else if((url_i > -1) && (background_i > -1)){
                    h+=2;
                }
                initialHour = data[h].data[i];
                finalHour = data[h+1].data[i];
                if(_isHour(initialHour) && _isHour(finalHour)){
                    date = _toDate(data[0].data[i] + " " + initialHour, data[1].data[i] + " " + finalHour);
                }else{
                    date = _toDate(data[0].data[i], data[1].data[i]);
                }
            }else{
                date = _toDate(data[0].data[i], data[1].data[i]);
            }

            start_date = date[0];
            end_date = date[1];

            titleTooltip = data[2].name;
            let headline = data[2] ? data[2].data[i] : '';

            let text = '', url = '', background = '';
            let j = 3;

            if (text_i > -1) {
                while (inputs[j] === "LOGTIMELINEEventDescription") {
                    text += "<table><tr class='event-description_row'><td id='event-description_data'><b>" + data[j].name + "</b>:</td><td style='max-width: 350px'>" + data[j].data[i] + "</td></tr></table>";
                    //text += "<div><small><b style='color: black'>" + data[j].name + "</b></small>: " + data[j].data[i] + "</div>";
                    j++;
                }
            }


            if (url_i > -1) {
                url = data[j].data[i];
                j++;

            }
            if (background_i > -1) {
                background = data[j].data[i];
                j++;
            }

            if((initialHour_i > -1) && (finalHour_i > -1)){
                j += 2;
            }

            if((eventInfo1_i > -1) || (eventInfo2_i > -1) || (eventInfo3_i > -1)){
                text += "<hr style='width: 50%; margin-right: 50%'>";
            }

            if(eventInfo1_i > -1){
                text += "<div><small><b>" + data[j].name + "</b>: " + data[j].data[i] + "</small></div>";
                j++;
            }
            if(eventInfo2_i > -1){
                text += "<div><small><b>" + data[j].name + "</b>: " + data[j].data[i] + "</small></div>";
                j++;
            }
            if(eventInfo3_i > -1){
                text += "<div><small><b>" + data[j].name + "</b>: " + data[j].data[i] + "</small></div>";
                j++;
            }
            if(link_i > -1){
                links.push(data[j].data[i]);

                let validURL = function(str) {
                    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                    return !!pattern.test(str);
                }

                if(!validURL(links[i])) {
                    if(links[i] !== '' && links[i] !== null && links[i] !== undefined) {
                        let _window = window;
                        if(_window.location.href === 'about:srcdoc')
                            _window = _window.parent;

                        let errorPageAbsolutePath = (_window.location.href + '').match(/[\w:/=.?_"' -]+COMPONENTS/g)[0] + '/datalets/logtimeline-datalet/error/errorPage-link.html';
                        links[i] = errorPageAbsolutePath + '?' + that.getAttribute("lang-timeline");
                    }
                }else{
                    if(!(links[i] + '').startsWith("http")) {
                        links[i] = "https://" + links[i];
                    }
                }
            }

            if (start_date)
                events.push({
                    "start_date": start_date,
                    "end_date": end_date,
                    "text": {
                        "headline": headline,
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

        let isDark = false;

        let makeTLOptions = function () {
            /*timenav on top*/
            if (that.getAttribute("timenav-position") === "Top") {
                options.timenav_position = "top";
            }

            /*hash bookmark*/
            if (that.getAttribute("hash_bookmark") === "on") {
                options.hash_bookmark = true;
            }

            /*start at end*/
            if (that.getAttribute("slides-order") === "end") {
                options.start_at_end = true;
            }

            /*lang timeline*/
            let lang_timeline = that.getAttribute("lang-timeline");
            switch (lang_timeline){
                case "en":
                    options.language = "en";
                    LN_logtimeline.setUserLanguage("en");
                    break;
                case "it":
                    options.language = "it";
                    LN_logtimeline.setUserLanguage("it");
                    break;
                case "fr":
                    options.language = "fr";
                    LN_logtimeline.setUserLanguage("fr");
                    break;
                case "de":
                    options.language = "de";
                    LN_logtimeline.setUserLanguage("de");
                    break;
                case "es":
                    options.language = "es";
                    LN_logtimeline.setUserLanguage("es");
                    break;
                case "cn":
                    options.language = "zh-cn";
                    LN_logtimeline.setUserLanguage("cn");
                    break;
                case "ja":
                    options.language = "ja";
                    LN_logtimeline.setUserLanguage("ja");
                    break;
            }

            /*theme*/
            if(that.getAttribute("LOGTIMELINETheme") === "dark") {
                that.shadowRoot.querySelector("#light").setAttribute("href", "http://localhost:8012/SPOD-CREATOR/COMPONENTS/datalets/logtimeline-datalet/css/themes/timeline.theme.dark.css");
                options.default_bg_color = "#302e2e";
                isDark = true;
            }
        }

        let makeTLContainer = function () {

            /*Set alert*/
            if(showAlert) {
                let dataletContainer = that.shadow_root.querySelector("#datalet_container");
                let baseDataletContainer = that.shadow_root.querySelector("#base_datalet_container");
                dataletContainer.setAttribute("style", "opacity: 0.1; pointer-events: none;");
                baseDataletContainer.setAttribute("style", "opacity: 0.1; pointer-events: none;");
                let banner = document.createElement('div');
                banner.setAttribute("class", "banner banner-top alert-primary active center");
                banner.setAttribute("role", "alert");
                banner.innerHTML = LN_logtimeline.translate("banner-text") + '<br>';
                let bannerButton = document.createElement('button');
                bannerButton.setAttribute("type", "button");
                bannerButton.setAttribute("class", "banner-button");
                bannerButton.innerHTML = LN_logtimeline.translate("banner-button").toUpperCase();
                bannerButton.onclick = function () {
                    that.setAttribute('date-reading', 'Std');
                    dataletContainer.setAttribute("style", "opacity: 1; pointer-events: auto;");
                    baseDataletContainer.setAttribute("style", "opacity: 1; pointer-events: auto;");
                    banner.style.display = 'none';
                    that.render(data);
                }
                banner.appendChild(bannerButton);
                dataletContainer.parentNode.appendChild(banner);
            }

            /*Set offset on date suffix*/
            if(offset !== ''){
                let setOffset = function () {
                    let listTimes = that.shadow_root.querySelectorAll(".tl-timeaxis-tick-text");
                    for(let timeSuffix of listTimes){
                        timeSuffix.innerHTML += ' ' + offset;
                    }
                }
                setOffset();
                /*replace on zoom*/
                let menuBArs = that.shadow_root.querySelectorAll(".tl-menubar-button");
                for (let menuBar of menuBArs){
                    menuBar.onclick = function (){setOffset();}
                }
            }

            /*Set event description in dark theme*/
            if(isDark) {
                let eventDescriptions = that.shadow_root.querySelectorAll(".event-description_row");
                for(let eventDescription of eventDescriptions){
                    eventDescription.setAttribute("style", "color: darkgrey");
                }
            }

            /*Set headline*/
            let headlines = that.shadow_root.querySelectorAll(".tl-headline");
            let i = 0;
            for (let headline of headlines) {
                if(headline.getAttribute("class") === 'tl-headline tl-headline-title')
                    continue;
                if(headline.parentNode.getAttribute("class") === 'tl-timemarker-text')
                    continue;

                let iconLink = '<span class ="icon-logtimeline-container" data-balloon-pos="up-left" data-balloon="' + LN_logtimeline.translate("icon-link") + '"><i id="icon-logtimeline-link" class="fas fa-external-link-alt icon-logtimeline"></i></span>';
                let iconEvent = '<span class ="icon-logtimeline-container" data-balloon-pos="up-left" data-balloon="' + titleTooltip + '"><i id="icon-logtimeline-event"  class="fas fa-calendar-minus icon-logtimeline"></i></span>';
                headline.innerHTML = iconEvent + ' <span id="event-name-text">' + headline.innerHTML + '</span>';
                /*Set iframe with page*/
                if(links[i] !== '' && links[i] !== null && links[i] !== undefined) {
                    headline.innerHTML = iconLink + headline.innerHTML;
                    let divPageContainer = document.createElement('div');
                    let iframe = document.createElement('iframe');
                    let titleLink = document.createElement('h5');
                    divPageContainer.setAttribute("id", "divListContainer");
                    titleLink.setAttribute("id", "listLink");
                    titleLink.setAttribute("class", "center");
                    titleLink.innerHTML = '<div style="text-align: center"><a target="_blank" href="' + links[i] + '"><span id="titleLink">' + LN_logtimeline.translate("title-link") + '</span></a></div>';
                    iframe.setAttribute("frameborder", "0");
                    iframe.setAttribute("class", "center");
                    iframe.setAttribute("id", 'listContainer');
                    iframe.setAttribute("src", links[i]);
                    headline.children[0].onclick = function () {
                        let fullscreen = that.shadow_root.querySelector("#fullscreen-iframe");
                        if(fullscreen != null)
                            fullscreen.remove();
                            that.hasPreview = false;

                        that.shadow_root.querySelector('#fullscreen-placeholder').style.display = 'block';
                        let fullScreenContainer = that.shadow_root.querySelector('#fullscreen-container');
                        fullScreenContainer.setAttribute("style", "width: 60%;");
                        let fullscreen_close = that.shadow_root.querySelector("#fullscreen-close");
                        fullscreen_close.removeAttribute("class");
                        fullscreen_close.setAttribute("class", "closeList");
                        fullScreenContainer.setAttribute("class", fullScreenContainer.getAttribute("class") + " zoom-out-box");
                        fullScreenContainer.appendChild(divPageContainer);
                        divPageContainer.appendChild(titleLink);
                        divPageContainer.appendChild(iframe);
                        that.shadow_root.querySelector('#fullscreen-close').onclick = function () {
                            if(divPageContainer != null)
                                fullScreenContainer.removeAttribute("style");
                                fullScreenContainer.setAttribute("class", "container");
                                fullscreen_close.removeAttribute("class");
                                fullscreen_close.setAttribute("class", "close");
                                divPageContainer.remove();
                        }
                    }
                } i++;
            }
        }

        this.loadDynamicScript(()=>{
            makeTLOptions();
            new TL.Timeline(this.shadowRoot.querySelector('#datalet_container'), _json, options);
            makeTLContainer();
        });
    }
}


const LogTimelineDatalet = Object.freeze(LogtimelineDatalet);
window.customElements.define('logtimeline-datalet', LogTimelineDatalet);