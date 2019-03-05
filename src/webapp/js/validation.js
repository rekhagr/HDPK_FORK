const vscode = acquireVsCodeApi();
var scrollflag = true;
var deleteBtnCount = 0;
var logicalPathLst;
var dataDefObj;
var dataSourceForVisu = [];
/* 
document.ready({
    disableLogicalBtn();

}); */


/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 */

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    return {
		/**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
		/**
		 * Closes dialog
		 */
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);

/* 
 This is the event listner for message which will sent from backend.Based command passed ,
 corresponding code will be executed 
 */
window.addEventListener('message', event => {
    const message = event.data;


    if (message.command == "existingPackageInfo") {

        document.getElementById('packageName').value = message.packageInfo.packageName;
        document.getElementById('version').value = message.packageInfo.version;
        document.getElementById('author').value = message.packageInfo.author;
        document.getElementById('description').value = message.packageInfo.description;


        document.getElementById('packageName').disabled = true;
        document.getElementById('version').disabled = true;
        document.getElementById('author').disabled = true;
        document.getElementById('description').disabled = true;
    }
    if (message.command == "existingPackageDataDef") {
        scrollflag = false;
        dataDefObj = message.DataDef.data;
        var dataCount = 1;
        var existingLayoutLen = document.getElementsByName("layoutNameVal").length;

        while (existingLayoutLen >= 1) {
            $('.delLogicalBtn').trigger("click");
            existingLayoutLen--;
        }

        while (dataCount <= dataDefObj.length) {
            $('.addLogicalBtn').trigger("click");
            dataCount++
        }

        for (var init = 1; init <= dataDefObj.length; init++) {
            document.getElementsByName("layoutNameVal")[init - 1].value = dataDefObj[init - 1].name;
            /*  document.getElementsByName("logicalPathVal")[init - 1].value = dataObj[init - 1].logicalPath; 
            document.getElementsByClassName("logicalPath")[init - 1].select2({
                val: dataObj[init - 1].logicalPath
            });*/
            document.getElementsByClassName("accordion")[init - 1].innerHTML = dataDefObj[init - 1].name;

        }
        document.getElementById("packageName").value = message.DataDef.info.packageName;
        scrollflag = true;
    }
    if (message.command == "gridDisplay") {


        const message = event.data;
        const counter = document.getElementById('lines-of-code-counter');
        counter.textContent = message.layoutName + ' Layout Definitions';


        mygrid = new dhtmlXGridObject("parentGrid");
        mygrid.setHeader("Name, Type, Size, DisplayType,DisplaySize,TextJustification,Format,Transforms,IsNullable,MinValue,MaxValue");
        mygrid.setColumnIds("name,type,size,displayType,displaySize,textJustification,format,transforms,isNullable,minValue,maxValue");
        mygrid.setRowTextBold(0);
        mygrid.setColTypes("ed,ed,ed,coro,ed,coro,ed,clist,coro,ed,ed");
        mygrid.setInitWidths("175,75,75,100,100,120,100,100,75,75,75");
        mygrid.setColSorting("str,str,str,str,str,str,str,str,str,str,str");
        mygrid.setSkin("dhx_skyblue");
        mygrid.registerCList(7, ["TRIM ", "TRIRIGHT", "TRIMBOTH", "TRIMALL", "UPPERCASE", "LOWERCASE"]);

        var isNullableCombobox = mygrid.getCombo(8);
        isNullableCombobox.put("true", "True");
        isNullableCombobox.put("false", "False");


        var textJustificationCombobox = mygrid.getCombo(5);
        textJustificationCombobox.put("right", "Right");
        textJustificationCombobox.put("left", "Left");


        var displayTypeCombobox = mygrid.getCombo(3);
        displayTypeCombobox.put("string", "String");
        displayTypeCombobox.put("integer", "Integer");
        mygrid.init();

        dataDef = message.layoutDef;
        layoutDef = [];
        count = 0;
        for (layout of dataDef) {
            count++;

            layoutDef.push({
                id: count, data: [layout.name, layout.type, layout.size,
                layout.displayType, layout.displaySize, layout.textJustification,
                layout.format, layout.transforms, layout.isNullable, layout.minValue, layout.maxValue]
            })
        }

        data = {
            rows: layoutDef
        };
        mygrid.parse(data, "json");

        mygrid.attachEvent("onCellChanged", function (rId, cInd, nValue) {
            dataObj = message.dataDef;
            var index;
            for (var init = 0; init < dataObj.data.length; init++) {
                if (dataObj.data[init].name == message.layoutName) {
                    index = init;
                }
            }

            switch (cInd) {
                case 0:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].name = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].name = nValue;
                    }

                    break;
                case 1:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].type = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].type = nValue;
                    }
                    break;
                case 2:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].size = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].size = nValue;
                    }
                    break;
                case 3:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].displayType = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].displayType = nValue;
                    }
                    break;
                case 4:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].displaySize = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].displaySize = nValue;
                    }
                    break;
                case 5:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].textJustification = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].textJustification = nValue;
                    }
                    break;
                case 6:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].format = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].format = nValue;
                    }
                    break;
                case 7:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].transforms = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].transforms = nValue;
                    }
                    break;
                case 8:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].isNullable = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].isNullable = nValue;
                    }
                    break;
                case 9:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].minValue = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].minValue = nValue;
                    }
                    break;
                case 10:
                    if (nValue == "&nbsp;") {
                        dataObj.data[index].layout[rId - 1].maxValue = "";
                    }
                    else {
                        dataObj.data[index].layout[rId - 1].maxValue = nValue;
                    }
                    break;

            }

            obj = {
                command: 'updateGrid',
                updatedHDPK: dataObj,
            }
            obj = JSON.parse(JSON.stringify(obj));
            vscode.postMessage(obj)
        });

    }

    if (message.command == "packageGenSuccess") {
        waitingDialog.show("Package is generated succesfully!!", {
            onHide: function () {

                obj = {
                    command: 'home'
                }
                obj = JSON.parse(JSON.stringify(obj));
                vscode.postMessage(obj)
            }
        });
        setTimeout(function () { waitingDialog.hide(); }, 2000);

    }

    if (message.command == "packageGenSuccess") {
        waitingDialog.show("Package is generated succesfully!!", {
            onHide: function () {

                obj = {
                    command: 'home'
                }
                obj = JSON.parse(JSON.stringify(obj));
                vscode.postMessage(obj)
            }
        });
        setTimeout(function () { waitingDialog.hide(); }, 2000);

    }


    if (message.command == "loadLogicalPaths") {
        logicalPathLst = message.logicalPathList;
        loadLogicalPathInUI(logicalPathLst, true);
    }


    switch (message.command) {
        case "Visualizer":
            var count = 0;
            var dataSourceObj = message.DataDef.data;
            for (dataVal of dataSourceObj) {
                dataSourceForVisu[count] = dataVal.name;
                count++;
            }



            scrollflag = false;
            dataDefObj = message.DataDef.visualizer;
            var dataCount = 1;

            var existingLayoutLen = document.getElementsByName("visualizerName").length;



            while (existingLayoutLen >= 1) {
                $('.delVisualizerBtn').trigger("click");
                existingLayoutLen--;
            }
            if (dataDefObj) {
                while (dataCount <= dataDefObj.length) {
                    $('.addVisualizerBtn').trigger("click");
                    dataCount++
                }

                for (var init = 1; init <= dataDefObj.length; init++) {
                    document.getElementsByName("visualizerName")[init - 1].value = dataDefObj[init - 1].name;
                    document.getElementsByName("outputName")[init - 1].value = dataDefObj[init - 1].outputName;

                    document.getElementsByClassName("accordion")[init - 1].innerHTML = dataDefObj[init - 1].name;

                }
            }


            else {
                $('.addVisualizerBtn').trigger("click");
            }

/*             document.getElementById("packageName").value = message.DataDef.info.packageName;
 */            scrollflag = true;

            loadDropDownsForVisu(dataDefObj);

            break;
    }
});

