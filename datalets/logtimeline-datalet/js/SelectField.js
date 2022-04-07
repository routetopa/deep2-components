class SelectField {

    static MEDIA_URL = "MediaUrl";
    static BACKGROUND = "Background";
    static START_TIME = "StartTime";
    static FINISH_TIME = "FinishTime";
    static EVENT_INFO1 = "Event-info1";
    static EVENT_INFO2 = "Event-info2";
    static EVENT_INFO3 = "Event-info3";
    static ALL = "All";

    /**
     *
     * @returns {string} defaults fields StartDate, EndDate, EventTitle, EventDescription and other selected fields
     */
    static select () {
        let selectedFields = [{field : "StartDate"}, {field : "EndDate"}, {field: "EventTitle"}, {field : "EventDescription", index : 2}];
        if(arguments.length > 0){
            let index = 2;
            for (let arg of arguments) {
                if (arg.match(/mediaurl/i)) {
                    selectedFields.push({field: "MediaUrl", index: (++index)});
                }
                else if (arg.match(/background/i)) {
                    selectedFields.push({field: "Background", index: (++index)});
                }
                else if (arg.match(/starttime/i)) {
                    console.log('match starttime');
                    selectedFields.push({field: "StartTime", index: (++index)});
                }
                else if (arg.match(/finishtime/i)) {
                    console.log('match finishtime');
                    selectedFields.push({field: "FinishTime", index: (++index)});
                }
                else if (arg.match(/event-info\d/i)) {
                    let num = (arg + '').charAt((arg + '').length - 1);
                    selectedFields.push({field: "Event-info".concat(num), index: (++index)});
                }
                else if(arg.match(/All/g)) {
                    selectedFields.push({field: "MediaUrl", index: (++index)});
                    selectedFields.push({field: "Background", index: (++index)});
                    selectedFields.push({field: "StartTime", index: (++index)});
                    selectedFields.push({field: "FinishTime", index: (++index)});
                    selectedFields.push({field: "Event-info1", index: (++index)});
                    selectedFields.push({field: "Event-info2", index: (++index)});
                    selectedFields.push({field: "Event-info3", index: (++index)});
                    break;
                }
            }
        }
        return JSON.stringify(selectedFields);
    }
}