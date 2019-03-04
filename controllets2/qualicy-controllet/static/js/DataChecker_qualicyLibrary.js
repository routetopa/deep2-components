/*
 ** This file is part of JSDataChecker.
 **
 ** JSDataChecker is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** JSDataChecker is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with JSDataChecker. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2018 JSDataChecker - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **
 ** ----------------------------------------------------------------------------------
 **
 ** Main class.
 **
 **/

export default class DataChecker {

    constructor(configFactory) {
        this._dataTypeConfigFactory = configFactory;
    }//EndConstructor.

    inferDataTypeOfValue(value) {
        //Retrieves the array of available types.
        var arrTraverseOrder = this._dataTypeConfigFactory.types;

        //Runs each registered "evaluate" function on the value.
        let _inferredDataType = { datatype: this._dataTypeConfigFactory.DT_UNKNOWN, value: value };
        for (let i=0; i<arrTraverseOrder.length; i++) {
            let dtnode = arrTraverseOrder[i];
            _inferredDataType = dtnode.evaluate(value);

            if (_inferredDataType.datatype.name !== this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN.name)
                return _inferredDataType;
        }

        return _inferredDataType;

        /*arrTraverseOrder.forEach( (dtnode, index) => {
            let _inferredDataType = dtnode.data.evaluate(value);
            if (_inferredDataType.datatype.name != this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN.name) {

            }
            debugger;
        });*/
    }//EndFunction.

    /**
     * The input "metadata" is a json object with:
     *  - an array of columns
     * @param metadata
     * @param options
     */
    evaluate(dataset, fieldKeys, options) {
        let evaLog = []; //Stack with all the issues found in the dataset.
        let annotateInputDataset = false;

        //Manage the options.
        if (typeof options !== "undefined") {
            annotateInputDataset = (options.annotateInputDataset !== "undefined" && options.annotateInputDataset);
        }

        for (let irow=0; irow<dataset.length; irow++) {
            let row = dataset[irow];

            for (let ikey=0; ikey<fieldKeys.length; ikey++) {
                let key = fieldKeys[ikey];

                //Value to evaluate.
                let fieldValue = row[key.name] + '';

                //
                //if (typeof value === 'undefined')
                //   return  { datatype: PRDATATYPES.DT_UNKNOWN, value: value };

                let _inferredType =  this.inferDataTypeOfValue(fieldValue);

                if (_inferredType.datatype !== this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN) {
                    let _keydescr = "key_descr_" + _inferredType.datatype.name;
                    // TODO let descr = this._dataTypeConfigFactory.translate(_keydescr, "EN");
                    let descr = _inferredType.datatype.name;

                    let evaLogItem = {
                        i: irow,
                        j: ikey,
                        key: key.name,
                        value: fieldValue,
                        datatype: _inferredType.datatype,
                        descr: descr
                    };

                    //The user accepted the annotation of the original dataset.
                    if (annotateInputDataset) {
                        row.__qualicy = evaLogItem;
                    }

                    evaLog.push(evaLogItem);
                }

            }//EndFor on keys.
        }//EndFor.

        return evaLog;
    };//EndFunction.

    askForInferDataTypeOfValue(value) {
        return this._dataTypeConfigFactory.evaluate(value);;
    }//EndFunction.

    askForEvaluation(dataset, fieldKeys, options) {
        debugger
        let evaLog = []; //Stack with all the issues found in the dataset.
        let annotateInputDataset = false;

        //Manage the options.
        if (typeof options !== "undefined") {
            annotateInputDataset = (options.annotateInputDataset !== "undefined" && options.annotateInputDataset);
        }

        for (let irow=0; irow<dataset.length; irow++) {
            let row = dataset[irow];

            for (let ikey=0; ikey<fieldKeys.length; ikey++) {
                let key = fieldKeys[ikey];

                //Value to evaluate.
                let fieldValue = row[key.name] + '';

                //
                //if (typeof value === 'undefined')
                //   return  { datatype: PRDATATYPES.DT_UNKNOWN, value: value };

                let _inferredType =  this.askForInferDataTypeOfValue(fieldValue);

                if (_inferredType.datatype !== this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN){

                    let descr = _inferredType.datatype.name; //TODO
                    var _metatype = this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN;
                    if(_inferredType.datatype === this._dataTypeConfigFactory.DATATYPES.DT_NULL)
                        _metatype = this._dataTypeConfigFactory.DATATYPES.DT_NULL;
                    else if('metatype' in _inferredType && _inferredType.metatype !== this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN){
                        _metatype = _inferredType.metatype;
                        descr = _inferredType.metatype.name; //TODO
                    }
                    /*todo
                        let _keydescr = "key_descr_" + _inferredType.metatype.name;
                        let descr = this._dataTypeConfigFactory.translate(_keydescr, "EN");
                    */


                    let evaLogItem = {
                        i: irow,
                        j: ikey,
                        key: key.name,
                        value: fieldValue,
                        datatype: _inferredType.datatype,
                        metatype: _metatype,
                        descr: descr
                    };

                    //The user accepted the annotation of the original dataset.
                    if (annotateInputDataset) {
                        row.__qualicy = evaLogItem;
                    }

                    evaLog.push(evaLogItem);

                }

            }//EndFor on keys.
        }//EndFor.

        return evaLog;
    };//EndFunction.

    detectTyposErrorsCorrections(value) {
        return this._dataTypeConfigFactory.testTyposErrors(value);
    }

    testTyposErrors(dataset, fieldKeys, options) {
        let evaLog = []; //Stack with all the issues found in the dataset.
        let annotateInputDataset = false;

        //Manage the options.
        if (typeof options !== "undefined") {
            annotateInputDataset = (options.annotateInputDataset !== "undefined" && options.annotateInputDataset);
        }

        for (let irow=0; irow<dataset.length; irow++) {
            let row = dataset[irow];

            for (let ikey=0; ikey<fieldKeys.length; ikey++) {
                let key = fieldKeys[ikey];

                //Value to evaluate.
                let fieldValue = row[key.name] + '';

                //
                //if (typeof value === 'undefined')
                //   return  { datatype: PRDATATYPES.DT_UNKNOWN, value: value };

                let _typosCorrections =  this.detectTyposErrorsCorrections(fieldValue);

                if (_typosCorrections.length != 0 ) {
                    //TODO manage description and internationalization

                    //let _keydescr = "key_descr_" + _inferredType.datatype.name;
                    //let descr = this._dataTypeConfigFactory.translate(_keydescr, "EN");
                    let descr = "TYPOS ERROR: ";
                    for(let correction_index = 0; correction_index < _typosCorrections.length; correction_index++){
                        let correction = _typosCorrections[correction_index];
                        descr += correction.correction;
                    }

                    let evaLogItem = {
                        i: irow,
                        j: ikey,
                        key: key.name,
                        value: fieldValue,
                        datatype: "TYPOS ERROR",
                        descr: descr
                    };

                    //The user accepted the annotation of the original dataset.
                    if (annotateInputDataset) {
                        row.__qualicy = evaLogItem;
                    }

                    evaLog.push(evaLogItem);
                }

            }
        }
        return evaLog;
    };//EndFunction.

    testContentPrivacyBreaches(value){
        return this._dataTypeConfigFactory.testContentPrivacyBreaches(value);
    }

    testStructuralPrivacyBreaches(schema){
        return this._dataTypeConfigFactory.testStructuralPrivacyBreaches(schema);
    }

}//EndClass.