//Method to add or delete Data definition container

$(document).ready(function () {
    $('body').on('click', '.addLogicalBtn', function () {
        /* $(this).attr('class', 'delLogicalBtn');
        $(this).children('i').attr('class', 'fa fa-minus');
 */
        var accordion = document.getElementsByClassName("accordion");
        $("input").blur();
        var accordionPosition = accordion.length + deleteBtnCount + 1;

        var appendTxt = '<div class="logicalBtn" style="position: relative;left:255px;top:14px"><span class="delLogicalBtn" style="display: none;"><i class="fa fa-minus"></i></span></div><button class="accordion" id="accordion' + accordionPosition + '" style="float:left"></button><div class="panel" ><table align="center" height="40%"> <tr style="height: 40px" class="dataDef"><td style="width: 112px">Name* &nbsp;</td><td><input style="width: 343px" type="text" name="layoutNameVal" id="layoutName" class="onKeyUpFunc" onkeyup="myOnkeyupFunction()"><span class="error" id="layoutNameError">Data definition is required</span></td></tr><tr style="height: 60px"><td style="width: 112px;padding-bottom: 6px;">Logical Path*&nbsp; </td><td style="width: 343px;color:black;padding-bottom: 6px;"><span class="error" id="logicalPathError">Logical path is required</span><select name="logicalPathVal" class="logicalPath" id="logicalPath" style="width: 343px" multiple> </select> </td></tr></table></div>';

        /* trlength = $("table").find("tr").length - 1;
        $("tr:nth-child(" + trlength + ")").after(appendTxt); */
        $('#dataContainer').append(appendTxt);
        //  document.getElementsByClassName("accordion").detachEvent("click", myFunction);
        // loadCollapse();
        disableLogicalBtn();

        document.getElementById("accordion" + accordionPosition).addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });

        $('#accordion' + accordionPosition).trigger("click");

        var len = document.getElementsByName("layoutNameVal").length;
        document.getElementsByName("layoutNameVal")[len - 1].focus();

        $(".logicalPath").select2();

        if (scrollflag == true) {
            loadLogicalPathInUI(logicalPathLst, false);

            $('html, body').animate({ scrollTop: $(document).height() }, 1200);
            $("#dataContainer").css({ "margin-top": "-20px" });

        }
    });


    $('body').on('click', '.delLogicalBtn', function () {
        $(this).parent().nextUntil("div.logicalBtn").remove();
        $(this).parent().remove();
        disableLogicalBtn();
        deleteBtnCount++
        $('#eclNext').trigger("click");
    });
});

