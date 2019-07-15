import {importModule} from '../../../shared/import_polyfill/import_polyfill.js';

const TYPES = {
    DT_DATE:   { name: "DATE" },
    DT_INT:    { name: "INT"},
    DT_NULL:   { name: "NULL" },
    DT_OBJECT: { name: "OBJECT" },
    DT_REAL:   { name: "REAL"},
    DT_TEXT:   { name: "TEXT" }
    //GEOCOORDINATE   :   { name: "GEOCOORDINATE" },
    //GEOJSON         :   { name: "GEOJSON" },
    //GEOJSONTYPES = [
    //     "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", "FeatureCollection"
    // ];
};

const METATYPES = {
    DT_ADDRESS : {name: "ADDRESS"},
    DT_ATECO_CODE : {name:"ATECO"},
    DT_CF:      { name: "CF" },
    DT_DEGREE : {name:"DEGREE"},
    DT_EMAIL:   { name: "EMAIL" },
    DT_GENDER : {name:"GENDER"},
    DT_IBAN : {name:"IBAN"},
    DT_LAT_LONG : {name:"LAT_LONG"},
    DT_LATITUDE : {name:"LATITUDE"},
    DT_LONGITUDE : {name:"LONGITUDE"},
    DT_MOBILEPHONE : { name: "MOBILE_PHONE"},
    DT_MONEY : {name:"MONEY"},
    DT_MUNICIPALITY : {name:"MUNICIPALITY"},
    DT_NAME : {name:"NAME"},
    DT_PERCENTAGE : {name:"PERCENTAGE"},
    DT_PHONE : { name: "PHONE"},
    DT_PROVINCE : {name:"PROVINCE"},
    DT_REGION : {name:"REGION"},
    DT_RELIGION : {name:"RELIGION"},
    DT_SURNAME : {name:"SURNAME"},
    DT_UNKNOWN: { name: "UNKNOWN" },
    DT_URL : {name:"URL"},
    DT_ZIPCODE : { name: "ZIPCODE"}
};

const DATATYPES = Object.assign({}, TYPES, METATYPES);

var wordsCollections, privacyBreachMessages;

export default class TypeAndMetatypeConfigFactory {
    constructor() {
        this._typesTraversal = this._getTraversal("types");
        this._metatypesTraversal = this._getTraversal("metatypes");

        this.typoTypes = [
            METATYPES.DT_NAME, METATYPES.DT_SURNAME, METATYPES.DT_GENDER, METATYPES.DT_RELIGION,
            METATYPES.DT_REGION, METATYPES.DT_PROVINCE, METATYPES.DT_MUNICIPALITY
        ];

        this.privacyBreachTypes = [
            METATYPES.DT_EMAIL, METATYPES.DT_PHONE, METATYPES.DT_MOBILEPHONE,
            METATYPES.DT_ADDRESS, METATYPES.DT_ZIPCODE, METATYPES.DT_CF, METATYPES.DT_IBAN
        ];
    }

    import_modules = async function(userLanguage) {
        privacyBreachMessages = await import_module("./localization/"+userLanguage+"/privacyBreachMessages.js");
        wordsCollections = await import_module("./localization/"+userLanguage+"/wordsCollections.js");
    };

    get DATATYPES() {
        return DATATYPES;
    };

    evaluate(value) {
        let type = this._inferType(value);//todo return .name.name???
        let metatype = this._inferMetatype(value, type.name);

        return {
            value : value,
            datatype : type.name,//todo type
            metatype : metatype.name
        };
    }

    testTyposErrors(value) {
        let words1 = this._editDistance1(value);

        let corrections = [];

        for(let i in this.typoTypes)
            corrections = corrections.concat(this.typoTypes[i].correct(words1, value));

        return corrections;
    };

    testContentPrivacyBreaches(value) {
        let matchList = [];

        for(let i in this.privacyBreachTypes)
            matchList = matchList.concat(this.privacyBreachTypes[i].checkInText(value));

        return matchList;
    };

