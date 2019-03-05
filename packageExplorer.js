// This file is to create package explorer for HDPK

var vscode = require('vscode');
var fs = require('fs');
var util = require('util');
var fileOperations = require('./src/fileOperations');
var logicalPathLoader = require('./src/logicalPathLoader')

var inputData = '';
var HTMLRender = require('./src/HTMLRender');
var packageGenerator = require('./src/packageGenerator');
var HPCCInvocation = require('./src/HPCCInvocation')

var gridPackage;
var gridLayout;
var title;
var panelForPackage;
var dataCount;
var inputDataObjForExistingPack;

var packGenKey = false;
var onloadExistingPackDataDef;
class packageExplorerProvider {

    constructor() {

        this.filesLst = FileFinder();
        this.childLst = ["Data", "ECL", "Visualizer"];

    }

    refresh() {
        this._onDidChangeTreeData.fire();

    }

    getTreeItem(element) {

        return element;
    }

    // Method to create all children in package explorer
    getChildren(element) {
        console.log("Entered into children");


        if (element) {
            switch (element.label) {
                //get All workunits for each package to display in package explorer
                case 'Visualizer':
                    return new Promise(resolve => {

                        resolve(this.getWorkUnits(element.contextValue));

                    });

            }

        }

        if (!element) {

            return new Promise(resolve => {
                //get pacakge list
                resolve(this.getPackages());

            });
        }

        //get Dataset list from each selected package

        else if (element.label == "Data") {

            return new Promise(resolve => {

                resolve(this.getDataChild(element.contextValue));


            });

        }

        //get path list from each selected DataSet Name
        else if (element.contextValue.includes("-path")) {


            return new Promise(resolve => {

                resolve(this.getDataChildPaths(element.contextValue));


            });
        }
        //Disable children if we select path
        else if (element.contextValue.includes("-grid")) {
            return Promise.resolve([]);

        }
        else if (element.contextValue.includes("-workunit")) {
            return Promise.resolve([]);

        }

        //get child details of each package such as Data,ECL,Visualizer etc..
        else if (element.label !== "Data" && element.label !== "ECL" && element.label !== "Visualizer") {
            if (!element.contextValue.includes("-path")) {

                //onDidReceiveMessage receive message event to load and display existing package details when onloading page.
                //same functionalities have been delegated to registerCommand below but that is when click on link in package explorer.
                panelForPackage.webview.onDidReceiveMessage(message => {

                    //loadExistingPackInfo to load package information details
                    //loadExistingPackDataDef to load Data Definition details
                    //generateVisualizer to regenerate visualizer with updated details
                    //packageGen to regenerate package with updated details

                    switch (message.command) {
                        case 'home':
                            packGenKey = false;
                            break;

                        case 'loadExistingPackInfo':
                            if (panelForPackage && panelForPackage.title) {
                                title = panelForPackage.title.split(" ");
                                var inputDataForExistingPack = fs.readFileSync(__dirname + "\\" + title[0] + "\\" + title[0] + '.hdpk', 'utf8');
                                inputDataObjForExistingPack = JSON.parse(inputDataForExistingPack);
                                panelForPackage.webview.postMessage({ command: "existingPackageInfo", packageInfo: inputDataObjForExistingPack.info });
                                break;
                            }
                        case 'loadExistingPackDataDef':
                            if (!onloadExistingPackDataDef) {
                                panelForPackage.webview.postMessage({ command: "existingPackageDataDef", DataDef: inputDataObjForExistingPack });
                                logicalPathLoader.loadLogicalPaths.loadLogicalPaths(panelForPackage);
                                onloadExistingPackDataDef = true;
                            }

                            break;
                        case 'generateVisualizer':
                            try {
                                if (panelForPackage && panelForPackage.title) {
                                    title = panelForPackage.title.split(" ");
                                    var packPath = __dirname + "\\" + title[0] + "\\";
                                    var inputDataForExistingPack = fs.readFileSync(packPath + title[0] + '.hdpk', 'utf8');
                                    inputDataObjForExistingPack = JSON.parse(inputDataForExistingPack);
                                    inputDataObjForExistingPack.visualizer = message.visualizer;
                                    var packWithVisu = JSON.stringify(inputDataObjForExistingPack);
                                    getFileOperator().createWriteToFile(packPath, packWithVisu, title[0] + '.hdpk');
                                    packageGenerator.packGen.generatePackage(inputDataObjForExistingPack, packPath, false, panelForPackage);
                                    break;
                                }
                            }
                            catch (e) {
                                console.log(e);

                            }
                        case 'packageGen':
                            console.log("Entered into existing package generation");

                            if (packGenKey == false) {
                                var layoutName = [];
                                var logicalPath = [];
                                layoutName = message.layoutName;
                                logicalPath = message.logicalPath;
                                var dataDefCnt;


                                dataCount = 0;
                                dataDefCnt = 0;
                                if (layoutName instanceof Array) {
                                    for (var layout of layoutName) {

                                        HPCCInvocation.HPCCInvocation.invokeHPCC(layout, logicalPath[dataCount], inputDataObjForExistingPack.info, dataDefCnt, panelForPackage, layoutName.length);
                                        dataCount++;
                                        dataDefCnt++
                                    }
                                }
                                else {
                                    HPCCInvocation.HPCCInvocation.invokeHPCC(layoutName, logicalPath, inputDataObjForExistingPack.info, null, panelForPackage);
                                }

                                packGenKey = true;


                            }
                            break;
                    }
                });


                return new Promise(resolve => {

                    resolve(this.getChildPackages(element.contextValue));

                });
            }
        }

        else {
            return;
        }


    }
    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */

