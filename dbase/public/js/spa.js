window.onload = function(){
   
   function buildTable(){
   var req = new XMLHttpRequest();
   req.open('GET', 'http://52.11.210.248:3002/getworkouts', true);
   req.addEventListener('load', function(){
      if(req.status >= 200 && req.status < 400){
         var tableContents = JSON.parse(req.responseText);
         var cRow;
         for(i = 0; i < tableContents.length; i++){
            cRow = tableContents[i];
            appendRow(cRow.id, cRow.name, cRow.weight, cRow.reps, cRow.date, cRow.lbs);
         }
      } else {
         console.log("Error in network request: " + req.statusText);
      }});
   req.send();
   };

   function addWorkout(){
      var p = getFormValues();
      if(p.n == "" || p.n == null) {
         document.getElementById("statusBar").innerHTML = "Name field is required. Try again.";
         return;
      }
      var req = new XMLHttpRequest();
      req.open('GET', 'http://52.11.210.248:3002/new?n='+p.n+'&w='+p.w+'&r='+p.r+'&d='+p.d+'&l='+p.l, true);
      req.addEventListener('load',function(){
         if(req.status >= 200 && req.status < 400){
            document.getElementById("statusBar").innerHTML = "Workout successfully uploaded!";
            var iRow = JSON.parse(req.responseText)[0];
            appendRow(iRow.id, iRow.name, iRow.weight, iRow.reps, iRow.date, iRow.lbs);
         } else {
           console.log("Error in network request: " + req.statusText);
         }
      });
      req.send();
   };
   
   function appendRow(id, name, weight, reps, date,lbs){
      if(lbs == true){ lbs = "lbs"; } else { lbs = "kg"; }
      var table = document.getElementById("dataTable");
      var nRow = document.createElement("tr");
      nRow.innerHTML = '<td>'+name+'</td>'+
                       '<td>'+weight+'</td>'+
                       '<td>'+lbs+'</td>'+
                       '<td>'+reps+'</td>'+
                       '<td>'+date+'</td>';
      table.appendChild(nRow);
      var delButton = document.createElement("button");
      delButton.innerHTML = "Delete";
      delButton.id = "del"+id;
      delButton.addEventListener('click', function(e){
         e.stopPropagation();
         deleteWorkout(id);
      });
      nRow.appendChild(delButton);
      var updButton = document.createElement("button");
      updButton.innerHTML = "Update";
      updButton.id = "upd"+id;
      updButton.addEventListener('click', function(e){
         e.stopPropagation();
         var updateId = this.id.substr(3);
         document.getElementById("name").value = updButton.parentNode.firstChild.innerHTML;
         document.getElementById("reps").value = updButton.parentNode.firstChild.nextSibling.nextSibling.nextSibling.innerHTML;
         document.getElementById("weight").value = updButton.parentNode.firstChild.nextSibling.innerHTML;
         document.getElementById("date").value = updButton.parentNode.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
         document.getElementById("statusBar").innerHTML = 'UPDATING WORKOUT!';
         document.getElementById("subButton").style.visibility = "hidden";
         var tableButtons = document.getElementById("dataTable").getElementsByTagName("Button");
         for(i = 0; i < tableButtons.length; i++){ tableButtons[i].style.visibility = "hidden"; }
         var cancelButton = document.createElement("button");
         cancelButton.innerHTML = 'Cancel Update';
         cancelButton.addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();
            location.reload();
         });
         document.getElementById("entryForm").appendChild(cancelButton);
         var updateSubmit = document.createElement("button");
         updateSubmit.innerHTML = 'Update Workout';
         updateSubmit.addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault(); 
            updateWorkout(updateId);
            location.reload();
         });
         document.getElementById("entryForm").appendChild(updateSubmit);
      });
      nRow.appendChild(updButton);
   };

   function updateWorkout(id){
      var p = getFormValues();
      var req = new XMLHttpRequest();
      req.open('GET', 'http://52.11.210.248:3002/upd?n='+p.n+'&w='+p.w+'&r='+p.r+'&d='+p.d+'&l='+p.l+'&id='+id, true);
      req.addEventListener('load',function(){
         if(req.status >= 200 && req.status < 400){
            document.getElementById("statusBar").innerHTML = "Workout successfully updated";
            var iRow = JSON.parse(req.responseText)[0];
         } else {
           console.log("Error in network request: " + req.statusText);
         }
      });
      req.send();
   };

   function deleteWorkout(id){
      var req = new XMLHttpRequest();
      req.open('GET', 'http://52.11.210.248:3002/del?id='+id, true);
      req.addEventListener('load', function(){
         if(req.status >= 200 && req.status < 400) {
            document.getElementById("statusBar").innerHTML = "Workout successfully deleted!";
            deleteRow(id);
         } else {
           console.log("Error in network request: " + req.statusText);
         }
      });
   req.send();
   };

   function deleteRow(id){
      var table = document.getElementById("dataTable");
      var rowToDelete = document.getElementById("del"+id).parentNode;
      table.removeChild(rowToDelete);
   };

   function getFormValues(){
      var name = document.getElementById("name").value;
      var weight = document.getElementById("weight").value;
      var reps = document.getElementById("reps").value;
      var date = document.getElementById("date").value;
      var lbs = document.getElementById("lbs").checked;
      console.log(lbs);
      if(lbs == true){ lbs = 1; } else { lbs = 0; }
      return { n:name, w:weight, r:reps, d:date, l:lbs };
   };

   var submitButton = document.getElementById("subButton");
   submitButton.addEventListener("click", function(e){
      e.preventDefault();
      addWorkout();
   });
   
   buildTable();
};
