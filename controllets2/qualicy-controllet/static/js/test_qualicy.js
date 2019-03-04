export default class Test_qualicy {

   constructor(ranking_table) {
       this.data = [];
       this.ranking_table = ranking_table;
   }

    initDataTable = function (data, data_url) {
        this.data = data || data_url;
        console.log(data);

        $(this.ranking_table).DataTable( {
            data: data,
            pageLength: 5,
            columns: [
                { title: "Name" },
                { title: "Position" },
                { title: "Office" },
                { title: "Extn." },
                { title: "Start date" },
                { title: "Salary" }
            ]
        });

    };

}