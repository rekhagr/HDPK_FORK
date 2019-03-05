var fileOperations = require('./fileOperations');
var packageGenerator = require('./packageGenerator');
var request = require('request')
var tempDataCnt;
var popKey;
module.exports.HPCCInvocation = {



    invokeHPCC: function (layoutName, logicalPath, packageInfo, dataDefCnt, panel, layoutsCnt) {
        //Invoke Logical file from THOR/ROXIE
        // username = "hpccdemo",
        // password = "",
        // //DFU Information
        myJson = {};
        var url = "http://" + "10.66.144.88:8010/WsDfu/DFUGetFileMetaData.json"
        // url = "http://" + "10.66.144.88:8010/WsDfu/DFUQuery.json";
        logicalPath = logicalPath.trim()
        var logicalPathReq;
        var logicalPathSplit;
        if (logicalPath.includes(",")) {
            logicalPathSplit = logicalPath.split(",");
            logicalPathReq = logicalPathSplit[0];
        }
        else {
            logicalPathSplit = [];
            logicalPathSplit.push(logicalPath);
            logicalPathReq = logicalPath;
        }
        var formData = { LogicalFileName: logicalPathReq }

        request({
            url,
            formData: formData
        }, function (error, response, body) {
            // Do more stuff with 'body' here

            var parsedResp = JSON.parse(body);
            /* 
                       var data1 = parsedResp.DFUQueryResponse.DFULogicalFiles.DFULogicalFile;
                       for (dataVal of data1) {
                           console.log(dataVal.Name);
                       } */

            console.log("HDPK generation gets started!!");


            generateHDPK(parsedResp, layoutName, logicalPathSplit, packageInfo, dataDefCnt, panel, layoutsCnt);

        });


    }
}
// Method to generate *.hdpk file
function generateHDPK(parsedResp, layoutName, logicalPath, packageInfo, dataCount, panel, layoutsCnt) {

    if (parsedResp.DFUGetFileMetaDataResponse && parsedResp.DFUGetFileMetaDataResponse.DataColumns
        && parsedResp.DFUGetFileMetaDataResponse.DataColumns.DFUDataColumn) {
        var data = parsedResp.DFUGetFileMetaDataResponse.DataColumns.DFUDataColumn;

        count = 0;


        if (myJson.info) {
            dataCount = myJson.data.length;

        }
        else {

            myJson.info = {
                "packageName": packageInfo.packageName,
                "version": packageInfo.version,
                "created": "04/24/2018 11:00",
                "author": packageInfo.author,
                "description": packageInfo.description
            };
            myJson.data = [];
            dataCount = 0;
        }

        myJson.data.layout = [];
        for (dataVal of data) {
            if (dataVal.ColumnLabel !== "__fileposition__") {
                size = "";
                prepopulateParentData = prepopulateData(size, dataVal);
                dataVal = prepopulateParentData.dataVal;
                size = prepopulateParentData.size;
                if (dataVal.ColumnType !== "Record" && dataVal.ColumnType !== "Dataset") {

                    myJson.data.layout[count] =
                        {
                            "name": dataVal.ColumnLabel,
                            "type": dataVal.ColumnType,
                            "size": size,
                            "displayType": "",
                            "displaySize": "",
                            "textJustification": "right",
                            "format": "",
                            "transforms": [],
                            "isNullable": "false",
                            "minValue": "",
                            "maxValue": ""
                        }
                }

                else if (dataVal.ColumnType == "Record") {

                    var layout = [];
                    layout = frameChildRecord(dataVal, layout);
                    myJson.data.layout[count] =
                        {
                            "name": dataVal.ColumnLabel,
                            "type": dataVal.ColumnType,
                            "layout": layout

                        }
                }

                else if (dataVal.ColumnType == "Dataset") {

                    var layout = [];
                    layout = frameChildRecord(dataVal, layout);
                    myJson.data.layout[count] =
                        {
                            "name": dataVal.ColumnLabel,
                            "type": dataVal.ColumnType,
                            "layout": layout

                        }
                }

                count++;
            }
        }
        myJson.data[dataCount] =
            {
                "name": layoutName,
                "fileType": "physical",
                "logicalPath": logicalPath,
                "format": "FLAT",
                "layout": myJson.data.layout

            }

        if (!tempDataCnt) {
            tempDataCnt = layoutsCnt;
        }
        tempDataCnt = tempDataCnt - 1;

        if (tempDataCnt == 0) {
            filePath = __dirname.replace("src", "") + myJson.info.packageName + '/';
            fileName = myJson.info.packageName + ".hdpk";
            var myJSON = JSON.stringify(myJson);
            getFileOperator().createWriteToFile(filePath, myJSON, fileName);
            console.log("Congrats sakthi hdpk generation is completed successfully");

            packageGenerator.packGen.generatePackage(myJson, filePath, false, panel);
            generationStatus = true;
        }

    }
}

//Function to assign corresponding size and dataType
function prepopulateData(size, dataVal) {

    if (dataVal.ColumnType == "Unsigned Integer") {
        dataVal.ColumnType = "unsigned";
        size = dataVal.ColumnEclType.substring(8);
    }
    else if (dataVal.ColumnType == "Real") {
        if (dataVal.ColumnEclType.includes("udecimal")) {
            dataVal.ColumnType = "udecimal";
            size = dataVal.ColumnEclType.substring(8);
        }
        else {
            dataVal.ColumnType = "decimal";
            size = dataVal.ColumnEclType.substring(7);
        }

    }
    else if (dataVal.ColumnType == "String") {
        dataVal.ColumnType = "string";
        if (dataVal.ColumnRawSize && dataVal.ColumnRawSize > 0) {
            size = dataVal.ColumnRawSize.toString();
        }

    }
    else if (dataVal.ColumnType == "Integer") {
        dataVal.ColumnType = "integer";
        size = dataVal.ColumnEclType.substring(7);
    }
    return { dataVal: dataVal, size: size };
}


function frameChildRecord(dataVal) {
    var childcount = 0;
    var childLayoutArray = [];
    for (childLayout of dataVal.DataColumns.DFUDataColumn) {
        size = "";

        //set dataType and Size based on input file
        prepopulateChildData = prepopulateData(size, childLayout);
        childLayout = prepopulateChildData.dataVal;
        size = prepopulateChildData.size;
        if (childLayout.ColumnType !== "Record" && childLayout.ColumnType !== "Dataset") {
            childLayoutArray[childcount] =
                {
                    "name": childLayout.ColumnLabel,
                    "type": childLayout.ColumnType,
                    "size": size,
                    "displayType": "",
                    "displaySize": "",
                    "textJustification": "right",
                    "format": "",
                    "transforms": [],
                    "isNullable": "false",
                    "minValue": "",
                    "maxValue": ""
                }
        }
        else if (childLayout.ColumnType == "Record") {
            var ColumnLabel = childLayout.ColumnLabel;
            var ColumnType = childLayout.ColumnType;
            var layout = frameChildRecord(childLayout, layout);
            childLayoutArray[childcount] =
                {
                    "name": ColumnLabel,
                    "type": ColumnType,
                    "layout": layout

                }
        }
        else if (childLayout.ColumnType == "Dataset") {
            var ColumnLabel = childLayout.ColumnLabel;
            var ColumnType = childLayout.ColumnType;
            var layout = frameChildRecord(childLayout, layout);
            childLayoutArray[childcount] =
                {
                    "name": ColumnLabel,
                    "type": ColumnType,
                    "layout": layout

                }
        }
        childcount++;
    }


    return childLayoutArray;
}


function getFileOperator() {
    return fileOperations.fileOperator;
}
