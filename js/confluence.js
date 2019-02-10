"Use Strict"
// REVISED FRAMEWORK FOR TRIBAL KNOWLEDGE ------------------------------------------------------------------------------------------------------------- //

$(function() {
	console.log("document load")
	  
	loadPageData()
})

// PAGE TRANSITIONS ------------------------------------------------------------------------------------------------------------- //
$('body').css('display', 'none').fadeIn(1000);

$("a, nav a").on("click", function(event) {
    var link = $(this).attr("href");
    event.preventDefault();

    if(link === '#') {
        event.preventDefault();
    } else {
        $("body").fadeOut(1000, function(event) { location.href = link; } );
    }
});

// LOAD PAGE DATA FUNCTION ------------------------------------------------------------------------------------------------------------- //
var loadPageData = function() {
	console.log("load page data called")
	var pageType = getParameterByName("pageType")
	console.log("this:" + pageType)
	
	// LOAD NAVIGATION 
	getData("categoryNav", "categoryNav", showNavElement)
	
	// LOAD CATEGORY OR CONTENT
	//getData(pageType, "pageContent", showResults) // FIX THIS FOR CATEGORY AND CONTENT IN PAGE TYPE BELOW
	
 	// IF CONTENT PAGE POPULATE CATEGORIES DROPDOWN

	switch(pageType) {
		case "content":
			getData("content", "pageContent", showResults) // show content
			getData("category", "runCb", function(data) { showCategories(data)}) // build category dropdown
		break;
		
		case "categoryDetails":
			getData("categoryDetails", "pageContent", showResults)
		break;
		
		case "contentDetails":
			getData("contentDetails", "pageContent", showResults)
		break;
		
		case "category":
			getData("category", "pageContent", showResults)
 		break;
		
	}
	
};


