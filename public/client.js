$(document).ready(function() {
  
  $("#getLogs").on("click", function() {
    var html = "<table><tr><th>No</th><th>DATE</th><th>ACTIVITY</th><th>DURATION</th></tr>";
    var link = "";
    
    var i = 1;
    var userId = document.getElementById("userId").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var limit = document.getElementById("limit").value;

    link = "https://api-uziel-exercise.glitch.me/api/exercise/log?userId=" + userId;
    if (from) {link += "&from=" + from}
    if (to) {link += "&to=" + to}
    if (limit) {link +=  "&limit=" + limit}
    
    document.getElementById("test").innerHTML = link;
 
    $.getJSON(link, function(json) {
      
      if (!json.message){
        json.log.forEach(function(x){
          html += "<tr><td>" + i + "</td><td>" + x.date + "</td><td>" + x.description + "</td><td>" + x.duration + "</td></tr>";
          i += 1;
        })
      }  
      else{
        html = json.message;
      }
      
      $("#activityLog").html(html); 
      i = 1;
      html = "";
    });
  });
});