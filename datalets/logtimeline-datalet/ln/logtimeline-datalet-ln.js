export const LN_logtimeline = {
    userLanguage: 'en'
};

LN_logtimeline.init = function() {
    try {
        if (typeof ODE !== 'undefined' && ODE && ODE.user_language)
            LN_logtimeline.userLanguage = ODE.user_language;
        else if (parent && typeof parent.ODE !== 'undefined' && parent.ODE && parent.ODE.user_language)
            LN_logtimeline.userLanguage = parent.ODE.user_language;
        else
            LN_logtimeline.userLanguage = (navigator.language || navigator.userLanguage).split('-')[0];

        if(['en', 'it', 'fr', 'nl', 'es', 'cn'].indexOf(LN_logtimeline.userLanguage) === -1)
            LN_logtimeline.userLanguage = 'en';
    } catch (e) {
    }
};

LN_logtimeline.setUserLanguage = function(ln) {
    LN_logtimeline.userLanguage = ln;
};

LN_logtimeline.translate = function(text, ul = LN_logtimeline.userLanguage) {
    if(logtimeline_datalet_ln[text+"_"+ul])
        return logtimeline_datalet_ln[text+"_"+ul];
    else if (logtimeline_datalet_ln[text+"_en"])
        return logtimeline_datalet_ln[text+"_en"];
    else
        return text+"_"+ul;
};
let logtimeline_datalet_ln = [];

/*EN*/
logtimeline_datalet_ln["banner-text_en"] = "Unable to set alternative date reading: the number representing the month cannot be greater than 12";
logtimeline_datalet_ln["banner-button_en"] = "Continue in Standard reading";
logtimeline_datalet_ln["icon-link_en"] = "Open link in a window";
logtimeline_datalet_ln["title-link_en"] = "GO TO PAGE";
logtimeline_datalet_ln["error-page_en"] = "ERROR PAGE";
logtimeline_datalet_ln["error-title_en"] = "SELECTED PAGE NOT WORK";
logtimeline_datalet_ln["error-description_en"] = "The page you were looking for could not be found. It might have been removed, renamed, or did not exist in the first place";
/*IT*/
logtimeline_datalet_ln["banner-text_it"] = "Impossibile impostare l'alternative reading: Il numero che rappresenta il mese non può essere maggiore di 12";
logtimeline_datalet_ln["banner-button_it"] = "Continua in Standard reading";
logtimeline_datalet_ln["icon-link_it"] = "Apri il link in una finestra";
logtimeline_datalet_ln["title-link_it"] = "VAI ALLA PAGINA";
logtimeline_datalet_ln["error-page_it"] = "PAGINA DI ERRORE";
logtimeline_datalet_ln["error-title_it"] = "LA PAGINA SELEZIONATA NON FUNZIONA";
logtimeline_datalet_ln["error-description_it"] = "Impossibile trovare la pagina che stavi cercando. Potrebbe essere stata rimossa, rinominata o non esisteva in primo luogo";
/*FR*/
logtimeline_datalet_ln["banner-text_fr"] = "Impossible de définir le alternative lecture: le nombre représentant le mois ne peut pas être supérieur à 12";
logtimeline_datalet_ln["banner-button_fr"] = "continuer en lecture standard";
logtimeline_datalet_ln["icon-link_fr"] = "Afficher le lien dans une fenêtre";
logtimeline_datalet_ln["title-link_fr"] = "ALLER À LA PAGE";
logtimeline_datalet_ln["error-page_fr"] = "PAGE D'ERREUR";
logtimeline_datalet_ln["error-title_fr"] = "LA PAGE SÉLECTIONNÉE NE FONCTIONNE PAS";
logtimeline_datalet_ln["error-description_fr"] = "La page que vous recherchez est introuvable. Il a peut-être été supprimé, renommé ou n'existait pas en premier lieu";
/*ES*/
logtimeline_datalet_ln["banner-text_es"] = "No se puede establecer una lectura de fecha alternativa: el número que representa el mes no puede ser mayor que 12";
logtimeline_datalet_ln["banner-button_es"] = "Continuar en lectura estándar";
logtimeline_datalet_ln["icon-link_es"] = "Mostrar enlace en una ventana";
logtimeline_datalet_ln["title-link_es"] = "IR A LA PÁGINA";
logtimeline_datalet_ln["error-page_es"] = "PÁGINA DE ERRORES";
logtimeline_datalet_ln["error-title_es"] = "LA PÁGINA SELECCIONADA NO FUNCIONA";
logtimeline_datalet_ln["error-description_es"] = "No se pudo encontrar la página que estaba buscando. Podría haber sido eliminado, renombrado o no existía en primer lugar";
/*DE*/
logtimeline_datalet_ln["banner-text_de"] = "Es kann keine alternative Datumsanzeige eingestellt werden: Die Zahl, die den Monat darstellt, darf nicht größer als 12 sein";
logtimeline_datalet_ln["banner-button_de"] = "Fahren Sie mit der Standardlektüre fort";
logtimeline_datalet_ln["icon-link_de"] = "Link in einem Fenster anzeigen";
logtimeline_datalet_ln["title-link_de"] = "GEHE ZU SEITE";
logtimeline_datalet_ln["error-page_de"] = "FEHLERSEITE";
logtimeline_datalet_ln["error-title_de"] = "AUSGEWÄHLTE SEITE FUNKTIONIERT NICHT";
logtimeline_datalet_ln["error-description_de"] = "Die gesuchte Seite konnte nicht gefunden werden. Möglicherweise wurde es entfernt, umbenannt oder existierte gar nicht erst";
/*CN*/
logtimeline_datalet_ln["banner-text_cn"] = "無法設置替代日期讀數：代表月份的數字不能大於 12";
logtimeline_datalet_ln["banner-button_cn"] = "繼續標準閱讀";
logtimeline_datalet_ln["icon-link_cn"] = "在窗口中顯示鏈接";
logtimeline_datalet_ln["title-link_cn"] = "轉到頁面";
logtimeline_datalet_ln["error-page_cn"] = "錯誤頁面";
logtimeline_datalet_ln["error-title_cn"] = "所選頁面無效";
logtimeline_datalet_ln["error-description_cn"] = "找不到您要查找的頁面。 它可能已被刪除、重命名或最初不存在";
/*JA*/
logtimeline_datalet_ln["banner-text_ja"] = "代替の日付の読み取り値を設定できません：月を表す数値は12を超えることはできません";
logtimeline_datalet_ln["banner-button_ja"] = "標準的な読みに進む";
logtimeline_datalet_ln["icon-link_ja"] = "ウィンドウにリンクを表示";
logtimeline_datalet_ln["title-link_ja"] = "ページに移動";
logtimeline_datalet_ln["error-page_ja"] = "エラーページ";
logtimeline_datalet_ln["error-title_ja"] = "選択したページが機能しない";
logtimeline_datalet_ln["error-description_ja"] = "探していたページが見つかりませんでした。 削除されたか、名前が変更されたか、そもそも存在しなかった可能性があります";