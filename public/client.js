$(document).ready(function() {
  
  $("#getLogs").on("click", function() {
  
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
    
    document.getElementById("urlGenerated").innerHTML = link;
    document.getElementById("urlGenerated").href = link;
 
    $.getJSON(link, function(json) {
      
      var html;
      
      if (!json.message){
        html = "<p><strong>Activity log for " + json.username + " from " + json.from + " to " + json.to + " limit " + json.limit 
          + "</strong></p><table><tr><th>No</th><th>DATE</th><th>ACTIVITY</th><th>DURATION</th></tr>";
        json.log.forEach(function(x){
          html += "<tr><td>" + i + "</td><td>" + x.date + "</td><td>" + x.description + "</td><td>" + x.duration + "</td></tr>";
          i += 1;
        })
        $("#activityLog").html(html);
        $("#errorMessage").html("");
      }  
      else{
        $("#errorMessage").html(json.message);
        $("#activityLog").html("");
      }
      
      i = 1;
      html = "";
    });
  });
});