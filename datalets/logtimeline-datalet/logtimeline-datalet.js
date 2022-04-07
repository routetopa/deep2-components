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

/**
 * `logtimeline-datalet` is a particular timeline datalet optimized for network events.
 * Pass to this component a data url(CKAN api uri), a string in Json PATH format of Selected fields,
 * a string in datalettitle and a string in dataletdescription

     Example:

     <logtimeline-datalet
     data-url="http://ckan.routetopa.eu/api/action/datastore_search?resource_id=#"
     fields='["field1","field2"]'
     datalettitle = 'Title'
     description = 'Description'>
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
            <style>
                #datalet_container
                {
                    display: block !important;
                }
            </style>             
            <link title="timeline-styles" rel="stylesheet" href="./css/timeline.css">
            <link title="timeline-styles" rel="stylesheet" href="./css/timelinenet.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
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
                script.src = ODE.deep_components + 'datalets/logtimeline-datalet/js/timeline.js';
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
        console.log('RENDER - logtimeline-datalet');

        let _toDate = function (startDateString, endDateString)
        {

            let s = _format(startDateString);
            let string_1 = s[0];
            let sign_1 = s[1];

            s = _format(endDateString);
            let string_2 = s[0];
            let sign_2 = s[1];
            let startDate = null, endDate = null;
            if(sign_1 === 6 || sign_1 === 7 || sign_1 === 8){
                let arrayStartDate = _dateStringToObject(string_1, sign_1);
                let arrayEndDate = _dateStringToObject(string_2, sign_2);
                startDate = arrayStartDate[0];
                startDateString = arrayStartDate[1];
                endDate = arrayEndDate[0];
                endDateString = arrayEndDate[1];
            }else{
                startDate = _dateStringToObject(string_1, sign_1);
                endDate = _dateStringToObject(string_2, sign_2);
            }

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


            if(_isISOFormat(startDateString) && _isISOFormat(endDateString)){
                let removeTZ = function (str)  {
                    return str.replace('Z', '');
                }
                startDateString = removeTZ(startDateString);
                endDateString = removeTZ(endDateString);
            }

            startDateString = !(pacDelTime(startDateString)) ? startDateString : startDateString.replace(pacDelTime(startDateString)[0], 'PDT');
            endDateString = !(pacDelTime(endDateString)) ? endDateString : endDateString.replace(pacDelTime(endDateString)[0], 'PDT');


            if(_ad(startDateString) && _ad(endDateString)){
                startDateString = startDateString.replace(_ad(startDateString)[0], '');
                endDateString = endDateString.replace(_ad(endDateString)[0], '');
            }

            if(_endsWithGMT(startDateString) && _endsWithGMT(endDateString)){
                let removeGMT = function (str) {
                    let gmtInString = (str.match(/GMT[ +.0-9]+$/g));
                    return str.replace(('' + gmtInString), '');
                };
                startDateString = removeGMT(startDateString);
                endDateString = removeGMT(endDateString);
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

            if((startDateString + '').match(/,( *)$/g)){
                startDateString = startDateString.replace(',', '');
                endDateString = endDateString.replace(',', '');
            }

            if((startDateString + '').match(/\d( ?)T( ?)\d/g)) startDateString = startDateString.replace('T', ' ');
            if((endDateString + '').match(/\d( ?)T( ?)\d/g)) endDateString = endDateString.replace('T', ' ');

            /*if(startDateString.startsWith('0')) startDateString = startDateString.substring(1);
            if(endDateString.startsWith('0')) endDateString = endDateString.substring(1);*/

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
            if(typeof dateElem === "string"){
                dateElem = dateElem.trim();
            }

            if (dateElem === "") return null;
            let date = null;

            let _isPm = (dateElem + '').match(/P(.?)M(.?)/i);
            let pacDelTIme = pacDelTime(dateElem);

            /**
             *
             * @param dateElem is the string or number of date
             * @returns {string|*} dataElem replaced with day before month if is DMY date-format
             * @private
             */
            let _checkDMY = function (dateElem) {
                if (that.getAttribute('date-format') === "DMY") {
                    let dataElemString = (dateElem + '');
                    if(dataElemString.match(/^\d((\d)?)[-. /]\d((\d)?)[-. /]\d{2}((\d{2})?)/g)){
                        let split = dataElemString.match(/[-. /]/g)[0];
                        let dayToMonth = dataElemString.match(/\d((\d)?)/g)[0];
                        let monthToDay = dataElemString.match(/\d((\d)?)/g)[1];
                        if(Number.parseInt(monthToDay) > 12)
                            return dateElem;
                        return dataElemString.replace((dayToMonth + split + monthToDay), (monthToDay + split + dayToMonth));
                    }
                }
                return dateElem;
            };

            /** case format "Unix Timestamp", example: 126.233491 */
            if(sign === 2){
                dateElem = _checkDMY(dateElem);
                date = new Date(dateElem * 1000);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let min = date.getMinutes();
                let sec = date.getSeconds();
                let millisecond = date.getUTCMilliseconds();
                date = {
                    "year": year,
                    "month": month,
                    "day": day,
                    "hour": hour,
                    "minute": min,
                    "second": sec,
                    "millisecond": millisecond,
                }
                return date;
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
                    if(pacDelTIme){
                        dateElem += " PDT";
                    }
                }
                dateElem = _checkDMY(dateElem);
                date = new Date(dateElem);
                date = {
                    "year": date.getFullYear(),
                    "month": date.getUTCMonth() + 1,
                    "day": date.getUTCDate(),
                    "hour": date.getHours(),
                    "minute": date.getUTCMinutes(),
                    "second": date.getUTCSeconds(),
                    "millisecond": date.getUTCMilliseconds(),
                }
                return date;
            }
            /** case format "yyyy.MM.dd G 'at' HH:mm:ss z", example: 2001.07.04 AD at 12:08:56 PDT */
            if(sign === 4){
                dateElem = (dateElem + '').replace(_ad(dateElem)[0], '');
                let match = dateElem.match(/(at|in|on|the)/i);
                if(match){
                    dateElem = dateElem.replace(match[0], '');
                }
                if(pacDelTime(dateElem)){
                    dateElem.replace(pacDelTime(dateElem)[0], 'PDT');
                }
                dateElem = _checkDMY(dateElem);
                date = new Date(dateElem);
                date = {
                    "year": date.getFullYear(),
                    "month": date.getUTCMonth() + 1,
                    "day": date.getDate(),
                    "hour": date.getHours(),
                    "minute": date.getUTCMinutes(),
                    "second": date.getUTCSeconds(),
                    "millisecond": date.getUTCMilliseconds(),
                }
                return date;
            }
            /** case format "hh-english_time a, zzzz", example: 12 o'clock PM, Pacific Daylight Time */
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
                    if(pacDelTIme){
                        dateElem += " PDT";
                    }
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
                                if(pacDelTIme){
                                    dateElem += " PDT";
                                }
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
                                if(pacDelTIme){
                                    dateElem += " PDT";
                                }
                            }
                        }
                    }
                }
                dateElem = _checkDMY(dateElem);
                date = new Date(dateElem);
                date = {
                    "year": date.getFullYear(),
                    "month": date.getUTCMonth() + 1,
                    "day": date.getDate(),
                    "hour": date.getHours(),
                    "minute": date.getUTCMinutes(),
                    "second": date.getUTCSeconds(),
                    "millisecond": date.getUTCMilliseconds(),
                }
                return [date, dateElem];
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
                    /*if (that.getAttribute('date-format') === "DMY") {
                        let dateParts = dateElem.split("/");
                        if (dateParts.length !== 3)
                            dateParts = dateElem.split("-");
                        if (dateParts[1] > 12)
                            date = null;
                        else
                            date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based
                    }*/
                    /*else*/
                    /** case format "yyyy-MM-dd'T'HH:mm:ss.SSSZ", example: 2001-07-04T12:08:56.235-0700 */
                        if(sign === 5){
                            dateElem = (dateElem + '').replace('T', ' ').replace('Z', '');
                        }
                        if(pacDelTIme){
                            dateElem = (dateElem + '').replace(pacDelTIme[0], 'PDT')
                        }
                    /** case format "dd-monthName-yyyy:HH:mm:ss SSSZ", example: 28/Jan/2022:00:06:59 +0000 */
                        if(sign === 7){
                            dateElem = (dateElem + '').replace(splitYearTime(dateElem), ' ');
                            dateElem = _checkDMY(dateElem);
                            date = new Date(dateElem);
                            date = {
                                "year": date.getFullYear(),
                                "month": date.getUTCMonth() + 1,
                                "day": date.getUTCDate() + 1,
                                "hour" : date.getHours(),
                                "minute": date.getUTCMinutes(),
                                "second": date.getUTCSeconds(),
                                "millisecond": date.getUTCMilliseconds(),
                            }
                            return [date, dateElem];
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
                            dateElem = _checkDMY(dateElem);
                            date = new Date(dateElem);
                            date = {
                                "year": date.getFullYear(),
                                "month": date.getUTCMonth() + 1,
                                "day": date.getUTCDate(),
                                "hour" : date.getHours(),
                                "minute": date.getUTCMinutes(),
                                "second": date.getUTCSeconds(),
                                "millisecond": date.getUTCMilliseconds(),
                            }
                            return [date, dateElem];
                        }
                        dateElem = _checkDMY(dateElem);
                        date = new Date(dateElem); //https://www.w3schools.com/js/js_date_formats.asp
                    if (isNaN(date.getFullYear()))
                        return null;

                    date = {
                        "year": date.getFullYear(),
                        "month": date.getUTCMonth() + 1,
                        "day": date.getDate(),
                        "hour" : date.getHours(),
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
            return ((str + '').match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(:[0-9]{2})*(:[0-9]{2})*(:[0-9][0-9]([0-9]?))Z$/g));
        };

        let _isyyMMddHHmmssmsZ = function (str) {
            return ((str + '').match(/\d{12}((\d{2,3})?)(([-+]\d{4})?)/g));
        };

        /*let _isFormatWithAD_PDT = function (str) {
            return ((str + '').match(/^(\d{4}).(\d{2}).(\d{2}) AD \w{2,3} (\d{2}):(\d{2}):(\d{2}) PDT$/g));
        }*/

        let _isUnixTimestamp = function (str) {

            if ((str + '').match(/^(1[0-9]{2,3}.[0-9]{5,6})$/g) || (str + '').match(/^(1[0-9]{7,8})$/g)) return true;
            else return false;
        };

        let _ad = function (str) {
            return (str + '').match(/A(.?)D(.?)/gi);
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
        let initialHour_i = inputs.indexOf("StartTime");
        let finalHour_i = inputs.indexOf("FinishTime");
        let eventInfo1_i = inputs.indexOf("Event-info1");
        let eventInfo2_i = inputs.indexOf("Event-info2");
        let eventInfo3_i = inputs.indexOf("Event-info3");

        let _isWordEnglishTime = function (str) {
            return (str + '').match(/O'CLOCK|A QUARTER|PAST|TO/i);
        };

        let _isHour = function (hour){
            return ('' + hour).match(/^[0-9]{1,2}(:|.)[0-9][0-9]((:|.)[0-9][0-9])?((:|.)[0-9][0-9]){0,2}[0-9]*( (a(.?)m(.?)|p(.?)m(.?))*)?( ?)((ad|pdt|Pacific Daylight Time)?)(([-+]?)((\d{4})?))$/gi) ||
                              _isWordEnglishTime('' + hour);
        }

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

            let titleTooltip = data[2].name;
            let headline = data[2] ? data[2].data[i] : '';

            let text = '', url = '', background = '';
            let j = 3;

            if (text_i > -1) {
                while (inputs[j] === "EventDescription") {
                    text += "<table><tr><td style='display: inline !important;'><b style='color: black'>" + data[j].name + "</b>:</td><td style='max-width: 350px'>" + data[j].data[i] + "</td></tr></table>";
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
                text += "<hr width='50%'>";
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
            }

            if (start_date)
                events.push({
                    "start_date": start_date,
                    "end_date": end_date,
                    "text": {
                        "headline": '<img src="https://img.icons8.com/external-those-icons-fill-those-icons/17/000000/external-event-time-calendar-those-icons-fill-those-icons-1.png" data-bs-toggle="tooltip" data-bs-placement="top" title =' + titleTooltip + ' /> ' + headline,
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


const LogTimelineDatalet = Object.freeze(LogtimelineDatalet);
window.customElements.define('logtimeline-datalet', LogTimelineDatalet);