
const csvEarly = `state,deaths
AL,28
AK,2
AZ,29
AR,10
CA,212
CO,80
CT,85
DE,11
DC,11
FL,100
GA,154
HI,1
ID,9
IL,146
IN,80
IA,9
KS,11
KY,20
LA,275
ME,7
MD,33
MA,122
MI,336
MN,17
MS,22
MD,21
MT,5
NE,5
NV,32
NH,4
NJ,355
NM,6
NY,2415
NC,11
ND,3
OH,65
OK,30
OR,19
PA,78
RI,10
SC,26
SD,1
TN,23
TX,65
UT,7
VT,16
VA,18
WA,250
WV,2
WI,33
WY,0`;
const csvMiddle = `state,deaths
AL,19313
AK,1192
AZ,29268
AR,11237
CA,89076
CO,12175
CT,10779
DE,2846
DC,1333
FL,73282
GA,35636
HI,1376
ID,4879
IL,37684
IN,23429
IA,9445
KS,8413
KY,14917
LA,17138
ME,2202
MD,14347
MA,20115
MI,35666
MN,12640
MS,12399
MD,20168
MT,3249
NE,4162
NV,10107
NH,2452
NJ,33238
NM,7281
NY,67330
NC,23225
ND,2279
OH,38042
OK,14010
OR,7147
PA,44295
RI,3522
SC,17591
SD,2883
TN,25349
TX,87549
UT,4714
VT,617
VA,19714
WA,12566
WV,6835
WI,14317
WY,1791`;
const csvLate = `state,deaths
AL,21208
AK,1408
AZ,32182
AR,12703
CA,100865
CO,13899
CT,11781
DE,3206
DC,1411
FL,83911
GA,39964
HI,1758
ID,5329
IL,40678
IN,25364
IA,10424
KS,9859
KY,17751
LA,18370
ME,2811
MD,16034
MA,22940
MI,40767
MN,14320
MS,13124
MD,23282
MT,3639
NE,4843
NV,11880
NH,2856
NJ,35533
NM,8828
NY,77722
NC,28789
ND,2474
OH,41018
OK,16054
OR,8967
PA,48972
RI,3800
SC,19385
SD,3138
TN,28274
TX,92709
UT,5187
VT,791
VA,22793
WA,15067
WV,7795
WI,15860
WY,1959`;


function handleDateChange(selectedDate) {

  // Parse the CSV data
  const data1 = d3.csvParse(csvEarly);
  const data2 = d3.csvParse(csvMiddle);
  const data3 = d3.csvParse(csvLate);

 
  const startDate = "2020-04-01"; // First month of COVID data
  const middleDate = "2022-04-01"; // Middle of COVID data
  const endDate = "2023-01-01"; // Last month of COVID data

  if (selectedDate == startDate) {
    showScreen(1, data1); /
  } else if (selectedDate == middleDate) {
    showScreen(2, data2); 
  } else {
    showScreen(3, data3);
  }
}

function showScreen(screenNumber, data) {
  const screens = document.getElementsByClassName("screen");
  for (let i = 0; i < screens.length; i++) {
    screens[i].style.display = "none";
  }

  document.getElementById(`screen${screenNumber}`).style.display = "block";
  createBarChart(data, `chartContainer${screenNumber}`);
}

// Function to create a bar chart
function createBarChart(data, containerId) {
  d3.select(`#${containerId}`).selectAll("*").remove();

  const width = 1200;
  const height = 450;
  const margin = { top: 30, right: 20, bottom: 50, left: 60 };

  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const states = [...new Set(data.map(d => d.state))];
  const stateWithMaxDeaths = data.reduce((acc, cur) => {
    if (+cur.deaths > acc.deaths) {
      return cur;
    }
    return acc;
  }, data[0]);

  const xScale = d3.scaleBand()
    .domain(states)
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.deaths)])
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.state))
    .attr("y", d => yScale(d.deaths))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.deaths));
    
    const annotations = [{
      note: {
      title: `Max Deaths in ${stateWithMaxDeaths.state}`,
    },
    x: xScale(stateWithMaxDeaths.state) + xScale.bandwidth() / 2,
    y: yScale(stateWithMaxDeaths.deaths),
    dx: 20,
    dy: 0, 
    color: "red",
    type: d3.annotationCalloutCircle,
    subject: { radius: 10 },
    }];
 
    

const makeAnnotations = d3.annotation()
  .type(d3.annotationCalloutCircle)
  .annotations(annotations);

svg.append("g")
  .attr("class", "annotation-group")
  .call(makeAnnotations);
}


document.addEventListener("DOMContentLoaded", function() {
  handleDateChange('2020-04-01'); 
});
