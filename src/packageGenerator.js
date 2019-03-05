/**
 * @description: HDPK: HPCC Data package. This generator generates the package with data files, layouts,
 * Datasources, ECL goodies; like functions, modules, makros containing ECL handy codes. Additionally 
 * Visualizer to draw charts. The source of information is *.hdpk as input data, metadata of all the above.
 * @requires *.hdpk
 * @author: Niyaz Ahamed
 * 
 */

var fileOperations = require('./fileOperations');
var chartGenerator = require('./chartGenerator');
var transforms = require('./transforms');
var packageExplorerProvider = require('../packageExplorer')
var vscode = require('vscode');


module.exports.packGen = {
    propFile: require('./dd/templates/schema'),
    //There may be a setting required for filepath to point to this path
    projDir: __dirname + '/',
    fieldTransformation: '',
    childTransformation: '',
    infoFile: '',
    childFuncTransformDefs: '',
    funcTransformDefs: '',
    packageDir: '',

    /**
     * HDPK is the package generated with ecl files consisting of data files, extra file
     * with ecl goodies, charts.ecl file with visualizer. Schema.ecl is the template 
     * used to create 
     * @param {Input file with predefined metadata for building packate} inputData 
     * @param {packDir} package directory path
     */
    generatePackage: function (inputData, packDir, isGridUpdate, panel) {


        getPackGen().infoFile = inputData;
        getPackGen().packageDir = packDir;
        var childRecords = '';
        var fileName = '';
        var filePath = '';
        data = '';
        var parentData = '';
        var fs = require('fs');
        for (var fileData of getPackGen().infoFile.data) {
            path = '';
            //Form the ECL layout data to write into above file
            for (var childLayout of fileData.layout) {
                //Start with child layout first, if exists (data.layout.layout)
                generateChildLayout(childLayout);
            }
            //Assured that the child data should have parent data
            data += '\n' + getPackGen().propFile.appLayout;

            parentData = '';
            for (var item of fileData.layout) {
                parentData += buildItem(item);
                //Build field specific tranformation for now and store for later to construct the export
                if (item.transforms && item.transforms.length > 0) {
                    getTransformer().buildOverallTransformation(item);
                }

            }

            // frame Layout Reference if available
            if (fileData.layoutReference) {
                parentData = generateLayoutReferance(fileData.layoutReference, parentData)
            }

            data = data.replace('hdpk_fields', parentData);

            path = generateLogicalpath(fileData);
            //get the template and replace the hdpk_fields with this application field
            //var templateData = fs.readFileSync('./dd/schema.tmp', 'utf8');
            try {
                var schemaFile = fs.readFileSync(getPackGen().projDir + 'dd/templates/schema.ecl', 'utf8');
                //var schemaFile = require('./dd/schema');
                var schema = schemaFile.replace(/schema/g, fileData.name);
                if (getPackGen().infoFile.info.packageName) {
                    schema = schema.replace('//imports', "IMPORT " + getPackGen().infoFile.info.packageName + ";");
                }
                schema = schema.replace(/logicalPath/g, path);
                schema = schema.replace('//layouts', data);
                data = '';
                schema = schema.replace('hdpk_format', fileData.format);
                //If transformations exists rename existing DS as the transformed export will be considered
                if (getPackGen().fieldTransformation || childRecords) {
                    schema = schema.replace("hdpk_Ds", "_hdpk_Ds")
                    if (childRecords) {
                        //Append child dataset transformation to parent and other
                        getPackGen().fieldTransformation += childRecords;
                        childRecords = '';
                    }
                    if (getPackGen().funcTransformDefs) {
                        //Append parent function/function marco variables to the transformation
                        getPackGen().fieldTransformation = getPackGen().funcTransformDefs + getPackGen().fieldTransformation;
                    }
                    var tempTransforms = getPackGen().propFile.RECORDTRANSFORMATION.replace("recordTransformation", getPackGen().fieldTransformation);
                    schema = schema.replace("//recordTransformations", tempTransforms);
                    getPackGen().fieldTransformation = '';
                    getPackGen().funcTransformDefs = '';
                } else {
                    schema = schema.replace("SHARED", "EXPORT");
                    schema = schema.replace("//recordTransformations", '');
                }
                //Replace all the occurance of hdpk_ to the name of the file
                schema = schema.replace(/hdpk_/g, fileData.name);
                // File will be created if it does not exist.
                //CREATE .ecl file in the package folder
                fileName = fileData.name + '.ecl';
                filePath = getPackGen().packageDir;
                console.log("Data files code is ready to write, writing: " + fileName);
                logger.info("Data files code is ready to write, writing: " + fileName);
                getFileOperator().createWriteToFile(filePath, schema, fileName);
            } catch (exp) {
                console.log(exp);
            }
        }


        generateECLCode();
        getChartGen().buildVisualizer();
        if (!isGridUpdate) {
            packExplorerProvider = new packageExplorerProvider();
            vscode.window.registerTreeDataProvider('packageExplorer', packExplorerProvider);
            panel.webview.postMessage({ command: "packageGenSuccess" });

        }


    }

}

/**
 * All Module exports below. Access them using get methods
 */
function getPackGen() {
    return module.exports.packGen;
}
function getChartGen() {
    return chartGenerator.chartGen;
}
function getTransformer() {
    return transforms.transformer;
}

function getFileOperator() {
    return fileOperations.fileOperator;
}

