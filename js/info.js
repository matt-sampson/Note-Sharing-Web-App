var $ = jQuery;

function DocumentReady(){


	setData();

	function  setData(){
		
		$.ajax({
			url : "/currentCode",
			method: "GET",
			success : function(foundCourse){
				if(foundCourse!==false){
					$("#course").html(foundCourse.code);
					var tableData = [];
					for(g =0; g<foundCourse.notes.length;g++){
						tableData.push(foundCourse.notes[g].title);
					}
					if(tableData.length!==0){
						createTable(tableData, false);
					}
					else{
						var linkList = document.getElementById("linkTable");
						$(linkTable).empty();
						var p = document.createElement("p");
						p.innerHTML = "There are no notes for this course yet";
						linkList.appendChild(p);
					}
				}
			}
		});
	}

	$('.allCourses').click(function showCourses(){
		$.ajax({
			url : "/courses",
			method: "GET",
			success : function(data){
				var tableData= [];
				for(i=0; i<data.length; i++){
					tableData.push(data[i].code);
				}
				createTable(tableData, true);
			}
		});
	});

	$('.notes').click(function(){
		setData();
	});

	$('.searchCourses').click(function(){
		code = prompt("Search a course code", "");
		if(code.length===0 || code === null || code === ""){
			alert("Courses must have names");
		}else{
			var course = {
				"code" : code
			};

			$.ajax({
				url : "/searchCourse",
				data : course,
				method: "POST",
				success : function(response){
					if(response===false){
						alert("that course doesn't exist");
					}
					else{
						location.replace("http://localhost:3000/course_info?code="+response);
					}
				}
			});
		}
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

	$('.homePage').click(function(){
		$.ajax({
			url : "/currentDoc",
			method: "GET",
			success : function(data){
				if (data.admin){
					location.replace("http://localhost:3000/admin_home_page.html");
				}
				else{
					location.replace("http://localhost:3000/user_home_page.html");
				}
			}
		});
	});

	function createTable(tableData,noteOrCourse){
		var linkList = document.getElementById("linkTable");
		$(linkTable).empty();
		for(j=0; j<tableData.length; j++){
			var li = document.createElement("li");
			var a = document.createElement('a');
			if (noteOrCourse){
				a.setAttribute('href', "http://localhost:3000/course_info?code="+tableData[j]);
			}
			else{
				a.setAttribute('href', "http://localhost:3000/noteNoEdit?title="+tableData[j]);
			}
			a.innerHTML = tableData[j];
			li.appendChild(a);
			linkList.appendChild(li);
		}
	}

}
$(document).ready(DocumentReady);