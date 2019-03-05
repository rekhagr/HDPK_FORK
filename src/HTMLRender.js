var vscode = require('vscode');
var path = require('path');

//load required scripts for visualizer to display in webview 
const utilOnDisk = vscode.Uri.file(path.join(__dirname.replace('src', ''), 'node_modules/@hpcc-js/util/dist', 'index.min.js'));
const utilURI = utilOnDisk.with({ scheme: 'vscode-resource' });
const commonOnDisk = vscode.Uri.file(path.join(__dirname.replace('src', ''), 'node_modules/@hpcc-js/common/dist', 'index.min.js'));
const commonURI = commonOnDisk.with({ scheme: 'vscode-resource' });
const apiOnDisk = vscode.Uri.file(path.join(__dirname.replace('src', ''), 'node_modules/@hpcc-js/api/dist', 'index.min.js'));
const apiURI = apiOnDisk.with({ scheme: 'vscode-resource' });
const chartOnDisk = vscode.Uri.file(path.join(__dirname.replace('src', ''), 'node_modules/@hpcc-js/chart/dist', 'index.min.js'));
const chartURI = chartOnDisk.with({ scheme: 'vscode-resource' });
const commsOnDisk = vscode.Uri.file(path.join(__dirname.replace('src', ''), 'node_modules/@hpcc-js/comms/dist', 'index.min.js'));
const commsURI = commsOnDisk.with({ scheme: 'vscode-resource' });

const imagePathOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/images', 'logo.png'));
const packageOnDisk = vscode.Uri.file(path.join(__dirname, 'package.json'));

//load required CSS files to display in webview 
const bootstrapOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'bootstrap.min.css'));
const fontOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'font-awesome.min.css'));
const stylePathOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'styles.css'));
const dhtmlxgridOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'dhtmlxgrid.css'));
const dhtmlxgrid_dhx_skyblueOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'dhtmlxgrid_dhx_skyblue.css'));
const dhtmlxOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'dhtmlx.css'));
const select2OnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'select2.css'));

const hpcc_vizOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'hpccviz.js'));
const indexJsOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'index.js'));
const indexCssOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/css', 'index.css'));
const hpcc_vizUri = hpcc_vizOnDisk.with({ scheme: 'vscode-resource' });
const indexJsUri = indexJsOnDisk.with({ scheme: 'vscode-resource' });
const indexCssUri = indexCssOnDisk.with({ scheme: 'vscode-resource' });


//load required scripts to display package and data definition in webview 
const jqueryOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'jquery.min.js'));
const bootstrapJsOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'bootstrap.min.js'));
const scriptPathOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'validation.js'));
const dhtmlxcommonOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'dhtmlxcommon.js'));
const dhtmlxgridJsOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'dhtmlxgrid.js'));
const dhtmlxJsOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'dhtmlx.js'));
const dhtmlxdataprocessorOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'dhtmlxdataprocessor.js'));
const select2JsOnDisk = vscode.Uri.file(path.join(__dirname, '/webapp/js', 'select2.js'));



const imgUri = imagePathOnDisk.with({ scheme: 'vscode-resource' });
const packageUri = packageOnDisk.with({ scheme: 'vscode-resource' });


// And the uri we use to load above script in the webview
const bootstrapUri = bootstrapOnDisk.with({ scheme: 'vscode-resource' });
const fontUri = fontOnDisk.with({ scheme: 'vscode-resource' });
const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxgridUri = dhtmlxgridOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxgrid_dhx_skyblueUri = dhtmlxgrid_dhx_skyblueOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxUri = dhtmlxOnDisk.with({ scheme: 'vscode-resource' });
const select2Uri = select2OnDisk.with({ scheme: 'vscode-resource' });


const jqueryUri = jqueryOnDisk.with({ scheme: 'vscode-resource' });
const bootstrapJsUri = bootstrapJsOnDisk.with({ scheme: 'vscode-resource' });
const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxcommonUri = dhtmlxcommonOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxgridJsUri = dhtmlxgridJsOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxJsUri = dhtmlxJsOnDisk.with({ scheme: 'vscode-resource' });
const dhtmlxdataprocessorUri = dhtmlxdataprocessorOnDisk.with({ scheme: 'vscode-resource' });
const select2JsUri = select2JsOnDisk.with({ scheme: 'vscode-resource' });

// Use a nonce to whitelist which scripts can be run
const nonce = getNonce();