//Method to add or delete Visualizer container

$(document).ready(function () {
    $('body').on('click', '.addVisualizerBtn', function () {

        var accordion = document.getElementsByClassName("accordion");
        $("input").blur();
        var accordionPosition = accordion.length + deleteBtnCount + 1;

        var appendTxt = '<div class="logicalBtn" style="position: relative;left:255px;top:33px"><span class="delVisualizerBtn" style="display: none;"><i class="fa fa-minus"></i></span>  </div><button class="accordion" id="accordion' + accordionPosition + '" style="float:left"></button><div class="panel" ><table align="center " height="40% "><tr style="height: 33px "><td>Visualizer Name &nbsp;&nbsp;&nbsp; </td><td> <input type="text" size="15" name="visualizerName" id="visualizerName" class="onKeyUpFunc" onkeyup="myOnkeyupFunction()"/></td> </tr> <tr style="height: 33px "><td>Type&nbsp;&nbsp;&nbsp;&nbsp; </td><td><select class="chartType" name="type" id="type" style="width: 250px;height:27px"></select></td></tr><tr style="height: 33px "><td>Data Source&nbsp;&nbsp;&nbsp;&nbsp; </td><td><select class="dataSource" name="dataSource" id="dataSource" style="width: 250px;height:27px"></select></td></tr><tr style="height: 33px "><td>Output Name&nbsp;&nbsp;&nbsp;&nbsp; </td><td><input type="text " name="outputName" id="outputName"></td></tr></table></div>';


        $('#dataContainer').append(appendTxt);

        disableVisualizerBtn();

        document.getElementById("accordion" + accordionPosition).addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });

        $('#accordion' + accordionPosition).trigger("click");

        var len = document.getElementsByName("visualizerName").length;
        document.getElementsByName("visualizerName")[len - 1].focus();

        if (scrollflag == true) {

            $('.chartType')
                .empty();
            $('.dataSource')
                .empty();

            loadDropDownsForVisu(dataDefObj);

            $('html, body').animate({ scrollTop: $(document).height() }, 1200);
            $("#dataContainer").css({ "margin-top": "-19px" });

        }

    });


    $('body').on('click', '.delVisualizerBtn', function () {
        $(this).parent().nextUntil("div.logicalBtn").remove();
        $(this).parent().remove();
        disableVisualizerBtn();
        deleteBtnCount++
        $('#eclNext').trigger("click");
    });
});


$('.addECLBtn').bind('click', function () {
    $(this).attr('class', 'delECLBtn');
    $(this).children('i').attr('class', 'fa fa-minus');

    var appendTxt = '<tr style="height: 115px"><td>ECL name* </td><td style="padding-right: 24px;width: 200px"><input type="text" name="eclName" id="eclName" required></td><td>Data Layout name </td><td style="width: 200px"><input type="text" name="dataLayoutName" id="dataLayoutName" required></td><td style="padding-left: 15px">Code* </td><td><textarea rows="4" cols="40" name="eclCode" id="eclCode" required></textarea></td><td style="padding-right: 24px"><span class="addECLBtn"><i class="fa fa-plus"></i></span></td></tr>';
    trlength = $("table").find("tr").length - 1;
    $("tr:nth-child(" + trlength + ")").after(appendTxt);
});