function getParameterByName(name, url) {
console.log("getparameter called")
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// BUILD NAVIGATION FOR SITE ------------------------------------------------------------------------------------------------------------- //
function loadNavigation(categories) {
 $.get('navigation.html', function(data) {
 	// NEED TO INSERT DATA TO DOM FIRST WHEN STRING THEN FIND
 	$("#holder").html(data).find('#categoriesMenu').html(""+categories+"")
	var newNav = $("#holder")
	$("#holder").remove()
 	$("#navigation").html(newNav)
 })
}

// CLICK EVENT HANDLERS ------------------------------------------------------------------------------------------------------------- //
$("body").on("click", "[data-type='delete']", function() { promptUser( $(this).data('id'), $(this).data('db'), "mDelete" ) })
$("body").on("click", "[data-type='update']", function() { promptUser( $(this).data('id'), $(this).data('db'), "mUpdate" ) })

// GET DATA FUNCTIONS ------------------------------------------------------------------------------------------------------------- //
// PASSES SQLTYPE 
function getData(dbTable, dataUse, cb) {
	console.log("getData called" + dbTable + "=" + dataUse + "=")
	cb = cb || "";
	dbTable = dbTable || "category"; // default to category
	dataUse = dataUse || "pageContent"; //default to pageContent
	
	// PASS THIS FOR DETAIL QUERIES
	var categoryId = getParameterByName("categoryId")
	var contentId = getParameterByName("contentId")
	
	$.ajax({
			 type		: 'GET',
			 url        : 'getData.asp?sqlType='+dbTable+'&categoryId='+categoryId+'&contentId='+contentId+'',
			 dataType   : 'json',
			 encode     : true,
			 success: function(data) {
			 	if(dataUse == "pageContent") {
					showResults(dbTable, data)
				} else {
					cb(data)
				}
			 },
			 error: function(data) {
				console.log(JSON.stringify(data))
			 }
	})
 	$("button[type=button]").removeAttr("disabled")
}

// BUILD NAVIGATION FUNCTIONS ------------------------------------------------------------------------------------------------------------- //
function showNavElement(data) {
	var tbl = ""
	
	//FILTER SPECIFIC CATEGORY
	//var filtered = data.filter(function(item) { return item.categoryTitle=="Title two"})
	
	// BUILD NAVIGATION ELEMENT
	for (let i = 0, l = data.length; i < l; i++) {
 		tbl += '<li><a href="categoryDetails.html?pageType=categoryDetails&categoryId='+data[i].categoryId+'" data-categoryid="'+data[i].categoryId+'">'+data[i].categoryTitle+'</li>';
 	}
	
	/*$.each(data, function(i, val) {
		$.each(val, function(key, name) {
 			tbl += '<li><a href="#">' + name + '</a></li>'
		});
	});*/
	loadNavigation(tbl)
}

// PROMPT USER FORM -------------------------------------------------------------------------------------------/
function promptUser(id, dbTable, modalType) {
	console.log("prompt user" + id + dbTable + modalType)
	
	// APPEND ID TO dbTable FOR LOOKUP
	var tableRecordId = dbTable + 'Id'
 	var formData = {
 		tableRecordId : id
 	}
	var newdbTable, formData

	// DETERMINE WHAT QUERY TO REQUEST VIA ASP
	switch(modalType) {
		case "mDelete":
			 newdbTable = dbTable + "Query"
		break
		case "mUpdate":
			 newdbTable = dbTable + "Query"
			
		break
	}

	// GET CURRENT CATEGORY VALUES
	$.ajax({
		 type		: 'POST',
 		 url        : 'getData.asp?sqlType='+newdbTable+'&sqlRecordId='+id+'',
		 data		: formData,
 		 dataType   : 'json', // ASP SO WE GET OL' HTML
 		 encode     : true,
 		 success: function(data) {
		 	// SHOW YES NO PROMPT IN MODAL
 			showModal(data[0], modalType, id, dbTable)
		 },
		 error: function(data) {
		 	console.log("error" + data)
		 }
	})

	return false;
}

// MODIFY DATA -------------------------------------------------------------------------------------------/

// GET DATA FROM FORM - SHOULD BE REFACTORED TO INCLUDE GET DATA
function getFormData(recordId, currentForm, dbTable) {
		console.log("getFormData called" + recordId + currentForm + dbTable)
	
		//var currentForm = "updateCategory"
		// GET INPUTS OF FORM THAT HAS FOCUS
		var inputs = document.forms[currentForm].querySelectorAll("input[type=text],input[type=number],select,textarea").length,
		inputsName = document.forms[currentForm].querySelectorAll("input[type=text],input[type=number],select,textarea"),
        valid = true,
		formData = {}
	
	// CHECK FOR INPUT IN INPUTS AND DISPLAY ALERT WARNING
      for (var i = 0; i < inputs; i++) {
        if (document.forms[currentForm][i].value.trim() === "") {
          document.forms[currentForm][i].classList.add("errinput")
 		  document.forms[currentForm][i].classList.add("alert-warning")
		  console.log("missing fields " + inputsName[i].getAttribute("name"))
          valid = false
		  return valid
        }
      }

      if (valid) {
    
		for(var x = 0; x < inputs; x++) {
			formData[""+inputsName[x].getAttribute('name')+""] = ""+inputsName[x].value.trim()+""
		}
		formData[""+dbTable+"Id"] = recordId
 }
	return formData
}

function modifyData(recordId, dbTable, modalType) {

		console.log("modifyData called" + recordId + "" + dbTable + "" + modalType)
 		var newdbTable, formData, valid, inputs, inputsName, dataForm, formData
		
		// DETERMINE WHAT QUERY TO REQUEST VIA ASP
		switch(modalType) {
			case "mDelete":
				 newdbTable = dbTable + "Delete"
			break
			case "mUpdate":
				 newdbTable = dbTable + "Update"
				 // ID of table to get update from
				 dataForm = dbTable + "Update"
				 formData = getFormData(recordId, dataForm, dbTable)
			break
		}
		 
		
		if(formData != false) {

        $.ajax({
            type		: 'POST',
 			url         : 'getData.asp?sqlType='+newdbTable+'&sqlRecordId='+recordId+'', // want to use getData.asp to centralize all ASP but UPDATE and DELETE do NOT work...
			data		: formData,
            dataType    : 'html', // ASP SO WE GET OL' HTML
            encode      : true,
			success: function(data) {
				// SHOW SUCCESS AND CLEAR FORM FIELDS
				showModal("","mSuccess","","")
			},
			error: function(data) {
				// SHOW ERROR
				console.log("ERROR" + data);
			}
        })
		}
	return false;
	e.preventDefault;
}

// ADD DATA ------------------------------------------------------------------------------------------------------------- //
function addData(currentForm) {
	console.log("addData called "  + currentForm)
	// GET INPUTS OF FORM THAT HAS FOCUS
	var inputs = document.forms[currentForm].querySelectorAll("input[type=text],input[type=number],select,textarea").length,
		inputsName = document.forms[currentForm].querySelectorAll("input[type=text],input[type=number],select,textarea"),
        valid = true,
		formData = {}
	
	// CHECK FOR INPUT IN INPUTS AND DISPLAY ALERT WARNING
      for (var i = 0; i < inputs; i++) {
        if (document.forms[currentForm][i].value.trim() === "") {
          document.forms[currentForm][i].classList.add("errinput")
 		  document.forms[currentForm][i].classList.add("alert-warning")
		  console.log("missing fields " + inputsName[i].getAttribute("name"))
          valid = false
        }
      }

      if (valid) {
        $("button[type=button]").attr("disabled", "disabled")
		
		for(var x = 0; x < inputs; x++) {
			formData[""+inputsName[x].getAttribute('name')+""] = ""+inputsName[x].value.trim()+""
		}

  		$.ajax({
            type		: 'POST',
            url         : 'getData.asp?sqlType='+currentForm+'',
            data        : formData, 
            dataType    : 'HTML', // ASP SO WE GET OL' HTML
            encode      : true,
			success: function(data) {
				$("#"+currentForm+"")[0].reset()
				//getData()
				uploadFiles(function() { loadPageData() })
				//loadPageData()
			},
			error: function(data) {
				// SHOW ERROR
				console.log("ERROR" + JSON.stringify(data))
			}
        })
			
        console.log("success")
      }
}

function uploadFiles(cb) {
	console.log("uploadFiles called")
	var formData = $("#file1").val();
	console.log("form path: " + formData + "")
	$.ajax({
		type		: 'GET',
		url			: 'uploadForm.asp',
		data		: formData.serialize(),
		processData	: false,
		contentType : false,
		encode		: true,
 		cache		: false,
		success		: function(data) {
			console.log("------ DONE -------")
		},
		error		: function(data) {
			console.log("ERROR" + JSON.stringify(data))
		}
	})

}

// FORM SUBMIT FIND ID AND PASS TO ADD DATA
$("body").on("submit", "form", function(e) {
	console.log("form clicked on")
    var currentForm = this.id
	if(currentForm == "contentSearch") {
		doSearch({"currentForm":this[0].value.trim()})
	} else {
 		addData(currentForm)
	}
	//modifyData(currentForm)
	return false
	e.preventDefault
})

function doSearch(a) {
	
}

// SHOW MODAL FUNCTION ------------------------------------------------------------------------------------------------------------- //
function showModal(data, modalType, id, dbTable) {

	// SHOW SUCCESS AND CLEAR FORM FIELDS
 	$('form').find('input, select, textarea').val('')
	// RESET MODAL BUTTONS
	$("#siteModal #saveBtn, #siteModal #deleteBtn").removeAttr("style")
	
	// SUCCESS FORM
	if(modalType === 'mSuccess') {
		$("#siteModal .modal-title").text("SUCCESS")
		$("#siteModal .modal-body").text(data)
		$("#siteModal #saveBtn, #siteModal #deleteBtn").css("display","none")
		$('#siteModal').modal('toggle')
	}
	
	// DELETE FORM
	if (modalType === 'mDelete') {
 		// SHOW YES NO PROMPT IN MODAL
 		$("#siteModal .modal-title").text("DELETE")
 		$("#siteModal .modal-body").text("Are you sure you want to delete "+data[''+dbTable+''+"Title"]+"?")
 		$("#siteModal #saveBtn").css("display","none")
 		$("#modal-footer").removeAttr("")
		$("#deleteBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")
		$('#siteModal').modal('toggle')
	}
	
	// CATEGORY UPDATE FORM
	if (modalType === 'mUpdate' && dbTable === 'category') {
		console.log("update category" + data.categoryTitle)
		$("#siteModal .modal-title").text("UPDATE")
 		$("#siteModal .modal-body").html("Update the following record:<P><form id='categoryUpdate'> "+
 		"<div class='form-group'>"+
 		"<label>Category Title: </label>"+
 		"<input type='text' name='categoryTitle' class='form-control' value='"+data.categoryTitle+"'> "+
 		"</div>"+
 		"<div class='form-group'>"+
 		"<label>User Level:</label>"+
 		"<select class='form-control' name='userLevel' id='updateLevel'>"+
 		""+showOptions(data.userLevel, getUserLevel(data.userLevel))+""+
 		"</select>"+
 		"</div>"+
 		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")
		$('#siteModal').modal('toggle')
	}
	
	// CONTENT UPDATE FORM
 	if (modalType === 'mUpdate' && dbTable === 'content') {
		console.log("update content" + data.contentTitle)
		var contentCategoryId = data.categoryId
		$("#siteModal .modal-title").text("UPDATE")
 		$("#siteModal .modal-body").html("Update the following record:<P><form id='contentUpdate'> "+
 		"<div class='form-group'>"+
 		"<label>Category Title: </label>"+
 		"<select class='form-control categorySelect' name='categoryId'>"+
 		""+getData("category","runCb", function(data) { showCategories(data,contentCategoryId)  })+""+
		"</select>"+
 		"</div>"+
 		"<div class='form-group'>"+
 		"<label>User Level:</label>"+
 		"<select class='form-control' name='userLevel' id='updateLevel'>"+
 		""+showOptions(data.userLevel, getUserLevel(data.userLevel))+""+
 		"</select>"+
 		"</div>"+
		"<div class='form-group'>"+
 		"<label>Post Title: </label>"+
 		"<input type='text' name='contentTitle' class='form-control' value='"+data.contentTitle+"'> "+
 		"</div>"+
		"<div class='form-group'>"+
 		"<label>Post Content: </label>"+
 		"<textarea name='contentContent' class='form-control' rows='4'>"+data.contentContent+"</textarea>"+
 		"</div>"+
 		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")
		$('#siteModal').modal('toggle')
	}
	
}

$('#siteModal').on('hidden.bs.modal', function () {
    loadPageData()
})

// SHOW RESULTS FUNCTION ------------------------------------------------------------------------------------------------------------- //
function showResults(typeOf, data) {
	console.log("showResults called" + typeOf + "-" + data)
	
	// BUILDS A TABLE OR PANEL FOR DATA REQUESTED
	var result = ""
	
	// DISPLAY TABLE FOR CATEGORY LISTINGS
	if(typeOf === "category") {
		result += '<tbody><tr><th>Category Title</th><th>Date</th><th>User Level</th><th>Edit</th></tr>'

		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td>'+data[i].categoryTitle+'</td><td>'+convertDate(data[i].categoryDate)+'</td><td>'+getUserLevel(data[i].userLevel)+'</td><td><div class="btn-group btn-group-xs" role="group"> <button type="button" class="btn btn-default" data-db='+typeOf+' data-type="delete" data-id='+data[i].categoryId+'>DELETE</button>  <button type="button" class="btn btn-default" data-db='+typeOf+' data-type="update" data-id='+data[i].categoryId+'>UPDATE</button> </div></td></tr>'
		}
		result += '</tbody></table>'
	}

	// DISPLAY TABLE FOR CONTENT LISTINGS
	if(typeOf === "content") {
		result += '<tbody><tr><th>Content Title</th><th>Date</th><th>Category</th><th>User Level</th><th>Edit</th></tr>'
		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td>'+data[i].contentTitle+'</td><td>'+convertDate(data[i].contentDate)+'</td><td>'+data[i].categoryTitle+'</td><td>'+getUserLevel(data[i].userLevel)+'</td><td><div class="btn-group btn-group-xs" role="group"> <button type="button" class="btn btn-default" data-db='+typeOf+' data-type="delete" data-id='+data[i].contentId+'>DELETE</button>  <button type="button" class="btn btn-default" data-db='+typeOf+' data-type="update" data-id='+data[i].contentId+'>UPDATE</button> </div></td></tr>'
		}
		result += '</tbody></table>'
	}
	
	// DISPLAY TABLE FOR CATEGORY DETAIL LISTING
	if(typeOf === "categoryDetails") {
		result += '<tbody><tr><th>Title</th><th>Date</th><th>Link</th></tr>'
		for ( let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td>'+data[i].contentTitle+'</td><td>'+convertDate(data[i].contentDate)+'</td><td><a href="contentDetails.html?pageType=contentDetails&contentId='+data[i].contentId+'">Read More</a></td></tr>'
		}
		result += '</tbody></table>'
		$("#categoryTitle").append(data[0].categoryTitle)
	}
	
	// DISPLAY TABLE FOR CONTENT DETAILS
	if(typeOf === "contentDetails") {

		result += '<div class="panel panel-default">'+
			     '<div class="panel-heading" id="contentTitle">'+data[0].contentTitle+'</div>'+
			  	 '<div class="panel-body">'+
			  	 '<p id="contentContent">'+specialChars(data[0].contentContent)+'</p>'+
			  	 '</div>'

	}

 	// DISPLAY DATA
 	$("#"+typeOf+"Count, #"+typeOf+"Result").empty()
 	$("#"+typeOf+"Result").append(result)
	$("#"+typeOf+"Count").append(data.length)

}

// ESCAPE HTML FUNCTION ------------------------------------------------------------------------------------------------------------- //
function specialChars(chars) {
    return chars
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
// CONVERT DATE FUNCTION ------------------------------------------------------------------------------------------------------------- //
function convertDate(p) {
    p = p.slice(0, 10);
    p = p.replace(/-/g, '/')
    p = p.split('/');
	p = p[1].replace(/(^|-)0+/g, "$1") + '-' + p[2].replace(/(^|-)0+/g, "$1") + '-' + p[0];
    return p;
}

// CONVERT LEVELS TO TEXT ------------------------------------------------------------------------------------------------------------- //
function getUserLevel(level) {
	var strLevel;
	if(level == 1) {
		strLevel = "Comms"
	} else if(level == 2) {
		strLevel = "External"
	} else if(level == 3) {
		strLevel = "Admin";
	}
	return strLevel
}

function getCategoryName(data, currCat) {
console.log("getCategoryNAME: " + data[2].categoryId + "-" + currCat)
	var currentCat = ""
	var flag = true
	for(var i = 0; i < data.length; i++) {
		if(data[i].categoryId == currCat) {
			console.log("matchs")
			currentCat == data[i].categoryTitle
 		 flag = false
		  return currentCat
		  alert(currentCat)
		}
	}
	//console.log(" get cat name : " + currentCat)
	//return currentCat
}

// SHOW CATEGORIES ------------------------------------------------------------------------------------------------------------- //
function showCategories(data, currCat) {
	
	console.log("showCategories called" + JSON.stringify(data) + "-" + currCat)
 	$(".categorySelect").empty() // prevent duplication
	var categoryOptions = ""
	var selectedCat = currCat
 	for(var i = 0; i < data.length; i++) {
 		if(selectedCat == data[i].categoryId) {
 			categoryOptions+="<option value='"+data[i].categoryId+"' selected>"+data[i].categoryTitle+"</option>"
 		} else {
 			categoryOptions+="<option value='"+data[i].categoryId+"'>"+data[i].categoryTitle+"</option>"
 		}
 	}
	console.log(categoryOptions)

	$(".categorySelect").append(categoryOptions)

	//return categoryOptions
}

// SHOW OPTIONS ------------------------------------------------------------------------------------------------------------- //
function showOptions(currRecord, currentLevel) {
	// GET CURRENT USER LEVEL AND APPEND SELECT 
 	var userLevelOptions=""
	var optionNum=3
 	for(var i=1;i<=optionNum;i++) {
 		if(currRecord == i) {
 			userLevelOptions+="<option value='"+i+"' selected>"+currentLevel+"</option>"
 		} else {
 			userLevelOptions+="<option value='"+i+"'>"+getUserLevel(i)+"</option>"
 		}
 	}
	return userLevelOptions
}