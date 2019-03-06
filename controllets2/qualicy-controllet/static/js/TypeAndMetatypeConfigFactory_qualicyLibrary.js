
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

    if (value in most_popular_italian_surnames)
        return { datatype: META_DATATYPES.DT_SURNAME, value: value };

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

    if (value in most_popular_italian_names)
        return { datatype: META_DATATYPES.DT_NAME, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_PROVINCE.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    if(value in province)
        return { datatype: META_DATATYPES.DT_PROVINCE, value: value };

    if(value in province_abbreviation)
        return { datatype: META_DATATYPES.DT_PROVINCE, value: value };

    return { datatype: META_DATATYPES.DT_UNKNOWN, value: value };
};

META_DATATYPES.DT_MUNICIPALITY.evaluate = function (value){
    value = value.toLowerCase();
    value = value.trim();

    var town_list = municipality["campania"];
    if(town_list.indexOf(value)>=0)
        return { datatype: META_DATATYPES.DT_MUNICIPALITY, value: value };

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

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_PROVINCE.evaluate(key);
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

META_DATATYPES.DT_MUNICIPALITY.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_MUNICIPALITY.evaluate(key);
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

META_DATATYPES.DT_SURNAME.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_SURNAME.evaluate(key);
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

META_DATATYPES.DT_NAME.correct = function (words, value) {
    var corrections = [];

    for(var key in words){
        var current_datatype = META_DATATYPES.DT_NAME.evaluate(key);
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
    var regex = /(via|viale|vico|v[.]|corso|c[.]so|piazza|piazzetta|p[.]|p[.]zza)\s([a-z]+\s?)+([,°][ ]?)?\d*/ig;

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


var most_popular_italian_names = {
    "adele" : "",
    "alberto" : "",
    "ale" : "",
    "alessandra" : "",
    "alessandro" : "",
    "alessia" : "",
    "alessio" : "",
    "alex" : "",
    "alice" : "",
    "andrea" : "",
    "angela" : "",
    "angelica" : "",
    "angelo" : "",
    "anita" : "",
    "anna" : "",
    "annalisa" : "",
    "antonella" : "",
    "antonio" : "",
    "arianna" : "",
    "aurora" : "",
    "barbara" : "",
    "beatrice" : "",
    "benedetta" : "",
    "bianca" : "",
    "camilla" : "",
    "carlo" : "",
    "carlotta" : "",
    "carmine" : "",
    "caterina" : "",
    "cecilia" : "",
    "chiara" : "",
    "christian" : "",
    "claudia" : "",
    "claudio" : "",
    "cristian" : "",
    "cristiano" : "",
    "cristina" : "",
    "cyril" : "",
    "damiano" : "",
    "daniel" : "",
    "daniela" : "",
    "daniele" : "",
    "dario" : "",
    "davide" : "",
    "debora" : "",
    "denis" : "",
    "diana" : "",
    "diego" : "",
    "domenico" : "",
    "edoardo" : "",
    "elena" : "",
    "eleonora" : "",
    "elia" : "",
    "elias" : "",
    "elisa" : "",
    "elisabetta" : "",
    "emanuela" : "",
    "emanuele" : "",
    "emiliano" : "",
    "emma" : "",
    "enrico" : "",
    "enzo" : "",
    "erica" : "",
    "erika" : "",
    "eva" : "",
    "fabio" : "",
    "fabrizio" : "",
    "federica" : "",
    "federico" : "",
    "filippo" : "",
    "flavio" : "",
    "francesca" : "",
    "francesco" : "",
    "gabriel" : "",
    "gabriele" : "",
    "gabriella" : "",
    "gaia" : "",
    "giacomo" : "",
    "giada" : "",
    "gianluca" : "",
    "gianmarco" : "",
    "ginevra" : "",
    "gioia" : "",
    "giorgia" : "",
    "giorgio" : "",
    "giovanna" : "",
    "giovanni" : "",
    "giulia" : "",
    "giulio" : "",
    "giuseppe" : "",
    "giusy" : "",
    "gloria" : "",
    "greta" : "",
    "guido" : "",
    "ilaria" : "",
    "ilenia" : "",
    "irene" : "",
    "isabella" : "",
    "ivan" : "",
    "jacopo" : "",
    "jessica" : "",
    "john" : "",
    "julia" : "",
    "kevin" : "",
    "laura" : "",
    "leo" : "",
    "leonardo" : "",
    "letizia" : "",
    "linda" : "",
    "lisa" : "",
    "lorenzo" : "",
    "luca" : "",
    "lucia" : "",
    "luciano" : "",
    "lucrezia" : "",
    "ludovica" : "",
    "luigi" : "",
    "luisa" : "",
    "manuel" : "",
    "manuela" : "",
    "marco" : "",
    "margherita" : "",
    "maria" : "",
    "marika" : "",
    "marina" : "",
    "mario" : "",
    "mark" : "",
    "marta" : "",
    "martin" : "",
    "martina" : "",
    "mary" : "",
    "marzia" : "",
    "massimo" : "",
    "matilde" : "",
    "matteo" : "",
    "mattia" : "",
    "maurizio" : "",
    "mauro" : "",
    "max" : "",
    "melissa" : "",
    "michael" : "",
    "michela" : "",
    "michele" : "",
    "mike" : "",
    "miriam" : "",
    "mirko" : "",
    "monica" : "",
    "nadia" : "",
    "nicholas" : "",
    "nicola" : "",
    "nicole" : "",
    "nicolò" : "",
    "noemi" : "",
    "paola" : "",
    "paolo" : "",
    "patrick" : "",
    "pier" : "",
    "piero" : "",
    "pietro" : "",
    "rachele" : "",
    "raffaele" : "",
    "rebecca" : "",
    "riccardo" : "",
    "roberta" : "",
    "roberto" : "",
    "rosa" : "",
    "rosario" : "",
    "sabrina" : "",
    "salvatore" : "",
    "samantha" : "",
    "samuel" : "",
    "samuele" : "",
    "sara" : "",
    "sarah" : "",
    "saverio" : "",
    "serena" : "",
    "sergio" : "",
    "silvia" : "",
    "simon" : "",
    "simona" : "",
    "simone" : "",
    "sofia" : "",
    "sonia" : "",
    "stefania" : "",
    "stefano" : "",
    "teresa" : "",
    "thomas" : "",
    "tiziano" : "",
    "tom" : "",
    "tommaso" : "",
    "umberto" : "",
    "valentina" : "",
    "valeria" : "",
    "valerio" : "",
    "vanessa" : "",
    "veronica" : "",
    "vincenzo" : "",
    "viola" : "",
    "vito" : "",
    "vittorio" : "",
};
var most_popular_italian_surnames = {
    "aiello" : "",
    "amato" : "",
    "antonini" : "",
    "arena" : "",
    "bacci" : "",
    "baldi" : "",
    "barberis" : "",
    "barbero" : "",
    "barbieri" : "",
    "bartolini" : "",
    "basso" : "",
    "bellucci" : "",
    "beltrame" : "",
    "benedetti" : "",
    "beretta" : "",
    "bernardi" : "",
    "berti" : "",
    "bianchi" : "",
    "bianco" : "",
    "bionaz" : "",
    "blancv" : "",
    "bordet" : "",
    "borghi" : "",
    "bortolin" : "",
    "bortolotti" : "",
    "brambilla" : "",
    "bruno" : "",
    "bruzzone" : "",
    "calcagno" : "",
    "canepa" : "",
    "capasso" : "",
    "capriotti" : "",
    "caputo" : "",
    "cardinali" : "",
    "carlucci" : "",
    "carta" : "",
    "caruso" : "",
    "casadei" : "",
    "castellani" : "",
    "catalano" : "",
    "cattaneo" : "",
    "ceccarelli" : "",
    "cerise" : "",
    "cerutti" : "",
    "chenal" : "",
    "cocco" : "",
    "colangelo" : "",
    "colombo" : "",
    "colussi" : "",
    "conte" : "",
    "conti" : "",
    "coppola" : "",
    "corazza" : "",
    "cossu" : "",
    "costa" : "",
    "costantini" : "",
    "coviello" : "",
    "cretier" : "",
    "d`alessandro" : "",
    "d`amico" : "",
    "d`angelo" : "",
    "de angelis" : "",
    "de luca" : "",
    "de rosa" : "",
    "de santis" : "",
    "de simone" : "",
    "degano" : "",
    "deiana" : "",
    "delfino" : "",
    "di carlo" : "",
    "di felice" : "",
    "di francesco" : "",
    "di giacomo" : "",
    "di giovanni" : "",
    "di iorio" : "",
    "di marco" : "",
    "di matteo" : "",
    "di paolo" : "",
    "di pietro" : "",
    "di stefano" : "",
    "diemoz" : "",
    "donati" : "",
    "egger" : "",
    "esposito" : "",
    "fabbri" : "",
    "fabbro" : "",
    "fabris" : "",
    "fadda" : "",
    "favre" : "",
    "ferrando" : "",
    "ferrara" : "",
    "ferrari" : "",
    "ferrario" : "",
    "ferraris" : "",
    "ferraro" : "",
    "ferrero" : "",
    "ferretti" : "",
    "ferri" : "",
    "fiore" : "",
    "fiorucci" : "",
    "floris" : "",
    "fumagalli" : "",
    "furlan" : "",
    "fusco" : "",
    "galli" : "",
    "gallo" : "",
    "gamper" : "",
    "gargiulo" : "",
    "gasser" : "",
    "gatti" : "",
    "gentile" : "",
    "giannini" : "",
    "giordano" : "",
    "giovannini" : "",
    "giuliani" : "",
    "giusti" : "",
    "gori" : "",
    "grange" : "",
    "grasso" : "",
    "greco" : "",
    "grieco" : "",
    "grosso" : "",
    "gruber" : "",
    "hofer" : "",
    "iezzi" : "",
    "innocenti" : "",
    "izzo" : "",
    "joly" : "",
    "kofler" : "",
    "la rosa" : "",
    "lai" : "",
    "landi" : "",
    "leone" : "",
    "locatelli" : "",
    "loi" : "",
    "lombardi" : "",
    "lombardo" : "",
    "longo" : "",
    "lorusso" : "",
    "magnani" : "",
    "mair" : "",
    "manca" : "",
    "mancini" : "",
    "mancuso" : "",
    "mantovani" : "",
    "marchetti" : "",
    "marconi" : "",
    "mariani" : "",
    "marinelli" : "",
    "marini" : "",
    "marino" : "",
    "mariotti" : "",
    "marras" : "",
    "martin" : "",
    "martinelli" : "",
    "martini" : "",
    "martino" : "",
    "mauro" : "",
    "mecca" : "",
    "melis" : "",
    "meloni" : "",
    "messina" : "",
    "mignogna" : "",
    "minelli" : "",
    "moffa" : "",
    "montanari" : "",
    "montemurro" : "",
    "monti" : "",
    "morabito" : "",
    "moretti" : "",
    "moro" : "",
    "moser" : "",
    "mura" : "",
    "murgia" : "",
    "musso" : "",
    "napolitano" : "",
    "negro" : "",
    "neri" : "",
    "oliveri" : "",
    "ottonello" : "",
    "pace" : "",
    "pagani" : "",
    "palladino" : "",
    "palmisano" : "",
    "palumbo" : "",
    "pappalardo" : "",
    "parisi" : "",
    "parodi" : "",
    "passeri" : "",
    "pastorino" : "",
    "peaquin" : "",
    "pedrotti" : "",
    "pellegrini" : "",
    "pellissier" : "",
    "perri" : "",
    "perron" : "",
    "perrone" : "",
    "pession" : "",
    "pichler" : "",
    "pinna" : "",
    "piras" : "",
    "pircher" : "",
    "poggi" : "",
    "porcu" : "",
    "pozzi" : "",
    "proietti" : "",
    "pugliese" : "",
    "puglisi" : "",
    "repetto" : "",
    "ricci" : "",
    "righi" : "",
    "rinaldi" : "",
    "riva" : "",
    "rizzi" : "",
    "rizzo" : "",
    "romagnoli" : "",
    "romaniello" : "",
    "romano" : "",
    "romeo" : "",
    "rosati" : "",
    "rosset" : "",
    "rossi" : "",
    "rosso" : "",
    "rota" : "",
    "ruggiero" : "",
    "russo" : "",
    "sabatini" : "",
    "sabbatini" : "",
    "sabia" : "",
    "sala" : "",
    "salvatore" : "",
    "sanna" : "",
    "santarossa" : "",
    "santarsiero" : "",
    "santini" : "",
    "santoro" : "",
    "sartori" : "",
    "semeraro" : "",
    "serra" : "",
    "simone" : "",
    "sorrentino" : "",
    "spina" : "",
    "talarico" : "",
    "telesca" : "",
    "testa" : "",
    "tomasi" : "",
    "traverso" : "",
    "trevisan" : "",
    "tripodi" : "",
    "usai" : "",
    "valentini" : "",
    "vallet" : "",
    "venditti" : "",
    "venier" : "",
    "venturi" : "",
    "vierin" : "",
    "villa" : "",
    "visintin" : "",
    "vitale" : "",
    "vitali" : "",
    "vuillermoz" : "",
    "zeni" : "",
    "zuliani" : "",
    "zunino" : "",
};
var province = {
    "avellino": "campania",
    "benevento": "campania",
    "caserta": "campania",
    "napoli": "campania",
    "salerno": "campania",
};
var province_abbreviation = {
    "av": "campania",
    "bn": "campania",
    "ce": "campania",
    "na": "campania",
    "sa": "campania"
};
var municipality = {
    "campania": [
"acerno",
    "acerra",
    "afragola",
    "agerola",
    "agropoli",
    "aiello del sabato",
    "ailano",
    "airola",
    "albanella",
    "alfano",
    "alife",
    "altavilla irpina",
    "altavilla silentina",
    "alvignano",
    "amalfi",
    "amorosi",
    "anacapri",
    "andretta",
    "angri",
    "apice",
    "apollosa",
    "aquara",
    "aquilonia",
    "ariano irpino",
    "arienzo",
    "arpaia",
    "arpaise",
    "arzano",
    "ascea",
    "atena lucana",
    "atrani",
    "atripalda",
    "auletta",
    "avella",
    "aversa",
    "bacoli",
    "bagnoli irpino",
    "baia e latina",
    "baiano",
    "barano d'ischia",
    "baronissi",
    "baselice",
    "battipaglia",
    "bellizzi",
    "bellona",
    "bellosguardo",
    "bisaccia",
    "bonea",
    "bonito",
    "boscoreale",
    "boscotrecase",
    "bracigliano",
    "brusciano",
    "bucciano",
    "buccino",
    "buonabitacolo",
    "buonalbergo",
    "caggiano",
    "caianello",
    "caiazzo",
    "cairano",
    "caivano",
    "calabritto",
    "calitri",
    "calvanico",
    "calvi",
    "calvi risorta",
    "calvizzano",
    "camerota",
    "camigliano",
    "campagna",
    "campolattaro",
    "campoli del monte taburno",
    "campora",
    "camposano",
    "cancello ed arnone",
    "candida",
    "cannalonga",
    "capaccio paestum",
    "capodrise",
    "caposele",
    "capri",
    "capriati a volturno",
    "capriglia irpina",
    "capua",
    "carbonara di nola",
    "cardito",
    "carife",
    "carinaro",
    "carinola",
    "casagiove",
    "casal di principe",
    "casal velino",
    "casalbore",
    "casalbuono",
    "casalduni",
    "casaletto spartano",
    "casalnuovo di napoli",
    "casaluce",
    "casamarciano",
    "casamicciola terme",
"casandrino",
"casapesenna",
"casapulla",
"casavatore",
"caselle in pittari",
"casola di napoli",
"casoria",
"cassano irpino",
"castel baronia",
"castel campagnano",
"castel di sasso",
"castel morrone",
"castel san giorgio",
"castel san lorenzo",
"castel volturno",
"castelcivita",
"castelfranci",
"castelfranco in miscano",
"castellabate",
"castellammare di stabia",
"castello del matese",
"castello di cisterna",
"castelnuovo cilento",
"castelnuovo di conza",
"castelpagano",
"castelpoto",
"castelvenere",
"castelvetere in val fortore",
"castelvetere sul calore",
"castiglione del genovesi",
"cautano",
"cava de' tirreni",
"celle di bulgheria",
"cellole",
"centola",
"ceppaloni",
"ceraso",
"cercola",
"cerreto sannita",
"cervinara",
"cervino",
"cesa",
"cesinali",
"cetara",
"chianche",
"chiusano di san domenico",
"cicciano",
"cicerale",
"cimitile",
"ciorlano",
"circello",
"colle sannita",
"colliano",
"comiziano",
"conca dei marini",
"conca della campania",
"contrada",
"controne",
"contursi terme",
"conza della campania",
"corbara",
"corleto monforte",
"crispano",
"cuccaro vetere",
"curti",
"cusano mutri",
"domicella",
"dragoni",
"dugenta",
"durazzano",
"eboli",
"ercolano",
"faicchio",
"falciano del massico",
"felitto",
"fisciano",
"flumeri",
"foglianise",
"foiano di val fortore",
"fontanarosa",
"fontegreca",
"forchia",
"forino",
"forio",
"formicola",
"fragneto l'abate",
"fragneto monforte",
"francolise",
"frasso telesino",
"frattamaggiore",
"frattaminore",
"frigento",
"frignano",
"furore",
"futani",
"gallo matese",
"galluccio",
"gesualdo",
"giano vetusto",
"giffoni sei casali",
"giffoni valle piana",
"ginestra degli schiavoni",
"gioi",
"gioia sannitica",
"giugliano in campania",
"giungano",
"gragnano",
"grazzanise",
"greci",
"gricignano di aversa",
"grottaminarda",
"grottolella",
"grumo nevano",
"guardia lombardi",
"guardia sanframondi",
"ischia",
"ispani",
"lacco ameno",
"lacedonia",
"lapio",
"laureana cilento",
"laurino",
"laurito",
"lauro",
"laviano",
"letino",
"lettere",
"liberi",
"limatola",
"lioni",
"liveri",
"luogosano",
"lusciano",
"lustra",
"macerata campania",
"maddaloni",
"magliano vetere",
"maiori",
"manocalzati",
"marano di napoli",
"marcianise",
"mariglianella",
"marigliano",
"marzano appio",
"marzano di nola",
"massa di somma",
"massa lubrense",
"melito di napoli",
"melito irpino",
"melizzano",
"mercato san severino",
"mercogliano",
"meta",
"mignano monte lungo",
"minori",
"mirabella eclano",
"moiano",
"moio della civitella",
"molinara",
"mondragone",
"montaguto",
"montano antilia",
"monte di procida",
"monte san giacomo",
"montecalvo irpino",
"montecorice",
"montecorvino pugliano",
"montecorvino rovella",
"montefalcione",
"montefalcone di val fortore",
"monteforte cilento",
"monteforte irpino",
"montefredane",
"montefusco",
"montella",
"montemarano",
"montemiletto",
"montesano sulla marcellana",
"montesarchio",
"monteverde",
"montoro",
"morcone",
"morigerati",
"morra de sanctis",
"moschiano",
"mugnano del cardinale",
"mugnano di napoli",
"nocera inferiore",
"nocera superiore",
"nola",
"novi velia",
"nusco",
"ogliastro cilento",
"olevano sul tusciano",
"oliveto citra",
"omignano",
"orria",
"orta di atella",
"ospedaletto d'alpinolo",
"ottati",
"ottaviano",
"padula",
"paduli",
"pagani",
"pago del vallo di lauro",
"pago veiano",
"palma campania",
"palomonte",
"pannarano",
"paolisi",
"parete",
"parolise",
"pastorano",
"paternopoli",
"paupisi",
"pellezzano",
"perdifumo",
"perito",
"pertosa",
"pesco sannita",
"petina",
"petruro irpino",
"piaggine",
"piana di monte verna",
"piano di sorrento",
"piedimonte matese",
"pietradefusi",
"pietramelara",
"pietraroja",
"pietrastornina",
"pietravairano",
"pietrelcina",
"pignataro maggiore",
"pimonte",
"pisciotta",
"poggiomarino",
"polla",
"pollena trocchia",
"pollica",
"pomigliano d'arco",
"pompei",
"ponte",
"pontecagnano faiano",
"pontelandolfo",
"pontelatone",
"portici",
"portico di caserta",
"positano",
"postiglione",
"pozzuoli",
"praiano",
"prata di principato ultra",
"prata sannita",
"pratella",
"pratola serra",
"presenzano",
"prignano cilento",
"procida",
"puglianello",
"quadrelle",
"qualiano",
"quarto",
"quindici",
"ravello",
"raviscanina",
"recale",
"reino",
"riardo",
"ricigliano",
"rocca d'evandro",
"rocca san felice",
"roccabascerana",
"roccadaspide",
"roccagloriosa",
"roccamonfina",
"roccapiemonte",
"roccarainola",
"roccaromana",
"rocchetta e croce",
"rofrano",
"romagnano al monte",
"roscigno",
"rotondi",
"rutino",
"ruviano",
"sacco",
"sala consilina",
"salento",
"salvitelle",
"salza irpina",
"san bartolomeo in galdo",
"san cipriano d'aversa",
"san cipriano picentino",
"san felice a cancello",
"san gennaro vesuviano",
"san giorgio a cremano",
"san giorgio del sannio",
"san giorgio la molara",
"san giovanni a piro",
"san giuseppe vesuviano",
"san gregorio magno",
"san gregorio matese",
"san leucio del sannio",
"san lorenzello",
"san lorenzo maggiore",
"san lupo",
"san mango piemonte",
"san mango sul calore",
"san marcellino",
"san marco dei cavoti",
"san marco evangelista",
"san martino sannita",
"san martino valle caudina",
"san marzano sul sarno",
"san mauro cilento",
"san mauro la bruca",
"san michele di serino",
"san nazzaro",
"san nicola baronia",
"san nicola la strada",
"san nicola manfredi",
"san paolo bel sito",
"san pietro al tanagro",
"san pietro infine",
"san potito sannitico",
"san potito ultra",
"san prisco",
"san rufo",
"san salvatore telesino",
"san sebastiano al vesuvio",
"san sossio baronia",
"san tammaro",
"san valentino torio",
"san vitaliano",
"santa croce del sannio",
"santa lucia di serino",
"santa maria a vico",
"santa maria capua vetere",
"santa maria la carità",
"santa maria la fossa",
"santa marina",
"santa paolina",
"sant'agata de' goti",
"sant'agnello",
"sant'anastasia",
"sant'andrea di conza",
"sant'angelo a cupolo",
"sant'angelo a fasanella",
"sant'angelo a scala",
"sant'angelo all'esca",
"sant'angelo d'alife",
"sant'angelo dei lombardi",
"sant'antimo",
"sant'antonio abate",
"sant'arcangelo trimonte",
"sant'arpino",
"sant'arsenio",
"sant'egidio del monte albino",
"santo stefano del sole",
"santomenna",
"sanza",
"sapri",
"sarno",
"sassano",
"sassinoro",
"saviano",
"savignano irpino",
"scafati",
"scala",
"scampitella",
"scisciano",
"senerchia",
"serino",
"serramezzana",
"serrara fontana",
"serre",
"sessa aurunca",
"sessa cilento",
"siano",
"sicignano degli alburni",
"sirignano",
"solofra",
"solopaca",
"somma vesuviana",
"sorbo serpico",
"sorrento",
"sparanise",
"sperone",
"stella cilento",
"stio",
"striano",
"sturno",
"succivo",
"summonte",
"taurano",
"taurasi",
"teano",
"teggiano",
"telese terme",
"teora",
"terzigno",
"teverola",
"tocco caudio",
"tora e piccilli",
"torchiara",
"torella dei lombardi",
"torraca",
"torre annunziata",
"torre del greco",
"torre le nocelle",
"torre orsaia",
"torrecuso",
"torrioni",
"tortorella",
"tramonti",
"trecase",
"trentinara",
"trentola-ducenta",
"trevico",
"tufino",
"tufo",
"vairano patenora",
"vallata",
"valle agricola",
"valle dell'angelo",
"valle di maddaloni",
"vallesaccarda",
"vallo della lucania",
"valva",
"venticano",
"vibonati",
"vico equense",
"vietri sul mare",
"villa di briano",
"villa literno",
"villamaina",
"villanova del battista",
"villaricca",
"visciano",
"vitulano",
"vitulazio",
"volla",
"volturara irpina",
"zungoli"],
};
var religions = {
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

var genders = ["maschio", "femmina", "uomo", "donna", "f", "m"];
var regions = ["abruzzo", "basilicata", "calabria", "campania", "emilia romagna", "friuli venezia giulia", "lazio", "liguria", "lombardia", "marche", "molise", "piemonte", "puglia", "sardegna", "sicilia", "toscana", "trentino alto adige", "umbria", "valle d'aosta", "veneto"];


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
