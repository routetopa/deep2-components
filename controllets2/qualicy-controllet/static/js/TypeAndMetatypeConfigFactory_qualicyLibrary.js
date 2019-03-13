import {
    most_popular_italian_names,
    most_popular_italian_surnames,
    regions,
    province,
    province_abbreviation,
    municipality,
    religions,
    genders
} from './initialization_Italy.js';

class TDS {

    constructor(rootnode) {
        if (typeof rootnode === 'undefined')
            rootnode = new TDSNODE();
        this._root = rootnode;
    }//EndConstructor.

    get root() { return this._root; }

    traverseDepthFirst() {
        let stack = [ this._root ];
        let traverse = [];
        let item = null;

        while ( typeof (item = stack.pop()) !== 'undefined') {
            traverse.unshift(item);
            item.children.forEach( (element, index) => {
                stack.push(element);
            });
        }

        return traverse;
    }//EndFunction.

};//EndClass.

class TDSNODE {

    constructor(data, parent) {
        this._parent = parent;
        this._data = data;
        this._children = [];

        if (typeof this._parent !== 'undefined') {
            this._parent.addChild(this);
        }
    }//EndConstructor.

    get parent() { return this._parent; }
    set parent(parent) { this._parent = parent; }

    get data() { return this._data; }
    set data(value) { this._data = value; }

    get children() { return this._children; }

    addChild(child) {
        child.parent = this;
        this._children.push(child);
    }//EndFunction.

};//EndClass.

/*
 ** This file is part of JSDataChecker.
 **
 ** JSDataChecker is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** JSDataChecker is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with JSDataChecker. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2018 JSDataChecker - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **
 ** ----------------------------------------------------------------------------------
 **
 ** A basic configuration for the privacy module.
 **/

const BASIC_DATATYPES = {
    DT_NULL:    { name: "NULL" },

    DT_TEXT:    { name: "TEXT" },
    DT_REAL:    { name: "REAL"},
    DT_INT:     { name: "INT" },

    DT_DATE:    { name: "DATE" },
    DT_DATEYM:  { name: "DATEYM"},
    DT_DATEYMD: { name: "DATEYMD" },
    DT_DATEXXY: { name: "DATEXXY" },
    DT_DATEDMY: { name: "DATEDMY" },
    DT_DATEMDY: { name: "DATEMDY" },

    DT_OBJECT:  { name: "OBJECT" },

    DT_UNKNOWN: { name: "UNKNOWN" },

    //OLD
    //OBJECT          :   { name: "OBJECT"},
    //GEOCOORDINATE   :   { name: "GEOCOORDINATE" },
    //GEOJSON         :   { name: "GEOJSON" },
};

//OLD
/*const GEOJSONTYPES = [ "Point", "MultiPoint", "LineString",
    "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature",
    "FeatureCollection" ];*/

const META_DATATYPES = {
    DT_UNKNOWN: { name: "UNKNOWN" },
    //DT_NULL:    { name: "NULL" },

    DT_EMAIL:   { name: "EMAIL" },
    DT_URL : {name:"URL"},
    DT_CF:      { name: "CF" },
    DT_IBAN : {name:"IBAN"},

    DT_ZIPCODE : { name: "ZIPCODE"},

    DT_MOBILEPHONE : { name: "MOBILE_PHONE"},
    DT_PHONE : { name: "PHONE"},

    DT_LONGITUDE : {name:"LONGITUDE"},
    DT_LATITUDE : {name:"LATITUDE"},
    DT_LAT_LONG : {name:"LAT_LONG"},

    DT_ADDRESS : {name: "ADDRESS"},
    DT_PROVINCE : {name:"PROVINCE"},
    DT_MUNICIPALITY : {name:"MUNICIPALITY"},
    DT_REGION : {name:"REGION"},

    DT_ATECO_CODE : {name:"ATECO"},

    DT_SURNAME : {name:"SURNAME"},
    DT_NAME : {name:"NAME"},

    DT_RELIGION : {name:"RELIGION"},
    DT_GENDER : {name:"GENDER"},
    DT_MONEY : {name:"MONEY"},
    DT_PERCENTAGE : {name:"PERCENTAGE"},
    DT_DEGREE : {name:"DEGREE"}
};

const META_DATATYPES_LANGS = {
    "key_descr_email": {
        "EN": "According to the GDPR the e-mail is a sensitive data."
    },
};

const DATATYPES = Object.assign({}, BASIC_DATATYPES, META_DATATYPES);

