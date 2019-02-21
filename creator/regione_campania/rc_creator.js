RC = {};

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