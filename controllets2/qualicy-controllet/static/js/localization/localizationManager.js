export default class localizationManager {

    constructor() {
        this.supportedLanguages = ['en', 'it'];
        this.userLanguage = this.userLanguage = (navigator.language || navigator.userLanguage).split('-')[0];

        if(this.supportedLanguages.indexOf(this.userLanguage) == -1)
            this.userLanguage = 'en';
    }

    setUserLanguage = function(ln) {
        if(this.supportedLanguages.indexOf(this.userLanguage) == -1)
            console.log(ln+" not supported");
        else
            this.userLanguage = ln;
    };

    translate = function(key, ln = this.userLanguage) {
        if(QUALICY_LN[key+"_"+ln])
            return QUALICY_LN[key+"_"+ln];
        else if (QUALICY_LN[key+"_en"])
            return QUALICY_LN[key+"_en"];
        else
            return key+"_"+ln;
    };
};

const QUALICY_LN = [];

/** EN **/

QUALICY_LN["column_en"] = "Column";

/** IT **/

QUALICY_LN["column_it"] = "Colonna";