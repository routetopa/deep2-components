export const LN = {
    userLanguage: 'en'
};

LN.init = function() {
    try {
        if (typeof ODE !== 'undefined' && ODE && ODE.user_language)
            LN.userLanguage = ODE.user_language;
        else if (parent && typeof parent.ODE !== 'undefined' && parent.ODE && parent.ODE.user_language)
            LN.userLanguage = parent.ODE.user_language;
        else
            LN.userLanguage = (navigator.language || navigator.userLanguage).split('-')[0];

        if(['en', 'it', 'fr', 'nl', 'es', 'cn'].indexOf(LN.userLanguage) == -1)
            LN.userLanguage = 'en';
    } catch (e) {
        console.log(e);
    }
};

LN.setUserLanguage = function(ln) {
    LN.userLanguage = ln;
};

LN.translate = function(text, ul = LN.userLanguage) {
    if(base_datalet_ln[text+"_"+ul])
        return base_datalet_ln[text+"_"+ul];
    else if (base_datalet_ln[text+"_en"])
        return base_datalet_ln[text+"_en"];
    else
        return text+"_"+ul;
};

let base_datalet_ln = [];

/** EN **/

base_datalet_ln["save_as_en"]       = "Save As...";
base_datalet_ln["copy_link_en"]     = "Click to Copy Link";
base_datalet_ln["copy_html_en"]     = "Click to Copy HTML";
base_datalet_ln["fullscreen_en"]    = "Fullscreen";
base_datalet_ln["copied_en"]        = "Copied";

base_datalet_ln["image_en"]         = "Save as Image (.png)";
base_datalet_ln["document_en"]      = "Save as Document (.docx)";
base_datalet_ln["full_csv_en"]      = "Save Full Dataset (.csv)";
base_datalet_ln["filtered_csv_en"]  = "Save Filtered Dataset (.csv)";
base_datalet_ln["save_in_en"]       = "Save in";
base_datalet_ln["my_space_en"]      = "My Space";

base_datalet_ln["width_en"]         = "Width (px):";
base_datalet_ln["height_en"]        = "Height (px):";
base_datalet_ln["presets_en"]       = "Presets:";
base_datalet_ln["download_en"]      = "Download";

base_datalet_ln["data_source_en"]   = "Provider:";
base_datalet_ln["data_source_b_en"] = "The visualization takes the data from the provider at this link";
base_datalet_ln["data_en"]          = "Data:";
base_datalet_ln["data_b_en"]        = "The visualization is based on the data at this link";

base_datalet_ln["live_en"]          = "LIVE";
base_datalet_ln["data_is_live_en"]  = "Data is live, click to use cached data";

base_datalet_ln["cache_en"]         = "CACHE";
base_datalet_ln["disable_cache_en"] = "Data is cached, click to use live data";

base_datalet_ln["proxy_en"]         = "PROXY";
base_datalet_ln["proxied_en"]       = "Data is proxied by ";

base_datalet_ln["error_en"]         = "Sorry, something didn't work right";

/** IT **/

base_datalet_ln["save_as_it"]       = "Salva come...";
base_datalet_ln["copy_link_it"]     = "Clicca per copiare il link";
base_datalet_ln["copy_html_it"]     = "Clicca per copiare l'HTML";
base_datalet_ln["fullscreen_it"]    = "A tutto schermo";
base_datalet_ln["copied_it"]        = "Copiato";

base_datalet_ln["image_it"]         = "Salva immagine (.png)";
base_datalet_ln["document_it"]      = "Salva documento (.docx)";
base_datalet_ln["full_csv_it"]      = "Salva dataset completo (.csv)";
base_datalet_ln["filtered_csv_it"]  = "Salva dataset filtrato (.csv)";
base_datalet_ln["save_in_it"]       = "Salva nello";
base_datalet_ln["my_space_it"]      = "Spazio privato";

base_datalet_ln["width_it"]         = "Larghezza (px):";
base_datalet_ln["height_it"]        = "Altezza (px):";
base_datalet_ln["presets_it"]       = "Preset:";
base_datalet_ln["download_it"]      = "Scarica";

base_datalet_ln["data_source_it"]   = "Provider:";
base_datalet_ln["data_source_b_it"] = "La visualizzazione prende i dati dal provider a questo link";
base_datalet_ln["data_it"]          = "Dati:";
base_datalet_ln["data_b_it"]        = "La visualizzazione è basata sui dati a questo link";

base_datalet_ln["live_it"]          = "LIVE";
base_datalet_ln["data_is_live_it"]  = "I dati sono live, clicca per usare i dati cached";

base_datalet_ln["cache_it"]         = "CACHE";
base_datalet_ln["disable_cache_it"] = "I dati sono cached, clicca per usare i dati live";

base_datalet_ln["proxy_it"]         = "PROXY";
base_datalet_ln["proxied_it"]       = "I dati sono inoltrati da ";

base_datalet_ln["error_it"]         = "Siamo spiacenti, qualcosa non ha funzionato correttamente";

/** FR **/

/** NL **/

/** ES **/

/** (Simplified) CN **/