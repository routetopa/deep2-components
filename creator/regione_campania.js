RC = {}

$(function () {
    RC.init();
    RC.setListeners();
});

RC.init = function() {
    $("#controllet").attr("datasets", JSON.stringify(datasets));
    $("#options")[0].innerHTML = "";
    $(".tab-content")[0].innerHTML = "DATASETS GIUNTA REGIONE CAMPANIA";
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
    if(e.detail.selected == 2)
        $("button.outside").show();
    else
        $("button.outside").hide();
};

RC.copyHtml  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#export_to_html').click()
};

RC.saveImg  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#export_to_png').click()
};

RC.fullscreenPreview  = function() {
    $("[data-url]")[0].shadow_root.querySelector('#fullscreen').click()
};