    testStructuralPrivacyBreaches(schema) {
        let report = [];

        if(schema.hasOwnProperty(METATYPES.DT_CF.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_CF.name] = schema[METATYPES.DT_CF.name];
            privacyBreach.warning = privacyBreachMessages.messages['CF'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_EMAIL.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_EMAIL.name] = schema[METATYPES.DT_EMAIL.name];
            privacyBreach.warning = privacyBreachMessages.messages['EMAIL'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_IBAN.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_IBAN.name] = schema[METATYPES.DT_IBAN.name];
            privacyBreach.warning = privacyBreachMessages.messages['IBAN'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_PHONE.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_PHONE.name] = schema[METATYPES.DT_PHONE.name];
            privacyBreach.warning = privacyBreachMessages.messages['PHONE'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_MOBILEPHONE.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_MOBILEPHONE.name] = schema[METATYPES.DT_MOBILEPHONE.name];
            privacyBreach.warning = privacyBreachMessages.messages['MOBILEPHONE'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_ZIPCODE.name) && schema.hasOwnProperty(METATYPES.DT_GENDER.name) && schema.hasOwnProperty(DATATYPES.DT_DATE.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_ZIPCODE.name] = schema[METATYPES.DT_ZIPCODE.name];
            privacyBreach.breach[METATYPES.DT_GENDER.name] = schema[METATYPES.DT_GENDER.name];
            privacyBreach.breach[DATATYPES.DT_DATE.name] = schema[DATATYPES.DT_DATE.name];
            privacyBreach.warning = privacyBreachMessages.messages['ZIPCODE_DATE_GENDER'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_NAME.name) && schema.hasOwnProperty(METATYPES.DT_SURNAME.name) && schema.hasOwnProperty(DATATYPES.DT_LAT_LONG.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_NAME.name] = schema[METATYPES.DT_NAME.name];
            privacyBreach.breach[METATYPES.DT_SURNAME.name] = schema[METATYPES.DT_SURNAME.name];
            privacyBreach.breach[METATYPES.DT_LAT_LONG.name] =  schema[METATYPES.DT_LAT_LONG.name];
            privacyBreach.warning = privacyBreachMessages.messages['NAME_SURNAME_LAT_LONG'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_NAME.name) && schema.hasOwnProperty(METATYPES.DT_SURNAME.name) &&
            schema.hasOwnProperty(DATATYPES.DT_LATITUDE.name) && schema.hasOwnProperty(DATATYPES.DT_LONGITUDE.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_NAME.name] = schema[METATYPES.DT_NAME.name];
            privacyBreach.breach[METATYPES.DT_SURNAME.name] = schema[METATYPES.DT_SURNAME.name];
            privacyBreach.breach[METATYPES.DT_LATITUDE.name] = schema[METATYPES.DT_LATITUDE.name];
            privacyBreach.breach[METATYPES.DT_LONGITUDE.name] = schema[METATYPES.DT_LONGITUDE.name];
            privacyBreach.warning = privacyBreachMessages.messages['NAME_SURNAME_LAT_LONG'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_NAME.name) && schema.hasOwnProperty(METATYPES.DT_SURNAME.name) && schema.hasOwnProperty(DATATYPES.DT_ADDRESS.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_NAME.name] = schema[METATYPES.DT_NAME.name];
            privacyBreach.breach[METATYPES.DT_SURNAME.name] = schema[METATYPES.DT_SURNAME.name];
            privacyBreach.breach[METATYPES.DT_ADDRESS.name] = schema[METATYPES.DT_ADDRESS.name];
            privacyBreach.warning = privacyBreachMessages.messages['NAME_SURNAME_ADDRESS'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_NAME.name) && schema.hasOwnProperty(METATYPES.DT_SURNAME.name) && schema.hasOwnProperty(DATATYPES.DT_RELIGION.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_NAME.name] = schema[METATYPES.DT_NAME.name];
            privacyBreach.breach[METATYPES.DT_SURNAME.name] = schema[METATYPES.DT_SURNAME.name];
            privacyBreach.breach[METATYPES.DT_RELIGION.name] = schema[METATYPES.DT_RELIGION.name];
            privacyBreach.warning = privacyBreachMessages.messages['NAME_SURNAME_RELIGION'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_CF.name) && schema.hasOwnProperty(DATATYPES.DT_ADDRESS.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_CF.name] = schema[METATYPES.DT_CF.name];
            privacyBreach.breach[METATYPES.DT_ADDRESS.name] = schema[METATYPES.DT_ADDRESS.name];
            privacyBreach.warning = privacyBreachMessages.messages['CF_ADDRESS'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_CF.name) && schema.hasOwnProperty(DATATYPES.DT_RELIGION.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_CF.name] = schema[METATYPES.DT_CF.name];
            privacyBreach.breach[METATYPES.DT_RELIGION.name] = schema[METATYPES.DT_RELIGION.name];
            privacyBreach.warning = privacyBreachMessages.messages['CF_RELIGION'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_CF.name) && schema.hasOwnProperty(DATATYPES.DT_LAT_LONG.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_CF.name] = schema[METATYPES.DT_CF.name];
            privacyBreach.breach[METATYPES.DT_LAT_LONG.name] = schema[METATYPES.DT_LAT_LONG.name];
            privacyBreach.warning = privacyBreachMessages.messages['CF_LAT_LONG'];
            report.push(privacyBreach);
        }
        if(schema.hasOwnProperty(METATYPES.DT_CF.name) &&
            schema.hasOwnProperty(DATATYPES.DT_LATITUDE.name) && schema.hasOwnProperty(DATATYPES.DT_LONGITUDE.name)){
            let privacyBreach = {};
            privacyBreach.breach = {};
            privacyBreach.breach[METATYPES.DT_CF.name] = schema[METATYPES.DT_CF.name];
            privacyBreach.breach[METATYPES.DT_LATITUDE.name] = schema[METATYPES.DT_LATITUDE.name];
            privacyBreach.breach[METATYPES.DT_LONGITUDE.name] = schema[METATYPES.DT_LONGITUDE.name];
            privacyBreach.warning = privacyBreachMessages.messages['CF_LAT_LONG'];
            report.push(privacyBreach);
        }

        return report;
    };

