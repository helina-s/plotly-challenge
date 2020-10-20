//  create function for the plot
function getPlot(id) {
    // read json file
    d3.json("samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        // get sample values and filter by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
  
        // get the top 10 sample values
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // get the top 10 otu_ids and format
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d)

        // get the top 10 labels
        var labels = samples.otu_labels.slice(0, 10);
  
        // create trace variable for bar plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'lightpurple'},
            type:"bar",
            orientation: "h",
        };
  
        // create data array for the plot
        var data = [trace];
  
        // define the plot layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 50
            }
        };
  
        // render the bar plot
        Plotly.newPlot("bar", data, layout);
  
    
       // create trace for the bubble chart
        var bubbleTrace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };

        // Create the data array for the bubble chart
        var bubbleData = [bubbleTrace];

        // define the plot layout
        var bubbleLayout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200
        };
        // render the bubble plot
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
        // create the gauge chart
        var gaugeData = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: '',
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "lightyellow"},
                    { range: [2, 4], color: "turquoise" },
                    { range: [3, 6], color: "lightblue" },
                    { range: [6, 8], color: "teal" },
                    { range: [8, 9], color: "lightgreen" },
                  ]}
          }
        ];
        var gaugeLayout= { 
            width: 550, 
            height: 400, 
            // margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
      });
  }  
// create the function fo the data
function getInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        // console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select panel to put the demographic data
        var panel = d3.select("#sample-metadata");
        // use '.html("")' to clear existing metadata
        panel.html("");

        //append the demographic data to the panel
        Object.entries(result).forEach((key) => {   
                panel.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}
// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
   // grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // populate the select options
        data.names.forEach(function(name) {
            selector.append("option").text(name).property("value");
        });

        // display the data and plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();


