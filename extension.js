/**
 * @description: HDPK: HPCC Data package. This generator generates the package with data files, layouts,
 * Datasources, ECL goodies, like functions, modules, makros containing ECL handy codes. Additionally 
 * Visualizer to draw charts. The source of information is *.hdpk, metadata of all the above.
 * 
 * @author: Niyaz Ahamed
 * 
 */
var vscode = require('vscode');
var packageGenerator = require('./src/packageGenerator');
var winston = require('winston');
var fs = require('fs');
var HPCCInvocation = require('./src/HPCCInvocation')
var HTMLRender = require('./src/HTMLRender')
var logicalPathLoader = require('./src/logicalPathLoader')
var packageExplorerProvider = require('./packageExplorer')
var packExplorerProvider = new packageExplorerProvider();
var panel;

require('babel-register')({
    presets: ['env']
})

createLogger();

// Create logger to load log file
function createLogger() {

    propFile = packageGenerator.packGen.propFile;

    //Define log level whether all error , warning, debug,info should loaded or only error
    //if isDebugEnable is diabled then error alone will be loaded
    //if isDebugEnable is enabled then all error , warning, debug,info will be loaded

    if (propFile.isDebugEnable) {
        levelVal = 'debug';
    }
    else {
        levelVal = 'error';
    }

    logger = new (winston.Logger)({
        transports: [
            new winston.transports.File({ name: 'info', level: levelVal, filename: __dirname + "/" + propFile.LOG_FILE_PATH, json: false })
        ]
    });


}

//
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    vscode.window.showInformationMessage("Congratulations, your extension hdpk is now active!")

    vscode.window.registerTreeDataProvider('packageExplorer', packExplorerProvider);
    //vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());


    console.log('Congratulations, your extension "hdpk" is now active!');
    context.subscriptions.push(startLintingOnSaveWatcher());

    var disposable = vscode.commands.registerCommand('extension.hdpk', function () {
        //Initialization for hdpk goes here. All the actions are on .hdpk file save event



    });

    console.log("Open and save your workspace *.hdpk file to trigger the package generation.");
    logger.info("Open and save your workspace *.hdpk file to trigger the package generation.");



    context.subscriptions.push(disposable);
}
exports.activate = activate;

function startLintingOnSaveWatcher() {

    webviewAPIForHDPK();

    return vscode.workspace.onDidSaveTextDocument(document => {
        console.log("onDidSaveTextDocument event received.");
        logger.info("onDidSaveTextDocument event received.");
        if (document.fileName.indexOf('.hdpk') !== -1) {
            console.log("Save of input file, *.hdpk detected. Triggering to generate package hdpk.");
            logger.info("Save of input file, *.hdpk detected. Triggering to generate package hdpk.");
            callPackageGenerator(document.fileName);
            return;
        }
    });
}
exports.callPackageGenerator = callPackageGenerator;
exports.createLogger = createLogger;
function callPackageGenerator(filePath) {
    vscode.window.showInformationMessage("Save of input file, *.hdpk detected. Triggering to generate package hdpk.")
    logger.info("Save of input file, *.hdpk detected. Triggering to generate package hdpk.")
    var inputData = '';
    var packagePath = __dirname + '/';
    try {
        inputData = fs.readFileSync(filePath, 'utf8');
        if (inputData) {
            inputData = JSON.parse(inputData);
        }
    } catch (err) {
        console.log("cant read input file .hdpk. Error: " + err);
        logger.error("cant read input file .hdpk. Error: " + err);
        return;
    }
    //Generate ECL file with layouts
    if (inputData) {
        if (inputData.info.packageName) {
            packagePath += inputData.info.packageName + '/';
        } else {
            //default the package name to sample as sometime user might forget to add this property
            console.log("Did you forget to define property packageName?");
            logger.warn("Did you forget to define property packageName?");
            return;
        }
        packageGenerator.packGen.generatePackage(inputData, packagePath);

        vscode.window.showInformationMessage("Package is generated successfully!!.")
    } else {
        console.log("No data in the input file, cannot create package");
        logger.warn("No data in the input file, cannot create package");
    }
    return;
}

// this method is called when your extension is deactivated
function deactivate() {
    // Close the opened file.
    //    fs.close(fd, function (err) {
    //        if (err) throw err;
    //    });
}


function webviewAPIForHDPK() {

    //web API
    console.log("web starts")

    panel = vscode.window.createWebviewPanel('HDPK Definitions', "HDPK Definitions", vscode.ViewColumn.One, {

        enableScripts: true

    });



    // And set its HTML content
    panel.webview.html = HTMLRender.HTMLRender.HTMLViewForHome();

    panel.webview.onDidReceiveMessage(message => {


        switch (message.command) {
            // Load webpage to fill package information details.
            case 'home':
                panel.webview.html = HTMLRender.HTMLRender.HTMLViewForHome();
                break;

            // Load webpage to fill data definition details for package.

            case 'info':
                panel.webview.html = HTMLRender.HTMLRender.HTMLViewForDataDef();
                console.log("message received" + message.packageName)
                packageInfo = message;
                logicalPathLoader.loadLogicalPaths.loadLogicalPaths(panel);
                break;

            //Generate package with given details such as package info , dataDefinition.
            case 'packageGen':

                layoutName = [];
                logicalPath = [];
                layoutName = message.layoutName;
                logicalPath = message.logicalPath;
                console.log("package details" + packageInfo.packageName + "--" + layoutName + "--" + logicalPath)


                dataCount = 0;
                dataDefCount = 0;
                if (layoutName instanceof Array) {
                    for (layout of layoutName) {

                        HPCCInvocation.HPCCInvocation.invokeHPCC(layout, logicalPath[dataCount], packageInfo, null, panel, layoutName.length);
                        dataCount++;
                    }
                }
                else {
                    HPCCInvocation.HPCCInvocation.invokeHPCC(layoutName, logicalPath, packageInfo, null, panel);
                }


                /*                 panel.webview.html = HTMLRender.HTMLRender.HTMLViewForSuccess();
                 */
                console.log("end")

                break;



        }

    }


    );



}





exports.deactivate = deactivate;