    _getTraversal(opt) {
        let tree;
        if(opt == "types")
            tree = this._typesTree();
        else // "metatypes"
            tree = this._metatypesTree();
        let dft = tree.traverseDepthFirst();
        let traversal = [];
        for(let i in dft)
            traversal.push(dft[i].data)
        return traversal;
    };

    _typesTree() {
        let DT_TEXT = new TDSNODE(TYPES.DT_TEXT);
        new TDSNODE(TYPES.DT_NULL, DT_TEXT);
        let DT_REAL = new TDSNODE(TYPES.DT_REAL, DT_TEXT);
        new TDSNODE(TYPES.DT_INT, DT_REAL);
        new TDSNODE(TYPES.DT_DATE, DT_TEXT);
        new TDSNODE(TYPES.DT_OBJECT, DT_TEXT);

        return new TDS(DT_TEXT);
    };

    _metatypesTree() {
        let DT_UNKNOWN = new TDSNODE(METATYPES.DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_EMAIL, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_URL, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_CF, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_IBAN, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_ZIPCODE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_MOBILEPHONE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_PHONE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_LATITUDE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_LONGITUDE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_LAT_LONG, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_ADDRESS, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_PROVINCE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_MUNICIPALITY, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_REGION, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_ATECO_CODE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_SURNAME, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_NAME, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_RELIGION, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_GENDER, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_MONEY, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_PERCENTAGE, DT_UNKNOWN);
        new TDSNODE(METATYPES.DT_DEGREE, DT_UNKNOWN);

        return new TDS(DT_UNKNOWN);
    };

    _inferType(value) {
        //todo controlla tutte le foglie , se nessuna va bene il mpadre è il TYPE, se una va bene e non ha figli è il TYPE, se una va bene e ha figli scendi giù!
        //todo quando va bene (se "non è una foglia type" sali)

        let inferredType;

        for (let i=0; i<this._typesTraversal.length; i++) {
            inferredType = this._typesTraversal[i].evaluate(value);
            if (inferredType)
                return inferredType;
        }
    };

