var $ = jQuery;

function DocumentReady(){

	
	$('.allCourses').click(function(){
		$.ajax({
			url : "/courses",
			method: "GET",
			success : function(data){
				var tableData= [];
				for(i=0; i<data.length; i++){
					tableData.push(data[i].code);
				}
				createTable(tableData);
			}
		});
	});

	$('.myNotes').click(function(){
		$.ajax({
			url : "/currentDoc",
			method: "GET",
			success : function(data){
				var tableData= [];
				for(i=0; i<data.notes.length; i++){
					tableData.push(data.notes[i].title);
				}
				createTable(tableData);
			}
		});
	});

	$('.makeNote').click(function(){
		location.replace("http://localhost:3000/note");
	});

	$('.logOut').click(function(){
		$.ajax({
			url : "/logout",
			method: "GET",
			success : function(data){
				location.replace("http://localhost:3000/");
			}
		});
	});

	function createTable(tableData){
		var linkList = document.getElementById("linkTable");
		for(j=0; j<tableData.length; j++){
			var li = document.createElement("li");
			var a = document.createElement('a');
			a.innerHTML = tableData[j];
			li.appendChild(a);
			linkList.appendChild(li);
		}
	}
}
$(document).ready(DocumentReady);