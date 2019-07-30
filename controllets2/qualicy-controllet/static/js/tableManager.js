export default class TableManager {

    constructor(ranking_table, menu, qualicyModal, columnModal) {
        this.data = [];
        this.ranking_table = ranking_table;
        this.qualicyModal = qualicyModal;
        this.columnStatsModal = columnModal;
        this.menu = menu;
        this.currentTypos = menu.querySelector('#currentTypo');
        this.currentNullCell = menu.querySelector('#currentNull');
        this.currentMismatchDatatypes = menu.querySelector('#currentMismatchDatatypes');
        this.currentMismatchMetadatatypes = menu.querySelector('#currentMismatchMetadatatypes');
        this.currentMissingMetadatatypes = menu.querySelector('#currentMissingMetadatatypes');
        this.currentContentPrivacyBreach = menu.querySelector('#currentContentPrivacyBreach');
        this.currentStructuralPrivacyBreach = menu.querySelector('#qualicy-tab-2');
        this.pageLength = 25;
    }

    redrawDataTable  = function () {
        this.dataTable.draw();
    };

    initDataTable = function (data, data_url) {
        // let _self = this;
        this.data = data || data_url; //todo data_url

        let columns = [];
        // let columnsDef = [];
        for(let columnName in data[0]){
            columns.push({data:columnName, title:columnName, name:columnName});
            // columnsDef.push({
            //     "targets": [columnName],
            //     "render": function (data, type, row, meta) {
            //         debugger
            //         //let title = _self.dataTable.columns( meta.col ).header();
            //         //let columnName = $(title).html();
            //         //var url = 'tom.html?office='+row[2]+'?filter='+columnName.toLowerCase();
            //         //return '<a href="'+url.trim()+'">'+data+'</a>';
            //         return '<div class="columns_warnings"></div>'+data;
            //     }
            // })
        }

        this.dataTable = $(this.ranking_table).DataTable( {
            // deferRender: true, //todo + drawCallback
            data: this.data,
            columns: columns,
            scrollX: 'auto',
            scrollY: $(this.menu).height() - 135 - 48,
            order: [],
            rowId: '_id',
            pageLength: this.pageLength,
            keys: true ,//?
            // columnDefs: columnsDef
        });

        this.dataTable.on( 'length.dt', function ( e, settings, len ) {
            this.pageLength = len;
        });

        //console.log($.fn.dataTable.KeyTable);
    };

    fillInTypoStats = function(typos) {
        this.counterTypo = -1;

        for(let typoIndex in typos){
            let typo = typos[typoIndex];
            let row = typo.i;
            let column = typo.j;
            $(this.dataTable.cell(row, column).node()).addClass('typo');
        }

        this.currentTypos.innerText = '0 / ' + typos.length;

        $(this.menu.querySelector('#prevTypo')).on( 'click', function () {
            debugger
            if(this.counterTypo<0)
                this.counterTypo = typos.length-1;
            else
                this.counterTypo = ((this.counterTypo -1) % typos.length + typos.length) %  typos.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(typos[this.counterTypo].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(typos[this.counterTypo].i,typos[this.counterTypo].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentTypos.innerText = (this.counterTypo + 1) + ' / ' + typos.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextTypo')).on( 'click', function () {
            if(this.counterTypo<0)
                this.counterTypo = 0;
            else
                this.counterTypo = (this.counterTypo + 1) %  typos.length;

            this.dataTable.page( Math.floor(typos[this.counterTypo].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(typos[this.counterTypo].i,typos[this.counterTypo].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentTypos.innerText = (this.counterTypo + 1) + ' / ' + typos.length;
        }.bind(this) );
    }

    fillInDatatypeStats = function(nullCells, mismatchDatatypes) {
        this.fillInNullCells(nullCells);
        this.fillInMismatchDatatypes(mismatchDatatypes);
    }

    fillInNullCells = function(nullCells) {
        if(nullCells.length == 0){
            this.currentNullCell.innerText = '0/0';
            $(this.menu.querySelector('#prevNull')).addClass('disabled');
            $(this.menu.querySelector('#nextNull')).addClass('disabled');
            return;
        }

        this.counterNullCells = -1;


        for(let nullIndex in nullCells){
            let nullCell = nullCells[nullIndex];
            let row = nullCell.rowIndex;
            let column = nullCell.columnIndex;
            $(this.dataTable.cell(row, column).node()).addClass('datatypeInconsistency');
        }

        this.currentNullCell.innerText = '0 / ' + nullCells.length;

        $(this.menu.querySelector('#prevNull')).on( 'click', function () {
             
            if(this.counterNullCells<0)
                this.counterNullCells = nullCells.length-1;
            else
                this.counterNullCells = ((this.counterNullCells -1) % nullCells.length + nullCells.length) %  nullCells.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(nullCells[this.counterNullCells].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(nullCells[this.counterNullCells].rowIndex,nullCells[this.counterNullCells].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentNullCell.innerText = (this.counterNullCells + 1) + ' / ' + nullCells.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextNull')).on( 'click', function () {
             
            if(this.counterNullCells<0)
                this.counterNullCells = 0;
            else
                this.counterNullCells = (this.counterNullCells + 1) %  nullCells.length;

            this.dataTable.page( Math.floor(nullCells[this.counterNullCells].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(nullCells[this.counterNullCells].rowIndex,nullCells[this.counterNullCells].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentNullCell.innerText = (this.counterNullCells + 1) + ' / ' + nullCells.length;
        }.bind(this) );
    }

    fillInMismatchDatatypes = function(mismatchDatatypes) {
        if(mismatchDatatypes.length == 0){
            this.currentMismatchDatatypes.innerText = '0/0';
            $(this.menu.querySelector('#prevMismatchDatatypes')).addClass('disabled');
            $(this.menu.querySelector('#nextMismatchDatatypes')).addClass('disabled');
            return;
        }

        this.counterMismatchDatatypes = -1;

        for(let index in mismatchDatatypes){
            let cell = mismatchDatatypes[index];
            let row = cell.rowIndex;
            let column = cell.columnIndex;
            $(this.dataTable.cell(row, column).node()).addClass('datatypeInconsistency');
        }

        this.currentMismatchDatatypes.innerText = '0 / ' + mismatchDatatypes.length;

        $(this.menu.querySelector('#prevMismatchDatatypes')).on( 'click', function () {
             
            if(this.counterMismatchDatatypes<0)
                this.counterMismatchDatatypes = mismatchDatatypes.length-1;
            else
                this.counterMismatchDatatypes = ((this.counterMismatchDatatypes -1) % mismatchDatatypes.length + mismatchDatatypes.length) %  mismatchDatatypes.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex,mismatchDatatypes[this.counterMismatchDatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchDatatypes.innerText = (this.counterMismatchDatatypes + 1) + ' / ' + mismatchDatatypes.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextMismatchDatatypes')).on( 'click', function () {
             
            if(this.counterMismatchDatatypes<0)
                this.counterMismatchDatatypes = 0;
            else
                this.counterMismatchDatatypes = (this.counterMismatchDatatypes + 1) %  mismatchDatatypes.length;

            this.dataTable.page( Math.floor(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex,mismatchDatatypes[this.counterMismatchDatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchDatatypes.innerText = (this.counterMismatchDatatypes + 1) + ' / ' + mismatchDatatypes.length;
        }.bind(this) );
    }

    fillInMetaDatatypeStats = function(mismatchMetadatatypes, missingMetadatatypes) {
        this.fillInMismatchMetadatatypes(mismatchMetadatatypes);
        this.fillInMissingMetadatatypes(missingMetadatatypes);
    }

    fillInMismatchMetadatatypes = function(mismatchMetadatatypes) {
        if(mismatchMetadatatypes.length == 0){
            this.currentMismatchMetadatatypes.innerText = '0/0';
            $(this.menu.querySelector('#prevMismatchMetadatatypes')).addClass('disabled');
            $(this.menu.querySelector('#nextMismatchMetadatatypes')).addClass('disabled');
            return;
        }

        this.counterMismatchMetadatatypes = -1;

        for(let index in mismatchMetadatatypes){
            let cell = mismatchMetadatatypes[index];
            let row = cell.rowIndex;
            let column = cell.columnIndex;
            $(this.dataTable.cell(row, column).node()).addClass('metadatatypeInconsistency');
        }

        this.currentMismatchMetadatatypes.innerText = '0 / ' + mismatchMetadatatypes.length;

        $(this.menu.querySelector('#prevMismatchMetadatatypes')).on( 'click', function () {
             
            if(this.counterMismatchMetadatatypes<0)
                this.counterMismatchMetadatatypes = mismatchMetadatatypes.length-1;
            else
                this.counterMismatchMetadatatypes = ((this.counterMismatchMetadatatypes -1) % mismatchMetadatatypes.length + mismatchMetadatatypes.length) %  mismatchMetadatatypes.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex,mismatchMetadatatypes[this.counterMismatchMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchMetadatatypes.innerText = (this.counterMismatchMetadatatypes + 1) + ' / ' + mismatchMetadatatypes.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextMismatchMetadatatypes')).on( 'click', function () {
             
            if(this.counterMismatchMetadatatypes<0)
                this.counterMismatchMetadatatypes = 0;
            else
                this.counterMismatchMetadatatypes = (this.counterMismatchMetadatatypes + 1) %  mismatchMetadatatypes.length;

            this.dataTable.page( Math.floor(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex,mismatchMetadatatypes[this.counterMismatchMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchMetadatatypes.innerText = (this.counterMismatchMetadatatypes + 1) + ' / ' + mismatchMetadatatypes.length;
        }.bind(this) );
    }

    fillInMissingMetadatatypes = function(missingMetadatatypes) {
        if(missingMetadatatypes.length == 0){
            this.currentMissingMetadatatypes.innerText = '0/0';
            $(this.menu.querySelector('#prevMissingMetadatatypes')).addClass('disabled');
            $(this.menu.querySelector('#nextMissingMetadatatypes')).addClass('disabled');
            return;
        }

        this.counterMissingMetadatatypes = -1;

        for(let index in missingMetadatatypes){
            let cell = missingMetadatatypes[index];
            let row = cell.rowIndex;
            let column = cell.columnIndex;
            $(this.dataTable.cell(row, column).node()).addClass('metadatatypeInconsistency');
        }

        this.currentMissingMetadatatypes.innerText = '0 / ' + missingMetadatatypes.length;

        $(this.menu.querySelector('#prevMissingMetadatatypes')).on( 'click', function () {
             
            if(this.counterMissingMetadatatypes<0)
                this.counterMissingMetadatatypes = missingMetadatatypes.length-1;
            else
                this.counterMissingMetadatatypes = ((this.counterMissingMetadatatypes -1) % missingMetadatatypes.length + missingMetadatatypes.length) %  missingMetadatatypes.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex,missingMetadatatypes[this.counterMissingMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMissingMetadatatypes.innerText = (this.counterMissingMetadatatypes + 1) + ' / ' + missingMetadatatypes.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextMissingMetadatatypes')).on( 'click', function () {
             
            if(this.counterMissingMetadatatypes<0)
                this.counterMissingMetadatatypes = 0;
            else
                this.counterMissingMetadatatypes = (this.counterMissingMetadatatypes + 1) %  missingMetadatatypes.length;

            this.dataTable.page( Math.floor(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex,missingMetadatatypes[this.counterMissingMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMissingMetadatatypes.innerText = (this.counterMissingMetadatatypes + 1) + ' / ' + missingMetadatatypes.length;
        }.bind(this) );
    }

    fillInContentPrivacyBreachesStats = function(contentPrivacyBreachStats) {
        if(contentPrivacyBreachStats.length == 0){
            this.currentContentPrivacyBreach.innerText = '0/0';
            $(this.menu.querySelector('#prevContentPrivacyBreach')).addClass('disabled');
            $(this.menu.querySelector('#nextContentPrivacyBreach')).addClass('disabled');
            return;
        }

        this.counterContentPrivacyBreach = -1;

        for(let index in contentPrivacyBreachStats){
            let cell = contentPrivacyBreachStats[index];
            let row = cell.i;
            let column = cell.j;
            $(this.dataTable.cell(row, column).node()).addClass('contentPrivacyBreach');
        }

        this.currentContentPrivacyBreach.innerText = '0 / ' + contentPrivacyBreachStats.length;

        $(this.menu.querySelector('#prevContentPrivacyBreach')).on( 'click', function () {
             
            if(this.counterContentPrivacyBreach<0)
                this.counterContentPrivacyBreach = contentPrivacyBreachStats.length-1;
            else
                this.counterContentPrivacyBreach = ((this.counterContentPrivacyBreach -1) % contentPrivacyBreachStats.length + contentPrivacyBreachStats.length) %  contentPrivacyBreachStats.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i,contentPrivacyBreachStats[this.counterContentPrivacyBreach].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentContentPrivacyBreach.innerText = (this.counterContentPrivacyBreach + 1) + ' / ' + contentPrivacyBreachStats.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextContentPrivacyBreach')).on( 'click', function () {
             
            if(this.counterContentPrivacyBreach<0)
                this.counterContentPrivacyBreach = 0;
            else
                this.counterContentPrivacyBreach = (this.counterContentPrivacyBreach + 1) %  contentPrivacyBreachStats.length;

            this.dataTable.page( Math.floor(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i,contentPrivacyBreachStats[this.counterContentPrivacyBreach].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 300);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentContentPrivacyBreach.innerText = (this.counterContentPrivacyBreach + 1) + ' / ' + contentPrivacyBreachStats.length;
        }.bind(this) );
    }

    fillInStructuralPrivacyBreachesStats = function(structuralPrivacyBreachStats) {
        for(let index in structuralPrivacyBreachStats){
            let structuralPrivacyBreach = structuralPrivacyBreachStats[index];

            let div = document.createElement("DIV");
            let textnode = document.createTextNode(Object.keys(structuralPrivacyBreach.breach).join(' '));
            div.appendChild(textnode);

            let list_of_arrays = [];
            for(let key in structuralPrivacyBreach.breach){
                let value = structuralPrivacyBreach.breach[key];
                list_of_arrays.push(value);
            }

            let list_of_all_the_combinations = this.cartesianProduct(list_of_arrays);

            let ul = document.createElement("UL");
            for(let i=0; i<list_of_all_the_combinations.length; i++) {
                let li = document.createElement("LI");
                let textnode = document.createTextNode(list_of_all_the_combinations[i].join(' '));

                li.appendChild(textnode);
                ul.appendChild(li);

            }
            div.appendChild(ul);

            textnode = document.createTextNode(structuralPrivacyBreach.warning);
            div.appendChild(textnode);

            this.currentStructuralPrivacyBreach.appendChild(div);
        }

    }

    fillInCellStats = function(annotatedDataset) {
        this.annotatedDataset = annotatedDataset;

        let _self = this;
        this.dataTable.on('click', 'tbody td', function(){
            $(_self.qualicyModal).removeClass('modal-close');
            $(_self.qualicyModal).addClass('modal-open');

            let row = _self.dataTable.cell(this).index().row;
            let column = _self.dataTable.cell(this).index().column;

            let cellAnnotations = _self.annotatedDataset[row][column];

            _self.qualicyModal.querySelector('#modal-value').innerText = cellAnnotations.value;
            _self.qualicyModal.querySelector('#modal-datatype').innerText = cellAnnotations.datatype.name;
            _self.qualicyModal.querySelector('#modal-metadatatype').innerText = cellAnnotations.metatype.name;

            if('typosCorrection' in cellAnnotations){
                let ul = document.createElement("UL");
                for(let i=0; i<cellAnnotations.typosCorrection.length; i++){
                    let li = document.createElement("LI");

                    let span1 = document.createTextNode(cellAnnotations.typosCorrection[i].correction);
                    let span2 = document.createTextNode(" [" + cellAnnotations.typosCorrection[i].datatype.name + "]");

                    li.appendChild(span1);
                    li.appendChild(span2);

                    ul.appendChild(li);

                }
                _self.qualicyModal.querySelector('#modal-typos').innerHTML = "";
                _self.qualicyModal.querySelector('#modal-typos').appendChild(ul);
            }
            else
                _self.qualicyModal.querySelector('#modal-typos').innerHTML = '<i class="fas fa-check"></i>';

            if('contentPrivacyBreaches' in cellAnnotations){
                let ul = document.createElement("UL");
                for(let i=0; i<cellAnnotations.contentPrivacyBreaches.length; i++){
                    let li = document.createElement("LI");

                    let span1 = document.createTextNode(cellAnnotations.contentPrivacyBreaches[i].match);
                    let span2 = cellAnnotations.contentPrivacyBreaches[i].datatype ? document.createTextNode(" [" + cellAnnotations.contentPrivacyBreaches[i].datatype.name + "]") : "?";

                    li.appendChild(span1);
                    li.appendChild(span2);

                    ul.appendChild(li);

                }
                _self.qualicyModal.querySelector('#modal-contentPrivacyBreach').innerHTML = "";
                _self.qualicyModal.querySelector('#modal-contentPrivacyBreach').appendChild(ul);
            }
            else
                _self.qualicyModal.querySelector('#modal-contentPrivacyBreach').innerHTML = '<i class="fas fa-check"></i>';

        });
    }

    fillInColumnStats = function(columnStats, structuralPrivacyBreaches) {
        this.columnStats = columnStats;

        for(let columnName in this.columnStats.COLUMN_STATS){
            let className = "";

            let columnData = this.columnStats.COLUMN_STATS[columnName];

            if(this.isColumnInvolvedInStructuralPrivacyBreach(columnData.metadatatype, structuralPrivacyBreaches))
                className += " structuralPrivacyBreach";

            if(columnData.datatypeConfidence<1 || columnData.completeness<1){
                className += ' datatypeInconsistency';
            }
            if(columnData.metadatatypeConfidence<1){
                className += ' metadatatypeInconsistency';
            }

            if(className!==""){
                $(this.dataTable.column(columnName+":name").header()).html(
                    $(this.dataTable.column(columnName+":name").header()).html()+
                    '<span class="columns_warnings'+className+'"></span>');
            }

            let _self = this;

            $(this.dataTable.column(columnName+":name").header()).on('click', function(){
                $(_self.columnStatsModal).removeClass('modal-close');
                $(_self.columnStatsModal).addClass('modal-open');

                _self.columnStatsModal.querySelector('#modal-column-title').innerText = columnName;
                _self.columnStatsModal.querySelector('#modal-column-datatype').innerText = columnData.datatype;
                _self.columnStatsModal.querySelector('#modal-column-type-homogeneity').innerText = columnData.datatypeConfidence;

                _self.columnStatsModal.querySelector('#modal-column-metadatatype').innerText = columnData.metadatatype;
                _self.columnStatsModal.querySelector('#modal-column-metadatatype-homogeneity').innerText = columnData.metadatatypeConfidence;

                _self.columnStatsModal.querySelector('#modal-column-completeness').innerText = columnData.completeness;
                _self.columnStatsModal.querySelector('#modal-column-null').innerText = columnData.null_values;

                let div = _self.columnStatsModal.querySelector('#modal-structuralPrivacyBreach');
                div.innerHTML = "";
                for(let i=0; i<structuralPrivacyBreaches.length; i++){
                    let breach = structuralPrivacyBreaches[i].breach;
                    if(columnData.metadatatype in breach){
                        debugger
                        let list_of_contentBreaches = [];

                        for(let key in breach){
                            let value = breach[key];
                            if(value.includes(columnName)){
                                list_of_contentBreaches.push(Object.keys(breach));
                            }
                        }

                        let ul = document.createElement("UL");
                        for(let i=0; i<list_of_contentBreaches.length; i++) {
                            let li = document.createElement("LI");
                            let textnode = document.createTextNode(list_of_contentBreaches[i].join(' '));

                            li.appendChild(textnode);
                            ul.appendChild(li);

                        }
                        div.appendChild(ul);
                    }
                }
            });
        }
    }

    cartesianProduct = function(arr) {
        return arr.reduce(function(a,b){
            return a.map(function(x){
                return b.map(function(y){
                    return x.concat(y);
                })
            }).reduce(function(a,b){ return a.concat(b) },[])
        }, [[]])
    }

    isColumnInvolvedInStructuralPrivacyBreach(columnMetadatatype, structuralPrivacyBreaches) {
        for(let i=0; i<structuralPrivacyBreaches.length; i++){
            let breach = structuralPrivacyBreaches[i].breach;
            if(columnMetadatatype in breach)
                return true;
        }
        return false;
    }

}