function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    if(file.type != 'text/csv'){
        alert("Invalid file type")
        return 
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        processCSV(contents)
    };
    reader.readAsText(file);
}

function processCSV(contents){
    const rows = contents.split("\n");
    const headers = rows.shift().split(",").map(x => x.trim().replace(/['"]+/g, ''));
    const data = convertCSVtoJSON(headers, rows);
    addOptionsToSelect("chart", ['Line', 'Bar']);
    addOptionsToSelect("yaxis", headers);
    addOptionsToSelect("xaxis", headers);
    const chartType = document.getElementById("chart");
    const xaxis = document.getElementById("xaxis");
    const yaxis = document.getElementById("yaxis");

    selectEventListeners(chartType, { chart: chartType.value, xaxis: xaxis.value, yaxis: yaxis.value,dataArr:data}); 
    selectEventListeners(xaxis, { chart: chartType.value, xaxis: xaxis.value, yaxis: yaxis.value, dataArr: data });
    selectEventListeners(yaxis, { chart: chartType.value, xaxis: xaxis.value, yaxis: yaxis.value, dataArr: data });

}

function selectEventListeners(obj, aData){
    return obj.addEventListener('change',(e) =>{
        console.log(aData)
        aData[e.target.id] = e.target.value
        createUpdateChart(aData)
    }
    
    );
}



function addOptionsToSelect(id,data){
    const select = document.getElementById(id);
    data.forEach( value => {
        const option = document.createElement("option");
        option.text = value;
        select.add(option);
    })
}

function convertCSVtoJSON(headers,rows){
    const dataArr = []
    rows.forEach((row)=>{
        dataArr.push(getObjectForData(headers, row.split(",")))
    });
    return dataArr;
}



function createUpdateChart({chart,yaxis,xaxis,dataArr}){
    //console.log(type, yaxis, xaxis, dataArr)
    new Chart(ctx, {
        // The type of chart we want to create
        type: chart.toLowerCase(),

        // The data for our dataset
        data: {
            labels: dataArr.map(x => x[xaxis]),
            datasets: [{
                label: yaxis,
                backgroundColor: 'rgb(255, 0, 0)',
                //borderColor: 'rgb(255, 99, 132)',
                data: dataArr.map(x => x[yaxis])
            }
            ]
        },

        // Configuration options go here
        options: {}
    });
}


function getObjectForData(properties,values){
    return properties.reduce((prev,current,index) =>{
        prev[current] = isNaN(values[index].trim()) ? values[index].replace(/['"]+/g, '') : Number(values[index].trim());
        return prev;
    },{});   
}

var ctx = document.getElementById('myChart').getContext('2d');

document.getElementById('file-input').addEventListener('change', readSingleFile, false);


    