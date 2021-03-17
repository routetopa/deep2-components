CREATOR = {};

CREATOR.ln  = function() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let ln = url.searchParams.get("ln");

    if(!ln)
        ln = (navigator.language || navigator.userLanguage).split('-')[0];

    if(['en', 'it', 'fr', 'nl', 'es', 'cn'].indexOf(ln) == -1)
        ln = 'en';

    if(ln == 'es')
        ln = 'es-ES';

    return ln;
};

CREATOR.injectHTML  = function(ln, datasets) {
    $("body").append(
        '<demo-data-sevc-controllet'+
        ' id="controllet"'+
        ' components-url="../COMPONENTS/"'+
        ' deep-url="../DEEP/"'+//http://deep.routetopa.eu/deep2t/DEEP/
        ' datalets-list-url="../DEEP/datalets-list"'+
        ' localization="'+ ln + '">'+
        '</demo-data-sevc-controllet>'
    );
};

CREATOR.init = async function() {
    if(!datasets)
        datasets = await CREATE_CACHE.init();

    $("#controllet").attr("datasets", JSON.stringify(datasets));
    setTimeout(() => {
        if($("#options").length && Object.keys(datasets).length < 2)
            $("#options")[0].innerHTML = "";
        $("button.outside").prop('disabled', true);
    }, 1000);
};

CREATOR.translate = function() {
    if(!LN)
        return;
    $('#btn_share').attr("data-balloon", LN.translate("btn_share"));
    $('#btn_download').attr("data-balloon", LN.translate("btn_download"));
    $('#btn_embed').attr("data-balloon", LN.translate("btn_embed"));
    $('#btn_fullscreen').attr("data-balloon", LN.translate("btn_fullscreen"));

    $('#btn_png').text(LN.translate("btn_png"));
    $('#btn_doc').text(LN.translate("btn_doc"));
    $('#btn_csv').text(LN.translate("btn_csv"));

    $('#label_fb').text(LN.translate("label_fb"));
    $('#label_tw').text(LN.translate("label_tw"));
    $('#label_li').text(LN.translate("label_li"));
    $('#label_pn').text(LN.translate("label_pn"));
    $('#label_ml').text(LN.translate("label_ml"));
};

CREATOR.setListeners = function() {
    document.addEventListener("select-inputs_isReady", CREATOR.enableButtons);
    document.addEventListener("page-slider-controllet_selected", CREATOR.toggleButtons);

    $("#btn_fullscreen").on("click", CREATOR.fullscreen);
    $("#btn_download").on("click", CREATOR.downloadModal);
    $("#btn_share").on("click", CREATOR.shareModal);
    // $("#btn_html").on("click", CREATOR.html);
    $("#btn_png").on("click", CREATOR.png);
    $("#btn_doc").on("click", CREATOR.doc);
    $("#btn_csv").on("click", CREATOR.fcsv);
    // $("#btn_csv").on("click", CREATOR.csv);
    // $("#btn_fcsv").on("click", CREATOR.fcsv);
    $("#btn_embed").on("click", CREATOR.embed);

    $("#btn_fb").on("click", CREATOR.share_fb);

    $("#download-modal .sm-modal-close").on("click", CREATOR.closeDownloadModal);
    $("#share-modal .sm-modal-close").on("click", CREATOR.closeShareModal);
};

CREATOR.enableButtons  = function(e) {
    if(e.detail.isReady)
        $("button.outside").prop('disabled', false);
};

CREATOR.toggleButtons  = function(e) {
    if(e.detail.selected == 2) {
        $("button.outside").show();
        $("div.outside").show();
    } else {
        $("button.outside").hide();
        $("div.outside").hide();
    }
};

CREATOR.closeDownloadModal = function() {
    $("#download-modal")[0].style.display = "none";
};

CREATOR.closeShareModal = function() {
    $("#share-modal")[0].style.display = "none";
};

CREATOR.fullscreen  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#fullscreen').click()
};

CREATOR.downloadModal  = function() {
    // $("#btn_html")[0].style.display = $("[data-url]")[0].shadow_root.querySelector('#export_html').style.display;
    $("#btn_png")[0].style.display = $("[selectedfields]")[0].shadow_root.querySelector('#img-action').style.display;
    $("#btn_doc")[0].style.display = $("[selectedfields]")[0].shadow_root.querySelector('#doc-action').style.display;

    // $("#btn_close")[0].style.display = 'none';
    // if($("#btn_png")[0].style.display == 'none' && $("#btn_doc")[0].style.display == 'none')
    //     $("#btn_close")[0].style.display = 'block';

    $("#download-modal")[0].style.display = "flex";
};

CREATOR.shareModal  = function() {
    $("#share-modal")[0].style.display = "flex";
};

CREATOR.html  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#export_to_html').click();
    $("#download-modal")[0].style.display = "none";
};

CREATOR.png  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#img-action').click();
    $("#download-modal")[0].style.display = "none";
};

CREATOR.doc  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#doc-action').click();
    $("#download-modal")[0].style.display = "none";
};

CREATOR.csv  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#csv-action').click();
    $("#download-modal")[0].style.display = "none";
};

CREATOR.fcsv  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#csv_filtered-action').click();
    $("#download-modal")[0].style.display = "none";
};

CREATOR.embed  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#embed').click();
    $("#btn_embed")[0].setAttribute("data-balloon", "Copied"); /*Copiato!*/
    setTimeout(function(){ $("#btn_embed")[0].setAttribute("data-balloon", "Click to Copy HTML"); }, 3000);
};

CREATOR.share_fb = async function() {
    let svg = $("[selectedfields]")[0].shadow_root.querySelector('svg');

    if (!svg && $("[selectedfields]")[0].tagName !== "LEAFLETJS-DATALET") {
        alert(LN.translate("fb1"));
        return;
    }

    alert(LN.translate("fb2"));

    let png = await $("[selectedfields]")[0].create_image(svg);

    if ($("[selectedfields]")[0].tagName !== "LEAFLETJS-DATALET") {
        let download = document.createElement('a');
        download.href = png;
        download.download = `facebook_upload.png`;
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
    }

    let temp = document.createElement("textarea")
    document.getElementsByTagName("body")[0].appendChild(temp);
    temp.value =
        $("[selectedfields]")[0].datalettitle+'\n' +
        $("[selectedfields]")[0].description+'\n' +
        "Visualizzazione '" + $("[selectedfields]")[0].tagName + "' costruita sui dati provenienti da " + ($("[selectedfields]").attr('data-url').split("/")[2]).split(':')[0];
    temp.select();
    document.execCommand("copy");
    document.getElementsByTagName("body")[0].removeChild(temp);

    window.open("https://m.facebook.com/", "", "top=540,left=540,width=720,height=540");
};