// HTML content for all pages which will be loaded in webview panel
module.exports.HTMLRender = {


    HTMLViewForHome: function () {

        return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
             <meta charset="UTF-8">
                 <link rel="stylesheet" type="text/css" href="${bootstrapUri}" />
                 <link rel="stylesheet" type="text/css" href="${fontUri}" />
                 <link rel="stylesheet" type="text/css" href="${styleUri}" />

                 <script nonce="${nonce}" src="${jqueryUri}"></script>
                 <script nonce="${nonce}" src="${bootstrapJsUri}"></script>
                 <script nonce="${nonce}" src="${scriptUri}"></script>
                

                 
            <style>
                td {
                    height: 25px;
                    font-size: 16px;
                    width: 170px;
                    text-align: right;
                    color:#d4d4d4;
                    font-family: 'Helvetica Neue',sans-serif;

                }
            </style>

            

        </head>
        
        <body align="center" height="100%" class="body" onload="loadExistPackInfo()">
        
                <div class="info ">
        
        
        
                    <form name="homePage " id="homePage" action="http://localhost:8080/info " method="POST">
                        <table align="center " height="40% ">
                            <tr style="height: 33px ">
                                <td>Package Name*&nbsp;&nbsp;&nbsp; </td>

                                <td>                   
             
                                    <input type="text" size="15" name="packageName" id="packageName" />
                                </td>
                                <div>
                                    <span class="error " id="errorPack">Package name is required</span>
                                </div>
                            </tr>
        
                            <tr style="height: 33px ">
                                <td>Version&nbsp;&nbsp;&nbsp;&nbsp; </td>
                                <td>
                                    <input type="text " name="version" id="version">
                                </td>
                            </tr>
                            <tr style="height: 33px ">
                                <td>Author&nbsp;&nbsp;&nbsp;&nbsp; </td>
                                <td>
                                    <input type="text " name="author" id="author">
                                </td>
                            </tr>
                            <tr style="height: 33px ">
                                <td>Description&nbsp;&nbsp;&nbsp;&nbsp; </td>
                                <td>
                                    <input type="text " name="description" id="description">
                                </td>
                            </tr>                                                   

                            <br>
        
                            <tr>
                                <td colspan="1 "></td>
        
        
                                <td>
                                    <div style="text-align:center; align-content: center;padding-top: 45px;padding-bottom: 100px ">
                                        <!--   <button type="submit " name="homeSubmit " id="homeSubmit " class="generate "> Next &raquo;</button>-->
                                        <button class="btn btn-primary" name="homeSubmit" id="homeSubmit">&nbsp;&nbsp; Next &raquo;&nbsp;&nbsp; </button>
        
                                    </div>
        
                                </td>
        
        
                            </tr>
        
        
        
                        </table>
        
                    </form>
        
        
                </div>
        
        </body>
        
        </html>`;


    }
    ,

    HTMLViewForDataDef: function () {


        return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
    <meta charset="UTF-8">

    <link rel="stylesheet" type="text/css" href="${bootstrapUri}" />
    <link rel="stylesheet" type="text/css" href="${fontUri}" />
    <link rel="stylesheet" type="text/css" href="${select2Uri}" />
    <link rel="stylesheet" type="text/css" href="${styleUri}" />

    <script nonce="${nonce}" src="${jqueryUri}"></script>
    <script nonce="${nonce}" src="${bootstrapJsUri}"></script>
    <script nonce="${nonce}" src="${scriptUri}"></script>
    <script  nonce="${nonce}" src="${select2JsUri}"></script>
    
    <script>
    $(document).ready(function() { $(".logicalPath").select2({placeholder: "Add path here"}); });     

    </script>
  
    </head>
    
    
<body align="center" height="100%" class="body" onload="loadExistPackDataDef()">
<style>
    td {
        height: 25px;
        font-size: 16px;       
        text-align: right;
        color:#d4d4d4;
        font-family: 'Helvetica Neue',sans-serif;
    }
    hdrcell {
        height: 25px;
        font-size: 18px;       
        text-align: right;
        color:#d4d4d4;
        font-family: 'Helvetica Neue',sans-serif;
    }
    
</style>

    <div class="data">

    <div class="header">
    <h2 class="h1prop">Data Definitions</h2>

    <div class="logicalBtn" style="margin-left:970px;margin-top:-58px;margin-bottom: 11px;">
    <span class="addLogicalBtn">
        <i class="fa fa-plus"></i>
    </span>
    </div>
    </div>
    <br>
        <form name="dataPage" id="dataPage" method="POST">
   
            <input type="hidden" id="packageName" name="packageName">
            <div id="dataContainer">
            <div class="logicalBtn" style="position: relative;left:255px;top:14px">
                <span class="delLogicalBtn" style="display: none;">
                    <i class="fa fa-minus"></i>
                </span>
           
</div>
            <button class="accordion" id="accordion1" style="float:left"></button>
           
            <div class="panel" >
            <table align="center" height="40%"> 
<tr style="height: 40px" class="dataDef">
                    <td style="width: 112px">Name* &nbsp;</td>
                    <td>
                        <input style="width: 343px" type="text" name="layoutNameVal" id="layoutName" class="onKeyUpFunc" onkeyup="myOnkeyupFunction()">
                        <span class="error" id="layoutNameError">Data definition is required</span>

                    </td>
                    </tr><tr style="height: 60px">
                    <td style="width: 112px;padding-bottom: 6px;">Logical Path*&nbsp; </td>
                    <td style="width: 343px;color:black;padding-bottom: 6px;">
                        <span class="error" id="logicalPathError">Logical path is required</span>
                        <select name="logicalPathVal" class="logicalPath" id="logicalPath" style="width: 343px" multiple> 
                        
                    </select> 
        
                    </td>                                        

                </tr>
                </table>
                </div>
                
                </div>
                <div style="padding-left: 410px">
<table>
                <tr>
                   
                    <td style="align-content: center;padding-top: 30px;padding-bottom: 50px">
                        <button type="submit" class="btn btn-primary" onclick="submitInfoData()">&nbsp;&nbsp; Generate &nbsp;&nbsp; </button>
                    </td>
                   

                </tr>
</table>
</div>
        </form>


    </div>



</body>
    
    </html>`;


    }
    ,
    HTMLViewForSchemaDetails: function () {


        return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <link rel="stylesheet" type="text/css" href="${bootstrapUri}" />
        <link rel="stylesheet" type="text/css" href="${fontUri}" />
        <link rel="stylesheet" type="text/css" href="${styleUri}" />
        <link rel="stylesheet" href="${dhtmlxgridUri}" type="text/css" media="screen" title="no title" charset="utf-8">
        <link rel="stylesheet" href="${dhtmlxgrid_dhx_skyblueUri}" type="text/css" media="screen" title="no title" charset="utf-8">
        <link rel="stylesheet" href="${dhtmlxUri}" type="text/css">


        <script nonce="${nonce}" src="${jqueryUri}"></script>
        <script nonce="${nonce}" src="${bootstrapJsUri}"></script>
        <script nonce="${nonce}" src="${dhtmlxcommonUri}"></script>
        <script nonce="${nonce}" src="${dhtmlxgridJsUri}"></script>
        <script nonce="${nonce}" src="${dhtmlxJsUri}"></script>
        <script nonce="${nonce}" src="${dhtmlxdataprocessorUri}"></script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
  
            <style>
                td {
                    
                    font-size: 14px;
                    background-color: var(--vscode-editor-background);
                    color: white;
                    font-family: 'Helvetica Neue',sans-serif;
                }
               
                
div.gridbox .objbox
{
    background-color: var(--vscode-editor-background);

}
      
td .hdrcell
{
    font-size: 13px;
    font-family: 'Helvetica Neue',sans-serif;
} 
                .ui-grid-render-container {
                    position: static;
                }
        
        
                input[type=checkbox] {
        
                    margin: 3px -15px 0 0;
                    box-sizing: border-box;
                    padding: 2px 2px 2px 2px;
                    width: 80px;
                    vertical-align: -webkit-baseline-middle;
                    margin-left: 1px;
                    float: left
                }
        
                .dhx_clist {
                    padding: 5px 8px 7px 0px;
                }
        
                 
div.gridbox_dhx_skyblue.isModern table.hdr tr td {
    color: white;
    background-color: #38383c;
    background: -webkit-linear-gradient(#38383c,#38383c);
}
div.gridbox_dhx_skyblue.gridbox {
    border: none;
}
div.gridbox .objbox {
    border-bottom: 1px solid #a4bed4;
    border-left: 1px solid #a4bed4;
    border-right: 1px solid #a4bed4;
}

            </style>
        
            
        </head>
        
        
<body align="center" height="100%" class="body" onload="listenEvent()">

    <div>

         <h2 id="lines-of-code-counter"></h2>
        <div id="parentGrid" style="width: 1077.5px; height: 270px"></div>
    </div>

             
   
</body>
        
        </html>`;


    }
    ,

    HTMLViewForVisualizer: function () {

        return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
         <meta charset="UTF-8">
             <link rel="stylesheet" type="text/css" href="${bootstrapUri}" />
             <link rel="stylesheet" type="text/css" href="${fontUri}" />
             <link rel="stylesheet" type="text/css" href="${styleUri}" />

             <script nonce="${nonce}" src="${jqueryUri}"></script>
             <script nonce="${nonce}" src="${bootstrapJsUri}"></script>
             <script nonce="${nonce}" src="${scriptUri}"></script>
            

             
        <style>
            td {
                height: 25px;
                font-size: 16px;
                text-align: right;
                color:#d4d4d4;
                font-family: 'Helvetica Neue',sans-serif;

            }
            
            .panel {
                padding: 3px 0px 2px 98px;
            }
        </style>

        

    </head>
    
    <body align="center" height="100%" class="body" onload="loadVisualizer()">
 
    <div class="data">
    <div class="header">
    <h2 class="h1prop">Visualizer</h2>
    <div class="logicalBtn" style="margin-left:970px;margin-top:-58px;margin-bottom: 11px;">
    <span class="addVisualizerBtn">
        <i class="fa fa-plus"></i>
    </span>
    </div>
    </div>
    <br>
                <form name="homePage " id="homePage"  method="POST">
                <div id="dataContainer">
                <div class="logicalBtn" style="position: relative;left:255px;top:33px">
                <span class="delVisualizerBtn" style="display: none;">
                    <i class="fa fa-minus"></i>
                </span>
           
</div>

                <button class="accordion" id="accordion1" style="float:left"></button>
           
                <div class="panel" >
                    <table align="center " height="40% ">
                        <tr style="height: 33px ">
                            <td>Visualizer Name &nbsp;&nbsp;&nbsp; </td>

                            <td>                   
         
                                <input type="text" size="15" name="visualizerName" id="visualizerName" class="onKeyUpFunc" onkeyup="myOnkeyupFunction()"/>
                            </td>
                          
                        </tr>
    
                        <tr style="height: 33px ">
                            <td>Type&nbsp;&nbsp;&nbsp;&nbsp; </td>
                            <td>
                                <select class="chartType" name="type" id="type" style="width: 250px;height:27px"></select>
                            </td>
                        </tr>
                        <tr style="height: 33px ">
                            <td>Data Source&nbsp;&nbsp;&nbsp;&nbsp; </td>
                            <td>
                            <select class="dataSource" name="dataSource" id="dataSource" style="width: 250px;height:27px"></select>
                            </td>
                        </tr>
                        <tr style="height: 33px ">
                            <td>Output Name&nbsp;&nbsp;&nbsp;&nbsp; </td>
                            <td>
                                <input type="text " name="outputName" id="outputName">
                            </td>
                        </tr>   
                        </table>                                                
                        </div>
                        </div>
                       
                        <div style="padding-left: 410px">
                        <table>
                                        <tr>
                                           
                                            <td style="align-content: center;padding-top: 30px;padding-bottom: 50px">
                                                <button type="submit" class="btn btn-primary" onclick="submitVisualizer()">&nbsp;&nbsp; Generate &nbsp;&nbsp; </button>
                                            </td>
                                           
                        
                                        </tr>
                        </table>
                        </div>
    
                </form>
                </div>
    </body>
    
    </html>`;


    }
    ,
    HTMLViewForGraph: function () {

        return `<!DOCTYPE html>
        <html>
        
        <head>
            <title>IIFE + NPM</title>
            <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="${indexCssUri}" />
        
        <script nonce="${nonce}" src="${utilURI}"></script></body>
        <script nonce="${nonce}" src="${commonURI}"></script></body>
        <script nonce="${nonce}" src="${apiURI}"></script></body>
        <script nonce="${nonce}" src="${chartURI}"></script></body>
        <script nonce="${nonce}" src="${commsURI}"></script></body>
        <script nonce="${nonce}" src="${scriptUri}"></script>
        <script src="${indexJsUri}"></script>
        <script>
        var hpccChart = window["@hpcc-js/chart"];
         
       </script>


        </head>
        
       
        <body onload="listenEventForGraph()">
        <div id="placeholder">
            <!--  Placeholder for Visualization  -->
        </div>
        <select id="popType" class="topcorner" onchange="doRender(this.value);">
            <option value="Area">Area</option>
            <option value="Bar">Bar</option>
            <option value="Bubble">Bubble</option>
            <option value="Contour">Contour</option>
            <option value="Column" selected="selected">Column</option>
            <option value="HexBin">HexBin</option>
            <option value="Line">Line</option>
            <option value="Pie">Pie</option>
            <option value="Scatter">Scatter</option>
            <option value="Radar">Radar</option>
            <option value="Step">Step</option>
            <option value="WordCloud">Word Cloud</option>
        </select>
                   </body>
        
        </html>`
    }
}


function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}