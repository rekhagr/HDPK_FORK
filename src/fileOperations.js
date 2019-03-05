/**
 * @description: HDPK: HPCC Data package. File operations like read write directory
 * status and make directory are operated using fs
 * @author: Niyaz Ahamed
 */
module.exports.fileOperator = {
    /*
    * create <data->name>.ecl files if not exists. If exists write to it
    * The files will have Layouts, DS and all other Exports related.
    * Schema.ecl and schema.json are the template and json file used to create data files.
    */
    createWriteToFile(filePath, data, fileName) {
        /* TODO: Compile the ECL data generated to see if no errors
            Check errors and if any auto correct it or throw an exception before write
            var syntax = vscode.commands.executeCommand('ecl.checkSyntax',data );
        */

        data = formatFile(data);

        var fs = require('fs');
        checkIfNotCreateDirectorySync(filePath);
        var writeStream = fs.createWriteStream(filePath + fileName);
        writeStream.write(data);
        writeStream.close();
        console.log('Data Package, created file: ' + fileName);
    }
}

/**
 * Check the directory status synchronously as it tries to write immediately
 * If exists return if not create one if exception the package is not created.
 * @param {path of the directory} directory 
 */
function checkIfNotCreateDirectorySync(directory) {
    var fs = require('fs');
    try {
        fs.statSync(directory);
    } catch (exp) {
        console.log("Directory do not exist. Trying to create one");
        try {
            fs.mkdirSync(directory);
        } catch (exp) {
            console.log("Cant create directory Error: " + exp)
        }
    }
}


function formatFile(data) {


    data = data.replace(new RegExp('TRANSFORM', 'g'), '\n\t\t\t\tTRANSFORM')
    data = data.replace(new RegExp('SELF', 'g'), '\n\t\t\t\t\tSELF');

    return data;
}
