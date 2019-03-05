var request = require('request')

module.exports.loadLogicalPaths = {

    //Load all logical paths from cluster
    //Below IP Address can be changed if we would to like to point different cluster

    loadLogicalPaths: function (panel) {
        var url = "http://" + "10.66.144.88:8010/WsDfu/DFUQuery.json";

        var formData = { PageSize: 10000 }

        request({
            url,
            formData: formData
        }, function (error, response, body) {
            // Do more stuff with 'body' here

            var parsedResp = JSON.parse(body);
            var logicalPathList = parsedResp.DFUQueryResponse.DFULogicalFiles.DFULogicalFile;

            panel.webview.postMessage({ command: "loadLogicalPaths", logicalPathList: logicalPathList });
            console.log("Logical paths are loaded!!");

        });


    }
}
