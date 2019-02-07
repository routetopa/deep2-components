RC = {};

$(function () {
    RC.init();
    RC.setListeners();
});

RC.init = function() {
    // eg. --> http://172.16.15.128/DEEP2/COMPONENTS/creator_from.html?data-url=http://ckan.routetopa.eu:8080/api/3/action/datastore_search?resource_id=e5acc3cc-06d0-4520-b1d7-fbf29da29c02
    let url_string = window.location.href;
    let url = new URL(url_string);
    let dataUrl = url.searchParams.get("data-url");

    $("#controllet").attr("data-url", dataUrl);
    $("#controllet")[0].ready();

    $("#options")[0].innerHTML = "";
    $(".tab-content")[0].innerHTML = "DATASETS";
    $("#add_button").hide();

    $("button.outside").prop('disabled', true);
};

RC.setListeners = function() {
    document.addEventListener("select-inputs_isReady", RC.enableButtons);
    document.addEventListener("page-slider-controllet_selected", RC.toggleButtons);

    $("#copy_html").on("click", RC.copyHtml);
    $("#save_img").on("click", RC.saveImg);
    $("#fullscreen_preview").on("click", RC.fullscreenPreview);
};

RC.enableButtons  = function() {
    $("button.outside").prop('disabled', false);
};

RC.toggleButtons  = function(e) {
    if(e.detail.selected == 1)
        $("button.outside").show();
    else
        $("button.outside").hide();
};

RC.copyHtml  = function() {debugger
    $("[selectedfields]")[0].shadow_root.querySelector('#export_to_html').click()
};

RC.saveImg  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#export_to_png').click()
};

RC.fullscreenPreview  = function() {
    $("[selectedfields]")[0].shadow_root.querySelector('#fullscreen').click()
};