$('.delECLBtn').bind('click', function () {
    $(this).parent().parent().remove();
});


function sendHomeData() {

    const packageName = document.getElementById('packageName').value;
    const version = document.getElementById('version').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    obj = {
        command: 'info',
        packageName: packageName,
        version: version,
        author: author,
        description: description

    }
    obj = JSON.parse(JSON.stringify(obj));
    vscode.postMessage(obj)
}

function listenEvent() {



    obj = {
        command: 'loadGrid',

    }
    obj = JSON.parse(JSON.stringify(obj));
    vscode.postMessage(obj)

}

function loadExistPackInfo() {



    obj = {
        command: 'loadExistingPackInfo',

    }
    obj = JSON.parse(JSON.stringify(obj));
    vscode.postMessage(obj)

}

function loadExistPackDataDef() {

    expandContainer();
    var len = document.getElementsByName("layoutNameVal").length;
    document.getElementsByName("layoutNameVal")[len - 1].focus();
    obj = {
        command: 'loadExistingPackDataDef',

    }
    obj = JSON.parse(JSON.stringify(obj));
    vscode.postMessage(obj)

}

function loadVisualizer() {

    expandContainer();
    var len = document.getElementsByName("visualizerName").length;
    document.getElementsByName("visualizerName")[len - 1].focus();

}

function expandContainer() {
    document.getElementById("accordion1").addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;

        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
    $('#accordion1').trigger("click");


}
function submitInfoData() {

    if (document.getElementById("layoutName").value && document.getElementById("logicalPath").value) {

        waitingDialog.show("Package is generating...");
        var layoutName = [];

        var layoutInputfields = document.getElementsByName("layoutNameVal");
        var ar_layoutInputfields = layoutInputfields.length;

        for (var i = 0; i < ar_layoutInputfields; i++) {
            layoutName.push(layoutInputfields[i].value);
        }




        var logicalPath = [];
        var logicalInputfields = document.getElementsByName("logicalPathVal");
        var ar_logicalInputfields = logicalInputfields.length;

        for (var i = 0; i < ar_logicalInputfields; i++) {
            logicalPath.push(logicalInputfields[i].value);
        }

        obj = {
            command: 'packageGen',
            layoutName: layoutName,
            logicalPath: logicalPath,
            packageName: document.getElementById("packageName").value
        }
        obj = JSON.parse(JSON.stringify(obj));
        vscode.postMessage(obj)
    }

    else {
        $('#eclNext').trigger("click");
    }
/*     setTimeout(function () { waitingDialog.hide(); }, 2000);
 */}



function submitVisualizer() {

    if (document.getElementById("visualizerName").value && document.getElementById("outputName").value) {

        waitingDialog.show("Package is generating...");
        var visualizer = [];

        var visualizerInputfields = document.getElementsByName("visualizerName");

        for (var init = 0; init < visualizerInputfields.length; init++) {
            visuObj = {
                name: document.getElementsByName("visualizerName")[init].value,
                outputName: document.getElementsByName("outputName")[init].value,
                dataSource: document.getElementsByName("dataSource")[init].value,
                type: document.getElementsByName("type")[init].value

            }
            visualizer.push(visuObj);
        }

        obj = {
            command: 'generateVisualizer',
            visualizer: visualizer
        }
        obj = JSON.parse(JSON.stringify(obj));
        vscode.postMessage(obj)
    }

}


function submitAction() {

    if (document.getElementById("layoutName").value && document.getElementById("logicalPath").value) {
        document.getElementById("dataPage").action = "http://localhost:8080/index";
        document.getElementById("dataPage").submit();
    }
    return;
}


$(function () {

    $('input:required,textarea:required').on('blur', function () {

        if ($(this).val() !== '') {

            $(this).addClass('yellow-background');

        } else {

            $(this).removeClass('yellow-background');

        }

    });

});

