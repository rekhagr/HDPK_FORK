
var hpccCommon = window["@hpcc-js/common"];
var hpccChart = window["@hpcc-js/chart"];
var hpccComms = window["@hpcc-js/comms"];



var d3Select = hpccCommon.select;
var Workunit = hpccComms.Workunit;
var Column = hpccChart.Column;

var columnChart;
var dataColoumn = [];
var eclContent;
/* var wu = Workunit.attach({ baseUrl: "https://play.hpccsystems.com:18010" }, "W20181021-065153");
 */

window.addEventListener('message', event => {
    const message = event.data;


    if (message.command == "displayGraph") {
        eclContent = message.eclData;

        doRender("Column");
    }
});


function doRender(chartName) {
    d3Select("#placeholder").html("");  //  Clear existing DOM Node

    dataColoumn = [];
    Workunit.submit({ baseUrl: "https://play.hpccsystems.com:18010" }, "hthor", eclContent).then((wu) => {
        return wu.watchUntilComplete();
    }).then((wu) => {

        return wu.fetchResults().then(results => {

            results[0].fetchXMLSchema().then(schema => {


                for (coloumn of schema.root._children) {
                    dataColoumn.push(coloumn.name)
                }
                columnChart = new hpccChart[chartName]()          //  Create new instance of Widget
                    .target("placeholder")          //  Nominate target on web page 
                    .columns(dataColoumn) //  Set "Columns"
                    .render()                      //  Render
                    ;
            });

            return results[0].fetchRows();
        }).then(rows => {

            var data = rows.map(row => mapRows(row));
            columnChart
                .data(data)
                .render()
                ;
        });        //  Expose to global namespace
    });
}                  //  Render Column by default

window.doRender = doRender;             //  Expose to global namespace

function mapRows(row) {
    var rowObj = []

    for (coloumn of dataColoumn) {
        rowObj.push(row[coloumn])

    }

    return rowObj;
}
