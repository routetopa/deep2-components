export default class TableManager {

    constructor(ranking_table, menu) {
        this.data = [];
        this.ranking_table = ranking_table;
        this.menu = menu;
    }

    initDataTable = function (data, data_url) {
        this.data = data || data_url;

        let columns = [];
        for(let columnName in data[0]){
            columns.push({data:columnName, title:columnName, class:['dt-left', 'sorting']});
        }


        $(this.ranking_table).dataTable( {
            data: this.data,
            pageLength: 5,
            columns: columns,
            lengthMenu : [5, 10, 15, 20],
            orderCellsTop: true,
            order: [ 0, 'asc' ],
            scrollX: true,
        });


        var table = $(this.ranking_table).DataTable();

        //test
        /*
        $(table.cell(0,1).node()).addClass('focus');
        $(table.cell(1,1).node()).addClass('datatypeInconsistency');
        $(table.cell(2,1).node()).addClass('metadatatypeInconsistency');
        $(table.cell(3,1).node()).addClass('typo');
        $(table.cell(4,1).node()).addClass('contentPrivacyBreach');
        $(table.cell(0,2).node()).addClass('contentPrivacyBreach datatypeInconsistency metadatatypeInconsistency typo');
         */

        /*
        $(this.ranking_table).on( 'click', 'tbody td', function () {
            let row = table.cell( this ).index().row;
            let column = table.cell( this ).index().columnVisible;

            let node = table
                .cell(row, column)
                .node();

            $(node).addClass( 'focus' );
        } );
        */
    };

    fillInTypoStats = function(typos){
        let table = $(this.ranking_table).DataTable();
        //let typosDiv = this.menu.querySelector('#typoDiv');
        let numTyposDiv = this.menu.querySelector('#numTypos');
        numTyposDiv.innerText = typos.length;

        //table.cell( ':eq(0)', null, {page: 'current'} ).select();

        debugger
        for(let typoIndex in typos){
            let typo = typos[typoIndex];
            let row = typo.i;
            let column = typo.j;
            $(table.cell(row, column).node()).addClass('typo');
        }

        this.counterTypo = 0;
        let currentTypos = this.menu.querySelector('#currentTypo');
        currentTypos.innerText = (this.counterTypo+1) + '/' + typos.length;

        $(table.cell(typos[this.counterTypo].i,typos[this.counterTypo].j).node()).addClass('focus');
        $(table.cell(typos[this.counterTypo].i,typos[this.counterTypo].j).node()).focus();

        let _self = this;
        $(this.menu.querySelector('#prevTypo')).on( 'click', function () {
            debugger
            $(table.cell(typos[_self.counterTypo].i,typos[_self.counterTypo].j).node()).removeClass('focus');
            _self.counterTypo = _self.counterTypo==0?0:_self.counterTypo-1;
            $(table.cell(typos[_self.counterTypo].i,typos[_self.counterTypo].j).node()).addClass('focus');
            table.scrollTo(table.row( ':eq('+typos[_self.counterTypo].i+')' ));

            //table.cell(typos[_self.counterTypo].i,typos[_self.counterTypo].j).node().focus();

            let currentTypos = _self.menu.querySelector('#currentTypo');
            currentTypos.innerText = (_self.counterTypo+1) + '/' + typos.length;
        } );

        $(this.menu.querySelector('#nextTypo')).on( 'click', function () {
            debugger
            $(table.cell(typos[_self.counterTypo].i,typos[_self.counterTypo].j).node()).removeClass('focus');
            _self.counterTypo = _self.counterTypo==(typos.length-1)?(typos.length-1):_self.counterTypo+1;
            $(table.cell(typos[_self.counterTypo].i,typos[_self.counterTypo].j).node()).addClass('focus');
            table.scrollTo(table.row( ':eq('+typos[_self.counterTypo].i+')' ));

            let currentTypos = _self.menu.querySelector('#currentTypo');
            currentTypos.innerText = (_self.counterTypo+1) + '/' + typos.length;
        } );
    }
}