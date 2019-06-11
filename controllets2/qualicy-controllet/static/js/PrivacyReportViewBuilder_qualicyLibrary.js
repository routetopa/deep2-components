export default class PrivacyReportViewBuilder {

    /**
     * It builds a report in which the statistics are provided
     * summarised based on DATATYPES
     * @param evaLogs
     */
    build(evaLogs) {
        let reportView = {
            DATATYPES: {},
            DATASET: []
        };

        /// It groups the statistics by row.
        for (let ilog=0; ilog<evaLogs.length; ilog++) {
            let slog = evaLogs[ilog];
            let _srowIndex = slog.i + "";
            let _scolIndex = slog.j + "";

            if (typeof reportView.DATASET[_srowIndex] === 'undefined')
                reportView.DATASET[_srowIndex] = [];

            reportView.DATASET[_srowIndex][_scolIndex] = slog;
        }

        /// It groups the statistics by Datatype.
        for (let ilog=0; ilog<evaLogs.length; ilog++) {
            let slog = evaLogs[ilog];
            let sdtkey = slog.datatype.name;

            if (typeof reportView.DATATYPES[sdtkey] === 'undefined')
                reportView.DATATYPES[sdtkey] = { datatypekey: sdtkey, warnings: 0 };

            reportView.DATATYPES[sdtkey].warnings++;
        }//EndFor.

        return reportView;
    }//EndFunction.

    _firstAndSecondMostCommonDatatypes(arr, fncompare){
        var max1 = null;
        var max2 = null;

        for (var key in arr) {
            //if (max1 == null) //Only the first time.
            //    max1 = {index: -1, key: key, value: arr[key]};

            if (max1 == null || fncompare(arr[key], max1.value)) {
                max2 = max1;
                max1 = {index: -1, key: key, value: arr[key]};
            } else if (max2 == null || fncompare(arr[key], max2.value))
                max2 = {index: -1, key: key, value: arr[key]};

        }//EndFor.

        return { first: max1, second: max2 };
    }//EndFunction.

    buildColumnStats(evaLogs){
        //initialization
        let COLUMN_DATATYPES={};
        let COLUMN_METADATATYPES={};
        let COLUMN_VALUES={};
        let reportView = {
            COLUMN_STATS:{},
            DATATYPE_HOMOGENEITY:1,
            METADATATYPE_HOMOGENEITY:1,
            COMPLETENESS:1,
            TOTAL_NULL:0,
            TOTAL_VALUES:0,

            qualityIndex:{
                homogeneity:1,
                completeness:1,
                totalValues:0,
                totalNullValues:0
            },
            types:{},
            warningsTextual:''
        };

        //
        for (let ilog=0; ilog<evaLogs.length; ilog++) {
            let slog = evaLogs[ilog];
            let _sdatatype = slog.datatype.name;
            let _smetadatatype = slog.metatype.name;
            let _scolKey = slog.key + "";
            let _srowIndex = slog.i;
            let _scolIndex = slog.j;
            let _scolValue = slog.value;

            if (typeof COLUMN_DATATYPES[_scolKey] === 'undefined')
                COLUMN_DATATYPES[_scolKey] = {};

            if (typeof COLUMN_DATATYPES[_scolKey][_sdatatype] === 'undefined')
                COLUMN_DATATYPES[_scolKey][_sdatatype] = 0;

            COLUMN_DATATYPES[_scolKey][_sdatatype] += 1;

            if (typeof COLUMN_METADATATYPES[_scolKey] === 'undefined')
                COLUMN_METADATATYPES[_scolKey] = {};

            if (typeof COLUMN_METADATATYPES[_scolKey][_smetadatatype] === 'undefined')
                COLUMN_METADATATYPES[_scolKey][_smetadatatype] = 0;

            COLUMN_METADATATYPES[_scolKey][_smetadatatype] += 1;

            if (typeof COLUMN_VALUES[_scolKey] === 'undefined')
                COLUMN_VALUES[_scolKey] = {};

            if (typeof COLUMN_VALUES[_scolKey][_scolValue] === 'undefined')
                COLUMN_VALUES[_scolKey][_scolValue] = 0;

            COLUMN_VALUES[_scolKey][_scolValue] += 1;

            reportView.types[_scolKey] = {
                label:_scolKey,
                name:_scolKey,
                index:_scolIndex,
                _inferredTypes:COLUMN_DATATYPES[_scolKey],
                _inferredSubTypes:COLUMN_METADATATYPES[_scolKey],
                _inferredValues:COLUMN_VALUES[_scolKey]
            }

            if (typeof reportView.types[_scolKey]._inferredTypes[_sdatatype + "_cells"] == 'undefined')
                reportView.types[_scolKey]._inferredTypes[_sdatatype + "_cells"] = [];
            reportView.types[_scolKey]._inferredTypes[_sdatatype + "_cells"].push({ columnKey: _scolKey, columnIndex: _scolIndex, rowIndex: _srowIndex });

            if (typeof reportView.types[_scolKey]._inferredSubTypes[_smetadatatype + "_cells"] == 'undefined')
                reportView.types[_scolKey]._inferredSubTypes[_smetadatatype + "_cells"] = [];
            reportView.types[_scolKey]._inferredSubTypes[_smetadatatype + "_cells"].push({ columnKey: _scolKey, columnIndex: _scolIndex, rowIndex: _srowIndex });
        }


        for(let column_index in COLUMN_DATATYPES){
            reportView.COLUMN_STATS[column_index]={datatype:'', metadatatype:'', datatypeConfidence: 1, metadatatypeConfidence:1, completeness: 1, null_values:0};

            let column_datatypes = {};
            for(var column_name in COLUMN_DATATYPES[column_index])
                if(column_name.indexOf("_cells") <0)
                    column_datatypes[column_name] = COLUMN_DATATYPES[column_index][column_name];

            let column_metadatatypes = {};
            for(var column_name in COLUMN_METADATATYPES[column_index])
                if(column_name.indexOf("_cells") <0)
                    column_metadatatypes[column_name] = COLUMN_METADATATYPES[column_index][column_name];

            var num_of_rows = 0;
            for (let datatype in column_datatypes){
                num_of_rows += column_datatypes[datatype];
            }

            //null values
            if (column_datatypes.hasOwnProperty('NULL')) {
                reportView.COLUMN_STATS[column_index].null_values = column_datatypes['NULL'];
                reportView.TOTAL_NULL += column_datatypes['NULL'];
                reportView.COLUMN_STATS[column_index].completeness = Math.round( (num_of_rows-column_datatypes['NULL'])/num_of_rows * 100) / 100;
            }
            
            reportView.TOTAL_VALUES += num_of_rows;
            num_of_rows -= reportView.COLUMN_STATS[column_index].null_values;
            
            //homogeineity
            var max = this._firstAndSecondMostCommonDatatypes(column_datatypes, function (curval, lastval){
                return curval > lastval;
            });

            var dtkey = max.first.key;
            if (dtkey === 'NULL' &&
                max.second != null && typeof max.second !== 'undefined')
                dtkey = max.second.key;

            reportView.COLUMN_STATS[column_index].datatype = dtkey;
            reportView.COLUMN_STATS[column_index].datatypeConfidence = Math.round( column_datatypes[dtkey] / num_of_rows * 100) / 100;

            reportView.DATATYPE_HOMOGENEITY *= reportView.COLUMN_STATS[column_index].datatypeConfidence;

            var max = this._firstAndSecondMostCommonDatatypes(column_metadatatypes, function (curval, lastval) {
                return curval > lastval;
            });

            var mdtkey = max.first.key;
            if ((mdtkey === 'NULL' || mdtkey === 'UNKNOWN') &&
                max.second != null && max.second.key !='NULL' && typeof max.second !== 'undefined')
                mdtkey = max.second.key;

            reportView.COLUMN_STATS[column_index].metadatatype = mdtkey;

            var subType;

            if(mdtkey !== 'NULL' && mdtkey !== 'UNKNOWN'){
                reportView.COLUMN_STATS[column_index].metadatatypeConfidence = Math.round( column_metadatatypes[mdtkey] / num_of_rows * 100) / 100;
                reportView.METADATATYPE_HOMOGENEITY *= reportView.COLUMN_STATS[column_index].metadatatypeConfidence;

                subType = mdtkey;
            }
            else{
                subType = null;
            }

            reportView.types[column_index].numOfItems = num_of_rows;
            reportView.types[column_index].totalNullValues= reportView.COLUMN_STATS[column_index].null_values;
            reportView.types[column_index].type = dtkey;
            reportView.types[column_index].typeLabel=dtkey;
            reportView.types[column_index].typeConfidence = reportView.COLUMN_STATS[column_index].datatypeConfidence;
            reportView.types[column_index].subtype = subType;
            reportView.types[column_index].subtypeLabel= subType;
            reportView.types[column_index].subtypeConfidence = reportView.COLUMN_STATS[column_index].metadatatypeConfidence;
            reportView.types[column_index].errorsDescription= '';

        }

        reportView.DATATYPE_HOMOGENEITY = Math.round(reportView.DATATYPE_HOMOGENEITY * 100) / 100;
        reportView.METADATATYPE_HOMOGENEITY = Math.round(reportView.METADATATYPE_HOMOGENEITY * 100) / 100;

        var totFullValues = reportView.TOTAL_VALUES - reportView.TOTAL_NULL;
        reportView.COMPLETENESS = Math.round(totFullValues / reportView.TOTAL_VALUES * 100) / 100;

        //TODO refactoring
        reportView.qualityIndex.completeness = reportView.COMPLETENESS;
        reportView.qualityIndex.homogeneity = reportView.DATATYPE_HOMOGENEITY;
        reportView.qualityIndex.totalNullValues = reportView.TOTAL_NULL;
        reportView.qualityIndex.totalValues = reportView.TOTAL_VALUES;

        //TODO translation

        //Convert confidence to description
        for(var columnName in reportView.types){
            var columnInfo = reportView.types[columnName];

            columnInfo.errorsDescription = ""; //useless

            var description = "";
            if (columnInfo.typeConfidence < 1) {
                var incorrect = columnInfo.numOfItems - columnInfo._inferredTypes[columnInfo.type];
                if(incorrect > 0){
                    var _descr1 = "the column '%COL_NAME' is of type '%COL_TYPE'."; //TODO
                    var _descr2 = "a value is not '%COL_TYPE'."; //TODO
                    if (incorrect > 1)
                        _descr2 = "%COL_ERRORS values are not '%COL_TYPE'."; //TODO

                    var _descr3 = ""; var _LISTWRONGROS = "";

                    _descr3 = "check rows '%LIST_WRONG_ROWS'."; //TODO

                    //At the end, this array contains keys with wrong types.
                    var keysWrongTypes =  Object.keys(columnInfo._inferredTypes).filter(function(typekey) {
                        return (typekey.indexOf("_cells") <0)
                            && (columnInfo._inferredTypes[typekey] > 0)
                            && (typekey !== columnInfo.type
                            && (typekey!=='NULL'));
                    });

                    //Loop through the wrong types to collect the cells.
                    //Each type has an array with wrong cells.
                    columnInfo.cellsWithWarnings = [];
                    for (var iKeyType=0; iKeyType<keysWrongTypes.length; iKeyType++) {
                        var _keywrongtype = keysWrongTypes[iKeyType];
                        var _wrongcells = columnInfo._inferredTypes[_keywrongtype + "_cells"];
                        if (typeof _wrongcells === 'undefined') continue;

                        //Loop on the cells.
                        for (var icell = 0; icell < _wrongcells.length; icell++) {
                            var _cell = _wrongcells[icell];

                            var _warningMessage = "the column '%COL_NAME' is of type '%COL_TYPE'. "; //TODO
                            _warningMessage += "the cell value is not '%COL_TYPE'. ";
                            _warningMessage = _warningMessage.replace(/%COL_NAME/g, columnInfo.label);
                            _warningMessage = _warningMessage.replace(/%COL_TYPE/g, columnInfo.type);
                            _cell.warningMessage = _warningMessage;

                            //Build the warning message for the cell.
                            if (_keywrongtype === 'NULL')
                                _cell.warningMessage = "the column '%COL_NAME' has an empty value.";

                            columnInfo.cellsWithWarnings.push(_cell);
                        }//EndFor.
                    }//EndFor.

                    //Build the message for the user.
                    for (var iKeyType=0; iKeyType<keysWrongTypes.length; iKeyType++) {
                        var _keytype = keysWrongTypes[iKeyType];
                        var _cells = columnInfo._inferredTypes[_keytype + "_cells"];
                        if (typeof _cells === 'undefined') continue;

                        for (var icell = 0; icell < _cells.length; icell++) {
                            var _cell = _cells[icell];
                            _LISTWRONGROS += (_cell.rowIndex + 2) + "(" + _keytype + ")" +
                                (icell == _cells.length - 2 ? ", and " : "") +
                                (icell < _cells.length - 2 ? ", " : "");
                        }
                    }//EndForInfTypes.

                    var descr = _descr1 + " " + _descr2 + " " + _descr3;
                    descr = descr.replace(/%COL_NAME/g, columnInfo.label);
                    descr = descr.replace(/%COL_TYPE/g, columnInfo.type);
                    descr = descr.replace(/%COL_ERRORS/g, incorrect);
                    descr = descr.replace(/%LIST_WRONG_ROWS/g, _LISTWRONGROS);

                    description += descr;
                }
            }
            if (columnInfo.subtypeConfidence < 1) {
                var incorrect = columnInfo.numOfItems - columnInfo._inferredSubTypes[columnInfo.subtype];
                if(incorrect > 0){
                    var _descr1 = "the column '%COL_NAME' is of type '%COL_METATYPE'."; //TODO
                    var _descr2 = "a value is not '%COL_METATYPE'."; //TODO
                    if (incorrect > 1)
                        _descr2 = "%COL_ERRORS values are not '%COL_METATYPE'."; //TODO

                    var _descr3 = ""; var _LISTWRONGROS = "";

                    _descr3 = "check rows '%LIST_WRONG_ROWS'."; //TODO

                    //At the end, this array contains keys with wrong types.
                    var keysWrongTypes =  Object.keys(columnInfo._inferredSubTypes).filter(function(typekey) {
                        return (typekey.indexOf("_cells") <0)
                            && (columnInfo._inferredSubTypes[typekey] > 0)
                            && (typekey !== columnInfo.subtype )
                            && (typekey!=='NULL');
                    });

                    //Loop through the wrong types to collect the cells.
                    //Each type has an array with wrong cells.
                    columnInfo.cellsWithWarnings = [];

                    for (var iKeyType=0; iKeyType<keysWrongTypes.length; iKeyType++) {
                        var _keywrongtype = keysWrongTypes[iKeyType];
                        var _wrongcells = columnInfo._inferredSubTypes[_keywrongtype + "_cells"];
                        if (typeof _wrongcells === 'undefined') continue;

                        //Loop on the cells.
                        for (var icell = 0; icell < _wrongcells.length; icell++) {
                            var _cell = _wrongcells[icell];

                            var _warningMessage = "the column '%COL_NAME' is of type '%COL_METATYPE'. "; //TODO
                            _warningMessage += "the cell value is not '%COL_METATYPE'. ";
                            _warningMessage = _warningMessage.replace(/%COL_NAME/g, columnInfo.label);
                            _warningMessage = _warningMessage.replace(/%COL_METATYPE/g, columnInfo.subtype);
                            _cell.warningMessage = _warningMessage;

                            columnInfo.cellsWithWarnings.push(_cell);
                        }//EndFor.
                    }//EndFor.

                    //Build the message for the user.
                    for (var iKeyType=0; iKeyType<keysWrongTypes.length; iKeyType++) {
                        var _keytype = keysWrongTypes[iKeyType];
                        var _cells = columnInfo._inferredSubTypes[_keytype + "_cells"];
                        if (typeof _cells === 'undefined') continue;

                        for (var icell = 0; icell < _cells.length; icell++) {
                            var _cell = _cells[icell];
                            _LISTWRONGROS += (_cell.rowIndex + 2) + "(" + _keytype + ")" +
                                (icell == _cells.length - 2 ? ", and " : "") +
                                (icell < _cells.length - 2 ? ", " : "");
                        }
                    }//EndForInfTypes.

                    var descr = _descr1 + " " + _descr2 + " " + _descr3;
                    descr = descr.replace(/%COL_NAME/g, columnInfo.label);
                    descr = descr.replace(/%COL_METATYPE/g, columnInfo.subtype);
                    descr = descr.replace(/%COL_ERRORS/g, incorrect);
                    descr = descr.replace(/%LIST_WRONG_ROWS/g, _LISTWRONGROS);

                    description += descr;
                }
            }
            //TODO DATETIME

            var descr = "";
            if (columnInfo.totalNullValues > 0 )
                descr = "In the column '%COL_NAME' '%COL_NULLVALUES' are empty values. ";

            description = description + " " + descr;

            description = description.replace(/%COL_NAME/g, columnInfo.label);
            description = description.replace(/%COL_TYPE/g, columnInfo.type);
            description = description.replace(/%COL_SUBTYPE/g, columnInfo.subtype);
            description = description.replace(/%COL_NULLVALUES/g, columnInfo.totalNullValues);

            columnInfo.errorsDescription = description.trim();
            reportView.warningsTextual += description.trim();

        }


        return reportView;

    }

    buildDatatypeAndMetatype(evaLogs) {
        let reportView = {
            DATATYPES: {},
            METADATATYPES: {},
            DATASET: []
        };

        /// It groups the statistics by row.
        for (let ilog=0; ilog<evaLogs.length; ilog++) {
            let slog = evaLogs[ilog];
            let _srowIndex = slog.i + "";
            let _scolIndex = slog.j + "";

            if (typeof reportView.DATASET[_srowIndex] === 'undefined')
                reportView.DATASET[_srowIndex] = [];

            reportView.DATASET[_srowIndex][_scolIndex] = slog;
        }

        /// It groups the statistics by Datatype.
        for (let ilog=0; ilog<evaLogs.length; ilog++) {
            let slog = evaLogs[ilog];
            let sdtkey = slog.datatype.name;
            let smdtkey = slog.metatype.name;

            if (typeof reportView.DATATYPES[sdtkey] === 'undefined')
                reportView.DATATYPES[sdtkey] = { datatypekey: sdtkey, warnings: 0 };

            if (typeof reportView.METADATATYPES[smdtkey] === 'undefined')
                reportView.METADATATYPES[smdtkey] = { metadatatypekey: smdtkey, warnings: 0 };

            reportView.DATATYPES[sdtkey].warnings++;
            reportView.METADATATYPES[smdtkey].warnings++;
        }//EndFor.

        return reportView;
    }//EndFunction.

}//EndClass.

