export default class TableManager {

    constructor(ranking_table, menu) {
        this.data = [];
        this.ranking_table = ranking_table;
        this.menu = menu;
        this.currentTypos = menu.querySelector('#currentTypo');
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
            "pageLength": this.pageLength,
            keys: true //?
        });

        console.log($.fn.dataTable.KeyTable);
    };

    fillInTypoStats = function(typos){
        this.counterTypo = 0;

        for(let typoIndex in typos){
            let typo = typos[typoIndex];
            let row = typo.i;
            let column = typo.j;
            $(this.dataTable.cell(row, column).node()).addClass('typo');
        }

        this.currentTypos.innerText = '1 / ' + typos.length;

        $(this.menu.querySelector('#prevTypo')).on( 'click', function () {
            //todo
        } );

        $(this.menu.querySelector('#nextTypo')).on( 'click', function () {
            this.dataTable.page( Math.floor(typos[this.counterTypo].i / this.pageLength)).draw( 'page' );

            this.selectedCell = $(this.dataTable.cell(typos[this.counterTypo].i,typos[this.counterTypo].j).node())[0];
            $(this.selectedCell).addClass('focus');
            setTimeout(function(){
                $(this.selectedCell).removeClass('focus');
            }.bind(this), 500);

            this.selectedCell.scrollIntoView({block: 'center', inline: 'center'});

            this.currentTypos.innerText = (this.counterTypo + 1) + ' / ' + typos.length;
            this.counterTypo = (this.counterTypo + 1) %  typos.length;
        }.bind(this) );
    }
}