BASIC_DATATYPES.DT_NULL.evaluate = function(value) {
    if (value === null || typeof value === 'undefined' || value.toLowerCase() == 'null')
        return { datatype: BASIC_DATATYPES.DT_NULL, value: value };

    return { datatype: BASIC_DATATYPES.DT_UNKNOWN, value: value };
};
//META_DATATYPES.DT_NULL = BASIC_DATATYPES.DT_NULL;
/*
BASIC_DATATYPES.DT_OBJECT.evaluate = function(value) {
    if (value === 'object')
        return { datatype: BASIC_DATATYPES.DT_OBJECT, value: value };

    return { datatype: BASIC_DATATYPES.DT_UNKNOWN, value: value };
};
*/
BASIC_DATATYPES.DT_TEXT.evaluate = function(value) {
    return { datatype: BASIC_DATATYPES.DT_TEXT, value: value };
};//EndFunction.

BASIC_DATATYPES.DT_REAL.evaluate = function (value) {
    if(/^(\-|\+)?((0|([1-9][0-9]*))|Infinity)$/
        .test(value))
        return { datatype: BASIC_DATATYPES.DT_INT, value: value, parsedValue: Number(value) };

    var match = /^(\-|\+)?(0|([1-9][0-9]*))((\.|\,)([0-9]+))?$/.exec(value);
    if( match )
        return { datatype: BASIC_DATATYPES.DT_REAL, value: value, parsedValue: Number(value), sign: match[1], decimalSeparator: match[5] }

    return { datatype: BASIC_DATATYPES.DT_UNKNOWN, value: value };
};
BASIC_DATATYPES.DT_INT.evaluate = BASIC_DATATYPES.DT_REAL.evaluate;

DATATYPES.DT_DATE.evaluate = function (value) {
    var dtDate = new Date("YYYY-MM-DD");

    // [YYYY-MM] year-month.
    var match = /^([0-9]{1,4})(\-|\/)([0-9]{1,2})$/.exec(value);
    if (match) {
        var splitted = match[2];
        var year = parseInt(match[1]);
        var month = parseInt(match[3]);

        if (month > 12) return { datatype: DATATYPES.DT_UNKNOWN, value: value };

        dtDate.setYear(year);
        dtDate.setMonth(month);
        return { datatype: DATATYPES.DT_DATEYM, value: value, parsedValue: dtDate };
    }

    // [YYYY-MM-DD]
    var match = /^([0-9]{1,4})(\-|\/)([0-9]{1,2})((\-|\/)([0-9]{1,2}))?$/.exec(value);
    if (match) {
        var year = parseInt(match[1]);
        var month = parseInt(match[3]);
        var day = parseInt(match[6]); //splitted.length == 3 ? parseInt(splitted[2]) : 0;

        //Checks the range.
        if (month <= 0 || month >= 13) return null;
        if (day <= 0 || day >= 32) return null;

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);

        return { datatype: DATATYPES.DT_DATEYMD, value: value, parsedValue: dtDate };
    }

    /// DD-MM-YYYY or MM-DD-YYYY
    var match = /^([0-9]{1,2})(\-|\/)([0-9]{1,2})(\-|\/)([0-9]{1,4})$/.exec(value);
    if (match) {
        var year = parseInt(match[5]);
        var month = parseInt(match[3]);
        var day = parseInt(match[1]);
        var result = { datatype: DATATYPES.DT_DATEDMY, value: value, parsedValue: dtDate };

        //Here, recognises the American vs Italian format.
        //When month is greater than twelve, it swaps month and day variable.
        if (month > 12) {
            var temp = month;
            month = day;
            day = temp;
            result.datatype = DATATYPES.DT_DATEMDY;
        }

        //Checks the range.
        if (month <= 0 || month >= 13) return { datatype: DATATYPES.DT_UNKNOWN, value: value };
        if (day <= 0 || day >= 32) return { datatype: DATATYPES.DT_UNKNOWN, value: value };

        if (day <= 12 && month <= 12) result.datatype = DATATYPES.DT_DATEXXY;//It can be both formats.

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return result;
    }

    return { datatype: DATATYPES.DT_UNKNOWN, value: value };
};
DATATYPES.DT_DATEYM.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEYMD.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEXXY.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEDMY.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEMDY.evaluate = DATATYPES.DT_DATE.evaluate;

BASIC_DATATYPES.DT_OBJECT.evaluate = function(value) {
    var dt_null = BASIC_DATATYPES.DT_NULL.evaluate(value);
    if (dt_null.datatype.name == BASIC_DATATYPES.DT_NULL.name)
        return dt_null;

    if (typeof value === 'object')
        return { datatype: BASIC_DATATYPES.DT_OBJECT, value: value };

    return { datatype: BASIC_DATATYPES.DT_UNKNOWN, value: value };
};