$(document).ready(function () {
    $('body').on('click', '#homeSubmit', function (e) {

        var emailBox = $("#packageName");
        if (!$('#packageName').val()) {
            e.preventDefault();
            $(".error").addClass("error_show");

        }
        else {
            $(".error_show").removeClass('error_show').addClass('error');
            sendHomeData();
        }
    });


    $('body').on('click', '#homePageData', function (e) {

        $('#homeSubmit').trigger("click");
        e.preventDefault();
    });



    $('#homePageECL').bind('click', function (e) {
        var dialog = document.getElementById('window');
        dialog.show();

        document.getElementById('exit').onclick = function () {
            dialog.close();
        };

    });


    $('body').on('click', '#eclNext', function (e) {
        layoutPosition = 165;
        pathPosition = 200;
        $("tr.dataDef").each(function () {
            $this = $(this);
            var layoutName = $this.find("#layoutName").val();
            var logicalPath = $this.find("#logicalPath").val();
            if (!layoutName) {
                e.preventDefault();
                $this.find("#layoutNameError").removeClass("error").addClass("error_show");

                $this.find("#layoutNameError").css({ "position": "absolute", "right": "710px", "top": layoutPosition + "px" })
                layoutPosition = layoutPosition + 129;
            }
            else {
                layoutPosition = layoutPosition + 129;
                $this.find("#layoutNameError").removeClass("error_show").addClass("error");
            }

            if (!logicalPath) {
                e.preventDefault();
                $this.find("#logicalPathError").removeClass("error").addClass("error_show");
                $this.find("#logicalPathError").css({ "position": "absolute", "right": "265px", "top": pathPosition + "px" })
                pathPosition = pathPosition + 129;

            }
            else {
                pathPosition = pathPosition + 129;
                $this.find("#logicalPathError").removeClass("error_show").addClass("error");

            }

        });



    });


});
function myOnkeyupFunction() {


    $('.onKeyUpFunc').keyup(function () {
        $(this).parentsUntil("div").parent().prev().text($(this).val());
    });
    $('.onKeyUpFunc').keyup(function () {
        $(this).parentsUntil("div").parent().prev().text($(this).val());
    });
}


function disableLogicalBtn() {

    var logicalBtn = document.getElementsByClassName("delLogicalBtn");

    if (logicalBtn.length == 1) {
        $(".delLogicalBtn").hide();
        $("#dataContainer").css({ "margin-top": "0px" });

    }
    else {
        $(".delLogicalBtn").show();
        $("#dataContainer").css({ "margin-top": "-20px" });

    }

}



function disableVisualizerBtn() {

    var logicalBtn = document.getElementsByClassName("delVisualizerBtn");

    if (logicalBtn.length == 1) {
        $(".delVisualizerBtn").hide();
        $("#dataContainer").css({ "margin-top": "0px" });

    }
    else {
        $(".delVisualizerBtn").show();
        $("#dataContainer").css({ "margin-top": "-20px" });

    }

}


function loadLogicalPathInUI(logicalPathList, addFlag) {
    for (logicalPath of logicalPathList) {
        $('.logicalPath').append($("<option/>", {
            value: logicalPath.Name,
            text: logicalPath.Name
        }));
    }
    if (dataDefObj && addFlag) {
        $(".logicalPath").each(function (index) {
            $(this).val(dataDefObj[index].logicalPath);
            $(this).trigger('change');
        });
    }



}



$(function () {
    $('#scrollToBottom').bind("click", function () {
        $('html, body').animate({ scrollTop: $(document).height() }, 1200);
        return false;
    });

});

$(document).ready(function () {



    $("body").on('DOMNodeInserted', 'li', function () {
        // code here
        $('.select2-search__field').attr("placeholder", "Add path here");
        $('.select2-search__field').css("width", "24em");
    });

});

function loadDropDownsForVisu(dataDefObj) {



    var chartTypes = ["", "TwoD.Pie", "TwoD.Bubble", "TwoD.WordCloud", "TwoD.Summary", "MultiD.Area", "MultiD.Bar", "MultiD.Column"]
    for (chartType of chartTypes) {
        $('.chartType').append($("<option/>", {
            value: chartType,
            text: chartType
        }));
    }


    for (dataSource of dataSourceForVisu) {
        $('.dataSource').append($("<option/>", {
            value: dataSource,
            text: dataSource
        }));
    }

    if (dataDefObj) {
        $(".chartType").each(function (index) {
            $(this).val(dataDefObj[index].type);
            $(this).trigger('change');
        });


        $(".dataSource").each(function (index) {
            $(this).val(dataDefObj[index].dataSource);
            $(this).trigger('change');
        });
    }


}


function listenEventForGraph() {
    obj = {
        command: 'loadGraph',

    }
    obj = JSON.parse(JSON.stringify(obj));
    vscode.postMessage(obj)


}