RC = {};

RC.injectHTML = function(ln, datasets) {
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

RC.init = async function() {
    if(!datasets)
        datasets = await CREATE_CACHE.init();

    $("#controllet").attr("datasets", JSON.stringify(datasets));
    setTimeout(() => {
        if($("#options").length && Object.keys(datasets).length < 2)
            $("#options")[0].innerHTML = "";
        $(".tab-content")[0].innerHTML = "LISTA DATASET REGIONE CALABRIA";//todo ln

        $("button.outside").prop('disabled', true);
    }, 1000);
};