META_DATATYPES.DT_CF.evaluate = function (value) {
    value = value.toUpperCase();
    value = value.trim();

    var regex = /^(?:(?:[B-DF-HJ-NP-TV-Z]|[AEIOU])[AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_CF, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_EMAIL.evaluate = function (value) {
    value = value.trim();

    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_EMAIL, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_ZIPCODE.evaluate = function(value) {
    value = value.trim();

    var regex = /^([0-9]{5})$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_ZIPCODE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_MOBILEPHONE.evaluate = function(value) {
    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    var regex = /^(\((([+]|00)39)\)|(([+]|00)39))?((313)|(32[034789])|(33[013456789])|(34[02456789])|(36[0368])|(37[037])|(38[0389])|(39[0123]))([\d]{7})$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_MOBILEPHONE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_PHONE.evaluate = function(value) {
    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    var regex = /^(\((([+]|00)39)\)|(([+]|00)39))?0([\d]{11}|[\d]{10}|[\d]{9}|[\d]{8})$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_PHONE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_ADDRESS.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    var regex = /^(via|viale|vico|v[.]|corso|c[.]so|piazza|piazzetta|p[.]|p[.]zza|parco|largo|traversa|contrada|c\/o)\s([a-z]+\s?)+(([,°]?\s?\d*)?|(s.n.c.)?)/i;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_ADDRESS, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_LATITUDE.evaluate = function(value){
    value = value.trim();

    var regex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_LATITUDE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_LONGITUDE.evaluate = function(value){
    value = value.trim();

    var regex = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_LONGITUDE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_IBAN.evaluate = function (value) {
    value = value.replace(/\s/g,'');

    var regex = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/i;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_IBAN, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_URL.evaluate = function(value){
    value = value.trim();

    var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_URL, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_ATECO_CODE.evaluate = function(value){
    value = value.trim();

    //Regular Expression to match Italian Istat Ateco Code (formally Codice Istat) updated to Ateco-Istat 2004.
    var regex = /^\d{2}[.]{1}\d{2}[.]{1}[0-9A-Za-z]{1}[p]?$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_ATECO_CODE, value: value };

    //Regular Expression to match Italian Istat Ateco Code (formally Codice Istat) updated to Ateco-Istat 2007.
    var regex = /^\d{2}[.]{1}\d{2}[.]{1}[0-9]{2}$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_ATECO_CODE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
}

META_DATATYPES.DT_MONEY.evaluate = function(value){
    value = value.replace(/\s/g,'');

    //currency symbol at the end
    var regex = /^-?((\d{1,3}(\.(\d){3})*)|\d*)(,\d{1,2})?((\u20AC)|(\$)|(£))$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_MONEY, value: value };

    //currency symbol at the beginning
    var regex = /^((\u20AC)|(\$)|(£))-?((\d{1,3}(\.(\d){3})*)|\d*)(,\d{1,2})?$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_MONEY, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_PERCENTAGE.evaluate = function(value){
    value = value.replace(/\s/g,'');

    var regex = /^(100|[0-9]{1,2}$|^[0-9]{1,2}\,[0-9]{1,3})%$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_PERCENTAGE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_DEGREE.evaluate = function(value){
    value = value.replace(/\s/g,'');

    //Celsius degree
    var regex = /^(100|[0-9]{1,2}|-[0-9]|-[1-2][0-9]|-30)°C?$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_DEGREE, value: value };

    //Fahrenheit  degree
    var regex = /^(^[0-9]{1,2}|220|2[1-2][0-9]|-[0-9]|-[1-2][0-9])°F$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_DEGREE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_LAT_LONG.evaluate = function(value){
    value = value.replace(/\s/g,'');

    var regex = /^([-+]?)([\d]{1,2})((\.)(\d+))?,(([-+]?)([\d]{1,3})((\.)(\d+))?)$/;

    if (regex.test(value))
        return { datatype: META_DATATYPES.DT_LAT_LONG, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_UNKNOWN.evaluate = function (value) {
    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_SURNAME.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if (value in most_popular_italian_surnames){
        return { datatype: META_DATATYPES.DT_SURNAME, value: value, correct_value:most_popular_italian_surnames[value].correct_value };
    }

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_NAME.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if (value in most_popular_italian_names){
        return { datatype: META_DATATYPES.DT_NAME, value: value, correct_value:most_popular_italian_names[value].correct_value };
    }

    let splitParts = value.split(' ');
    if(splitParts.length<5){
        if(splitParts.every(_checkInMap))
            return { datatype: META_DATATYPES.DT_NAME,
                value: value,
                correct_value: splitParts
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')
            };
    }

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

function _checkInMap(element){
    return element in most_popular_italian_names;
}

META_DATATYPES.DT_PROVINCE.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(value in province)
        return { datatype: META_DATATYPES.DT_PROVINCE, value: value, correct_value:province[value].correct_value };

    if(value in province_abbreviation)
        return { datatype: META_DATATYPES.DT_PROVINCE, value: value, correct_value:province_abbreviation[value].correct_value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_MUNICIPALITY.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(value in municipality)
        return { datatype: META_DATATYPES.DT_MUNICIPALITY, value: value, correct_value:municipality[value].correct_value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_REGION.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(value in regions)
        return { datatype: META_DATATYPES.DT_REGION, value: value, correct_value:regions[value].correct_value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_RELIGION.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(religions.indexOf(value)>=0)
        return { datatype: META_DATATYPES.DT_RELIGION, value: value, correct_value:value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_GENDER.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(genders.indexOf(value)>=0)
        return { datatype: META_DATATYPES.DT_GENDER, value: value, correct_value:value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

//typos errors
META_DATATYPES.DT_PROVINCE.correct = function (words, value) {
    var corrections = [];

    for(let key in words){
        let current_datatype = META_DATATYPES.DT_PROVINCE.evaluate(key);
        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: current_datatype.correct_value
            });
        }
    }
    return corrections;
};

META_DATATYPES.DT_MUNICIPALITY.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_MUNICIPALITY.evaluate(key);
        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: current_datatype.correct_value
            });
        }
    }

    return corrections;
};

META_DATATYPES.DT_SURNAME.correct = function (words, value) {
    let corrections = [];

    for(let key in words){
        let current_datatype = META_DATATYPES.DT_SURNAME.evaluate(key);
        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: current_datatype.correct_value
            });
        }
    }
    return corrections;
};

META_DATATYPES.DT_NAME.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        // let current_datatype = null;
        // if (value in most_popular_italian_names)
        //     current_datatype = { datatype: META_DATATYPES.DT_NAME, value: value };
        // else
        //     current_datatype = { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
        var current_datatype = META_DATATYPES.DT_NAME.evaluate(key);

        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: current_datatype.correct_value
            });
        }
    }
    return corrections;
};

META_DATATYPES.DT_RELIGION.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_RELIGION.evaluate(key);
        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: key
            });
        }
    }
    return corrections;
};

