
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

//dictionaries
META_DATATYPES.DT_SURNAME.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if (value in most_popular_italian_surnames){
        let correct_name = value;
        if(value != most_popular_italian_surnames[value].correct_value){
            correct_name = most_popular_italian_surnames[value].correct_value;
        }
        return { datatype: META_DATATYPES.DT_SURNAME, value: value, correct_value:correct_name };
    }

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_NAME.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();


    /*
    var splittedParts = value.split(' ');

    for(var i in splittedParts){
        var valuePart = splittedParts[i];
        if (valuePart in most_popular_italian_names)
            return { datatype: META_DATATYPES.DT_NAME, value: value };
    }
     */

    if (value in most_popular_italian_names){
        let correct_name = value;
        if(value != most_popular_italian_names[value].correct_value){
            correct_name = most_popular_italian_names[value].correct_value;
        }
        return { datatype: META_DATATYPES.DT_NAME, value: value, correct_value:correct_name };
    }

    let splittedParts = value.split(' ');
    if(splittedParts.length<5){
        console.log(splittedParts)
        if(splittedParts.every(_checkInMap))
            return { datatype: META_DATATYPES.DT_NAME, value: value };
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

    if(regions.indexOf(value)>=0)
        return { datatype: META_DATATYPES.DT_REGION, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_RELIGION.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(value in religions)
        return { datatype: META_DATATYPES.DT_RELIGION, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_GENDER.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(genders.indexOf(value)>=0)
        return { datatype: META_DATATYPES.DT_GENDER, value: value };

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


let most_popular_italian_names = {
    "adele" : {
        correct_value : "Adele"
    },
    "alberto" : {
        correct_value : "Alberto"
    },
    //"ale" : "",
    "alessandra" : {
        correct_value : "Alessandra"
    },
    "alessandro" : {
        correct_value : "Alessandro"
    },
    "alessia" : {
        correct_value : "Alessia"
    },
    "alessio" : {
        correct_value : "Alessia"
    },
    //"alex" : "",
    "alice" : {
        correct_value : "Alice"
    },
    "andrea" : {
        correct_value : "Andrea"
    },
    "angela" : {
        correct_value : "Angela"
    },
    "angelica" : {
        correct_value : "Angelica"
    },
    "angelo" : {
        correct_value : "Angelo"
    },
    "anita" : {
        correct_value : "Anita"
    },
    "anna" : {
        correct_value : "Anna"
    },
    "annalisa" : {
        correct_value : "Annalisa"
    },
    "antonella" : {
        correct_value : "Antonella"
    },
    "antonio" : {
        correct_value : "Antonio"
    },
    "arianna" : {
        correct_value : "Arianna"
    },
    "aurora" : {
        correct_value : "Aurora"
    },
    "barbara" : {
        correct_value : "Barbara"
    },
    "beatrice" : {
        correct_value : "Beatrice"
    },
    "benedetta" : {
        correct_value : "Benedetta"
    },
    "bianca" : {
        correct_value : "Bianca"
    },
    "camilla" : {
        correct_value : "Camilla"
    },
    "carlo" : {
        correct_value : "Carlo"
    },
    "carlotta" : {
        correct_value : "Carlotta"
    },
    "carmine" : {
        correct_value : "Carmine"
    },
    "caterina" : {
        correct_value : "Caterina"
    },
    "cecilia" : {
        correct_value : "Cecilia"
    },
    "chiara" : {
        correct_value : "Chiara"
    },
    "christian" : {
        correct_value : "Christian"
    },
    "claudia" : {
        correct_value : "Claudia"
    },
    "claudio" : {
        correct_value : "Claudio"
    },
    "cristian" : {
        correct_value : "Cristian"
    },
    "cristiano" : {
        correct_value : "Cristiano"
    },
    "cristina" : {
        correct_value : "Cristina"
    },
    //"cyril" : "",
    "damiano" : {
        correct_value : "Damiano"
    },
    "daniel" : {
        correct_value : "Daniel"
    },
    "daniela" : {
        correct_value : "Daniela"
    },
    "daniele" : {
        correct_value : "Daniele"
    },
    "dario" : {
        correct_value : "Dario"
    },
    "davide" : {
        correct_value : "Davide"
    },
    "debora" : {
        correct_value : "Debora"
    },
    //"denis" : "",
    "diana" : {
        correct_value : "Diana"
    },
    "diego" : {
        correct_value : "Diego"
    },
    "domenico" : {
        correct_value : "Domenico"
    },
    "edoardo" : {
        correct_value : "Edoardo"
    },
    "elena" : {
        correct_value : "Elena"
    },
    "eleonora" : {
        correct_value : "Eleonora"
    },
    "elia" : {
        correct_value : "Elis"
    },
    //"elias" : "",
    "elisa" : {
        correct_value : "Elisa"
    },
    "elisabetta" : {
        correct_value : "Elisabetta"
    },
    "emanuela" : {
        correct_value : "Emanuela"
    },
    "emanuele" : {
        correct_value : "Emanuele"
    },
    "emiliano" : {
        correct_value : "Emiliano"
    },
    "emma" : {
        correct_value : "Emma"
    },
    "enrico" : {
        correct_value : "Enrico"
    },
    "enzo" : {
        correct_value : "Enzo"
    },
    "erica" : {
        correct_value : "Erica"
    },
    "erika" : {
        correct_value : "Erika"
    },
    "eva" : {
        correct_value : "Eva"
    },
    "fabio" : {
        correct_value : "Fabio"
    },
    "fabrizio" : {
        correct_value : "Fabrizio"
    },
    "federica" : {
        correct_value : "Federica"
    },
    "federico" : {
        correct_value : "Federico"
    },
    "filippo" : {
        correct_value : "Filippo"
    },
    "flavio" : {
        correct_value : "Flavio"
    },
    "francesca" : {
        correct_value : "Francesca"
    },
    "francesco" : {
        correct_value : "Francesco"
    },
    "gabriel" : {
        correct_value : "Gabriel"
    },
    "gabriele" : {
        correct_value : "Gabriele"
    },
    "gabriella" : {
        correct_value : "Gabriella"
    },
    "gaia" : {
        correct_value : "Gaia"
    },
    "giacomo" : {
        correct_value : "Giacomo"
    },
    "giada" : {
        correct_value : "Giada"
    },
    "gianluca" : {
        correct_value : "Gianluca"
    },
    "gianmarco" : {
        correct_value : "Gianmarco"
    },
    "ginevra" : {
        correct_value : "Ginevra"
    },
    "gioia" : {
        correct_value : "Gioia"
    },
    "giorgia" : {
        correct_value : "Giorgia"
    },
    "giorgio" : {
        correct_value : "Giorgio"
    },
    "giovanna" : {
        correct_value : "Giovanna"
    },
    "giovanni" : {
        correct_value : "Giovanni"
    },
    "giulia" : {
        correct_value : "Giulia"
    },
    "giulio" : {
        correct_value : "Giulio"
    },
    "giuseppe" : {
        correct_value : "Giuseppe"
    },
    "giusy" : {
        correct_value : "Giusy"
    },
    "gloria" : {
        correct_value : "Gloria"
    },
    "greta" : {
        correct_value : "Greta"
    },
    "guido" : {
        correct_value : "Guido"
    },
    "ilaria" : {
        correct_value : "Ilaria"
    },
    "ilenia" : {
        correct_value : "Ilenia"
    },
    "irene" : {
        correct_value : "Irene"
    },
    "isabella" : {
        correct_value : "Isabella"
    },
    "ivan" : {
        correct_value : "Ivan"
    },
    "jacopo" : {
        correct_value : "Jacopo"
    },
    "jessica" : {
        correct_value : "Jessica"
    },
    "john" : {
        correct_value : "John"
    },
    "julia" : {
        correct_value : "Julia"
    },
    "kevin" : {
        correct_value : "Kevin"
    },
    "laura" : {
        correct_value : "Laura"
    },
    "leo" : {
        correct_value : "Leo"
    },
    "leonardo" : {
        correct_value : "Leonardo"
    },
    "letizia" : {
        correct_value : "Letizia"
    },
    "linda" : {
        correct_value : "Linda"
    },
    "lisa" : {
        correct_value : "Lisa"
    },
    "lorenzo" : {
        correct_value : "Lorenzo"
    },
    "luca" : {
        correct_value : "Luca"
    },
    "lucia" : {
        correct_value : "Lucia"
    },
    "luciano" : {
        correct_value : "Luciano"
    },
    "lucrezia" : {
        correct_value : "Lucrezia"
    },
    "ludovica" : {
        correct_value : "Ludovica"
    },
    "luigi" : {
        correct_value : "Luigi"
    },
    "luisa" : {
        correct_value : "Luisa"
    },
    "manuel" : {
        correct_value : "Manuel"
    },
    "manuela" : {
        correct_value : "Manuela"
    },
    "marco" : {
        correct_value : "Marco"
    },
    "margherita" : {
        correct_value : "Margherita"
    },
    "maria" : {
        correct_value : "Maria"
    },
    "marika" : {
        correct_value : "Marika"
    },
    "marina" : {
        correct_value : "Marina"
    },
    "mario" : {
        correct_value : "Mario"
    },
    "mark" : {
        correct_value : "Mark"
    },
    "marta" : {
        correct_value : "Marta"
    },
    "martin" : {
        correct_value : "Martin"
    },
    "martina" : {
        correct_value : "Martina"
    },
    "mary" : {
        correct_value : "Mary"
    },
    "marzia" : {
        correct_value : "Marzia"
    },
    "massimo" : {
        correct_value : "Massimo"
    },
    "matilde" : {
        correct_value : "Matilde"
    },
    "matteo" : {
        correct_value : "Matteo"
    },
    "mattia" : {
        correct_value : "Mattia"
    },
    "maurizio" : {
        correct_value : "Maurizio"
    },
    "mauro" : {
        correct_value : "Mauro"
    },
    "max" : {
        correct_value : "Max"
    },
    "melissa" : {
        correct_value : "Melissa"
    },
    "michael" : {
        correct_value : "Michael"
    },
    "michela" : {
        correct_value : "Michela"
    },
    "michele" : {
        correct_value : "Michele"
    },
    "mike" : {
        correct_value : "Mike"
    },
    "miriam" : {
        correct_value : "Miriam"
    },
    "mirko" : {
        correct_value : "Mirko"
    },
    "monica" : {
        correct_value : "Monica"
    },
    "nadia" : {
        correct_value : "Nadia"
    },
    "nicholas" : {
        correct_value : "Nicholas"
    },
    "nicola" : {
        correct_value : "Nicola"
    },
    "nicole" : {
        correct_value : "Nicole"
    },
    "nicolò" : {
        correct_value : "Nicolò"
    },
    "noemi" : {
        correct_value : "Noemi"
    },
    "paola" : {
        correct_value : "Paola"
    },
    "paolo" : {
        correct_value : "Paolo"
    },
    "patrick" : {
        correct_value : "Patrick"
    },
    "pier" : {
        correct_value : "Pier"
    },
    "piero" : {
        correct_value : "Piero"
    },
    "pietro" : {
        correct_value : "Pietro"
    },
    "rachele" : {
        correct_value : "Rachele"
    },
    "raffaele" : {
        correct_value : "Raffaele"
    },
    "rebecca" : {
        correct_value : "Rebecca"
    },
    "riccardo" : {
        correct_value : "Riccardo"
    },
    "roberta" : {
        correct_value : "Roberta"
    },
    "roberto" : {
        correct_value : "Roberto"
    },
    "rosa" : {
        correct_value : "Rosa"
    },
    "rosario" : {
        correct_value : "Rosario"
    },
    "sabrina" : {
        correct_value : "Sabrina"
    },
    "salvatore" : {
        correct_value : "Salvatore"
    },
    "samantha" : {
        correct_value : "Samantha"
    },
    "samuel" : {
        correct_value : "Samuel"
    },
    "samuele" : {
        correct_value : "Samuele"
    },
    "sara" : {
        correct_value : "Sara"
    },
    "sarah" : {
        correct_value : "Sarah"
    },
    "saverio" : {
        correct_value : "Saverio"
    },
    "serena" : {
        correct_value : "Serena"
    },
    "sergio" : {
        correct_value : "Sergio"
    },
    "silvia" : {
        correct_value : "Silvia"
    },
    "simon" : {
        correct_value : "Simon"
    },
    "simona" : {
        correct_value : "Simona"
    },
    "simone" : {
        correct_value : "Simone"
    },
    "sofia" : {
        correct_value : "Sofia"
    },
    "sonia" : {
        correct_value : "Sonia"
    },
    "stefania" : {
        correct_value : "Stefania"
    },
    "stefano" : {
        correct_value : "Stefano"
    },
    "teresa" : {
        correct_value : "Teresa"
    },
    "thomas" : {
        correct_value : "Thomas"
    },
    "tiziano" : {
        correct_value : "Tiziano"
    },
    "tom" : {
        correct_value : "Tom"
    },
    "tommaso" : {
        correct_value : "Tommaso"
    },
    "umberto" : {
        correct_value : "Umberto"
    },
    "valentina" : {
        correct_value : "Valentina"
    },
    "valeria" : {
        correct_value : "Valeria"
    },
    "valerio" : {
        correct_value : "Valerio"
    },
    "vanessa" : {
        correct_value : "Vanessa"
    },
    "veronica" : {
        correct_value : "Veronica"
    },
    "vincenzo" : {
        correct_value : "Vincenzo"
    },
    "viola" : {
        correct_value : "Viola"
    },
    "vito" : {
        correct_value : "Vito"
    },
    "vittorio" : {
        correct_value : "Vittorio"
    },
};
let most_popular_italian_surnames = {
    "aiello" : {
        correct_value : "Aiello"
    },
    "amato" : {
        correct_value : "Amato"
    },
    "antonini" : {
        correct_value : "Antonini"
    },
    "arena" : {
        correct_value : "Arena"
    },
    "bacci" : {
        correct_value : "Bacci"
    },
    "baldi" : {
        correct_value : "Baldi"
    },
    "barberis" : {
        correct_value : "Barberis"
    },
    "barbero" : {
        correct_value : "Barbero"
    },
    "barbieri" : {
        correct_value : "Barbieri"
    },
    "bartolini" : {
        correct_value : "Bartolini"
    },
    "basso" : {
        correct_value : "Basso"
    },
    "bellucci" : {
        correct_value : "Bellucci"
    },
    "beltrame" : {
        correct_value : "Beltrame"
    },
    "benedetti" : {
        correct_value : "Benedetti"
    },
    "beretta" : {
        correct_value : "Beretta"
    },
    "bernardi" : {
        correct_value : "Bernardi"
    },
    "berti" : {
        correct_value : "Berti"
    },
    "bianchi" : {
        correct_value : "Bianchi"
    },
    "bianco" : {
        correct_value : "Bianco"
    },
    "bionaz" : {
        correct_value : "Bionaz"
    },
    "blancv" : {
        correct_value : "Blancv"
    },
    "bordet" : {
        correct_value : "Bordet"
    },
    "borghi" : {
        correct_value : "Borghi"
    },
    "bortolin" : {
        correct_value : "Bortolin"
    },
    "bortolotti" : {
        correct_value : "Bortolotti"
    },
    "brambilla" : {
        correct_value : "Brambilla"
    },
    "bruno" : {
        correct_value : "Bruno"
    },
    "bruzzone" : {
        correct_value : "Bruzzone"
    },
    "calcagno" : {
        correct_value : "Calcagno"
    },
    "canepa" : {
        correct_value : "Canepa"
    },
    "capasso" : {
        correct_value : "Capasso"
    },
    "capriotti" : {
        correct_value : "Capriotti"
    },
    "caputo" : {
        correct_value : "Caputo"
    },
    "cardinali" : {
        correct_value : "Cardinali"
    },
    "carlucci" : {
        correct_value : "Carlucci"
    },
    "carta" : {
        correct_value : "Carta"
    },
    "caruso" : {
        correct_value : "Caruso"
    },
    "casadei" : {
        correct_value : "Casadei"
    },
    "castellani" : {
        correct_value : "Castellani"
    },
    "catalano" : {
        correct_value : "Catalano"
    },
    "cattaneo" : {
        correct_value : "Cattaneo"
    },
    "ceccarelli" : {
        correct_value : "Ceccarelli"
    },
    "cerise" : {
        correct_value : "Cerise"
    },
    "cerutti" : {
        correct_value : "Cerutti"
    },
    "chenal" : {
        correct_value : "Chenal"
    },
    "cocco" : {
        correct_value : "Cocco"
    },
    "colangelo" : {
        correct_value : "Colangelo"
    },
    "colombo" : {
        correct_value : "Colombo"
    },
    "colussi" : {
        correct_value : "Colussi"
    },
    "conte" : {
        correct_value : "Conte"
    },
    "conti" : {
        correct_value : "Conti"
    },
    "coppola" : {
        correct_value : "Coppola"
    },
    "corazza" : {
        correct_value : "Corazza"
    },
    "cossu" : {
        correct_value : "Cossu"
    },
    "costa" : {
        correct_value : "Costa"
    },
    "costantini" : {
        correct_value : "Costantini"
    },
    "coviello" : {
        correct_value : "Coviello"
    },
    "cretier" : {
        correct_value : "Cretier"
    },
    "d`alessandro" : {
        correct_value : "D'Alessandro"
    },
    "d`amico" : {
        correct_value : "D'Amico"
    },
    "d`angelo" : {
        correct_value : "D'Angelo"
    },
    "de angelis" : {
        correct_value : "De Angelis"
    },
    "de luca" : {
        correct_value : "De Luca"
    },
    "de rosa" : {
        correct_value : "De Rosa"
    },
    "de santis" : {
        correct_value : "De Santis"
    },
    "de simone" : {
        correct_value : "De Simone"
    },
    "degano" : {
        correct_value : "Degano"
    },
    "deiana" : {
        correct_value : "Deiana"
    },
    "delfino" : {
        correct_value : "Delfino"
    },
    "di carlo" : {
        correct_value : "Di Carlo"
    },
    "di felice" : {
        correct_value : "Di Felice"
    },
    "di francesco" : {
        correct_value : "Di Francesco"
    },
    "di giacomo" : {
        correct_value : "Di Giacomo"
    },
    "di giovanni" : {
        correct_value : "Di Giovanni"
    },
    "di iorio" : {
        correct_value : "Di Iorio"
    },
    "di marco" : {
        correct_value : "Di Marco"
    },
    "di matteo" : {
        correct_value : "Di Matteo"
    },
    "di paolo" : {
        correct_value : "Di Paolo"
    },
    "di pietro" : {
        correct_value : "Di Pietro"
    },
    "di stefano" : {
        correct_value : "Di Stefano"
    },
    "diemoz" : {
        correct_value : "Diemoz"
    },
    "donati" : {
        correct_value : "Donati"
    },
    "egger" : {
        correct_value : "Egger"
    },
    "esposito" : {
        correct_value : "Esposito"
    },
    "fabbri" : {
        correct_value : "Fabbri"
    },
    "fabbro" : {
        correct_value : "Fabbro"
    },
    "fabris" : {
        correct_value : "Fabris"
    },
    "fadda" : {
        correct_value : "Fadda"
    },
    "favre" : {
        correct_value : "Favre"
    },
    "ferrando" : {
        correct_value : "Ferrando"
    },
    "ferrara" : {
        correct_value : "Ferrara"
    },
    "ferrari" : {
        correct_value : "Ferrari"
    },
    "ferrario" : {
        correct_value : "Ferrario"
    },
    "ferraris" : {
        correct_value : "Ferraris"
    },
    "ferraro" : {
        correct_value : "Ferraro"
    },
    "ferrero" : {
        correct_value : "Ferrero"
    },
    "ferretti" : {
        correct_value : "Ferretti"
    },
    "ferri" : {
        correct_value : "Ferri"
    },
    "fiore" : {
        correct_value : "Fiore"
    },
    "fiorucci" : {
        correct_value : "Fiorucci"
    },
    "floris" : {
        correct_value : "Floris"
    },
    "fumagalli" : {
        correct_value : "Fumagalli"
    },
    "furlan" : {
        correct_value : "Furlan"
    },
    "fusco" : {
        correct_value : "Fusco"
    },
    "galli" : {
        correct_value : "Galli"
    },
    "gallo" : {
        correct_value : "Gallo"
    },
    "gamper" : {
        correct_value : "Gamper"
    },
    "gargiulo" : {
        correct_value : "Gargiulo"
    },
    "gasser" : {
        correct_value : "Gasser"
    },
    "gatti" : {
        correct_value : "Gatti"
    },
    "gentile" : {
        correct_value : "Gentile"
    },
    "giannini" : {
        correct_value : "Giannini"
    },
    "giordano" : {
        correct_value : "Giordano"
    },
    "giovannini" : {
        correct_value : "Giovannini"
    },
    "giuliani" : {
        correct_value : "Giuliani"
    },
    "giusti" : {
        correct_value : "Giusti"
    },
    "gori" : {
        correct_value : "Gori"
    },
    "grange" : {
        correct_value : "Grange"
    },
    "grasso" : {
        correct_value : "Grasso"
    },
    "greco" : {
        correct_value : "Greco"
    },
    "grieco" : {
        correct_value : "Grieco"
    },
    "grosso" : {
        correct_value : "Grosso"
    },
    "gruber" : {
        correct_value : "Gruber"
    },
    "hofer" : {
        correct_value : "Hofer"
    },
    "iezzi" : {
        correct_value : "Iezzi"
    },
    "innocenti" : {
        correct_value : "Innocenti"
    },
    "izzo" : {
        correct_value : "Izzo"
    },
    "joly" : {
        correct_value : "Joly"
    },
    "kofler" : {
        correct_value : "Kofler"
    },
    "la rosa" : {
        correct_value : "La Rosa"
    },
    "lai" : {
        correct_value : "Lai"
    },
    "landi" : {
        correct_value : "Landi"
    },
    "leone" : {
        correct_value : "Leone"
    },
    "locatelli" : {
        correct_value : "Locatelli"
    },
    "loi" : {
        correct_value : "Loi"
    },
    "lombardi" : {
        correct_value : "Lombardi"
    },
    "lombardo" : {
        correct_value : "Lombardo"
    },
    "longo" : {
        correct_value : "Longo"
    },
    "lorusso" : {
        correct_value : "Lorusso"
    },
    "magnani" : {
        correct_value : "Magnani"
    },
    "mair" : {
        correct_value : "Mair"
    },
    "manca" : {
        correct_value : "Manca"
    },
    "mancini" : {
        correct_value : "Mancini"
    },
    "mancuso" : {
        correct_value : "Mancuso"
    },
    "mantovani" : {
        correct_value : "Mantovani"
    },
    "marchetti" : {
        correct_value : "Marchetti"
    },
    "marconi" : {
        correct_value : "Marconi"
    },
    "mariani" : {
        correct_value : "Mariani"
    },
    "marinelli" : {
        correct_value : "Marinelli"
    },
    "marini" : {
        correct_value : "Marini"
    },
    "marino" : {
        correct_value : "Marino"
    },
    "mariotti" : {
        correct_value : "Mariotti"
    },
    "marras" : {
        correct_value : "Marras"
    },
    "martin" : {
        correct_value : "Martin"
    },
    "martinelli" : {
        correct_value : "Martinelli"
    },
    "martini" : {
        correct_value : "Martini"
    },
    "martino" : {
        correct_value : "Martino"
    },
    "mauro" : {
        correct_value : "Mauro"
    },
    "mecca" : {
        correct_value : "Mecca"
    },
    "melis" : {
        correct_value : "Melis"
    },
    "meloni" : {
        correct_value : "Meloni"
    },
    "messina" : {
        correct_value : "Messina"
    },
    "mignogna" : {
        correct_value : "Mignogna"
    },
    "minelli" : {
        correct_value : "Minelli"
    },
    "moffa" : {
        correct_value : "Moffa"
    },
    "montanari" : {
        correct_value : "Montanari"
    },
    "montemurro" : {
        correct_value : "Montemurro"
    },
    "monti" : {
        correct_value : "Monti"
    },
    "morabito" : {
        correct_value : "Morabito"
    },
    "moretti" : {
        correct_value : "Moretti"
    },
    "moro" : {
        correct_value : "Moro"
    },
    "moser" : {
        correct_value : "Moser"
    },
    "mura" : {
        correct_value : "Mura"
    },
    "murgia" : {
        correct_value : "Murgia"
    },
    "musso" : {
        correct_value : "Musso"
    },
    "napolitano" : {
        correct_value : "Napolitano"
    },
    "negro" : {
        correct_value : "Negro"
    },
    "neri" : {
        correct_value : "Neri"
    },
    "oliveri" : {
        correct_value : "Oliveri"
    },
    "ottonello" : {
        correct_value : "Ottonello"
    },
    "pace" : {
        correct_value : "Pace"
    },
    "pagani" : {
        correct_value : "Pagani"
    },
    "palladino" : {
        correct_value : "Palladino"
    },
    "palmisano" : {
        correct_value : "Palmisano"
    },
    "palumbo" : {
        correct_value : "Palumbo"
    },
    "pappalardo" : {
        correct_value : "Pappalardo"
    },
    "parisi" : {
        correct_value : "Parisi"
    },
    "parodi" : {
        correct_value : "Parodi"
    },
    "passeri" : {
        correct_value : "Passeri"
    },
    "pastorino" : {
        correct_value : "Pastorino"
    },
    "peaquin" : {
        correct_value : "Peaquin"
    },
    "pedrotti" : {
        correct_value : "Pedrotti"
    },
    "pellegrini" : {
        correct_value : "Pellegrini"
    },
    "pellissier" : {
        correct_value : "Pellissier"
    },
    "perri" : {
        correct_value : "Perri"
    },
    "perron" : {
        correct_value : "Perron"
    },
    "perrone" : {
        correct_value : "Perrone"
    },
    "pession" : {
        correct_value : "Pession"
    },
    "pichler" : {
        correct_value : "Pichler"
    },
    "pinna" : {
        correct_value : "Pinna"
    },
    "piras" : {
        correct_value : "Piras"
    },
    "pircher" : {
        correct_value : "Pircher"
    },
    "poggi" : {
        correct_value : "Poggi"
    },
    "porcu" : {
        correct_value : "Porcu"
    },
    "pozzi" : {
        correct_value : "Pozzi"
    },
    "proietti" : {
        correct_value : "Proietti"
    },
    "pugliese" : {
        correct_value : "Pugliese"
    },
    "puglisi" : {
        correct_value : "Pugliesi"
    },
    "repetto" : {
        correct_value : "Repetto"
    },
    "ricci" : {
        correct_value : "Ricci"
    },
    "righi" : {
        correct_value : "Righi"
    },
    "rinaldi" : {
        correct_value : "Rinaldi"
    },
    "riva" : {
        correct_value : "Riva"
    },
    "rizzi" : {
        correct_value : "Rizzi"
    },
    "rizzo" : {
        correct_value : "Rizzo"
    },
    "romagnoli" : {
        correct_value : "Romagnoli"
    },
    "romaniello" : {
        correct_value : "Romaniello"
    },
    "romano" : {
        correct_value : "Romano"
    },
    "romeo" : {
        correct_value : "Romeo"
    },
    "rosati" : {
        correct_value : "Rosati"
    },
    "rosset" : {
        correct_value : "Rosset"
    },
    "rossi" : {
        correct_value : "Rossi"
    },
    "rosso" : {
        correct_value : "Rosso"
    },
    "rota" : {
        correct_value : "Rota"
    },
    "ruggiero" : {
        correct_value : "Ruggiero"
    },
    "russo" : {
        correct_value : "Russo"
    },
    "sabatini" : {
        correct_value : "Sabatini"
    },
    "sabbatini" : {
        correct_value : "Sabbatini"
    },
    "sabia" : {
        correct_value : "Sabia"
    },
    "sala" : {
        correct_value : "Sala"
    },
    "salvatore" : {
        correct_value : "Salvatore"
    },
    "sanna" : {
        correct_value : "Sanna"
    },
    "santarossa" : {
        correct_value : "Santarossa"
    },
    "santarsiero" : {
        correct_value : "Santarsiero"
    },
    "santini" : {
        correct_value : "Santini"
    },
    "santoro" : {
        correct_value : "Santoro"
    },
    "sartori" : {
        correct_value : "Sartori"
    },
    "semeraro" : {
        correct_value : "Semeraro"
    },
    "serra" : {
        correct_value : "Serra"
    },
    "simone" : {
        correct_value : "Simone"
    },
    "sorrentino" : {
        correct_value : "Sorrentino"
    },
    "spina" : {
        correct_value : "Spina"
    },
    "talarico" : {
        correct_value : "Talarico"
    },
    "telesca" : {
        correct_value : "Telesca"
    },
    "testa" : {
        correct_value : "Testa"
    },
    "tomasi" : {
        correct_value : "Tomasi"
    },
    "traverso" : {
        correct_value : "Traverso"
    },
    "trevisan" : {
        correct_value : "Trevisan"
    },
    "tripodi" : {
        correct_value : "Tripodi"
    },
    "usai" : {
        correct_value : "Usai"
    },
    "valentini" : {
        correct_value : "Valentini"
    },
    "vallet" : {
        correct_value : "Vallet"
    },
    "venditti" : {
        correct_value : "Venditti"
    },
    "venier" : {
        correct_value : "Venier"
    },
    "venturi" : {
        correct_value : "Venturi"
    },
    "vierin" : {
        correct_value : "Vierin"
    },
    "villa" : {
        correct_value : "Villa"
    },
    "visintin" : {
        correct_value : "Visintin"
    },
    "vitale" : {
        correct_value : "Vitale"
    },
    "vitali" : {
        correct_value : "Vitali"
    },
    "vuillermoz" : {
        correct_value : "Vuillermoz"
    },
    "zeni" : {
        correct_value : "Zeni"
    },
    "zuliani" : {
        correct_value : "Zuliani"
    },
    "zunino" : {
        correct_value : "Zunino"
    },
};
let province = {
    "avellino": {
        region: "campania",
        correct_value: "Avellino",
    },
    "benevento": {
        region: "campania",
        correct_value: "Benevento",
    },
    "caserta": {
        region: "campania",
        correct_value: "Caserta",
    },
    "napoli": {
        region: "campania",
        correct_value: "Napoli",
    },
    "salerno": {
        region: "campania",
        correct_value: "Salerno",
    },
};
let province_abbreviation = {
    "av": {
        region: "campania",
        correct_value: "AV",
    },
    "bn": {
        region: "campania",
        correct_value: "BN",
    },
    "ce": {
        region: "campania",
        correct_value: "CE",
    },
    "na": {
        region: "campania",
        correct_value: "NA",
    },
    "sa": {
        region: "campania",
        correct_value: "SA",
    },
};
let municipality = {
    //"campania": [
    "acerno":{
        region: "campania",
        correct_value: "Acerno",
    },
    "acerra" :{
        region: "campania",
        correct_value: "Acerra",
    },
    "afragola" :{
        region: "campania",
        correct_value: "Afragola",
    },
    "agerola" :{
        region: "campania",
        correct_value: "Agerola",
    },
    "agropoli" :{
        region: "campania",
        correct_value: "Agropoli",
    },
    "aiello del sabato" :{
        region: "campania",
        correct_value: "Aiello del Sabato",
    },
    "ailano" :{
        region: "campania",
        correct_value: "Ailano",
    },
    "airola" :{
        region: "campania",
        correct_value: "Airola",
    },
    "albanella" :{
        region: "campania",
        correct_value: "Albanella",
    },
    "alfano" :{
        region: "campania",
        correct_value: "Alfano",
    },
    "alife" :{
        region: "campania",
        correct_value: "Alife",
    },
    "altavilla irpina" :{
        region: "campania",
        correct_value: "Altavilla Irpina",
    },
    "altavilla silentina" :{
        region: "campania",
        correct_value: "Altavilla Silentina",
    },
    "alvignano" :{
        region: "campania",
        correct_value: "Alvignano",
    },
    "amalfi" :{
        region: "campania",
        correct_value: "Amalfi",
    },
    "amorosi" :{
        region: "campania",
        correct_value: "Amorosi",
    },
    "anacapri" :{
        region: "campania",
        correct_value: "Anacapri",
    },
    "andretta" :{
        region: "campania",
        correct_value: "Andretta",
    },
    "angri" :{
        region: "campania",
        correct_value: "Angri",
    },
    "apice" :{
        region: "campania",
        correct_value: "Apice",
    },
    "apollosa" :{
        region: "campania",
        correct_value: "Apollosa",
    },
    "aquara" :{
        region: "campania",
        correct_value: "Aquara",
    },
    "aquilonia" :{
        region: "campania",
        correct_value: "Aquilonia",
    },
    "ariano irpino" :{
        region: "campania",
        correct_value: "Ariano Irpino",
    },
    "arienzo" :{
        region: "campania",
        correct_value: "Arienzo",
    },
    "arpaia" :{
        region: "campania",
        correct_value: "Arpaia",
    },
    "arpaise" :{
        region: "campania",
        correct_value: "Arpaise",
    },
    "arzano" :{
        region: "campania",
        correct_value: "Arzano",
    },
    "ascea" :{
        region: "campania",
        correct_value: "Ascea",
    },
    "atena lucana" :{
        region: "campania",
        correct_value: "Atena Lucana",
    },
    "atrani" :{
        region: "campania",
        correct_value: "Atrani",
    },
    "atripalda" :{
        region: "campania",
        correct_value: "Atripalda",
    },
    "auletta" :{
        region: "campania",
        correct_value: "Auletta",
    },
    "avella" :{
        region: "campania",
        correct_value: "Avella",
    },
    "aversa" :{
        region: "campania",
        correct_value: "Aversa",
    },
    "bacoli" :{
        region: "campania",
        correct_value: "Bacoli",
    },
    "bagnoli irpino" :{
        region: "campania",
        correct_value: "Bagnoli Irpino",
    },
    "baia e latina" :{
        region: "campania",
        correct_value: "Baia e Latina",
    },
    "baiano" :{
        region: "campania",
        correct_value: "Baiano",
    },
    "barano d'ischia" :{
        region: "campania",
        correct_value: "Barano d'Ischia",
    },
    "baronissi" :{
        region: "campania",
        correct_value: "Baronissi",
    },
    "baselice" :{
        region: "campania",
        correct_value: "Baselice",
    },
    "battipaglia" :{
        region: "campania",
        correct_value: "Battipaglia",
    },
    "bellizzi" :{
        region: "campania",
        correct_value: "Bellizzi",
    },
    "bellona" :{
        region: "campania",
        correct_value: "Bellona",
    },
    "bellosguardo" :{
        region: "campania",
        correct_value: "Bellosguardo",
    },
    "bisaccia" :{
        region: "campania",
        correct_value: "Bisaccia",
    },
    "bonea" :{
        region: "campania",
        correct_value: "Bonea",
    },
    "bonito" :{
        region: "campania",
        correct_value: "Bonito",
    },
    "boscoreale" :{
        region: "campania",
        correct_value: "Boscoreale",
    },
    "boscotrecase" :{
        region: "campania",
        correct_value: "Boscotrecase",
    },
    "bracigliano" :{
        region: "campania",
        correct_value: "Bracigliano",
    },
    "brusciano" :{
        region: "campania",
        correct_value: "Brusciano",
    },
    "bucciano" :{
        region: "campania",
        correct_value: "Bucciano",
    },
    "buccino" :{
        region: "campania",
        correct_value: "Buccino",
    },
    "buonabitacolo" :{
        region: "campania",
        correct_value: "Buonabitacolo",
    },
    "buonalbergo" :{
        region: "campania",
        correct_value: "Buonalbergo",
    },
    "caggiano" :{
        region: "campania",
        correct_value: "Caggiano",
    },
    "caianello" :{
        region: "campania",
        correct_value: "Caianello",
    },
    "caiazzo" :{
        region: "campania",
        correct_value: "Caiazzo",
    },
    "cairano" :{
        region: "campania",
        correct_value: "Cairano",
    },
    "caivano" :{
        region: "campania",
        correct_value: "Caivano",
    },
    "calabritto" :{
        region: "campania",
        correct_value: "Calabritto",
    },
    "calitri" :{
        region: "campania",
        correct_value: "Calitri",
    },
    "calvanico" :{
        region: "campania",
        correct_value: "Calvanico",
    },
    "calvi" :{
        region: "campania",
        correct_value: "Calvi",
    },
    "calvi risorta" :{
        region: "campania",
        correct_value: "Calvi Risorta",
    },
    "calvizzano" :{
        region: "campania",
        correct_value: "Calvizzano",
    },
    "camerota" :{
        region: "campania",
        correct_value: "Camerota",
    },
    "camigliano" :{
        region: "campania",
        correct_value: "Camigliano",
    },
    "campagna" :{
        region: "campania",
        correct_value: "Campagna",
    },
    "campolattaro" :{
        region: "campania",
        correct_value: "Campolattaro",
    },
    "campoli del monte taburno" :{
        region: "campania",
        correct_value: "Campoli del Monte Taburno",
    },
    "campora" :{
        region: "campania",
        correct_value: "Campora",
    },
    "camposano" :{
        region: "campania",
        correct_value: "Camposano",
    },
    "cancello ed arnone" :{
        region: "campania",
        correct_value: "Cancello ed Arnone",
    },
    "candida" :{
        region: "campania",
        correct_value: "Candida",
    },
    "cannalonga" :{
        region: "campania",
        correct_value: "Cannalonga",
    },
    "capaccio paestum" :{
        region: "campania",
        correct_value: "Capaccio Paestum",
    },
    "capodrise" :{
        region: "campania",
        correct_value: "Capodrise",
    },
    "caposele" :{
        region: "campania",
        correct_value: "Caposele",
    },
    "capri" :{
        region: "campania",
        correct_value: "Capri",
    },
    "capriati a volturno" :{
        region: "campania",
        correct_value: "Capriati a Volturno",
    },
    "capriglia irpina" :{
        region: "campania",
        correct_value: "Capriglia Irpina",
    },
    "capua" :{
        region: "campania",
        correct_value: "Capua",
    },
    "carbonara di nola" :{
        region: "campania",
        correct_value: "Carbonara di Nola",
    },
    "cardito" :{
        region: "campania",
        correct_value: "Cardito",
    },
    "carife" :{
        region: "campania",
        correct_value: "Carife",
    },
    "carinaro" :{
        region: "campania",
        correct_value: "Carinaro",
    },
    "carinola" :{
        region: "campania",
        correct_value: "Carinola",
    },
    "casagiove" :{
        region: "campania",
        correct_value: "Casagiove",
    },
    "casal di principe" :{
        region: "campania",
        correct_value: "Casal di Principe",
    },
    "casal velino" :{
        region: "campania",
        correct_value: "Casal Velino",
    },
    "casalbore" :{
        region: "campania",
        correct_value: "Casalbore",
    },
    "casalbuono" :{
        region: "campania",
        correct_value: "Casalbuono",
    },
    "casalduni" :{
        region: "campania",
        correct_value: "Casalduni",
    },
    "casaletto spartano" :{
        region: "campania",
        correct_value: "Casaletto Spartano",
    },
    "casalnuovo di napoli" :{
        region: "campania",
        correct_value: "Casalnuovo di Napoli",
    },
    "casaluce" :{
        region: "campania",
        correct_value: "Casaluce",
    },
    "casamarciano" :{
        region: "campania",
        correct_value: "Casamarciano",
    },
    "casamicciola terme" :{
        region: "campania",
        correct_value: "casamicciola Terme",
    },
    "casandrino" :{
        region: "campania",
        correct_value: "Casandrino",
    },
    "casapesenna" :{
        region: "campania",
        correct_value: "Casapesenna",
    },
    "casapulla" :{
        region: "campania",
        correct_value: "Casapulla",
    },
    "casavatore" :{
        region: "campania",
        correct_value: "Casavatore",
    },
    "caselle in pittari" :{
        region: "campania",
        correct_value: "Caselle in Pittari",
    },
    "casola di napoli" :{
        region: "campania",
        correct_value: "Casola di Napoli",
    },
    "casoria" :{
        region: "campania",
        correct_value: "Casoria",
    },
    "cassano irpino" :{
        region: "campania",
        correct_value: "Cassano Irpino",
    },
    "castel baronia" :{
        region: "campania",
        correct_value: "Castel Baronia",
    },
    "castel campagnano" :{
        region: "campania",
        correct_value: "Castel Campagnano",
    },
    "castel di sasso" :{
        region: "campania",
        correct_value: "Castel di Sasso",
    },
    "castel morrone" :{
        region: "campania",
        correct_value: "Castel Morrone",
    },
    "castel san giorgio" :{
        region: "campania",
        correct_value: "Castel San Giorgio",
    },
    "castel san lorenzo" :{
        region: "campania",
        correct_value: "Castel San Lorenzo",
    },
    "castel volturno" :{
        region: "campania",
        correct_value: "Castel Volturno",
    },
    "castelcivita" :{
        region: "campania",
        correct_value: "Castelcivita",
    },
    "castelfranci" :{
        region: "campania",
        correct_value: "Castelfranci",
    },
    "castelfranco in miscano" :{
        region: "campania",
        correct_value: "Castelfranco in Miscano",
    },
    "castellabate" :{
        region: "campania",
        correct_value: "Castellabate",
    },
    "castellammare di stabia" :{
        region: "campania",
        correct_value: "Castellammare di Stabia",
    },
    "castello del matese" :{
        region: "campania",
        correct_value: "Castello del Matese",
    },
    "castello di cisterna" :{
        region: "campania",
        correct_value: "Castello di Cisterna",
    },
    "castelnuovo cilento" :{
        region: "campania",
        correct_value: "Castelnuovo Cilento",
    },
    "castelnuovo di conza" :{
        region: "campania",
        correct_value: "Castelnuovo di Conza",
    },
    "castelpagano" :{
        region: "campania",
        correct_value: "Castelpagano",
    },
    "castelpoto" :{
        region: "campania",
        correct_value: "Castelpoto",
    },
    "castelvenere" :{
        region: "campania",
        correct_value: "Castelvenere",
    },
    "castelvetere in val fortore" :{
        region: "campania",
        correct_value: "Castelvenere in Val Fortore",
    },
    "castelvetere sul calore" :{
        region: "campania",
        correct_value: "Castelvenere sul Calore",
    },
    "castiglione del genovesi" :{
        region: "campania",
        correct_value: "Castelvenere del Genovesi",
    },
    "cautano" :{
        region: "campania",
        correct_value: "Cautano",
    },
    "cava de' tirreni" :{
        region: "campania",
        correct_value: "Cava de' Tirreni",
    },
    "celle di bulgheria" :{
        region: "campania",
        correct_value: "Celle di Bulgheria",
    },
    "cellole" :{
        region: "campania",
        correct_value: "Cellole",
    },
    "centola" :{
        region: "campania",
        correct_value: "Centola",
    },
    "ceppaloni" :{
        region: "campania",
        correct_value: "Ceppaloni",
    },
    "ceraso" :{
        region: "campania",
        correct_value: "Ceraso",
    },
    "cercola" :{
        region: "campania",
        correct_value: "Cercola",
    },
    "cerreto sannita" :{
        region: "campania",
        correct_value: "Cerreto Sannita",
    },
    "cervinara" :{
        region: "campania",
        correct_value: "Cervinara",
    },
    "cervino" :{
        region: "campania",
        correct_value: "Cervino",
    },
    "cesa" :{
        region: "campania",
        correct_value: "Casa",
    },
    "cesinali" :{
        region: "campania",
        correct_value: "Cesinali",
    },
    "cetara" :{
        region: "campania",
        correct_value: "Cetara",
    },
    "chianche" :{
        region: "campania",
        correct_value: "Chianche",
    },
    "chiusano di san domenico" :{
        region: "campania",
        correct_value: "Chiusano di San Domenico",
    },
    "cicciano" :{
        region: "campania",
        correct_value: "Cicciano",
    },
    "cicerale" :{
        region: "campania",
        correct_value: "Cicerale",
    },
    "cimitile" :{
        region: "campania",
        correct_value: "Cimitile",
    },
    "ciorlano" :{
        region: "campania",
        correct_value: "Ciorlano",
    },
    "circello" :{
        region: "campania",
        correct_value: "Circello",
    },
    "colle sannita" :{
        region: "campania",
        correct_value: "Colle Sannita",
    },
    "colliano" :{
        region: "campania",
        correct_value: "Colliano",
    },
    "comiziano" :{
        region: "campania",
        correct_value: "Comiziano",
    },
    "conca dei marini" :{
        region: "campania",
        correct_value: "Conca dei Marini",
    },
    "conca della campania" :{
        region: "campania",
        correct_value: "Conca della Campania",
    },
    "contrada" :{
        region: "campania",
        correct_value: "Contrada",
    },
    "controne" :{
        region: "campania",
        correct_value: "Controne",
    },
    "contursi terme" :{
        region: "campania",
        correct_value: "Contursi Terme",
    },
    "conza della campania" :{
        region: "campania",
        correct_value: "Conza della Campania",
    },
    "corbara" :{
        region: "campania",
        correct_value: "Corbara",
    },
    "corleto monforte" :{
        region: "campania",
        correct_value: "Corleto Monforte",
    },
    "crispano" :{
        region: "campania",
        correct_value: "Crispano",
    },
    "cuccaro vetere" :{
        region: "campania",
        correct_value: "Cuccaro Vetere",
    },
    "curti" :{
        region: "campania",
        correct_value: "Curti",
    },
    "cusano mutri" :{
        region: "campania",
        correct_value: "Cusano Mutri",
    },
    "domicella" :{
        region: "campania",
        correct_value: "Domicella",
    },
    "dragoni" :{
        region: "campania",
        correct_value: "Dragoni",
    },
    "dugenta" :{
        region: "campania",
        correct_value: "Dugenta",
    },
    "durazzano" :{
        region: "campania",
        correct_value: "Durazzano",
    },
    "eboli" :{
        region: "campania",
        correct_value: "Eboli",
    },
    "ercolano" :{
        region: "campania",
        correct_value: "Ercolano",
    },
    "faicchio" :{
        region: "campania",
        correct_value: "Faicchio",
    },
    "falciano del massico" :{
        region: "campania",
        correct_value: "Falciano del Massico",
    },
    "felitto" :{
        region: "campania",
        correct_value: "Felitto",
    },
    "fisciano" :{
        region: "campania",
        correct_value: "Fisciano",
    },
    "flumeri" :{
        region: "campania",
        correct_value: "Flumeri",
    },
    "foglianise" :{
        region: "campania",
        correct_value: "Foglianise",
    },
    "foiano di val fortore" :{
        region: "campania",
        correct_value: "Foiano di val Fortore",
    },
    "fontanarosa" :{
        region: "campania",
        correct_value: "Fontanarosa",
    },
    "fontegreca" :{
        region: "campania",
        correct_value: "Fontegreca",
    },
    "forchia" :{
        region: "campania",
        correct_value: "Forchia",
    },
    "forino" :{
        region: "campania",
        correct_value: "Forino",
    },
    "forio" :{
        region: "campania",
        correct_value: "Forio",
    },
    "formicola" :{
        region: "campania",
        correct_value: "Formicola",
    },
    "fragneto l'abate" :{
        region: "campania",
        correct_value: "Fragneto l'Abate",
    },
    "fragneto monforte" :{
        region: "campania",
        correct_value: "Fragneto Monforte",
    },
    "francolise" :{
        region: "campania",
        correct_value: "Francolise",
    },
    "frasso telesino" :{
        region: "campania",
        correct_value: "Frasso Telesino",
    },
    "frattamaggiore" :{
        region: "campania",
        correct_value: "Frattamaggiore",
    },
    "frattaminore" :{
        region: "campania",
        correct_value: "Frattaminore",
    },
    "frigento" :{
        region: "campania",
        correct_value: "Frigento",
    },
    "frignano" :{
        region: "campania",
        correct_value: "Frignano",
    },
    "furore" :{
        region: "campania",
        correct_value: "Furore",
    },
    "futani" :{
        region: "campania",
        correct_value: "Futani",
    },
    "gallo matese" :{
        region: "campania",
        correct_value: "Gallo Matese",
    },
    "galluccio" :{
        region: "campania",
        correct_value: "Galluccio",
    },
    "gesualdo" :{
        region: "campania",
        correct_value: "Gesualdo",
    },
    "giano vetusto" :{
        region: "campania",
        correct_value: "Giano Vetusto",
    },
    "giffoni sei casali" :{
        region: "campania",
        correct_value: "Giffoni Sei Casali",
    },
    "giffoni valle piana" :{
        region: "campania",
        correct_value: "Giffoni Valle Piana",
    },
    "ginestra degli schiavoni" :{
        region: "campania",
        correct_value: "Ginestra degli Schiavoni",
    },
    "gioi" :{
        region: "campania",
        correct_value: "Gioi",
    },
    "gioia sannitica" :{
        region: "campania",
        correct_value: "Gioia Sannitica",
    },
    "giugliano in campania" :{
        region: "campania",
        correct_value: "Giugliano in Campania",
    },
    "giungano" :{
        region: "campania",
        correct_value: "Giungano",
    },
    "gragnano" :{
        region: "campania",
        correct_value: "Gragnano",
    },
    "grazzanise" :{
        region: "campania",
        correct_value: "Grazzanise",
    },
    "greci" :{
        region: "campania",
        correct_value: "Greci",
    },
    "gricignano di aversa" :{
        region: "campania",
        correct_value: "Gricignano di Aversa",
    },
    "grottaminarda" :{
        region: "campania",
        correct_value: "Grottaminarda",
    },
    "grottolella" :{
        region: "campania",
        correct_value: "Grottolella",
    },
    "grumo nevano" :{
        region: "campania",
        correct_value: "Grumo Nevano",
    },
    "guardia lombardi" :{
        region: "campania",
        correct_value: "Guardia Lombardi",
    },
    "guardia sanframondi" :{
        region: "campania",
        correct_value: "Guardia Sanframondi",
    },
    "ischia" :{
        region: "campania",
        correct_value: "Ischia",
    },
    "ispani" :{
        region: "campania",
        correct_value: "Ispani",
    },
    "lacco ameno" :{
        region: "campania",
        correct_value: "Lacco Ameno",
    },
    "lacedonia" :{
        region: "campania",
        correct_value: "Lacedonia",
    },
    "lapio" :{
        region: "campania",
        correct_value: "Lapio",
    },
    "laureana cilento" :{
        region: "campania",
        correct_value: "Laureana Cilento",
    },
    "laurino" :{
        region: "campania",
        correct_value: "Laurino",
    },
    "laurito" :{
        region: "campania",
        correct_value: "Laurito",
    },
    "lauro" :{
        region: "campania",
        correct_value: "Lauro",
    },
    "laviano" :{
        region: "campania",
        correct_value: "Laviano",
    },
    "letino" :{
        region: "campania",
        correct_value: "Letino",
    },
    "lettere" :{
        region: "campania",
        correct_value: "Lettere",
    },
    "liberi" :{
        region: "campania",
        correct_value: "Liberi",
    },
    "limatola" :{
        region: "campania",
        correct_value: "Limatola",
    },
    "lioni" :{
        region: "campania",
        correct_value: "Lioni",
    },
    "liveri" :{
        region: "campania",
        correct_value: "Liveri",
    },
    "luogosano" :{
        region: "campania",
        correct_value: "Luogosano",
    },
    "lusciano" :{
        region: "campania",
        correct_value: "Lusciano",
    },
    "lustra" :{
        region: "campania",
        correct_value: "Lustra",
    },
    "macerata campania" :{
        region: "campania",
        correct_value: "Macerata Campania",
    },
    "maddaloni" :{
        region: "campania",
        correct_value: "Maddaloni",
    },
    "magliano vetere" :{
        region: "campania",
        correct_value: "Magliano Vetere",
    },
    "maiori" :{
        region: "campania",
        correct_value: "Maiori",
    },
    "manocalzati" :{
        region: "campania",
        correct_value: "Manocalzati",
    },
    "marano di napoli" :{
        region: "campania",
        correct_value: "Marano di Napoli",
    },
    "marcianise" :{
        region: "campania",
        correct_value: "Marcianise",
    },
    "mariglianella" :{
        region: "campania",
        correct_value: "Mariglianella",
    },
    "marigliano" :{
        region: "campania",
        correct_value: "Marigliano",
    },
    "marzano appio" :{
        region: "campania",
        correct_value: "Marzano Appio",
    },
    "marzano di nola" :{
        region: "campania",
        correct_value: "Marzano di Nola",
    },
    "massa di somma" :{
        region: "campania",
        correct_value: "Massa di Somma",
    },
    "massa lubrense" :{
        region: "campania",
        correct_value: "Massa Lubrense",
    },
    "melito di napoli" :{
        region: "campania",
        correct_value: "Melito di Napoli",
    },
    "melito irpino" :{
        region: "campania",
        correct_value: "Melito Irpino",
    },
    "melizzano" :{
        region: "campania",
        correct_value: "Melizzano",
    },
    "mercato san severino" :{
        region: "campania",
        correct_value: "Mercato San Severino",
    },
    "mercogliano" :{
        region: "campania",
        correct_value: "Mercogliano",
    },
    "meta" :{
        region: "campania",
        correct_value: "Meta",
    },
    "mignano monte lungo" :{
        region: "campania",
        correct_value: "Mignano Monte Lungo",
    },
    "minori" :{
        region: "campania",
        correct_value: "Minori",
    },
    "mirabella eclano" :{
        region: "campania",
        correct_value: "Mirabella Eclano",
    },
    "moiano" :{
        region: "campania",
        correct_value: "Moiano",
    },
    "moio della civitella" :{
        region: "campania",
        correct_value: "Moio della Civitella",
    },
    "molinara" :{
        region: "campania",
        correct_value: "Molinara",
    },
    "mondragone" :{
        region: "campania",
        correct_value: "Mondragone",
    },
    "montaguto" :{
        region: "campania",
        correct_value: "Montaguto",
    },
    "montano antilia" :{
        region: "campania",
        correct_value: "Montano Antilia",
    },
    "monte di procida" :{
        region: "campania",
        correct_value: "Monte di Procida",
    },
    "monte san giacomo" :{
        region: "campania",
        correct_value: "Monte San Giacomo",
    },
    "montecalvo irpino" :{
        region: "campania",
        correct_value: "Montecalvo Irpino",
    },
    "montecorice" :{
        region: "campania",
        correct_value: "Montecorice",
    },
    "montecorvino pugliano" :{
        region: "campania",
        correct_value: "Montecorvino Pugliano",
    },
    "montecorvino rovella" :{
        region: "campania",
        correct_value: "Montecorvino Rovella",
    },
    "montefalcione" :{
        region: "campania",
        correct_value: "Montefalcione",
    },
    "montefalcone di val fortore" :{
        region: "campania",
        correct_value: "Montefalcone di Val Fortore",
    },
    "monteforte cilento" :{
        region: "campania",
        correct_value: "Monteforte Cilento",
    },
    "monteforte irpino" :{
        region: "campania",
        correct_value: "Monteforte Irpino",
    },
    "montefredane" :{
        region: "campania",
        correct_value: "Montefradane",
    },
    "montefusco" :{
        region: "campania",
        correct_value: "Montefusco",
    },
    "montella" :{
        region: "campania",
        correct_value: "Montella",
    },
    "montemarano" :{
        region: "campania",
        correct_value: "Montemarano",
    },
    "montemiletto" :{
        region: "campania",
        correct_value: "Montemiletto",
    },
    "montesano sulla marcellana" :{
        region: "campania",
        correct_value: "Montesano sulla Marcellana",
    },
    "montesarchio" :{
        region: "campania",
        correct_value: "Montesarchio",
    },
    "monteverde" :{
        region: "campania",
        correct_value: "Monteverde",
    },
    "montoro" :{
        region: "campania",
        correct_value: "Montoro",
    },
    "morcone" :{
        region: "campania",
        correct_value: "Morcone",
    },
    "morigerati" :{
        region: "campania",
        correct_value: "Morigerati",
    },
    "morra de sanctis" :{
        region: "campania",
        correct_value: "Morra de Sanctis",
    },
    "moschiano" :{
        region: "campania",
        correct_value: "Moschiano",
    },
    "mugnano del cardinale" :{
        region: "campania",
        correct_value: "Mugnano del Cardinale",
    },
    "mugnano di napoli" :{
        region: "campania",
        correct_value: "Mugnano di Napoli",
    },
    "nocera inferiore" :{
        region: "campania",
        correct_value: "Nocera Inferiore",
    },
    "nocera superiore" :{
        region: "campania",
        correct_value: "Nocera Superiore",
    },
    "nola" :{
        region: "campania",
        correct_value: "Nola",
    },
    "novi velia" :{
        region: "campania",
        correct_value: "Novi Velia",
    },
    "nusco" :{
        region: "campania",
        correct_value: "Nusco",
    },
    "ogliastro cilento" :{
        region: "campania",
        correct_value: "Ogliastro Cilento",
    },
    "olevano sul tusciano" :{
        region: "campania",
        correct_value: "Olevano sul Tusciano",
    },
    "oliveto citra" :{
        region: "campania",
        correct_value: "Oliveto Citra",
    },
    "omignano" :{
        region: "campania",
        correct_value: "Omignano",
    },
    "orria" :{
        region: "campania",
        correct_value: "Orria",
    },
    "orta di atella" :{
        region: "campania",
        correct_value: "Orta di Atella",
    },
    "ospedaletto d'alpinolo" :{
        region: "campania",
        correct_value: "Ospedaletto d'Alpinolo",
    },
    "ottati" :{
        region: "campania",
        correct_value: "Ottati",
    },
    "ottaviano" :{
        region: "campania",
        correct_value: "Ottaviano",
    },
    "padula" :{
        region: "campania",
        correct_value: "Padula",
    },
    "paduli" :{
        region: "campania",
        correct_value: "Paduli",
    },
    "pagani" :{
        region: "campania",
        correct_value: "Pagani",
    },
    "pago del vallo di lauro" :{
        region: "campania",
        correct_value: "Pago del Vallo di Lauro",
    },
    "pago veiano" :{
        region: "campania",
        correct_value: "Pago Veiano",
    },
    "palma campania" :{
        region: "campania",
        correct_value: "Palma Campania",
    },
    "palomonte" :{
        region: "campania",
        correct_value: "Palomonte",
    },
    "pannarano" :{
        region: "campania",
        correct_value: "Pannarano",
    },
    "paolisi" :{
        region: "campania",
        correct_value: "Paolisi",
    },
    "parete" :{
        region: "campania",
        correct_value: "Parete",
    },
    "parolise" :{
        region: "campania",
        correct_value: "Parolise",
    },
    "pastorano" :{
        region: "campania",
        correct_value: "Pastorano",
    },
    "paternopoli" :{
        region: "campania",
        correct_value: "Paternopoli",
    },
    "paupisi" :{
        region: "campania",
        correct_value: "Paupisi",
    },
    "pellezzano" :{
        region: "campania",
        correct_value: "Pellezzano",
    },
    "perdifumo" :{
        region: "campania",
        correct_value: "Perdifumo",
    },
    "perito" :{
        region: "campania",
        correct_value: "Perito",
    },
    "pertosa" :{
        region: "campania",
        correct_value: "Pertosa",
    },
    "pesco sannita" :{
        region: "campania",
        correct_value: "Pesco Sannita",
    },
    "petina" :{
        region: "campania",
        correct_value: "Petina",
    },
    "petruro irpino" :{
        region: "campania",
        correct_value: "Petruro Irpino",
    },
    "piaggine" :{
        region: "campania",
        correct_value: "Piaggine",
    },
    "piana di monte verna" :{
        region: "campania",
        correct_value: "Piana di Monte Verna",
    },
    "piano di sorrento" :{
        region: "campania",
        correct_value: "Piano di Sorrento",
    },
    "piedimonte matese" :{
        region: "campania",
        correct_value: "Piedimonte Matese",
    },
    "pietradefusi" :{
        region: "campania",
        correct_value: "Pietradefusi",
    },
    "pietramelara" :{
        region: "campania",
        correct_value: "Pietramelara",
    },
    "pietraroja" :{
        region: "campania",
        correct_value: "Pietraroja",
    },
    "pietrastornina" :{
        region: "campania",
        correct_value: "Pietrastornina",
    },
    "pietravairano" :{
        region: "campania",
        correct_value: "Pietravairano",
    },
    "pietrelcina" :{
        region: "campania",
        correct_value: "Pietralcina",
    },
    "pignataro maggiore" :{
        region: "campania",
        correct_value: "Pignataro Maggiore",
    },
    "pimonte" :{
        region: "campania",
        correct_value: "Pimonte",
    },
    "pisciotta" :{
        region: "campania",
        correct_value: "Pisciotta",
    },
    "poggiomarino" :{
        region: "campania",
        correct_value: "Poggiomarino",
    },
    "polla" :{
        region: "campania",
        correct_value: "Polla",
    },
    "pollena trocchia" :{
        region: "campania",
        correct_value: "Pollena Trocchia",
    },
    "pollica" :{
        region: "campania",
        correct_value: "Pollica",
    },
    "pomigliano d'arco" :{
        region: "campania",
        correct_value: "Pomigliano d'Arco",
    },
    "pompei" :{
        region: "campania",
        correct_value: "Pompei",
    },
    "ponte" :{
        region: "campania",
        correct_value: "Ponte",
    },
    "pontecagnano faiano" :{
        region: "campania",
        correct_value: "Pontecagnano Faiano",
    },
    "pontelandolfo" :{
        region: "campania",
        correct_value: "Pontelandolfo",
    },
    "pontelatone" :{
        region: "campania",
        correct_value: "Pontelatone",
    },
    "portici" :{
        region: "campania",
        correct_value: "Portici",
    },
    "portico di caserta" :{
        region: "campania",
        correct_value: "Portico di Caserta",
    },
    "positano" :{
        region: "campania",
        correct_value: "Positano",
    },
    "postiglione" :{
        region: "campania",
        correct_value: "Postiglione",
    },
    "pozzuoli" :{
        region: "campania",
        correct_value: "Pozzuoli",
    },
    "praiano" :{
        region: "campania",
        correct_value: "Praiano",
    },
    "prata di principato ultra" :{
        region: "campania",
        correct_value: "Prata di Principato Ultra",
    },
    "prata sannita" :{
        region: "campania",
        correct_value: "Prata Sannita",
    },
    "pratella" :{
        region: "campania",
        correct_value: "Pratella",
    },
    "pratola serra" :{
        region: "campania",
        correct_value: "Pratola Serra",
    },
    "presenzano" :{
        region: "campania",
        correct_value: "Presenzano",
    },
    "prignano cilento" :{
        region: "campania",
        correct_value: "Prignano Cilento",
    },
    "procida" :{
        region: "campania",
        correct_value: "Procida",
    },
    "puglianello" :{
        region: "campania",
        correct_value: "Puglianello",
    },
    "quadrelle" :{
        region: "campania",
        correct_value: "Quadrelle",
    },
    "qualiano" :{
        region: "campania",
        correct_value: "Qualiano",
    },
    "quarto" :{
        region: "campania",
        correct_value: "Quarto",
    },
    "quindici" :{
        region: "campania",
        correct_value: "Quindici",
    },
    "ravello" :{
        region: "campania",
        correct_value: "Ravello",
    },
    "raviscanina" :{
        region: "campania",
        correct_value: "Raviscanina",
    },
    "recale" :{
        region: "campania",
        correct_value: "Recale",
    },
    "reino" :{
        region: "campania",
        correct_value: "Reino",
    },
    "riardo" :{
        region: "campania",
        correct_value: "Riardo",
    },
    "ricigliano" :{
        region: "campania",
        correct_value: "Ricigliano",
    },
    "rocca d'evandro" :{
        region: "campania",
        correct_value: "Rocca d'Evandro",
    },
    "rocca san felice" :{
        region: "campania",
        correct_value: "Rocca San Felice",
    },
    "roccabascerana" :{
        region: "campania",
        correct_value: "Roccabascerana",
    },
    "roccadaspide" :{
        region: "campania",
        correct_value: "Roccadaspide",
    },
    "roccagloriosa" :{
        region: "campania",
        correct_value: "Roccagloriosa",
    },
    "roccamonfina" :{
        region: "campania",
        correct_value: "Roccamonfina",
    },
    "roccapiemonte" :{
        region: "campania",
        correct_value: "Roccapiemonte",
    },
    "roccarainola" :{
        region: "campania",
        correct_value: "Roccarainola",
    },
    "roccaromana" :{
        region: "campania",
        correct_value: "Roccaromana",
    },
    "rocchetta e croce" :{
        region: "campania",
        correct_value: "Rocchetta e Croce",
    },
    "rofrano" :{
        region: "campania",
        correct_value: "Rofrano",
    },
    "romagnano al monte" :{
        region: "campania",
        correct_value: "Romagnano al Monte",
    },
    "roscigno" :{
        region: "campania",
        correct_value: "Roscigno",
    },
    "rotondi" :{
        region: "campania",
        correct_value: "Rotondi",
    },
    "rutino" :{
        region: "campania",
        correct_value: "Rutino",
    },
    "ruviano" :{
        region: "campania",
        correct_value: "Ruviano",
    },
    "sacco" :{
        region: "campania",
        correct_value: "Sacco",
    },
    "sala consilina" :{
        region: "campania",
        correct_value: "Sala Consilina",
    },
    "salento" :{
        region: "campania",
        correct_value: "Salento",
    },
    "salvitelle" :{
        region: "campania",
        correct_value: "Salvitelle",
    },
    "salza irpina" :{
        region: "campania",
        correct_value: "Salza Irpina",
    },
    "san bartolomeo in galdo" :{
        region: "campania",
        correct_value: "San Bartolomeo in Galdo",
    },
    "san cipriano d'aversa" :{
        region: "campania",
        correct_value: "San Cipriano d'Aversa",
    },
    "san cipriano picentino" :{
        region: "campania",
        correct_value: "San Cipriano Picentino",
    },
    "san felice a cancello" :{
        region: "campania",
        correct_value: "San Felice a Cancello",
    },
    "san gennaro vesuviano" :{
        region: "campania",
        correct_value: "San Gennaro Vesuviano",
    },
    "san giorgio a cremano" :{
        region: "campania",
        correct_value: "San Giorgio a Cremano",
    },
    "san giorgio del sannio" :{
        region: "campania",
        correct_value: "San Giorgio del Sannio",
    },
    "san giorgio la molara" :{
        region: "campania",
        correct_value: "San Giorgio la Molara",
    },
    "san giovanni a piro" :{
        region: "campania",
        correct_value: "San Giovanni a Piro",
    },
    "san giuseppe vesuviano" :{
        region: "campania",
        correct_value: "San Giuseppe Vesuviano",
    },
    "san gregorio magno" :{
        region: "campania",
        correct_value: "San Gregorio Magno",
    },
    "san gregorio matese" :{
        region: "campania",
        correct_value: "San Gregorio Matese",
    },
    "san leucio del sannio" :{
        region: "campania",
        correct_value: "San Leucio del Sannio",
    },
    "san lorenzello" :{
        region: "campania",
        correct_value: "San Lorenzello",
    },
    "san lorenzo maggiore" :{
        region: "campania",
        correct_value: "San Lorenzo Maggiore",
    },
    "san lupo" :{
        region: "campania",
        correct_value: "San Lupo",
    },
    "san mango piemonte" :{
        region: "campania",
        correct_value: "San Mango Piemonte",
    },
    "san mango sul calore" :{
        region: "campania",
        correct_value: "San Mango sul Calore",
    },
    "san marcellino" :{
        region: "campania",
        correct_value: "San Marcellino",
    },
    "san marco dei cavoti" :{
        region: "campania",
        correct_value: "San Marco dei Cavoti",
    },
    "san marco evangelista" :{
        region: "campania",
        correct_value: "San Marco Evangelista",
    },
    "san martino sannita" :{
        region: "campania",
        correct_value: "San Martino Sannita",
    },
    "san martino valle caudina" :{
        region: "campania",
        correct_value: "San Martino Valle Caudina",
    },
    "san marzano sul sarno" :{
        region: "campania",
        correct_value: "San Marzano sul Sarno",
    },
    "san mauro cilento" :{
        region: "campania",
        correct_value: "San Mauro Cilento",
    },
    "san mauro la bruca" :{
        region: "campania",
        correct_value: "San Mauro la Bruca",
    },
    "san michele di serino" :{
        region: "campania",
        correct_value: "San Michele di Serino",
    },
    "san nazzaro" :{
        region: "campania",
        correct_value: "San Nazzaro",
    },
    "san nicola baronia" :{
        region: "campania",
        correct_value: "San Nicola Baronia",
    },
    "san nicola la strada" :{
        region: "campania",
        correct_value: "San Nicola la Strada",
    },
    "san nicola manfredi" :{
        region: "campania",
        correct_value: "San Nicola Manfredi",
    },
    "san paolo bel sito" :{
        region: "campania",
        correct_value: "San Paolo Bel Sito",
    },
    "san pietro al tanagro" :{
        region: "campania",
        correct_value: "San Pietro al Tanagro",
    },
    "san pietro infine" :{
        region: "campania",
        correct_value: "San Pietro Infine",
    },
    "san potito sannitico" :{
        region: "campania",
        correct_value: "San Potito Sannitico",
    },
    "san potito ultra" :{
        region: "campania",
        correct_value: "San Potito Ultra",
    },
    "san prisco" :{
        region: "campania",
        correct_value: "San Prisco",
    },
    "san rufo" :{
        region: "campania",
        correct_value: "San Rufo",
    },
    "san salvatore telesino" :{
        region: "campania",
        correct_value: "San Salvatore Telesino",
    },
    "san sebastiano al vesuvio" :{
        region: "campania",
        correct_value: "San Sebastiano al Vesuvio",
    },
    "san sossio baronia" :{
        region: "campania",
        correct_value: "San Sossio Baronia",
    },
    "san tammaro" :{
        region: "campania",
        correct_value: "San Tammaro",
    },
    "san valentino torio" :{
        region: "campania",
        correct_value: "San Valentino Torio",
    },
    "san vitaliano" :{
        region: "campania",
        correct_value: "San Vitaliano",
    },
    "santa croce del sannio" :{
        region: "campania",
        correct_value: "Santa Croce del Sannio",
    },
    "santa lucia di serino" :{
        region: "campania",
        correct_value: "Santa Lucia di Serino",
    },
    "santa maria a vico" :{
        region: "campania",
        correct_value: "Santa Maria a Vico",
    },
    "santa maria capua vetere" :{
        region: "campania",
        correct_value: "Santa Maria Capua Vetere",
    },
    "santa maria la carità" :{
        region: "campania",
        correct_value: "Santa Maria la Carità",
    },
    "santa maria la fossa" :{
        region: "campania",
        correct_value: "Santa Maria la Fossa",
    },
    "santa marina" :{
        region: "campania",
        correct_value: "Santa Marina",
    },
    "santa paolina" :{
        region: "campania",
        correct_value: "Santa Paolina",
    },
    "sant'agata de' goti" :{
        region: "campania",
        correct_value: "Sant'Agata de' Goti",
    },
    "sant'agnello" :{
        region: "campania",
        correct_value: "Sant'Agnello",
    },
    "sant'anastasia" :{
        region: "campania",
        correct_value: "Sant'Anastasia",
    },
    "sant'andrea di conza" :{
        region: "campania",
        correct_value: "Sant'Andrea di Conza",
    },
    "sant'angelo a cupolo" :{
        region: "campania",
        correct_value: "Sant'Angelo a Cupolo",
    },
    "sant'angelo a fasanella" :{
        region: "campania",
        correct_value: "Sant'Angelo a Fasanella",
    },
    "sant'angelo a scala" :{
        region: "campania",
        correct_value: "Sant'Angelo a Scala",
    },
    "sant'angelo all'esca" :{
        region: "campania",
        correct_value: "Sant'Angelo all'Esca",
    },
    "sant'angelo d'alife" :{
        region: "campania",
        correct_value: "Sant'Angelo d'Alife",
    },
    "sant'angelo dei lombardi" :{
        region: "campania",
        correct_value: "Sant'Angelo dei Lombardi",
    },
    "sant'antimo" :{
        region: "campania",
        correct_value: "Sant'Antimo",
    },
    "sant'antonio abate" :{
        region: "campania",
        correct_value: "Sant'Antonio Abate",
    },
    "sant'arcangelo trimonte" :{
        region: "campania",
        correct_value: "Sant'Arcangelo Trimonte",
    },
    "sant'arpino" :{
        region: "campania",
        correct_value: "Sant'Arpino",
    },
    "sant'arsenio" :{
        region: "campania",
        correct_value: "Sant'Arsenio",
    },
    "sant'egidio del monte albino" :{
        region: "campania",
        correct_value: "Sant'Egidio del Monte Albino",
    },
    "santo stefano del sole" :{
        region: "campania",
        correct_value: "Santo Stefano del Sole",
    },
    "santomenna" :{
        region: "campania",
        correct_value: "Santomenna",
    },
    "sanza" :{
        region: "campania",
        correct_value: "Sanza",
    },
    "sapri" :{
        region: "campania",
        correct_value: "Sapri",
    },
    "sarno" :{
        region: "campania",
        correct_value: "Sarno",
    },
    "sassano" :{
        region: "campania",
        correct_value: "Sassano",
    },
    "sassinoro" :{
        region: "campania",
        correct_value: "Sassinoro",
    },
    "saviano" :{
        region: "campania",
        correct_value: "Saviano",
    },
    "savignano irpino" :{
        region: "campania",
        correct_value: "Saignano Irpino",
    },
    "scafati" :{
        region: "campania",
        correct_value: "Scafati",
    },
    "scala" :{
        region: "campania",
        correct_value: "Scala",
    },
    "scampitella" :{
        region: "campania",
        correct_value: "Scampitella",
    },
    "scisciano" :{
        region: "campania",
        correct_value: "Scisciano",
    },
    "senerchia" :{
        region: "campania",
        correct_value: "Senerchia",
    },
    "serino" :{
        region: "campania",
        correct_value: "Serino",
    },
    "serramezzana" :{
        region: "campania",
        correct_value: "Serramezzana",
    },
    "serrara fontana" :{
        region: "campania",
        correct_value: "Serrara Fontana",
    },
    "serre" :{
        region: "campania",
        correct_value: "Serre",
    },
    "sessa aurunca" :{
        region: "campania",
        correct_value: "Sessa Aurunca",
    },
    "sessa cilento" :{
        region: "campania",
        correct_value: "Sessa Cilento",
    },
    "siano" :{
        region: "campania",
        correct_value: "Siano",
    },
    "sicignano degli alburni" :{
        region: "campania",
        correct_value: "Sicignano degli Alburni",
    },
    "sirignano" :{
        region: "campania",
        correct_value: "Sirignano",
    },
    "solofra" :{
        region: "campania",
        correct_value: "Solofra",
    },
    "solopaca" :{
        region: "campania",
        correct_value: "Solopaca",
    },
    "somma vesuviana" :{
        region: "campania",
        correct_value: "Somma Vesuviana",
    },
    "sorbo serpico" :{
        region: "campania",
        correct_value: "Sorbo Serpico",
    },
    "sorrento" :{
        region: "campania",
        correct_value: "Sorrento",
    },
    "sparanise" :{
        region: "campania",
        correct_value: "Sparanise",
    },
    "sperone" :{
        region: "campania",
        correct_value: "Sperone",
    },
    "stella cilento" :{
        region: "campania",
        correct_value: "Stella Cilento",
    },
    "stio" :{
        region: "campania",
        correct_value: "Stio",
    },
    "striano" :{
        region: "campania",
        correct_value: "Striano",
    },
    "sturno" :{
        region: "campania",
        correct_value: "Sturno",
    },
    "succivo" :{
        region: "campania",
        correct_value: "Succivo",
    },
    "summonte" :{
        region: "campania",
        correct_value: "Summonte",
    },
    "taurano" :{
        region: "campania",
        correct_value: "Taurano",
    },
    "taurasi" :{
        region: "campania",
        correct_value: "TAurasi",
    },
    "teano" :{
        region: "campania",
        correct_value: "Teano",
    },
    "teggiano" :{
        region: "campania",
        correct_value: "Teggiano",
    },
    "telese terme" :{
        region: "campania",
        correct_value: "Telese Terme",
    },
    "teora" :{
        region: "campania",
        correct_value: "Teora",
    },
    "terzigno" :{
        region: "campania",
        correct_value: "Terzigno",
    },
    "teverola" :{
        region: "campania",
        correct_value: "Teverola",
    },
    "tocco caudio" :{
        region: "campania",
        correct_value: "Tocco Caudio",
    },
    "tora e piccilli" :{
        region: "campania",
        correct_value: "Tora e Piccilli",
    },
    "torchiara" :{
        region: "campania",
        correct_value: "Torchiara",
    },
    "torella dei lombardi" :{
        region: "campania",
        correct_value: "Torella del Lombardi",
    },
    "torraca" :{
        region: "campania",
        correct_value: "Torraca",
    },
    "torre annunziata" :{
        region: "campania",
        correct_value: "Torre Annunziata",
    },
    "torre del greco" :{
        region: "campania",
        correct_value: "Torre del Greco",
    },
    "torre le nocelle" :{
        region: "campania",
        correct_value: "Torre le Nocelle",
    },
    "torre orsaia" :{
        region: "campania",
        correct_value: "Torre Orsaia",
    },
    "torrecuso" :{
        region: "campania",
        correct_value: "Torrecuso",
    },
    "torrioni" :{
        region: "campania",
        correct_value: "Totrioni",
    },
    "tortorella" :{
        region: "campania",
        correct_value: "Tortorella",
    },
    "tramonti" :{
        region: "campania",
        correct_value: "Tramonti",
    },
    "trecase" :{
        region: "campania",
        correct_value: "Trecase",
    },
    "trentinara" :{
        region: "campania",
        correct_value: "Trentinara",
    },
    "trentola ducenta" :{
        region: "campania",
        correct_value: "Trentola Ducenta",
    },
    "trevico" :{
        region: "campania",
        correct_value: "Trevico",
    },
    "tufino" :{
        region: "campania",
        correct_value: "Tufino",
    },
    "tufo" :{
        region: "campania",
        correct_value: "Tufo",
    },
    "vairano patenora" :{
        region: "campania",
        correct_value: "Vairano Patenora",
    },
    "vallata" :{
        region: "campania",
        correct_value: "Vallata",
    },
    "valle agricola" :{
        region: "campania",
        correct_value: "Valle Agricola",
    },
    "valle dell'angelo" :{
        region: "campania",
        correct_value: "Valle dell'Angelo",
    },
    "valle di maddaloni" :{
        region: "campania",
        correct_value: "Valle di Madaloni",
    },
    "vallesaccarda" :{
        region: "campania",
        correct_value: "Vallesaccarda",
    },
    "vallo della lucania" :{
        region: "campania",
        correct_value: "Vallo della Lucania",
    },
    "valva" :{
        region: "campania",
        correct_value: "Valva",
    },
    "venticano" :{
        region: "campania",
        correct_value: "Venticano",
    },
    "vibonati" :{
        region: "campania",
        correct_value: "Vibonati",
    },
    "vico equense" :{
        region: "campania",
        correct_value: "Vico Equense",
    },
    "vietri sul mare" :{
        region: "campania",
        correct_value: "Vietri sul Mare",
    },
    "villa di briano" :{
        region: "campania",
        correct_value: "Villa di Briano",
    },
    "villa literno" :{
        region: "campania",
        correct_value: "Villa Literno",
    },
    "villamaina" :{
        region: "campania",
        correct_value: "Villamaina",
    },
    "villanova del battista" :{
        region: "campania",
        correct_value: "Villanova del Battista",
    },
    "villaricca" :{
        region: "campania",
        correct_value: "Villaricca",
    },
    "visciano" :{
        region: "campania",
        correct_value: "Visciano",
    },
    "vitulano" :{
        region: "campania",
        correct_value: "Vitulano",
    },
    "vitulazio" :{
        region: "campania",
        correct_value: "Vitulazio",
    },
    "volla" :{
        region: "campania",
        correct_value: "Volla",
    },
    "volturara irpina" :{
        region: "campania",
        correct_value: "Volturara Irpina",
    },
    "zungoli":{
        region: "campania",
        correct_value: "Zungoli",
    },
//],
};
let religions = {
    "bahaismo" : "",
    "behaista" : "",
    "buddhismo" : "",
    "buddhista" : "",
    "confucianesimo" : "",
    "cristiana" : "",
    "cristianesimo" : "",
    "cristianità" : "",
    "cristiano" : "",
    "ebraica" : "",
    "ebraismo" : "",
    "ebreo" : "",
    "giainismo" : "",
    "gianista" : "",
    "induismo" : "",
    "induista" : "",
    "islam" : "",
    "islamica" : "",
    "islamista" : "",
    "religione buddhista" : "",
    "religione cristiana" : "",
    "religione ebraica" : "",
    "religione islamica" : "",
    "shintoismo" : "",
    "shitoista" : "",
    "sikhismo" : "",
    "sikista" : "",
    "taoismo" : "",
    "taoista" : "",
    "zoroastrica" : "",
    "zoroastrismo" : "",
};

let genders = ["maschio", "femmina", "uomo", "donna", "f", "m"];
let regions = ["abruzzo", "basilicata", "calabria", "campania", "emilia romagna", "friuli venezia giulia", "lazio", "liguria", "lombardia", "marche", "molise", "piemonte", "puglia", "sardegna", "sicilia", "toscana", "trentino alto adige", "umbria", "valle d'aosta", "veneto"];


function initializeNames(datum) {

    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        most_popular_italian_names[list[objIndex].names.toLowerCase()] = "";
    }
}

function initializeSurnames(datum) {

    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        most_popular_italian_surnames[list[objIndex].surnames.toLowerCase()] = "";
    }
}

function initializeProvinces(datum) {

    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        var obj = list[objIndex];
        province[obj.province.toLowerCase()] = obj.region.toLowerCase();
    }
}

function initializeReligions(datum) {

    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        religions[list[objIndex].religions.toLowerCase()] = "";
    }
}

function initializeMunicipalities(datum) {

    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        var obj = list[objIndex];
        if(!(obj.region.toLowerCase() in municipality))
            municipality[obj.region.toLowerCase()] = [];
        municipality[obj.region.toLowerCase()].push(obj.municipality.toLowerCase());
    }
}

function initializeProvinceAbbreviations(datum) {

    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        var obj = list[objIndex];
        province_abbreviation[obj.province_abbreviation.toLowerCase()] = obj.region.toLowerCase();
    }
}

function initializeGenders(datum) {
    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        genders.push(list[objIndex].genders.toLowerCase());
    }
}

function initializeRegions(datum) {
    var reader = new csvjson();
    var jsonDataset = reader.read(datum); //Parse the CSV Content.
    var list = jsonDataset.records;

    for(var objIndex in list){
        regions.push(list[objIndex].regions.toLowerCase());
    }
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