    _inferMetatype(value, type) {
        let numbers      = /[0-9]/;
        let letters      = /[a-zA-Z]/;
        let alphanumeric = /^[a-z0-9]+$/;

        let list = [];

        //NULL or DATE or OBJECT
        if ([TYPES.DT_NULL.name, TYPES.DT_DATE.name, TYPES.DT_OBJECT.name].indexOf(type.name) > -1) {
            //list = []
        }
        //INT
        else if (type.name == TYPES.DT_INT.name) {
            list = [METATYPES.DT_ZIPCODE, METATYPES.DT_PHONE, METATYPES.DT_MOBILEPHONE, METATYPES.DT_LATITUDE, METATYPES.DT_LONGITUDE];
        }
        //REAL
        else if (type.name == TYPES.DT_REAL.name) {
            list = [METATYPES.DT_LATITUDE, METATYPES.DT_LONGITUDE];
        }
        //numbers&symbols
        else if (!letters.test(value)) {
            if(value.indexOf('%') > -1)
                list = [METATYPES.DT_PERCENTAGE];
            else if (value.indexOf('$') > -1 || value.indexOf('€') > -1 || value.indexOf('£') > -1)
                list = [METATYPES.DT_MONEY];
            else if (value.indexOf('.') > -1)
                list = [METATYPES.DT_ATECO_CODE];
            else if (value.indexOf(',') > -1)
                list = [METATYPES.DT_LAT_LONG];
            else if (value.indexOf('°') > -1)
                list = [METATYPES.DT_DEGREE];
            else
                list = [METATYPES.DT_PHONE, METATYPES.DT_MOBILEPHONE];
        }
        //letters&symbols
        else if (!numbers.test(value)) {
            if (value.indexOf('@') > -1)
                list = [METATYPES.DT_EMAIL];
            else if(value.indexOf('.') > -1)
                list = [METATYPES.DT_URL, METATYPES.DT_ADDRESS];
            else
                list = [METATYPES.DT_ADDRESS, METATYPES.DT_GENDER, METATYPES.DT_RELIGION, METATYPES.DT_REGION, METATYPES.DT_PROVINCE, METATYPES.DT_MUNICIPALITY, METATYPES.DT_SURNAME, METATYPES.DT_NAME];
        }
        //letters&numbers
        else if (value.match(alphanumeric)) {
            list = [METATYPES.DT_CF, METATYPES.DT_IBAN, METATYPES.DT_ADDRESS, METATYPES.DT_GENDER, METATYPES.DT_RELIGION, METATYPES.DT_REGION, METATYPES.DT_PROVINCE, METATYPES.DT_MUNICIPALITY, METATYPES.DT_SURNAME, METATYPES.DT_NAME];
        }
        //letters&numbers&symbols
        else {
            if (value.indexOf('@') > -1)
                list = [METATYPES.DT_EMAIL];
            else if(value.indexOf('.') > -1)
                list = [METATYPES.DT_URL, METATYPES.DT_ATECO_CODE, METATYPES.DT_ADDRESS];
            else if (value.indexOf('°') > -1)
                list = [METATYPES.DT_DEGREE, METATYPES.DT_ADDRESS];
            else
                list = [METATYPES.DT_CF, METATYPES.DT_IBAN, METATYPES.DT_ADDRESS];
        }

        list.push(METATYPES.DT_UNKNOWN);

        let inferredMetatype;

        for (let i=0; list.length; i++) {
            inferredMetatype = list[i].evaluate(value);
            if (inferredMetatype)
                return inferredMetatype;
        }

        // for (let i=0; i<this._metatypesTraversal.length; i++) {
        //     inferredMetatype = this._metatypesTraversal[i].evaluate(value);
        //     if (inferredMetatype)
        //         return inferredMetatype;
        // }

    };