    /*   Below getPackages, getChildPackages, getDataChild, getDataChildPaths and getWorkUnits are used to
      frame child values to each */
    getPackages() {


        const toDep = (moduleName) => {
            if (moduleName == "") {
                return new Files(moduleName, moduleName, vscode.TreeItemCollapsibleState.None);
            }
            return new Files(moduleName, moduleName, vscode.TreeItemCollapsibleState.Collapsed);


        }

        const deps = this.filesLst
            ? Object.keys(this.filesLst).map(dep => toDep(this.filesLst[dep]))
            : [];

        return deps;
    }
    getChildPackages(packageName) {


        const toDep = (moduleName, packageName) => {
            return new Files(moduleName, packageName, vscode.TreeItemCollapsibleState.Collapsed);


        }

        const deps = this.childLst
            ? Object.keys(this.childLst).map(dep => toDep(this.childLst[dep], packageName))
            : [];

        return deps;
    }


    getDataChild(packageName) {

        const toDep = (moduleName, packageName) => {
            return new Files(moduleName, packageName, vscode.TreeItemCollapsibleState.Collapsed);

        }

        try {
            inputData = fs.readFileSync(__dirname + "/" + packageName + "/" + packageName + '.hdpk', 'utf8');
            if (inputData) {
                inputData = JSON.parse(inputData);
            }
        }
        catch (err) {
            console.log(err);
        }

        const deps = inputData.data
            ? Object.keys(inputData.data).map(dep => toDep(inputData.data[dep].name, packageName + "-" + inputData.data[dep].name + "-path"))
            : [];

        return deps;
    }



    getDataChildPaths(contextValue) {

        const toDep = (moduleName, packageName) => {
            return new Files(moduleName, packageName, vscode.TreeItemCollapsibleState.Collapsed);

        }

        var layout = [];
        var contextSplit = contextValue.split("-");
        if (contextSplit[0] != inputData.info.packageName) {
            var inputDataForExistingPack = fs.readFileSync(__dirname + "\\" + contextSplit[0] + "\\" + contextSplit[0] + '.hdpk', 'utf8');
            inputData = JSON.parse(inputDataForExistingPack);
        }
        for (var layoutData of inputData.data) {
            if (contextSplit[1] == layoutData.name) {
                layout = layoutData.logicalPath;
            }
        }

        const deps = layout
            ? Object.keys(layout).map(dep => toDep(layout[dep], contextSplit[0] + "-" + contextSplit[1] + "-grid"))
            : [];
        return deps;
    }

    getWorkUnits(packageName) {



        const toDep = (moduleName, packageName) => {
            return new Files(moduleName, packageName, vscode.TreeItemCollapsibleState.Collapsed);

        }

        try {
            inputData = fs.readFileSync(__dirname + "/" + packageName + "/" + packageName + '.hdpk', 'utf8');
            if (inputData) {
                inputData = JSON.parse(inputData);
            }
        }
        catch (err) {
            console.log(err);
        }

        const deps = inputData.visualizer
            ? Object.keys(inputData.visualizer).map(dep => toDep(inputData.visualizer[dep].outputName, packageName + "-" + inputData.visualizer[dep].outputName + "-workunit"))
            : [];

        return deps;
    }

}

class Files extends vscode.TreeItem {

    constructor(
        label,
        packageName,
        collapsibleState

    ) {
        super(label, collapsibleState);
        super.contextValue = packageName;

        super.command = {
            command: "existingPackageDetails",
            arguments: [label, packageName],
            title: "existingPackageDetails"
        };;
    }

}
// find all hdpk files to display package list in package explorer
function FileFinder() {
    try {
        var readdirpSync = require('fs-readdirp').readdirpSync;
        var files = readdirpSync(__dirname, function (filePath, stats) {
            if (!filePath.includes("node_modules") && filePath.includes(".hdpk"))
                return filePath.substr(filePath.lastIndexOf('\\') + 1).replace('.hdpk', '');
            return false;
        });
    }

    catch (e) {
        console.log(e)

    }

    return files;
}