/**
 * Items are layout fields defined in the info input file
 * Read and build them to create the ecl layout field definiations.
 * @param {*} item 
 */
function buildItem(item) {
    var itemData = '';
    if (!item.type) {
        console.log("The layout field type cant be empty");
        return '';
    }
    if (item.type.toUpperCase() == "DATASET") {
        //for dataset children, DATASET(nameLayout)   name;
        itemData = '\t\t' + item.type.toUpperCase() + '(' + item.name + getPackGen().propFile.layout + ')'
            + ' ' + item.name + ';' + '\n';
    }
    else if (item.type.toUpperCase() == 'RECORD') {
        //else if(item.type == item.name) {
        //this is not a recordset but single record layout
        itemData = '\t\t' + item.name.toUpperCase() + getPackGen().propFile.layout + ' ' + item.name + ';' + '\n';
    }
    else {
        itemData = '\t\t' + item.type.toUpperCase() + item.size + ' ' + item.name + ';' + '\n';
    }


    return itemData;
}

/**
* generate ECL code if it exists in info file. The output File will have all the Exports with
* ECL Code. The Template used to build the file is Extras.ecl. Once the code is generated
* write the files named after layout names.
*/
function generateECLCode() {
    console.log("ECL definiations found. Trying to generate ECL code for Extras");
    logger.info("ECL definiations found. Trying to generate ECL code for Extras");
    if (!getPackGen().infoFile.ecl) {
        console.log("No ECL definiations found");
        return;
    }
    var fs = require('fs')
    var filePath = getPackGen().packageDir;
    var extrasFile = fs.readFileSync(getPackGen().projDir + 'dd/templates/extras.ecl', 'utf8');
    var eclCode = '';
    var imports = '';
    if (getPackGen().infoFile.info.packageName) {
        imports = "IMPORT " + getPackGen().infoFile.info.packageName + ";" + '\n';
    }
    for (var ecl of getPackGen().infoFile.ecl) {
        //Add export name and definition which is code defined in *.hdpk


        if (eclCode == '') {
            eclCode += '\n';
        }


        eclCode += getPackGen().propFile.export + ecl.name + " := " + ecl.code + ";" + '\n';
        if (ecl.dataLayoutName && ecl.dataLayoutName.toUpperCase().includes("IMPORT")) {
            imports += ecl.dataLayoutName + '\n';
        }
    }
    var data = extrasFile.replace('//ecl_code', eclCode);
    //irrespective of imports replace //imports 
    data = data.replace("//imports", imports);
    // File will be created if it does not exist. 
    console.log("Done generationg ECL definiations code. Writing it to: extras.ecl");
    logger.info("Done generationg ECL definiations code. Writing it to: extras.ecl");
    getFileOperator().createWriteToFile(filePath, data, 'extras.ecl');
}

//Generate path for single and multiple logical path
function generateLogicalpath(fileData) {
    if (fileData && fileData.logicalPath) {
        if (fileData.logicalPath.length > 1) {
            for (var init = 0; init < fileData.logicalPath.length; init++) {
                if (init == fileData.logicalPath.length - 1) {
                    path = path + "+'" + fileData.logicalPath[init] + "'";
                }
                else {
                    path = path + "+'" + fileData.logicalPath[init] + ",'" + "\n\t\t\t\t\t";
                }
            }
            logger.info(fileData.name + "is having multiple logical path")
            path = "'~{'\n\t\t\t\t\t" + path + '\n\t\t\t\t\t+' + "'}';";
        }
        else {
            path = path + "'~" + fileData.logicalPath[0] + "';";
        }
    }
    return path;
}

// generate Layout Reference if available
function generateLayoutReferance(layoutReference, data) {

    var splitLayout = layoutReference.split(".");
    data += '\t\t' + layoutReference + " " + splitLayout[splitLayout.length - 2] + ';' + '\n';
    return data;
}

function generateChildLayout(childLayout) {
    if (childLayout.layout) {
        var childData = '';
        for (var item of childLayout.layout) {
            //pass childlayout name as its required to add transforms
            childData += buildItem(item, childLayout.name);
            //Build field specific transformation for now and store for later to construct the export
            //the only way to build DATASET record transformation is by checking the record type of child
            if (item.transforms && childLayout.type.toUpperCase() == "DATASET") {
                getTransformer().buildChildDatasetTransformation(item);
            } else if (item.transforms && item.transforms.length > 0) {
                getTransformer().buildOverallTransformation(item, childLayout.name);
            }
            if (item.layout) {
                generateChildLayout(item);
            }
        }
        // frame Layout Reference if available
        if (childLayout.layoutReference) {
            childData = generateLayoutReferance(childLayout.layoutReference, childData)
        }


        data += getPackGen().propFile.appLayout;
        data = data.replace('hdpk_fields', childData);
        data = data.replace('hdpk_', childLayout.name);
        //add child transformation to the datasetchildRecordTransformation
        if (getPackGen().childTransformation) {
            childRecords = getPackGen().propFile.CHILDTRANSFORMATION;
            childRecords = childRecords.replace(/childName/g, childLayout.name);
            if (getPackGen().childFuncTransformDefs) {
                //append function/function macro variables in the beginning of transformation
                getPackGen().childTransformation = getPackGen().childFuncTransformDefs + getPackGen().childTransformation;
            }
            childRecords = childRecords.replace("childRecordTransformation", getPackGen().childTransformation);
            getPackGen().childTransformation = '';
            getPackGen().childFuncTransformDefs = '';
        }
    }
}