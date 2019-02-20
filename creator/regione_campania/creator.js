RC = {};

$(function () {
    let ln = RC.ln();
    RC.injectHTML(ln);
    RC.init();
    RC.setListeners();
});

RC.ln  = function() {
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

RC.injectHTML  = function(ln, datasets) {
    $("body").append(
        '<demo-data-sevc-controllet'+
        ' id="controllet"'+
        ' components-url="../../COMPONENTS/"'+
        ' deep-url="../../DEEP/"'+
        ' datalets-list-url="../../DEEP/datalets-list"'+
        ' localization="'+ ln + '">'+
        '</demo-data-sevc-controllet>'
    );
};

RC.init = function() {
    $("#controllet").attr("datasets", JSON.stringify(datasets));
    $("#options")[0].innerHTML = "";
    $(".tab-content")[0].innerHTML = "LISTA DATASET REGIONE CAMPANIA";//todo ln
    $("#add_button").hide();

    $("button.outside").prop('disabled', true);
};

RC.setListeners = function() {
    document.addEventListener("select-inputs_isReady", RC.enableButtons);
    document.addEventListener("page-slider-controllet_selected", RC.toggleButtons);

    $("#btn_fullscreen").on("click", RC.fullscreen);
    $("#btn_download").on("click", RC.downloadModal);
    $("#btn_share").on("click", RC.shareModal);
    // $("#btn_html").on("click", RC.html);
    $("#btn_png").on("click", RC.png);
    $("#btn_doc").on("click", RC.doc);
    $("#btn_csv").on("click", RC.fcsv);
    // $("#btn_csv").on("click", RC.csv);
    // $("#btn_fcsv").on("click", RC.fcsv);
    $("#btn_embed").on("click", RC.embed);

    $("#download-modal .sm-modal-close").on("click", RC.closeDownloadModal);
    $("#share-modal .sm-modal-close").on("click", RC.closeShareModal);
};

RC.enableButtons  = function(e) {
    if(e.detail.isReady)
        $("button.outside").prop('disabled', false);
};

RC.toggleButtons  = function(e) {
    if(e.detail.selected == 2)
        $("button.outside").show();
    else
        $("button.outside").hide();
};

RC.closeDownloadModal = function() {
    $("#download-modal")[0].style.display = "none";
};

RC.closeShareModal = function() {
    $("#share-modal")[0].style.display = "none";
};

RC.fullscreen  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#fullscreen').click()
};

RC.downloadModal  = function() {
    // $("#btn_html")[0].style.display = $("[data-url]")[0].shadow_root.querySelector('#export_html').style.display;
    $("#btn_png")[0].style.display = $("[data-url]")[0].shadow_root.querySelector('#img-action').style.display;
    $("#btn_doc")[0].style.display = $("[data-url]")[0].shadow_root.querySelector('#doc-action').style.display;

    // $("#btn_close")[0].style.display = 'none';
    // if($("#btn_png")[0].style.display == 'none' && $("#btn_doc")[0].style.display == 'none')
    //     $("#btn_close")[0].style.display = 'block';

    $("#download-modal")[0].style.display = "flex";
};

RC.shareModal  = function() {
    $("#share-modal")[0].style.display = "flex";
};

RC.html  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#export_to_html').click();
    $("#download-modal")[0].style.display = "none";
};

RC.png  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#img-action').click();
    $("#download-modal")[0].style.display = "none";
};

RC.doc  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#doc-action').click();
    $("#download-modal")[0].style.display = "none";
};

RC.csv  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#csv-action').click();
    $("#download-modal")[0].style.display = "none";
};

RC.fcsv  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#csv_filtered-action').click();
    $("#download-modal")[0].style.display = "none";
};

RC.embed  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#embed').click();
    $("#btn_embed")[0].setAttribute("data-balloon", "Copiato!");
    setTimeout(function(){ $("#btn_embed")[0].setAttribute("data-balloon", "Clicca per copiare l'HTML"); }, 3000);
};