    _editDistance1(originalWord) {

        originalWord = originalWord.toLowerCase();
        let word = originalWord.split('');
        let results = {};
        let alphabet = "abcdefghijklmnopqrstuvwxyz";

        //Adding any one character (from the alphabet) anywhere in the word.
        for(let i = 0; i <= word.length; i++){
            for(let j = 0; j < alphabet.length; j++){
                let newWord = word.slice();
                newWord.splice(i, 0, alphabet[j]);
                newWord = newWord.join('');
                results[newWord] = 1;
            }
        }

        //Removing any one character from the word.
        if(word.length > 1){
            for(let i = 0; i < word.length; i++){
                let newWord = word.slice();
                newWord.splice(i,1);
                newWord = newWord.join('');
                results[newWord] = 1;
            }
        }

        //Transposing (switching) the order of any two adjacent characters in a word.
        if(word.length > 1){
            for(let i = 0; i < word.length - 1; i++){
                let newWord = word.slice();
                let r = newWord.splice(i,1);
                newWord.splice(i + 1, 0, r[0]);
                newWord = newWord.join('');
                results[newWord] = 1;
            }
        }

        //Substituting any character in the word with another character.
        for(let i = 0; i < word.length; i++){
            for(let j = 0; j < alphabet.length; j++){
                let newWord = word.slice();
                newWord[i] = alphabet[j];
                newWord = newWord.join('');
                results[newWord] = 1;
            }
        }
        if(originalWord in results){
            delete results[originalWord];
        }

        return results;
    };
}

class TDS {
    constructor(rootnode) {
        if (typeof rootnode === 'undefined')
            rootnode = new TDSNODE();
        this._root = rootnode;
    }

    get root() { return this._root; }

    traverseDepthFirst() {
        let stack = [ this._root ];
        let traverse = [];
        let item;

        while ( typeof (item = stack.pop()) !== 'undefined') {
            traverse.unshift(item);
            item.children.forEach( (element, index) => {
                stack.push(element);
            });
        }

        return traverse;
    }
}

class TDSNODE {
    constructor(data, parent) {
        this._parent = parent;
        this._data = data;
        this._children = [];

        if (typeof this._parent !== 'undefined') {
            this._parent.addChild(this);
        }
    }

    get parent() { return this._parent; }
    set parent(parent) { this._parent = parent; }

    get data() { return this._data; }
    set data(value) { this._data = value; }

    get children() { return this._children; }

    addChild(child) {
        child.parent = this;
        this._children.push(child);
    }
}

// utilities

async function import_module(url) {
    let define = window.define;
    window.define = undefined;
    let dynamic_import_support = get_dynamic_import();
    let mod = await dynamic_import_support(url);
    window.define = define;
    return mod;
}

function get_dynamic_import() {
    try {
        return new Function('url', 'return import(url)');
    } catch (err) {
        return importModule;
    }
}

// evaluate types

TYPES.DT_DATE.evaluate = function (value) {
    let dtDate = new Date("YYYY-MM-DD");

    // [YYYY-MM] year-month.
    let match = /^([0-9]{1,4})(\-|\/)([0-9]{1,2})$/.exec(value);
    if (match) {
        let splitted = match[2];
        let year = parseInt(match[1]);
        let month = parseInt(match[3]);

        if (month > 12) return false;

        dtDate.setYear(year);
        dtDate.setMonth(month);
        return { name: DATATYPES.DT_DATE, format: "YM", parsedValue: dtDate };
    }

    // [YYYY-MM-DD]
    match = /^([0-9]{1,4})(\-|\/)([0-9]{1,2})((\-|\/)([0-9]{1,2}))?$/.exec(value);
    if (match) {
        let year = parseInt(match[1]);
        let month = parseInt(match[3]);
        let day = parseInt(match[6]); //splitted.length == 3 ? parseInt(splitted[2]) : 0;

        //Checks the range.
        if (month <= 0 || month >= 13) return null;
        if (day <= 0 || day >= 32) return null;

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);

        return { name: DATATYPES.DT_DATE, format: "YMD", parsedValue: dtDate };
    }

    /// DD-MM-YYYY or MM-DD-YYYY
    match = /^([0-9]{1,2})(\-|\/)([0-9]{1,2})(\-|\/)([0-9]{1,4})$/.exec(value);
    if (match) {
        let year = parseInt(match[5]);
        let month = parseInt(match[3]);
        let day = parseInt(match[1]);
        let result = { name: DATATYPES.DT_DATE, format: "DMY", parsedValue: dtDate };

        //Here, recognises the American vs Italian format.
        //When month is greater than twelve, it swaps month and day variable.
        if (month > 12) {
            let temp = month;
            month = day;
            day = temp;
            result.format = "MDY";
        }

        //Checks the range.
        if (month <= 0 || month >= 13) return false;
        if (day <= 0 || day >= 32) return false;

        if (day <= 12 && month <= 12) result.format = "XXY";//It can be both formats.

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return result;
    }

    return false;
};

