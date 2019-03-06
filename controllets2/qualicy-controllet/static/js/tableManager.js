export default class TableManager {

    constructor(ranking_table, menu) {
        this.data = [];
        this.ranking_table = ranking_table;
        this.menu = menu;
        this.currentTypos = menu.querySelector('#currentTypo');
        this.currentNullCell = menu.querySelector('#currentNull');
        this.currentMismatchDatatypes = menu.querySelector('#currentMismatchDatatypes');
        this.currentMismatchMetadatatypes = menu.querySelector('#currentMismatchMetadatatypes');
        this.currentMissingMetadatatypes = menu.querySelector('#currentMissingMetadatatypes');
        this.currentContentPrivacyBreach = menu.querySelector('#currentContentPrivacyBreach');
        this.pageLength = 10;
    }

    redrawDataTable  = function () {
        this.dataTable.draw();
    };

    initDataTable = function (data, data_url) {
        this.data = data || data_url; //todo data_url

        let columns = [];
        for(let columnName in data[0]){
            columns.push({data:columnName, title:columnName});
        }

        this.dataTable = $(this.ranking_table).DataTable( {
            // deferRender: true, //todo + drawCallback
            data: this.data,
            columns: columns,
            scrollX: 'auto',
            order: [],
            rowId: '_id',
            pageLength: this.pageLength,
            keys: true //?
        });

        this.dataTable.on( 'length.dt', function ( e, settings, len ) {
            this.pageLength = len;
        } );

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

        this.currentTypos.innerText = '... / ' + typos.length;

        $(this.menu.querySelector('#prevTypo')).on( 'click', function () {
            if(this.counterTypo<0)
                this.counterTypo = typos.length-1;
            else
                this.counterTypo = ((this.counterTypo -1) % typos.length + typos.length) %  typos.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(typos[this.counterTypo].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(typos[this.counterTypo].i,typos[this.counterTypo].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

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
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentTypos.innerText = (this.counterTypo + 1) + ' / ' + typos.length;
        }.bind(this) );
    }

    fillInDatatypeStats = function(nullCells, mismatchDatatypes){
        this.fillInNullCells(nullCells);
        this.fillInMismatchDatatypes(mismatchDatatypes);
    }

    fillInNullCells = function(nullCells){
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

        this.currentNullCell.innerText = '... / ' + nullCells.length;

        $(this.menu.querySelector('#prevNull')).on( 'click', function () {
            debugger
            if(this.counterNullCells<0)
                this.counterNullCells = nullCells.length-1;
            else
                this.counterNullCells = ((this.counterNullCells -1) % nullCells.length + nullCells.length) %  nullCells.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(nullCells[this.counterNullCells].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(nullCells[this.counterNullCells].rowIndex,nullCells[this.counterNullCells].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentNullCell.innerText = (this.counterNullCells + 1) + ' / ' + nullCells.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextNull')).on( 'click', function () {
            debugger
            if(this.counterNullCells<0)
                this.counterNullCells = 0;
            else
                this.counterNullCells = (this.counterNullCells + 1) %  nullCells.length;

            this.dataTable.page( Math.floor(nullCells[this.counterNullCells].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(nullCells[this.counterNullCells].rowIndex,nullCells[this.counterNullCells].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentNullCell.innerText = (this.counterNullCells + 1) + ' / ' + nullCells.length;
        }.bind(this) );
    }

    fillInMismatchDatatypes = function(mismatchDatatypes){
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

        this.currentMismatchDatatypes.innerText = '... / ' + mismatchDatatypes.length;

        $(this.menu.querySelector('#prevMismatchDatatypes')).on( 'click', function () {
            debugger
            if(this.counterMismatchDatatypes<0)
                this.counterMismatchDatatypes = mismatchDatatypes.length-1;
            else
                this.counterMismatchDatatypes = ((this.counterMismatchDatatypes -1) % mismatchDatatypes.length + mismatchDatatypes.length) %  mismatchDatatypes.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex,mismatchDatatypes[this.counterMismatchDatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchDatatypes.innerText = (this.counterMismatchDatatypes + 1) + ' / ' + mismatchDatatypes.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextMismatchDatatypes')).on( 'click', function () {
            debugger
            if(this.counterMismatchDatatypes<0)
                this.counterMismatchDatatypes = 0;
            else
                this.counterMismatchDatatypes = (this.counterMismatchDatatypes + 1) %  mismatchDatatypes.length;

            this.dataTable.page( Math.floor(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchDatatypes[this.counterMismatchDatatypes].rowIndex,mismatchDatatypes[this.counterMismatchDatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchDatatypes.innerText = (this.counterMismatchDatatypes + 1) + ' / ' + mismatchDatatypes.length;
        }.bind(this) );
    }

    fillInMetaDatatypeStats = function(mismatchMetadatatypes, missingMetadatatypes){
        this.fillInMismatchMetadatatypes(mismatchMetadatatypes);
        this.fillInMissingMetadatatypes(missingMetadatatypes);
    }

    fillInMismatchMetadatatypes = function(mismatchMetadatatypes){
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

        this.currentMismatchMetadatatypes.innerText = '... / ' + mismatchMetadatatypes.length;

        $(this.menu.querySelector('#prevMismatchMetadatatypes')).on( 'click', function () {
            debugger
            if(this.counterMismatchMetadatatypes<0)
                this.counterMismatchMetadatatypes = mismatchMetadatatypes.length-1;
            else
                this.counterMismatchMetadatatypes = ((this.counterMismatchMetadatatypes -1) % mismatchMetadatatypes.length + mismatchMetadatatypes.length) %  mismatchMetadatatypes.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex,mismatchMetadatatypes[this.counterMismatchMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchMetadatatypes.innerText = (this.counterMismatchMetadatatypes + 1) + ' / ' + mismatchMetadatatypes.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextMismatchMetadatatypes')).on( 'click', function () {
            debugger
            if(this.counterMismatchMetadatatypes<0)
                this.counterMismatchMetadatatypes = 0;
            else
                this.counterMismatchMetadatatypes = (this.counterMismatchMetadatatypes + 1) %  mismatchMetadatatypes.length;

            this.dataTable.page( Math.floor(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(mismatchMetadatatypes[this.counterMismatchMetadatatypes].rowIndex,mismatchMetadatatypes[this.counterMismatchMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMismatchMetadatatypes.innerText = (this.counterMismatchMetadatatypes + 1) + ' / ' + mismatchMetadatatypes.length;
        }.bind(this) );
    }

    fillInMissingMetadatatypes = function(missingMetadatatypes){
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

        this.currentMissingMetadatatypes.innerText = '... / ' + missingMetadatatypes.length;

        $(this.menu.querySelector('#prevMissingMetadatatypes')).on( 'click', function () {
            debugger
            if(this.counterMissingMetadatatypes<0)
                this.counterMissingMetadatatypes = missingMetadatatypes.length-1;
            else
                this.counterMissingMetadatatypes = ((this.counterMissingMetadatatypes -1) % missingMetadatatypes.length + missingMetadatatypes.length) %  missingMetadatatypes.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex,missingMetadatatypes[this.counterMissingMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMissingMetadatatypes.innerText = (this.counterMissingMetadatatypes + 1) + ' / ' + missingMetadatatypes.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextMissingMetadatatypes')).on( 'click', function () {
            debugger
            if(this.counterMissingMetadatatypes<0)
                this.counterMissingMetadatatypes = 0;
            else
                this.counterMissingMetadatatypes = (this.counterMissingMetadatatypes + 1) %  missingMetadatatypes.length;

            this.dataTable.page( Math.floor(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(missingMetadatatypes[this.counterMissingMetadatatypes].rowIndex,missingMetadatatypes[this.counterMissingMetadatatypes].columnIndex).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentMissingMetadatatypes.innerText = (this.counterMissingMetadatatypes + 1) + ' / ' + missingMetadatatypes.length;
        }.bind(this) );
    }

    fillInContentPrivacyBreachesStats = function(contentPrivacyBreachStats){
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

        this.currentContentPrivacyBreach.innerText = '... / ' + contentPrivacyBreachStats.length;

        $(this.menu.querySelector('#prevContentPrivacyBreach')).on( 'click', function () {
            debugger
            if(this.counterContentPrivacyBreach<0)
                this.counterContentPrivacyBreach = contentPrivacyBreachStats.length-1;
            else
                this.counterContentPrivacyBreach = ((this.counterContentPrivacyBreach -1) % contentPrivacyBreachStats.length + contentPrivacyBreachStats.length) %  contentPrivacyBreachStats.length; //(x % n + n) % n

            this.dataTable.page( Math.floor(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i,contentPrivacyBreachStats[this.counterContentPrivacyBreach].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentContentPrivacyBreach.innerText = (this.counterContentPrivacyBreach + 1) + ' / ' + contentPrivacyBreachStats.length;
        }.bind(this) );

        $(this.menu.querySelector('#nextContentPrivacyBreach')).on( 'click', function () {
            debugger
            if(this.counterContentPrivacyBreach<0)
                this.counterContentPrivacyBreach = 0;
            else
                this.counterContentPrivacyBreach = (this.counterContentPrivacyBreach + 1) %  contentPrivacyBreachStats.length;

            this.dataTable.page( Math.floor(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(contentPrivacyBreachStats[this.counterContentPrivacyBreach].i,contentPrivacyBreachStats[this.counterContentPrivacyBreach].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentContentPrivacyBreach.innerText = (this.counterContentPrivacyBreach + 1) + ' / ' + contentPrivacyBreachStats.length;
        }.bind(this) );
    }
}