function getFileOperator() {
    return fileOperations.fileOperator;
}

//Above same loading existing package details functionalities have been delegated to this registerCommand but it is when click on link in package explorer.
vscode.commands.registerCommand('existingPackageDetails', function (label, contextValue) {

    console.log("Entered into display existingPackageDetails");

    if (panelForPackage && panelForPackage._isDisposed == true) {

        panelForPackage = vscode.window.createWebviewPanel(label, label, vscode.ViewColumn.One, {

            enableScripts: true

        });
    }


    //loadExistingPackDataDef to load Data Definition details

    if (label == "Data") {
        panelForPackage.reveal(vscode.ViewColumn.One)
        packGenKey = false;
        panelForPackage.title = contextValue;
        title = panelForPackage.title.split(" ");
        var inputDataForExistingPack = fs.readFileSync(__dirname + "\\" + title[0] + "\\" + title[0] + '.hdpk', 'utf8');
        inputDataObjForExistingPack = JSON.parse(inputDataForExistingPack);
        panelForPackage.webview.html = HTMLRender.HTMLRender.HTMLViewForDataDef();
        panelForPackage.webview.postMessage({ command: "existingPackageDataDef", DataDef: inputDataObjForExistingPack });
        logicalPathLoader.loadLogicalPaths.loadLogicalPaths(panelForPackage);
        onloadExistingPackDataDef = true;

    }
    //load grid respect to selected path in package explorer
    else if (contextValue.includes("-grid")) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        const splitContext = contextValue.split("-");
        gridPackage = splitContext[0];
        gridLayout = splitContext[1];

        var panel = vscode.window.createWebviewPanel(gridPackage + " " + gridLayout + ' Definitions', gridPackage + " " + gridLayout + ' Definitions', column || vscode.ViewColumn.One, {

            enableScripts: true

        });


        // And set its HTML content
        panel.webview.html = HTMLRender.HTMLRender.HTMLViewForSchemaDetails();




        panel.webview.onDidReceiveMessage(message => {


            switch (message.command) {
                //Load grid for selected path in package explorer
                case 'loadGrid':

                    if (panel && panel.title) {
                        title = panel.title.split(" ");
                        var inputDataForGrid = fs.readFileSync(__dirname + "\\" + title[0] + "\\" + title[0] + '.hdpk', 'utf8');
                        var myobj = JSON.parse(inputDataForGrid);
                        for (var dataVal of myobj.data) {
                            if (dataVal.name == title[1]) {
                                var layout = dataVal.layout;
                                panel.webview.postMessage({ command: "gridDisplay", layoutName: dataVal.name, packName: title[0], layoutDef: layout, dataDef: myobj });

                            }
                        }
                    }
                    break;

                //Update grid for selected path in package explorer and regenerate package with updated values

                case 'updateGrid':
                    try {
                        var myJSON = JSON.stringify(message.updatedHDPK);
                        getFileOperator().createWriteToFile(__dirname + "\\" + title[0] + "\\", myJSON, title[0] + ".hdpk");
                        packageGenerator.packGen.generatePackage(message.updatedHDPK, __dirname + "\\" + title[0] + "\\", true);
                    }
                    catch (err) {
                        console.log(err);
                    }
                    break;


            }


        });
        return Promise.resolve([]);
    }

    else if (contextValue.includes("-workunit")) {

        //overload console.log and log in file
        /* var fs = require('fs');
        var log_file = fs.createWriteStream(__dirname + '/debugSakthiWU.log', { flags: 'w' });

        console.log = function (d) {
            log_file.write(d + '\n');
        }; */


        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        const splitContext = contextValue.split("-");
        graphPackage = splitContext[0];
        graphName = splitContext[1];

        var panelForGraph = vscode.window.createWebviewPanel(graphPackage + " " + graphName + ' Graph', graphPackage + " " + graphName + ' Graph', column || vscode.ViewColumn.One, {

            enableScripts: true

        });

        let launchConfig = {

            "name": "localhost-hthor",
            "type": "ecl",
            "request": "launch",
            "mode": "submit",
            "workspace": "${workspaceRoot}",
            "program": "${workspaceFolder}\\Demo\\charts\\taxiOut.ecl",
            "protocol": "http",
            "serverAddress": "10.66.144.88",
            "port": 8010,
            "rejectUnauthorized": false,
            "targetCluster": "hthor",
            "eclccPath": "${config:ecl.eclccPath}",
            "eclccArgs": [],
            "includeFolders": "${config:ecl.includeFolders}",
            "legacyMode": "${config:ecl.legacyMode}",
            "resultLimit": 100,
            "user": "",
            "password": ""
        };
        let launchConfig1 = {
            name: "localhost-hthor",
            type: "ecl",
            request: "launch",
            mode: "submit",
            workspace: __dirname,
            program: __dirname + "\\Demo\\charts\\taxiOut.ecl",
            protocol: "http",
            serverAddress: "10.66.144.88",
            port: 8010,
            rejectUnauthorized: false,
            targetCluster: "hthor",
            eclccPath: "${config:ecl.eclccPath}",
            eclccArgs: [],
            includeFolders: "${config:ecl.includeFolders}",
            legacyMode: "${config:ecl.legacyMode}",
            resultLimit: 100,
            user: "",
            password: ""
        }
        /* 
                            vscode.commands.executeCommand('startSessionCommand', launchConfig).then(() => {
                                vscode.window.showInformationMessage('OK!');
                            }, err => {
                                vscode.window.showInformationMessage('Error: ' + err.message);
                            });
         */
        var token = vscode.CancellationTokenSource.prototype.token;
        var objLaunch = {
            __dirname, launchConfig, token
        };

        try {
            vscode.debug.registerDebugConfigurationProvider("ecl", objLaunch);

            /*   vscode.debug.startDebugging(undefined, {
                  name: "localhost-hthor",
                  type: "ecl",
                  request: "launch",
                  mode: "submit",
                  workspace: __dirname,
                  program: __dirname + "\\Demo\\charts\\taxiOut.ecl",
                  protocol: "http",
                  serverAddress: "10.66.144.88",
                  port: 8010,
                  rejectUnauthorized: false,
                  targetCluster: "hthor",
                  eclccPath: "${config:ecl.eclccPath}",
                  eclccArgs: [],
                  includeFolders: "${config:ecl.includeFolders}",
                  legacyMode: "${config:ecl.legacyMode}",
                  resultLimit: 100,
                  user: "",
                  password: ""
              })
                  .then(success => console.log(success)); */

        }
        catch (e) {
            console.log(e);
        }


        // And set its HTML content
        panelForGraph.webview.html = HTMLRender.HTMLRender.HTMLViewForGraph();


        // Display visualizer graph for corresponding selected visualizer output
        panelForGraph.webview.onDidReceiveMessage(message => {


            switch (message.command) {

                case 'loadGraph':


                    if (panelForGraph && panelForGraph.title) {
                        title = panelForGraph.title.split(" ");
                        var eclData = fs.readFileSync(__dirname + "\\" + title[0] + "\\charts\\" + title[1] + '.ecl', 'utf8');
                        panelForGraph.webview.postMessage({ command: "displayGraph", eclData: eclData });

                    }
                    break;



            }


        });


        return Promise.resolve([]);

    }


    //loadExistingPackInfo to load package information details

    else if (label !== "Data" && label !== "ECL" && label !== "Visualizer") {
        if (!contextValue.includes("-path")) {
            packGenKey = false;
            if (!panelForPackage) {


                panelForPackage = vscode.window.createWebviewPanel(label, label, vscode.ViewColumn.One, {

                    enableScripts: true

                });
                panelForPackage.webview.html = HTMLRender.HTMLRender.HTMLViewForHome();

            }
            else {
                try {
                    panelForPackage.title = label;
                    panelForPackage.reveal(vscode.ViewColumn.One)

                    title = panelForPackage.title.split(" ");
                    var inputDataForExistingPack = fs.readFileSync(__dirname + "\\" + title[0] + "\\" + title[0] + '.hdpk', 'utf8');
                    inputDataObjForExistingPack = JSON.parse(inputDataForExistingPack);
                    panelForPackage.webview.html = HTMLRender.HTMLRender.HTMLViewForHome();
                    panelForPackage.webview.postMessage({ command: "existingPackageInfo", packageInfo: inputDataObjForExistingPack.info });

                }
                catch (e) {
                    console.log(e);
                }
            }


            panelForPackage.onDidChangeViewState(message => {
                onloadExistingPackDataDef = false;

            });

        }
    }

    // Generate or Update visualizer ECL files for each package
    else if (label == "Visualizer") {
        panelForPackage.reveal(vscode.ViewColumn.One)
        packGenKey = false;
        panelForPackage.title = contextValue;
        title = panelForPackage.title.split(" ");
        var inputDataForExistingPack = fs.readFileSync(__dirname + "\\" + title[0] + "\\" + title[0] + '.hdpk', 'utf8');
        inputDataObjForExistingPack = JSON.parse(inputDataForExistingPack);
        panelForPackage.webview.html = HTMLRender.HTMLRender.HTMLViewForVisualizer();
        panelForPackage.webview.postMessage({ command: "Visualizer", DataDef: inputDataObjForExistingPack });
        onloadExistingPackDataDef = true;


    }



});

module.exports = packageExplorerProvider;

