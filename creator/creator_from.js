CREATOR_FROM = {};

CREATOR_FROM.injectHTML  = function(ln, datasets) {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let dataUrl = url.searchParams.get("data-url");
    let limit = url.searchParams.get("limit");

    if(limit)
        dataUrl += '&limit=' + limit;

    $("body").append(
        '<co-datalets-creator-controllet'+
        ' id="controllet"'+
        ' components-url="../COMPONENTS/"'+
        ' deep-url="../DEEP/"'+
        ' datalets-list-url="../DEEP/datalets-list"'+
        ' data-url="'+ dataUrl + '"'+
        ' localization="'+ ln + '">'+
        '</co-datalets-creator-controllet>'
    );
};

CREATOR_FROM.init = function() {
    setTimeout(() => {
        $("button.outside").prop('disabled', true);
    }, 1000);
};

CREATOR_FROM.setListeners = function() {
    document.addEventListener("select-inputs_isReady", CREATOR.enableButtons);
    document.addEventListener("page-slider-controllet_selected", CREATOR_FROM.toggleButtons);

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

CREATOR_FROM.toggleButtons  = function(e) {
    if(e.detail.selected == 1) {
        $("button.outside").show();
        $("div.outside").show();
    }
    else {
        $("button.outside").hide();
        $("div.outside").hide();
    }
};