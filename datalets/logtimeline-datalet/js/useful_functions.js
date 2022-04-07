function checkStructureJson(data){
    if(!isDateNameStructure(data)){
        let newData = [];
        let names = getMatrixData(data);
        $.each(names, function (i){
            let objEl = {
                "data" : getArrayElFromMatrix(names, i),
                "name" : names[i][0]
            };
            newData.push(objEl);
        });
        data = newData;
    }
    return data;
}
function getArrayElFromMatrix(names, i){
    let temp = names[i];
    let pos = [];
    let result = [];
    $.each(names, function (j) {
        if(names[j][0] === temp[0]){
            pos.push(j);
        }
    });

    $.each(pos, function (j) {
        result.push(names[pos[j]][1]);
    });
    return result;
}
function getMatrixData(data){
    let names = [];
    $.each(data, function (i){
        let el = data[i];
        for(let name in el){
            names.push([name, el[name]]);
        }
    });
    return names;
}
function isDateNameStructure(data){
    return data[0].data !== undefined && data[0].name !== undefined;
}