TYPES.DT_INT.evaluate = function (value) {
    if(/^(\-|\+)?((0|([1-9][0-9]*))|Infinity)$/.test(value))
        return { name: TYPES.DT_INT, parsedValue: Number(value) };

    return false;
};

TYPES.DT_NULL.evaluate = function(value) {
    if (value === null || typeof value === 'undefined' || value.toLowerCase() == 'null')
        return { name: TYPES.DT_NULL };

    return false;
};

TYPES.DT_OBJECT.evaluate = function(value) {
    // todo --> JSON.parse() ?
    if (typeof value === 'object')
        return { name: TYPES.DT_OBJECT};

    return false;
};

TYPES.DT_REAL.evaluate = function (value) {
    let match = /^(\-|\+)?(0|([1-9][0-9]*))((\.|\,)([0-9]+))?$/.exec(value);
    if( match )
        return { name: TYPES.DT_REAL, parsedValue: Number(value), sign: match[1], decimalSeparator: match[5] };

    return false;
};

TYPES.DT_TEXT.evaluate = function(value) {
    return { name: TYPES.DT_TEXT };
};

// evaluate metatypes

METATYPES.DT_ADDRESS.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    let regex = /^(via|viale|vico|v[.]|corso|c[.]so|piazza|piazzetta|p[.]|p[.]zza|parco|largo|traversa|contrada|c\/o)\s([a-z]+\s?)+(([,°]?\s?\d*)?|(s.n.c.)?)/i;

    if (regex.test(value))
        return { name: METATYPES.DT_ADDRESS};

    return false;
};

METATYPES.DT_ATECO_CODE.evaluate = function(value) {
    value = value.trim();

    //Regular Expression to match Italian Istat Ateco Code (formally Codice Istat) updated to Ateco-Istat 2004.
    let regex = /^\d{2}[.]{1}\d{2}[.]{1}[0-9A-Za-z]{1}[p]?$/;

    if (regex.test(value))
        return { name: METATYPES.DT_ATECO_CODE };

    //Regular Expression to match Italian Istat Ateco Code (formally Codice Istat) updated to Ateco-Istat 2007.
    regex = /^\d{2}[.]{1}\d{2}[.]{1}[0-9]{2}$/;

    if (regex.test(value))
        return { name: METATYPES.DT_ATECO_CODE };

    return false;
};

METATYPES.DT_CF.evaluate = function (value) {
    value = value.toUpperCase();
    value = value.trim();

    let regex = /^(?:(?:[B-DF-HJ-NP-TV-Z]|[AEIOU])[AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i;

    if (regex.test(value))
        return { name: METATYPES.DT_CF };

    return false;
};

METATYPES.DT_DEGREE.evaluate = function(value) {
    value = value.replace(/\s/g,'');

    //Celsius degree
    let regex = /^(100|[0-9]{1,2}|-[0-9]|-[1-2][0-9]|-30)°C?$/;

    if (regex.test(value))
        return { name: METATYPES.DT_DEGREE };

    //Fahrenheit  degree
    regex = /^(^[0-9]{1,2}|220|2[1-2][0-9]|-[0-9]|-[1-2][0-9])°F$/;

    if (regex.test(value))
        return { name: METATYPES.DT_DEGREE };

    return false;
};

METATYPES.DT_EMAIL.evaluate = function (value) {
    value = value.trim();

    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regex.test(value))
        return { name: METATYPES.DT_EMAIL };

    return false;
};

METATYPES.DT_GENDER.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if(wordsCollections.genders.indexOf(value)>=0)
        return { name: METATYPES.DT_GENDER, correct_value:value };

    return false;
};

METATYPES.DT_IBAN.evaluate = function (value) {
    value = value.replace(/\s/g,'');

    let regex = /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/i;

    if (regex.test(value))
        return { name: METATYPES.DT_IBAN };

    return false;
};

