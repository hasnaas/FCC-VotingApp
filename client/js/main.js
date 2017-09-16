//hiding navbar on mobile once an item has been chosen
$("#navbar1 ul li a ").on("click",function(){
  $("#navbar1").collapse("hide");
});

//hiding and shwoing the custom option vote form
$("#sel2").hide();
$("#lsel2").hide();

function is_custom(){
  if($("#sel1").val()=="custom"){
    $("#sel2").val('');
    $("#sel2").show();
    $("#lsel2").show();
  }
  else{
    $("#sel2").hide();
   $("#lsel2").hide();
  }
}

//sending voting form data via ajax and treating the response
/*global $*/
$('#vote').on('submit', function (e) {
    //to prevent double submission of the form
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var $form = $(this);
    var url = $form.attr( "action" );
    var choice= $("#sel1").val();
    if(choice =="custom"){
      choice=$("#sel2").val();
    }
    var posting=$.post(url,{sel1:choice});
    posting.done(function(response){
        if(response.success==false){
            alert(response.reason);
        }
        else{
            alert('voting succeeded for '+choice);
            //refresh the webpage from the server
            location.reload(true);
        }
        
    })
  });
  


//drawing the pie chart
/*global d3*/
/*global colorbrewer*/
/* global mypoll*/

//http://bl.ocks.org/nadinesk/99393098950665c471e035ac517c2224
var data=[];
Object.keys(mypoll.options).forEach(function(i){
    data.push({'option' : i, 'value' : mypoll.options[i]});
});
    
var width = 300,
    height = 350,
    radius = Math.min(width, height) / 2;

/*var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888"]);
*/

var colors=d3.scaleOrdinal(colorbrewer.Set3[12]);

var arc = d3.arc()
    .outerRadius(radius-20)
    .innerRadius(radius-100);

/*var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);
*/
var pie = d3.pie()
    .sort(null)
    .startAngle(1.1*Math.PI)
    .endAngle(3.1*Math.PI)
    .value(function(d) { return d.value; });

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      //.attr("d", arc)
      .style("fill", function(d,i) { return colors(i); })
      .transition().delay(function(d,i) {
	return i * 400; }).duration(500)
	.attrTween('d', function(d) {
		var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
		return function(t) {
			d.endAngle = i(t); 
			return arc(d)
			}
		}); 
		
		
/*
  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.option; });
      
*/

var legend = d3.select('svg').selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
  .data(pie(data))
  .enter().append("g")
  .attr("transform", function(d,i){
    return "translate(" + (i*60+20) + "," + (height-30) + ")"; // place each legend on the right and bump each one down 15 pixels
  })
  .attr("class", "legend");   

legend.append("rect") // make a matching color rect
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", function(d, i) {
    return colors(i);
  });

legend.append("text") // add the text
  .text(function(d){
    return d.data.option;
  })
  .style("font-size", 12)
  .attr("y", 21)
  .attr("x", 0);