/**
 * @description: HDPK: HPCC Data package. This file is to generate all the charts using visualizer
 * Plain data is boring. It can be eye catching when inserted or displayed using visualizer. 
 * Charts.ecl is created with charts adding the data fileds 
 * @requires info.jsos,packageGenerator.js,templates
 * @author: Niyaz Ahamed
 * 
 */

var packageGenerator = require('./packageGenerator');
var fileOperations = require('./fileOperations');
module.exports.chartGen = {
    /** 
    * Build the visualizer. The Charts.ecl is the template used to replace code
    * The output file is the Charts.ecl with imports, outputs and the chart type.
    */
    buildVisualizer() {
        console.log("Found Visualizer, building it now");
        logger.info("Found Visualizer, building it now");
        if (!getPackGen().infoFile.visualizer) {
            console.log("No Visualizer definiations found");
            return;
        }
        var imports = '';
        var fs = require('fs');

        if (getPackGen().infoFile.info.packageName) {
            imports = "IMPORT " + getPackGen().infoFile.info.packageName + ";" + '\n';
        }
        for (var visualizer of getPackGen().infoFile.visualizer) {
            var eclCode = '';
            var visualizerData = '';

            if (visualizer.dataSource) {
                if (visualizer.dataSource.toUpperCase().includes("ECL.")) {

                    for (var ecl of getPackGen().infoFile.ecl) {
                        //the visualizer is associated with ECL code
                        if (visualizer.dataSource.toUpperCase().includes(ecl.name.toUpperCase())) {
                            //Assuming Visualizer works on actions and Output is the the best way to visualize
                            //Add output. Name of output is the visualizer outputName
                            eclCode += "OUTPUT(" + ecl.code + ",NAMED('" + visualizer.outputName + "'));";
                        }
                        if (ecl.dataLayoutName && ecl.dataLayoutName.toUpperCase().includes("IMPORT")) {
                            imports += ecl.dataLayoutName + '\n';
                        }
                    }
                }

                else {
                    eclCode += "OUTPUT(" + getPackGen().infoFile.info.packageName + "." + visualizer.dataSource + "." + visualizer.dataSource + "Ds" + ",NAMED('" + visualizer.outputName + "'));";
                }

            }


            visualizerData += formVisualizer(visualizer) + '\n';

            var filePath = getPackGen().packageDir;
            var extrasFile = fs.readFileSync(getPackGen().projDir + 'dd/templates/charts.ecl', 'utf8');
            var data = extrasFile.replace("//output", eclCode);
            //irrespective of imports replace //imports 
            data = data.replace("//imports", imports);
            data = data.replace("//chart", visualizerData);
            console.log("Visualizer, code is built, trying to create file");
            logger.info("Visualizer, code is built, trying to create file");
            getFileOperator().createWriteToFile(filePath + "\\charts\\", data, visualizer.outputName + '.ecl');
        }
    }
}

/**
 * All the module exports go right below
 */
function getPackGen() {
    return packageGenerator.packGen;
}

function getFileOperator() {
    return fileOperations.fileOperator;
}

/**
 * Create and assign all visualizer field and values. Read them from input file
 * @param {*} visualizer 
 */
function formVisualizer(visualizer) {
    //Visualizer.type(/*name_Chart*/, /*datasource*/, /*outputname*/, /*mappings*/, 
    ///*filteredBy*/, /*dermatologyProperties*/ );
    var data = getPackGen().propFile.VISUALIZE;
    data = data.replace("type", visualizer.type);
    data = data.replace("/*name_Chart*/", visualizer.name);
    //data = data.replace("/*datasource*/", visualizer.dataSource);
    data = data.replace("/*outputName*/", visualizer.outputName);
    if (visualizer.mappings) {
        data = data.replace("/*mappings*/", visualizer.mappings);
    }
    if (visualizer.filteredBy) {
        data = data.replace("/*filteredBy*/", visualizer.filteredBy);

    }
    if (visualizer.properties) {
        data = data.replace("/*dermatologyProperties*/", visualizer.properties);

    }

    return data;
}