METATYPES.DT_LAT_LONG.evaluate = function(value) {
    value = value.replace(/\s/g,'');

    let regex = /^([-+]?)([\d]{1,2})((\.)(\d+))?,(([-+]?)([\d]{1,3})((\.)(\d+))?)$/;

    if (regex.test(value))
        return { name: METATYPES.DT_LAT_LONG };

    return false;
};

METATYPES.DT_LATITUDE.evaluate = function(value) {
    value = value.trim();

    let regex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;

    if (regex.test(value))
        return { name: METATYPES.DT_LATITUDE };

    return false;
};

METATYPES.DT_LONGITUDE.evaluate = function(value) {
    value = value.trim();

    let regex = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;

    if (regex.test(value))
        return { name: METATYPES.DT_LONGITUDE };

    return false;
};

METATYPES.DT_MOBILEPHONE.evaluate = function(value) {
    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    let regex = /^(\((([+]|00)39)\)|(([+]|00)39))?((313)|(32[034789])|(33[013456789])|(34[02456789])|(36[0368])|(37[037])|(38[0389])|(39[0123]))([\d]{7})$/;

    if (regex.test(value))
        return { name: METATYPES.DT_MOBILEPHONE };

    return false;
};

METATYPES.DT_MONEY.evaluate = function(value) {
    value = value.replace(/\s/g,'');

    //currency symbol at the end
    let regex = /^-?((\d{1,3}(\.(\d){3})*)|\d*)(,\d{1,2})?((\u20AC)|(\$)|(£))$/;

    if (regex.test(value))
        return { name: METATYPES.DT_MONEY };

    //currency symbol at the beginning
    regex = /^((\u20AC)|(\$)|(£))-?((\d{1,3}(\.(\d){3})*)|\d*)(,\d{1,2})?$/;

    if (regex.test(value))
        return { name: METATYPES.DT_MONEY };

    return false;
};

METATYPES.DT_MUNICIPALITY.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if(value in wordsCollections.municipality)
        return { name: METATYPES.DT_MUNICIPALITY, correct_value:wordsCollections.municipality[value].correct_value };

    return false;
};

METATYPES.DT_NAME.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if (value in wordsCollections.most_popular_italian_names){
        return { name: METATYPES.DT_NAME, correct_value:wordsCollections.most_popular_italian_names[value].correct_value };
    }

    let splitParts = value.split(' ');
    if(splitParts.length<5){
        if(splitParts.every(_checkInMap))
            return { name: METATYPES.DT_NAME,
                correct_value: splitParts
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')
            };
    }

    function _checkInMap(element){
        return element in wordsCollections.most_popular_italian_names;
    }

    return false;
};

METATYPES.DT_PERCENTAGE.evaluate = function(value){
    value = value.replace(/\s/g,'');

    let regex = /^(100|[0-9]{1,2}$|^[0-9]{1,2}\,[0-9]{1,3})%$/;

    if (regex.test(value))
        return { name: METATYPES.DT_PERCENTAGE };

    return false;
};

METATYPES.DT_PHONE.evaluate = function(value) {
    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    let regex = /^(\((([+]|00)39)\)|(([+]|00)39))?0([\d]{11}|[\d]{10}|[\d]{9}|[\d]{8})$/;

    if (regex.test(value))
        return { name: METATYPES.DT_PHONE };

    return false;
};

METATYPES.DT_PROVINCE.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if(value in wordsCollections.province)
        return { name: METATYPES.DT_PROVINCE, correct_value:wordsCollections.province[value].correct_value };

    if(value in wordsCollections.province_abbreviation)
        return { name: METATYPES.DT_PROVINCE, correct_value:wordsCollections.province_abbreviation[value].correct_value };

    return false;
};

METATYPES.DT_REGION.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if(value in wordsCollections.regions)
        return { name: METATYPES.DT_REGION, correct_value:wordsCollections.regions[value].correct_value };

    return false;
};

METATYPES.DT_RELIGION.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if(wordsCollections.religions.indexOf(value)>=0)
        return { name: METATYPES.DT_RELIGION, correct_value:value };

    return false;
};

