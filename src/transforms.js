/**
 * @description: HDPK: HPCC Data package. This file is to generate all the transaformations
 * Transforms on the fields are important as they change the dimension of look and feel of 
 * the data. The Transforms can be standard or user defined functions or function macros
 * @requires info.jsos,packageGenerator.js,templates
 * @author: Niyaz Ahamed
 * 
 */

var packageGenerator = require('./packageGenerator');

module.exports.transformer = {
    /*
    *If child record is a dataset then build separate transformation
    */
    buildChildDatasetTransformation (item) {
        //its a child DATASET create child dataset transformation
        getPackGen().childTransformation += getPackGen().propFile.ASSIGNFIELDNAME;
        getPackGen().childTransformation += buildTransformFunction(item, "DATASET");
        getPackGen().childTransformation = getPackGen().childTransformation.replace(/fieldName/g, item.name);
        getPackGen().childTransformation += ',';
    },

    buildOverallTransformation (item, childDSName) {    
        getPackGen().fieldTransformation += getPackGen().propFile.ASSIGNFIELDNAME;
        getPackGen().fieldTransformation += buildTransformFunction(item, childDSName);
        if(childDSName) {
            //If child data set then its LEFT.child.name
            getPackGen().fieldTransformation = getPackGen().fieldTransformation.replace(/fieldName/g, childDSName + '.' + item.name); 
        } else {
            //non child transformation
            getPackGen().fieldTransformation = getPackGen().fieldTransformation.replace(/fieldName/g, item.name);
        }
        getPackGen().fieldTransformation += ',';
    }
};
/**
 * All the module exports go right below
 */
function getPackGen() {
    return packageGenerator.packGen;
}
/**
 * Transaforms Can be ECL defined or User defined functions or function makros. 
 * The default here is considered ECL which is defined in the input file
 * @param {*} item the individual field on which the transformation is applied
 * @param {*} childDSName true If the transformation to apply is on child DS
 */
function buildTransformFunction (item, childDSName) {
    //Fill in field specific transformation like below commented
    //"TRANSFORM" : "EXPORT hdpk_Ds := PROJECT(_hdpk_Ds, TRANSFORM(RECORDOF(LEFT), recordTransformation, SELF = LEFT));",
    //"TRANSFORMATION" : "SELF.fieldName := getPackGen().fieldTransformation,"
    var fieldTrans = 'LEFT.fieldName';
    for(var transform of item.transforms) {
        console.log("Transforming field, into function:", item.name, transform);
        switch (transform.toUpperCase()) {
            case 'TRIM':
                fieldTrans = fieldTrans.replace("LEFT.fieldName", "TRIM(LEFT.fieldName)");
                break;
            case 'TRIRIGHT':
                fieldTrans = fieldTrans.replace("LEFT.fieldName", "TRIM(LEFT.fieldName, Right)");               
                break;
            case 'TRIMBOTH':
                fieldTrans = fieldTrans.replace("LEFT.fieldName", "TRIM(LEFT.fieldName, Left, Right)");
                break;
            case 'TRIMALL':
                fieldTrans = fieldTrans.replace("LEFT.fieldName", "TRIM(LEFT.fieldName, All)");
                break;
            case 'UPPERCASE':
                if (item.type.toUpperCase().includes("STRING")) {
                    fieldTrans = fieldTrans.replace("LEFT.fieldName", "STD.Str.ToUpperCase(LEFT.fieldName)");
                }
                else if (item.type.toUpperCase().includes("UNICODE") || item.type.toUpperCase().includes("UTF")){
                    fieldTrans = fieldTrans.replace("LEFT.fieldName", "STD.Uni.ToUpperCase(LEFT.fieldName)");
                } else {
                    console.log("Invalid type to transform Uppercase on the filed");
                }
                break;
            case 'LOWERCASE':
                if (item.type.toUpperCase().includes("STRING")) {
                    fieldTrans = fieldTrans.replace("LEFT.fieldName", "STD.Str.ToLowerCase(LEFT.fieldName)");
                }
                else if (item.type.toUpperCase().includes("UNICODE") || item.type.toUpperCase().includes("UTF")){
                    fieldTrans = fieldTrans.replace("LEFT.fieldName", "STD.Uni.ToLowerCase(LEFT.fieldName)");
                } else {
                    console.log("Invalid type to transform Lowercase on the filed");
                }
                break;
            default:
                if(transform.toUpperCase().includes("ECL")) {
                    fieldTrans = fieldTrans.replace("LEFT.fieldName", transformECLCode(transform, item.name, childDSName));
                } else {
                    console.log("No matching case to transform on the field: " + item.name);
                }
        }
    }
    return fieldTrans;
}

/**
* The embedded ECL functions or any sort of ECL code to transform the field
* The variables are created to avoid type mismatches and passed to the functions
* The variables are prefixed with _ to avoid keyword coflict.
 * @param {*} transform type and name
 * @param {*} itemName the name of the field the transformation applied
 * @param {*} childDSName check if child dataset or inherited child
 */
function transformECLCode (transform, itemName, childDSName){    
    if(!getPackGen().infoFile.ecl) {
        console.log("No ECL definiations found");
        return;
    }
    var code = '';
    //search for ECL code
    for(var eclData of getPackGen().infoFile.ecl) {
        if(transform.includes(eclData.name)) {
            var code = eclData.code;
            if (code) {
                //name is template keyword, which is standard in json definition
                //Prefixed itemName
                var prefixedItemName = "_" + itemName;
                code = code.replace("'name'", prefixedItemName);
                code = code.replace(";", "");

                //For functions or function macros the variable should be defined before
                //passing as function variable. So, below defining the variable in the Transform
                //Prefix the variables with '_'
                if (childDSName) {
                    if (childDSName == "DATASET") {
                        //dataset transformation fields
                        getPackGen().childFuncTransformDefs += prefixedItemName + ":=LEFT." + itemName + ";";
                    } else {
                        //record transformation fields
                        getPackGen().funcTransformDefs += prefixedItemName + ":= LEFT." + childDSName + '.' + itemName + ";";
                    }
                } else {
                    //no children here all fields are parents
                    getPackGen().funcTransformDefs += prefixedItemName + ":= LEFT." + itemName + ";" ;
                }
            } else {
                console.log("No ECL code found to transform the field");
            }
            return code;
        }
    }
    return;
}