META_DATATYPES.DT_REGION.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_REGION.evaluate(key);
        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: key
            });
        }
    }
    return corrections;
};

META_DATATYPES.DT_GENDER.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_GENDER.evaluate(key);
        if(current_datatype.datatype!=META_DATATYPES.DT_UNKNOWN) {
            corrections.push({
                datatype: current_datatype.datatype,
                value: value,
                num_of_modifications: words[key],
                correction: key
            });
        }
    }
    return corrections;
};

//content privacy breach
META_DATATYPES.DT_CF.checkInText = function (value) {
    var regex = /(?:(?:[B-DF-HJ-NP-TV-Z]|[AEIOU])[AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]/ig;

    value = value.toLowerCase();
    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_CF, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

META_DATATYPES.DT_EMAIL.checkInText = function (value) {
    var regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

    value = value.toLowerCase();
    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_EMAIL, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

META_DATATYPES.DT_ZIPCODE.checkInText = function(value) {
    var regex = /([0-9]{5})/g;

    //value = value.toLowerCase();
    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_ZIPCODE, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

META_DATATYPES.DT_MOBILEPHONE.checkInText = function(value)  {
    var regex = /(\((([+]|00)39)\)|(([+]|00)39))?((313)|(32[034789])|(33[013456789])|(34[02456789])|(36[0368])|(37[037])|(38[0389])|(39[0123]))([\d]{7})/g;

    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    //value = value.toLowerCase();
    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_MOBILEPHONE, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

META_DATATYPES.DT_PHONE.checkInText = function(value) {
    var regex = /(\((([+]|00)39)\)|(([+]|00)39))?0([\d]{11}|[\d]{10}|[\d]{9}|[\d]{8})/g;

    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    //value = value.toLowerCase();
    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_PHONE, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

META_DATATYPES.DT_ADDRESS.checkInText = function (value) {
    var regex = /(via|viale|vico|corso|piazza|piazzetta)\s([a-z]+\s?)+([,°][ ]?)?\d*/ig;
    //v[.], c[.]so, p[.], p[.]zza

    value = value.toLowerCase();

    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_ADDRESS, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

META_DATATYPES.DT_IBAN.checkInText = function (value) {
    var regex = /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/ig;

    value = value.replace(/\s/g,'');

    var matchList = [];
    var match = regex.exec(value);
    while (match != null) {
        matchList.push({ datatype: META_DATATYPES.DT_IBAN, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
};

function editDistance1(originalWord) {

    originalWord = originalWord.toLowerCase();
    var word = originalWord.split('');
    var results = {};
    var alphabet = "abcdefghijklmnopqrstuvwxyz";

    //Adding any one character (from the alphabet) anywhere in the word.
    for(var i = 0; i <= word.length; i++){
        for(var j = 0; j < alphabet.length; j++){
            var newWord = word.slice();
            newWord.splice(i, 0, alphabet[j]);
            newWord = newWord.join('');
            results[newWord] = 1;
        }
    }

    //Removing any one character from the word.
    if(word.length > 1){
        for(var i = 0; i < word.length; i++){
            var newWord = word.slice();
            newWord.splice(i,1);
            newWord = newWord.join('');
            results[newWord] = 1;
        }
    }

    //Transposing (switching) the order of any two adjacent characters in a word.
    if(word.length > 1){
        for(var i = 0; i < word.length - 1; i++){
            var newWord = word.slice();
            var r = newWord.splice(i,1);
            newWord.splice(i + 1, 0, r[0]);
            newWord = newWord.join('');
            results[newWord] = 1;
        }
    }

    //Substituting any character in the word with another character.
    for(var i = 0; i < word.length; i++){
        for(var j = 0; j < alphabet.length; j++){
            var newWord = word.slice();
            newWord[i] = alphabet[j];
            newWord = newWord.join('');
            results[newWord] = 1;
        }
    }
    if(originalWord in results){
        delete results[originalWord];
    }


    return results;
}

//////////////////////////////////////////////////////////////////////////
//// The factory class for the configuration of the privacy module.
////
export default class TypeAndMetatypeConfigFactory {

    constructor() {}//EndConstructor.

    get DATATYPES() {
        return DATATYPES;
    }

    get METADATATYPES(){
        return META_DATATYPES;
    }

    get BASICDATATYPES(){
        return BASIC_DATATYPES;
    }

    //TODO still something to do
    get types() {
        return [];
    }

    _basicDatatypes() {
        var dtds = this._datatypesBuild();
        var arrToTraverse = dtds.traverseDepthFirst();
        var datatypesList = [];
        for(var datatypeIndex in arrToTraverse){
            datatypesList.push(arrToTraverse[datatypeIndex].data)
        }
        return datatypesList;
    };

    _datatypesBuild() {
        const dt_text = new TDSNODE(this.BASICDATATYPES.DT_TEXT);

        const dt_null = new TDSNODE(this.BASICDATATYPES.DT_NULL, dt_text);

        const dt_real = new TDSNODE(this.BASICDATATYPES.DT_REAL, dt_text);
        const dt_int = new TDSNODE(this.BASICDATATYPES.DT_INT, dt_real);

        const dt_date = new TDSNODE(this.BASICDATATYPES.DT_DATE, dt_text);
        const dt_date_ym = new TDSNODE(this.BASICDATATYPES.DT_DATEYM, dt_date);
        const dt_date_ymd = new TDSNODE(this.BASICDATATYPES.DT_DATEYMD, dt_date);
        const dt_date_xxy = new TDSNODE(this.BASICDATATYPES.DT_DATEXXY, dt_date);
        const dt_date_dmy = new TDSNODE(this.BASICDATATYPES.DT_DATEDMY, dt_date_xxy);
        const dt_date_mdy = new TDSNODE(this.BASICDATATYPES.DT_DATEMDY, dt_date_xxy);

        const dt_object = new TDSNODE(this.BASICDATATYPES.DT_OBJECT, dt_text);

        return new TDS(dt_text);
    };

    _inferDatatype(value){

        var arrTraverseOrder = this._basicDatatypes();

        //Runs each registered "evaluate" function on the value.
        let _inferredDataType = { datatype: this.BASICDATATYPES.DT_UNKNOWN, value: value };
        for (let i=0; i<arrTraverseOrder.length; i++) {
            let dtnode = arrTraverseOrder[i];
            _inferredDataType = dtnode.evaluate(value);

            if (_inferredDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name)
                return _inferredDataType;
        }

        return _inferredDataType;
    }

    evaluate(value){

        var _inferredDataType = this._inferDatatype(value);
        var _inferredMetaDataTypeObj;
        if(_inferredDataType.datatype.name === BASIC_DATATYPES.DT_NULL.name){
            _inferredMetaDataTypeObj = {
                value : _inferredDataType.value,
                datatype : _inferredDataType.datatype,
                metatype : _inferredDataType.datatype,
            };
            return _inferredMetaDataTypeObj;
        }

        _inferredMetaDataTypeObj = {
            value : _inferredDataType.value,
            datatype : _inferredDataType.datatype,
            metatype : META_DATATYPES.DT_UNKNOWN
        };

        if(_inferredDataType.datatype.name.startsWith(this.BASICDATATYPES.DT_DATE.name)){
            _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
            return _inferredMetaDataTypeObj;
        }
        else{
            //it is a number
            if(_inferredDataType.datatype.name == this.BASICDATATYPES.DT_INT.name){
                var _toTest = [this.METADATATYPES.DT_ZIPCODE, this.METADATATYPES.DT_MOBILEPHONE, this.METADATATYPES.DT_PHONE];
                for (let i=0; i<_toTest.length; i++) {
                    let dtnode = _toTest[i];
                    var _inferredMetaDataType = dtnode.evaluate(value);

                    if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                        _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                        return _inferredMetaDataTypeObj;
                    }
                }
                // TODO intero non classificato

            }
            else if(_inferredDataType.datatype.name == this.BASICDATATYPES.DT_REAL.name){
                var _toTest = [this.METADATATYPES.DT_LATITUDE, this.METADATATYPES.DT_LONGITUDE];
                for (let i=0; i<_toTest.length; i++) {
                    let dtnode = _toTest[i];
                    var _inferredMetaDataType = dtnode.evaluate(value);

                    if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                        _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                        return _inferredMetaDataTypeObj;
                    }
                }
                // TODO reale non classificato

            }
            //it is a string or an alfanumeric value
            else{
                var regex = /\d/;

                if (regex.test(value)){
                    //it contains also numbers
                    regex = /[a-zA-Z]/;
                    if (!regex.test(value)){
                        //it contains only numbers and special characters
                        if(value.indexOf('%')>=0){
                            let dtnode = this.METADATATYPES.DT_PERCENTAGE;
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                            else{
                                //TODO
                                _inferredMetaDataTypeObj.error = "Malformatted percetage?";
                                return _inferredMetaDataTypeObj;
                            }
                        }
                        else if(value.indexOf('$')>=0 ||value.indexOf('€')>=0||value.indexOf('£')>=0){
                            let dtnode = this.METADATATYPES.DT_MONEY;
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                            else{
                                //TODO
                                _inferredMetaDataTypeObj.error = "Malformatted payment?";
                                return _inferredMetaDataTypeObj;
                            }
                        }
                        else if(value.indexOf('.')>=0){
                            let dtnode = this.METADATATYPES.DT_ATECO_CODE;
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                        }
                        else if(value.indexOf(',')>=0){
                            let dtnode = this.METADATATYPES.DT_LAT_LONG;
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                        }
                        else if(value.indexOf('°')>=0){
                            let dtnode = this.METADATATYPES.DT_DEGREE;
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                        }

                        var _toTest = [this.METADATATYPES.DT_MOBILEPHONE, this.METADATATYPES.DT_PHONE];
                        for (let i=0; i<_toTest.length; i++) {
                            let dtnode = _toTest[i];
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                        }

                        // TODO only numbers and special characters not classified

                    }
                    else{
                        // alphanumeric string
                        if(value.indexOf('.')>=0){
                            var _toTest = [this.METADATATYPES.DT_ATECO_CODE, this.METADATATYPES.DT_URL];
                            for (let i=0; i<_toTest.length; i++) {
                                let dtnode = _toTest[i];
                                var _inferredMetaDataType = dtnode.evaluate(value);

                                if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                    _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                    return _inferredMetaDataTypeObj;
                                }
                            }
                            if(value.indexOf('@')>=0){
                                let dtnode = this.METADATATYPES.DT_EMAIL;
                                var _inferredMetaDataType = dtnode.evaluate(value);

                                if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                    _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                    return _inferredMetaDataTypeObj;
                                }
                                //TODO
                            }
                        }
                        else if(value.indexOf('°')>=0){
                            var _toTest = [this.METADATATYPES.DT_DEGREE, this.METADATATYPES.DT_ADDRESS];
                            for (let i=0; i<_toTest.length; i++) {
                                let dtnode = _toTest[i];
                                var _inferredMetaDataType = dtnode.evaluate(value);

                                if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                    _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                    return _inferredMetaDataTypeObj;
                                }
                            }

                        }

                        var _toTest = [this.METADATATYPES.DT_CF, this.METADATATYPES.DT_IBAN, this.METADATATYPES.DT_ADDRESS];
                        for (let i=0; i<_toTest.length; i++) {
                            let dtnode = _toTest[i];
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                        }

                        // TODO

                    }
                }
                //it contains only letters and symbols
                else{
                    if(value.indexOf('.')>=0){
                        let dtnode = this.METADATATYPES.DT_URL;
                        var _inferredMetaDataType = dtnode.evaluate(value);

                        if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                            _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                            return _inferredMetaDataTypeObj;
                        }
                        if(value.indexOf('@')>=0){
                            let dtnode = this.METADATATYPES.DT_EMAIL;
                            var _inferredMetaDataType = dtnode.evaluate(value);

                            if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name){
                                _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                                return _inferredMetaDataTypeObj;
                            }
                            else{
                                //TODO
                                _inferredMetaDataTypeObj.error = "Malformatted email?";
                                return _inferredMetaDataTypeObj;
                            }
                        }
                    }

                    var _toTest = [this.METADATATYPES.DT_ADDRESS, this.METADATATYPES.DT_GENDER, this.METADATATYPES.DT_RELIGION, this.METADATATYPES.DT_REGION, this.METADATATYPES.DT_PROVINCE, this.METADATATYPES.DT_MUNICIPALITY, this.METADATATYPES.DT_SURNAME, this.METADATATYPES.DT_NAME];
                    for (let i=0; i<_toTest.length; i++) {
                        let dtnode = _toTest[i];
                        var _inferredMetaDataType = dtnode.evaluate(value);

                        if (_inferredMetaDataType.datatype.name !== this.BASICDATATYPES.DT_UNKNOWN.name) {
                            _inferredMetaDataTypeObj.metatype = _inferredMetaDataType.datatype;
                            return _inferredMetaDataTypeObj;
                        }
                    }

                    //TODO
                }

            }
        }
        return _inferredMetaDataTypeObj;

    }

    get typosCheckingTypes() {
        return [META_DATATYPES.DT_GENDER, META_DATATYPES.DT_RELIGION,
            META_DATATYPES.DT_REGION, META_DATATYPES.DT_PROVINCE, META_DATATYPES.DT_MUNICIPALITY,
            META_DATATYPES.DT_SURNAME, META_DATATYPES.DT_NAME];
    }

    get contentPrivacyBreachesTypes() {
        return [META_DATATYPES.DT_EMAIL, META_DATATYPES.DT_CF, META_DATATYPES.DT_IBAN, META_DATATYPES.DT_ZIPCODE, META_DATATYPES.DT_MOBILEPHONE, META_DATATYPES.DT_PHONE, META_DATATYPES.DT_ADDRESS];
    }

    /**
     * Gives the translation for the
     * @param key
     * @param lang
     * @returns {*}
     */
    translate(key, lang) {
        if (META_DATATYPES_LANGS.hasOwnProperty(key))
            return langs[key][lang];
        return null;
    };

    /*
     * For the moment it does nothing...
     */
    build() {
        return null;
    };

    testTyposErrors(value) {
        var editDistance1Words = editDistance1(value);

        var corrections = [];
        var testCorrectionBASIC_DATATYPES = this.typosCheckingTypes;

        for(var index in testCorrectionBASIC_DATATYPES){
            corrections = corrections.concat(testCorrectionBASIC_DATATYPES[index].correct(editDistance1Words, value));
        }

        return corrections;
    };

    testContentPrivacyBreaches(value){
        var matchList = [];
        var contentPrivacyBreaches = this.contentPrivacyBreachesTypes;

        for(var index in contentPrivacyBreaches){
            matchList = matchList.concat(contentPrivacyBreaches[index].checkInText(value));
        }

        return matchList;
    };

    testStructuralPrivacyBreaches(schema){
        let report = [];

        if(schema.hasOwnProperty(META_DATATYPES.DT_CF.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_CF.name] = {};
            privacyBreach[META_DATATYPES.DT_CF.name].columnKey = schema[META_DATATYPES.DT_CF.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_EMAIL.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_EMAIL.name] = {};
            privacyBreach[META_DATATYPES.DT_EMAIL.name].columnKey = schema[META_DATATYPES.DT_EMAIL.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_IBAN.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_IBAN.name] = {};
            privacyBreach[META_DATATYPES.DT_IBAN.name].columnKey = schema[META_DATATYPES.DT_IBAN.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_PHONE.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_PHONE.name] = {};
            privacyBreach[META_DATATYPES.DT_PHONE.name].columnKey = schema[META_DATATYPES.DT_PHONE.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_MOBILEPHONE.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_MOBILEPHONE.name] = {};
            privacyBreach[META_DATATYPES.DT_MOBILEPHONE.name].columnKey = schema[META_DATATYPES.DT_MOBILEPHONE.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_ZIPCODE.name) && schema.hasOwnProperty(META_DATATYPES.DT_GENDER.name) && schema.hasOwnProperty(DATATYPES.DT_DATE.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_ZIPCODE.name] = {};
            privacyBreach[META_DATATYPES.DT_ZIPCODE.name].columnKey = schema[META_DATATYPES.DT_ZIPCODE.name];
            privacyBreach[META_DATATYPES.DT_GENDER.name] = {};
            privacyBreach[META_DATATYPES.DT_GENDER.name].columnKey = schema[META_DATATYPES.DT_GENDER.name];
            privacyBreach[DATATYPES.DT_DATE.name] = {};
            privacyBreach[DATATYPES.DT_DATE.name].columnKey = schema[DATATYPES.DT_DATE.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_NAME.name) && schema.hasOwnProperty(META_DATATYPES.DT_SURNAME.name) && schema.hasOwnProperty(DATATYPES.DT_LAT_LONG.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_NAME.name] = {};
            privacyBreach[META_DATATYPES.DT_NAME.name].columnKey = schema[META_DATATYPES.DT_NAME.name];
            privacyBreach[META_DATATYPES.DT_SURNAME.name] = {};
            privacyBreach[META_DATATYPES.DT_SURNAME.name].columnKey = schema[META_DATATYPES.DT_SURNAME.name];
            privacyBreach[META_DATATYPES.DT_LAT_LONG.name] = {};
            privacyBreach[META_DATATYPES.DT_LAT_LONG.name].columnKey = schema[META_DATATYPES.DT_LAT_LONG.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_NAME.name) && schema.hasOwnProperty(META_DATATYPES.DT_SURNAME.name) &&
            schema.hasOwnProperty(DATATYPES.DT_LATITUDE.name) && schema.hasOwnProperty(DATATYPES.DT_LONGITUDE.name)){
                let privacyBreach = {};
                privacyBreach[META_DATATYPES.DT_NAME.name] = {};
                privacyBreach[META_DATATYPES.DT_SURNAME.name] = {};
                privacyBreach[META_DATATYPES.DT_LATITUDE.name] = {};
                privacyBreach[META_DATATYPES.DT_LONGITUDE.name] = {};

                privacyBreach[META_DATATYPES.DT_NAME.name].columnKey = schema[META_DATATYPES.DT_NAME.name];
                privacyBreach[META_DATATYPES.DT_SURNAME.name].columnKey = schema[META_DATATYPES.DT_SURNAME.name];
                privacyBreach[META_DATATYPES.DT_LATITUDE.name].columnKey = schema[META_DATATYPES.DT_LATITUDE.name];
                privacyBreach[META_DATATYPES.DT_LONGITUDE.name].columnKey = schema[META_DATATYPES.DT_LONGITUDE.name];
                report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_NAME.name) && schema.hasOwnProperty(META_DATATYPES.DT_SURNAME.name) && schema.hasOwnProperty(DATATYPES.DT_ADDRESS.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_NAME.name] = {};
            privacyBreach[META_DATATYPES.DT_SURNAME.name] = {};
            privacyBreach[META_DATATYPES.DT_ADDRESS.name] = {};

            privacyBreach[META_DATATYPES.DT_NAME.name].columnKey = schema[META_DATATYPES.DT_NAME.name];
            privacyBreach[META_DATATYPES.DT_SURNAME.name].columnKey = schema[META_DATATYPES.DT_SURNAME.name];
            privacyBreach[META_DATATYPES.DT_ADDRESS.name].columnKey = schema[META_DATATYPES.DT_ADDRESS.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_NAME.name) && schema.hasOwnProperty(META_DATATYPES.DT_SURNAME.name) && schema.hasOwnProperty(DATATYPES.DT_RELIGION.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_NAME.name] = {};
            privacyBreach[META_DATATYPES.DT_SURNAME.name]  = {};
            privacyBreach[META_DATATYPES.DT_RELIGION.name]  = {};

            privacyBreach[META_DATATYPES.DT_NAME.name].columnKey = schema[META_DATATYPES.DT_NAME.name];
            privacyBreach[META_DATATYPES.DT_SURNAME.name].columnKey = schema[META_DATATYPES.DT_SURNAME.name];
            privacyBreach[META_DATATYPES.DT_RELIGION.name].columnKey = schema[META_DATATYPES.DT_RELIGION.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_CF.name) && schema.hasOwnProperty(DATATYPES.DT_ADDRESS.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_CF.name] = {};
            privacyBreach[META_DATATYPES.DT_ADDRESS.name] = {};

            privacyBreach[META_DATATYPES.DT_CF.name].columnKey = schema[META_DATATYPES.DT_CF.name];
            privacyBreach[META_DATATYPES.DT_ADDRESS.name].columnKey = schema[META_DATATYPES.DT_ADDRESS.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_CF.name) && schema.hasOwnProperty(DATATYPES.DT_RELIGION.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_CF.name] = {};
            privacyBreach[META_DATATYPES.DT_RELIGION.name] = {};

            privacyBreach[META_DATATYPES.DT_CF.name].columnKey = schema[META_DATATYPES.DT_CF.name];
            privacyBreach[META_DATATYPES.DT_RELIGION.name].columnKey = schema[META_DATATYPES.DT_RELIGION.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_CF.name) && schema.hasOwnProperty(DATATYPES.DT_LAT_LONG.name)){
            let privacyBreach = {};
            privacyBreach[META_DATATYPES.DT_CF.name] = {};
            privacyBreach[META_DATATYPES.DT_LAT_LONG.name] = {};

            privacyBreach[META_DATATYPES.DT_CF.name].columnKey = schema[META_DATATYPES.DT_CF.name];
            privacyBreach[META_DATATYPES.DT_LAT_LONG.name].columnKey = schema[META_DATATYPES.DT_LAT_LONG.name];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(META_DATATYPES.DT_CF.name) &&
            schema.hasOwnProperty(DATATYPES.DT_LATITUDE.name) && schema.hasOwnProperty(DATATYPES.DT_LONGITUDE.name)){
                let privacyBreach = {};
                privacyBreach[META_DATATYPES.DT_CF.name] = {};
                privacyBreach[META_DATATYPES.DT_LATITUDE.name] = {};
                privacyBreach[META_DATATYPES.DT_LONGITUDE.name] = {};

                privacyBreach[META_DATATYPES.DT_CF.name].columnKey = schema[META_DATATYPES.DT_CF.name];
                privacyBreach[META_DATATYPES.DT_LATITUDE.name].columnKey = schema[META_DATATYPES.DT_LATITUDE.name];
                privacyBreach[META_DATATYPES.DT_LONGITUDE.name].columnKey = schema[META_DATATYPES.DT_LONGITUDE.name];
                report.push(privacyBreach);
        }

        return report;
    }


};//EndClass.