METATYPES.DT_SURNAME.evaluate = function (value) {
    value = value.toLowerCase();
    value = value.trim();

    if (value in wordsCollections.most_popular_italian_surnames){
        return { name: METATYPES.DT_SURNAME, correct_value:wordsCollections.most_popular_italian_surnames[value].correct_value };
    }

    return false;
};

METATYPES.DT_UNKNOWN.evaluate = function (value) {
    return { name: METATYPES.DT_UNKNOWN };
};

METATYPES.DT_URL.evaluate = function(value) {
    value = value.trim();

    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    if (regex.test(value))
        return { name: METATYPES.DT_URL };

    return false;
};

METATYPES.DT_ZIPCODE.evaluate = function(value) {
    value = value.trim();

    let regex = /^([0-9]{5})$/;

    if (regex.test(value))
        return { name: METATYPES.DT_ZIPCODE };

    return false;
};

//typos errors

function correct (words, value, f) {
    let corrections = [];

    for(let key in words){
        let current_datatype = f(key);
        if(current_datatype) {
            corrections.push({
                datatype: current_datatype.name,
                value: value,
                num_of_modifications: words[key],
                correction: key
            });
        }
    }
    return corrections;
}

METATYPES.DT_GENDER.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_GENDER.evaluate);
};

METATYPES.DT_MUNICIPALITY.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_MUNICIPALITY.evaluate);
};

METATYPES.DT_NAME.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_NAME.evaluate);
};

METATYPES.DT_PROVINCE.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_PROVINCE.evaluate);
};

METATYPES.DT_REGION.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_REGION.evaluate);
};

METATYPES.DT_RELIGION.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_RELIGION.evaluate);
};

METATYPES.DT_SURNAME.correct = function (words, value) {
    return correct(words, value, METATYPES.DT_SURNAME.evaluate);
};

//content privacy breach

function checkInText (value, regex, name) {
    let matchList = [];
    let match = regex.exec(value);
    while (match != null) {
        matchList.push({ name: name, value: value, match:match[0]});
        match = regex.exec(value);
    }

    return matchList;
}

METATYPES.DT_ADDRESS.checkInText = function (value) {
    let regex = /(via|viale|vico|corso|piazza|piazzetta)\s([a-z]+\s?)+([,°][ ]?)?\d*/ig;
    //v[.], c[.]so, p[.], p[.]zza

    value = value.toLowerCase();

    return checkInText(value, regex, METATYPES.DT_ADDRESS);
};

METATYPES.DT_CF.checkInText = function (value) {
    let regex = /(?:(?:[B-DF-HJ-NP-TV-Z]|[AEIOU])[AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]/ig;

    value = value.toLowerCase();

    return checkInText(value, regex, METATYPES.DT_CF);
};

METATYPES.DT_EMAIL.checkInText = function (value) {
    let regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

    value = value.toLowerCase();

    return checkInText(value, regex, METATYPES.DT_EMAIL);
};

METATYPES.DT_IBAN.checkInText = function (value) {
    let regex = /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/ig;

    value = value.replace(/\s/g,'');

    return checkInText(value, regex, METATYPES.DT_IBAN);
};

METATYPES.DT_MOBILEPHONE.checkInText = function(value)  {
    let regex = /(\((([+]|00)39)\)|(([+]|00)39))?((313)|(32[034789])|(33[013456789])|(34[02456789])|(36[0368])|(37[037])|(38[0389])|(39[0123]))([\d]{7})/g;

    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    return checkInText(value, regex, METATYPES.DT_MOBILEPHONE);
};

METATYPES.DT_PHONE.checkInText = function(value) {
    let regex = /(\((([+]|00)39)\)|(([+]|00)39))?0([\d]{11}|[\d]{10}|[\d]{9}|[\d]{8})/g;

    value = value.replace(/-/gm, '');
    value = value.replace(/\s/g,'');

    return checkInText(value, regex, METATYPES.DT_PHONE);
};

METATYPES.DT_ZIPCODE.checkInText = function(value) {
    let regex = /([0-9]{5})/g;

    return checkInText(value, regex, METATYPES.DT_ZIPCODE);
};