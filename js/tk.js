"Use Strict"

//-------------------------------------------------------------------------------------------//
// TRIBAL KNOWLEDGE SYSTEM ------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------------------//
// URL QUERYSTRING APPEND -------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

$(function() {
	if ( (window.location.href === "http://localhost:8080/tk/tk.html") || (window.location.href  === "http://localhost:8080/tk/")) {
    	window.history.pushState("object or string", "Title", "http://localhost:8080/tk/tk.html?pageType=category")
	} 	
	loadPageData()
})

//-------------------------------------------------------------------------------------------//
// PAGE TRANSITIONS -------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
$('#mainSection').css('display', 'none').fadeIn(1000)

$("body").on("click", "a, nav a", function(e) {

	e.preventDefault()
    var link = $(this).attr("href")
	var newurl
    if(link != '#') {
        $("#mainSection").fadeOut(100, function() { 
			console.log("link ==>" + link)
			
			//location.href = link
		
 			if(link == 'tk.html') {
				newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + link
				newurl = newurl.replace("tk.htmltk.html", "tk.html?pageType=category")
				console.log("===> " + newurl)
			} else {
				newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + link
			}
			console.log("newurl ==>" + newurl)
			window.history.pushState({path:newurl},'',newurl);
			window.loadPageData()
			
		})
		$("#mainSection").fadeIn(100)
    }
	
})

//-------------------------------------------------------------------------------------------//
// LOAD PAGE DATA ---------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
var loadPageData = function() {
	console.log("%c loadPageData() ", "color: #ff7b00")
 	var pageType = getParameterByName("pageType")

	// CHECK USER
 	checkUser(function(data) { 
		isAdmin = data
 			console.log("USER LEVEL IS " + JSON.stringify(data))
			if(data.admin != "False") {
				sessionStorage.setItem("admin", data.admin)
				sessionStorage.setItem("adminName", data.adminName)
				sessionStorage.setItem("userLevel", data.userLevel)
			} else {
				sessionStorage.setItem("admin", data.admin)
				sessionStorage.setItem("adminName", data.adminName)
				sessionStorage.setItem("userLevel", data.userLevel)
			}
	})

	// LOAD NAVIGATION
	doData("categoryNav", "category", showNavElement)
	
 	// POPULATE CATEGORIES DROPDOWN BY PAGE TYPE
	switch(pageType) {
		case "content":
			doData("content", "pageContent", showResults) // show content
			doData("category", "runCb", function(data) { showCategories(data)}) // build category dropdown
		break
		
		case "contentDetails":
			doData("contentDetails", "pageContent", showResults) // show content details
		break
		
		case "adminContent":
			doData("adminContent", "pageContent", showResults) // show admin content
			doData("category", "runCb", function(data) { showCategories(data)}) // build category dropdown
		break
		
		case "category":
			doData("category", "pageContent", showResults) // show category content
 		break

		case "categoryDetails":
			doData("categoryDetails", "pageContent", showResults) // show category details
		break
		
		case "adminCategory":
			doData("adminCategory", "pageContent", showResults) // show admin category
 		break
		
		case "adminKeywords":
			doData("adminKeywords", "pageContent", showResults) // show admin keywords
		break
	}
}


//-------------------------------------------------------------------------------------------//
// CHECK USER -------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function checkUser(cb) {
	console.log("%c checkUser(cb) ", "color: #ff7b00")
	$.ajax({
 		type		: 'GET',
		url         : 'checkUser.asp',
		dataType    : 'JSON',
		encode      : true,
		success	    : function(data) { cb(data) },
		error	    : function(data) { console.log("ERROR" + JSON.stringify(data)) }
 	})
}

//-------------------------------------------------------------------------------------------//
// GET PARAMETER BY NAME --------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function getParameterByName(name, url) {
	console.log("%c getParameterByName(name, url) ", "color: #ff7b00")
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

//-------------------------------------------------------------------------------------------//
// LOAD NAVIGATION  -------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function loadNavigation(categories) {
	console.log("%c loadNavigation(categories) ", "color: #ff7b00")
	var userName = sessionStorage.getItem("adminName")
		userName = userName.replace(/\./g,' ')
		$.ajax({
			type	: 'GET',
			url		: 'navigation.asp',
			success : function(data) { 
				// APPEND DATA TO DOM FIRST THEN FIND
				$("#holder").html(data).find('#categoriesMenu').html(""+categories+"")
				// USER LEVEL CHECK - EXTERNAL USERS
				if( (sessionStorage.admin === "True" && sessionStorage.userLevel === "2") || (sessionStorage.admin === "False" && sessionStorage.userLevel === "2") ) {
					$("#holder").find('#adminbtn').html("")
				}
				$("#userName").html("Hello: " + userName)
				var newNav = $("#holder")
				// HIDE ADMIN
				$("#holder").remove()
				$("#navigation").html(newNav)
			},
			error	: function(data) {
				console.log("ERROR" + JSON.stringify(data))
			}
		})
}

//-------------------------------------------------------------------------------------------//
// EVENT HANDLERS ---------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
// ADD UPDATE DELETE
$("body").on("click", "[data-type='delete']", function() { promptUser( $(this).data('id'), $(this).data('db'), "mDelete" ) })
$("body").on("click", "[data-type='update']", function() { promptUser( $(this).data('id'), $(this).data('db'), "mUpdate" ) })
$("body").on("click", "[data-type='add']", function() { showModal("","mAdd","", $(this).data('db')) })
// ALLOW TINYMCE FOCUS
$("body").on("focusin", function(e) { if ($(e.target).closest(".mce-window").length) { e.stopImmediatePropagation() } }) 
// TABLE CONTAINER HOVER AND CLICK
$("body").on({
	"mouseenter" : function() {
        if($(this).find('a.link').length) {
 			$(this).addClass("tableContainerHover")
 		}
    },
	"mouseleave" : function() {
 		if($(this).find('a.link').length) {
 			$(this).removeClass("tableContainerHover")
		}
    },
 	"click" : function() {
 		if($(this).find('a.link').length) {
 			//window.location = $(this).children().attr("href")
		}
	}
}, ".tableContainer > table > tbody > tr > td")
// TK LOGO SWAP HOVER AND CLICK
$("body").on({
	"mouseenter" : function() {
 		tk = 'T<div class="k">K</div>'
 		home = "<i class='fa fa-home'></i>"
		time = 100
		$(".navbar-icons").empty().fadeOut(time, function() { $(".navbar-icons").html(home).fadeIn(time)})
    },
	"mouseleave" : function() { 
		$(".navbar-icons").empty().fadeOut(time, function() { $(".navbar-icons").html(tk).fadeIn(time)})
		
    },
	"click" : function() { 
		$(".navbar-icons").empty().fadeOut(time, function() { $(".navbar-icons").html(tk).fadeIn(time)})
    }

}, ".navbar-brand")

// REVERT TO PREVIOUS STATE
window.addEventListener('popstate', function(event) {
	//window.history.pushState(event.state);
 	window.loadPageData()
	//updateContent(event.state);
})

//-------------------------------------------------------------------------------------------//
// GET DATA  --------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function doData(dbTable, dataUse, cb) {
 	console.log("%c doData(dbTable, dataUse, cb)", "color: #ff7b00")
	cb = cb || "";
	dbTable = dbTable || "category"; // default to category
	dataUse = dataUse || "pageContent"; //default to pageContent
	
	// PASS THIS FOR DETAIL QUERIES
	var categoryId = getParameterByName("categoryId")
	var contentId = getParameterByName("contentId")

	$.ajax({
		 type		: 'GET',
		 url        : 'doData.asp?sqlType='+dbTable+'&categoryId='+categoryId+'&contentId='+contentId+'&sqlRecordId='+categoryId+'',
		 dataType   : 'json',
		 encode     : true,
		 success	: function(data) {
			if(dataUse == "pageContent") {
				showResults(dbTable, data)
			} else {
				cb(data)
			}
		 },
		 error		: function(data) {
			console.log("ERROR" + JSON.stringify(data))
		 }
	})
 	$("button[type=button]").removeAttr("disabled")
}

//-------------------------------------------------------------------------------------------//
// SEARCH -----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function doSearch(search, list, cb) {
	console.log("%c doSearch(search, list, cb) ", "color: #ff7b00")
	$("#mainSection").fadeIn(100)
	var options = {
 		tokenize: true,
  		findAllMatches: true,
  		includeScore: false, // adds 'item:' to JSON
  		threshold: 0.1,
  		location: 0,
  		distance: 100,
  		maxPatternLength: 32,
  		minMatchCharLength: 1,
 		keys: [{
			name: 'taggles',
			weight: 0.4
 		}, {
			name: 'contentContent',
 			weight: 0.6
 		}]
		}
	var fuse = new Fuse(list, options) // "list" is the item array
	var result = fuse.search(search)
	cb(result)
}
//-------------------------------------------------------------------------------------------//
// SHOW NAV ELEMENTS ------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function showNavElement(data) {
	console.log("%c showNavElement(data) ", "color: #ff7b00")
	var tbl = ""
	//FILTER SPECIFIC CATEGORY
	//var filtered = data.filter(function(item) { return item.categoryTitle=="Title two"})
	// BUILD NAVIGATION ELEMENT
	for (let i = 0, l = data.length; i < l; i++) {
		if(data[i].ct != 0) {
			tbl += '<li><a href="?pageType=categoryDetails&categoryId='+data[i].categoryId+'" data-categoryid="'+data[i].categoryId+'">'+data[i].categoryTitle+ ' ' +badgeStatus(data[i].countDifference)+'</li>'
			}
 	}
	loadNavigation(tbl)
}

//-------------------------------------------------------------------------------------------//
// PROMPT USER ------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function promptUser(id, dbTable, modalType) {
	console.log("%c promptUser(id, dbTable, modalType) ", "color: #ff7b00")
	// USER LEVEL CHECK - ADMIN - APPEND TABLE NAME TO REMOVE ADMIN FOR TABLES
	if((sessionStorage.admin === "True" && sessionStorage.userLevel == "1") || (sessionStorage.admin === "True" && sessionStorage.userLevel == "3")) {
		dbTable = dbTable.replace("admin",'')
		dbTable = dbTable.toLowerCase()
	}

	// APPEND ID TO dbTable FOR LOOKUP
	var tableRecordId = dbTable + 'Id'
 	var formData = { tableRecordId : id }
	var newdbTable, formData

	// DETERMINE WHAT QUERY TO REQUEST VIA ASP
	switch(modalType) {
		case "mDelete":
			 newdbTable = dbTable + "Query"
		break
		case "mUpdate":
			 newdbTable = dbTable + "Query"
		break
		case "mAdd":
			newdbTable = dbTable + "Insert"
 		break
	}
	
	// GET CURRENT CATEGORY VALUES
	$.ajax({
		 type	  : 'POST',
 		 url      : 'doData.asp?sqlType='+newdbTable+'&sqlRecordId='+id+'',
		 data	  : formData,
 		 dataType : 'json',
 		 encode   : true,
 		 success  : function(data) {
		 	// SHOW YES NO PROMPT IN MODAL
			console.log("==> " + data + "==>" + JSON.stringify(data))
 			showModal(data[0], modalType, id, dbTable)
		 },
		 error	  : function(data) {
		 	console.log("ERROR" + JSON.stringify(data))
		 }
	})
	return false
}

//-------------------------------------------------------------------------------------------//
// GET FORM DATA ----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function getFormData(recordId, currentForm, dbTable) {
	console.log("%c getFormData(recordId, currentForm, dbTable) ", "color: #ff7b00")
 	// GET INPUTS OF FORM THAT HAS FOCUS
	// removed :not([name^=keywords]) so keywords are required
	var inputs = document.forms[currentForm].querySelectorAll("input[type=text]:not([name=keywords]),input[type=number], input[type=hidden], input[type=hidden],select,textarea").length,
	inputsName = document.forms[currentForm].querySelectorAll("input[type=text]:not([name=keywords]),input[type=number],input[type=hidden],select,textarea"),
	valid = true,
	formData = {}
	
 	// CHECK FOR INPUT IN INPUTS AND DISPLAY ALERT WARNING
	for (var i = 0; i < inputs; i++) {
		// MODIFIED FOR TINYMCE
		if (inputsName[i].value.trim() === "") {
		  document.forms[currentForm][i].classList.add("errinput")
		  document.forms[currentForm][i].classList.add("alert-warning")
		  console.log("missing fields " + inputsName[i].getAttribute("name"))
		  valid = false
		  return valid
		}
	}
	
	// VALID AND BUILD FORMDATA  
 	if (valid) {
 		for(var x = 0; x < inputs; x++) {
			// TAGGLE KEYWORDS ADDED
			if(inputsName[x].getAttribute('name')=== "taggles") {
				formData["taggles"] = []
				$('input[name^="taggles"]').each(function() {
					formData["taggles"].push(($(this).val()))
				})
				formData["taggles"] = formData["taggles"].toString()
			} else {
				formData[""+inputsName[x].getAttribute('name')+""] = ""+inputsName[x].value.trim()+""
 			}
		}
 		formData[""+dbTable+"Id"] = recordId
 	}
	return formData
}

//-------------------------------------------------------------------------------------------//
// MODIFY DATA ------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function modifyData(recordId, dbTable, modalType) {
	console.log("%c modifyData(recordId, dbTable, modalType) ", "color: #ff7b00")
 	var newdbTable, formData, valid, inputs, inputsName, dataForm
			
	// DETERMINE WHAT QUERY TO REQUEST VIA ASP
	switch(modalType) {
		case "mDelete":
			 newdbTable = dbTable + "Delete"
			 formData = {}
			 formData["adminName"] = "" + sessionStorage.getItem("adminName") + ""
			 formData["modifiedDate"] = "" + getDate() + ""
		break
		case "mUpdate":
			 newdbTable = dbTable + "Update"
			 // ID of table to get update from
			 dataForm = dbTable + "Update"
			 // TRIGGER SAVE ON MCE TO UPDATE DATA FOR CONTENT
			 if(dbTable === "content") {
				tinyMCE.triggerSave()
			 }
			 formData = getFormData(recordId, dataForm, dbTable)
			 formData["adminName"] = "" + sessionStorage.getItem("adminName") + ""
			 formData["modifiedDate"] = "" + getDate() + ""
		break
		case "mAdd":
			newdbTable = dbTable + "Insert"
			dataForm = dbTable + "Insert"
			// TRIGGER SAVE ON MCE TO UPDATE DATA FOR CONTENT
			 if(dbTable === "content") {
				tinyMCE.triggerSave()
			 }
			 formData = getFormData(recordId, dataForm, dbTable)
			 formData["adminName"] = "" + sessionStorage.getItem("adminName") + ""
			 formData["modifiedDate"] = "" + getDate() + ""
		break
	}
		
	if(formData != false) {
		$.ajax({
			type		 : 'POST',
			url          : 'doData.asp?sqlType='+newdbTable+'&sqlRecordId='+recordId+'',
			data		 : formData,
			encode       : true,
			async	     : true,
			cache		 : false,
			success		 : function(data) {
				switch(modalType) {
					case "mAdd":
						// UPLOAD FILES
						uploadFile(formData)
					break
					
					case "mUpdate":
						// SHOW SUCCESS IF CATEGORY
						if(dbTable === "category" || dbTable === "keywords") {
							showModal("","mSuccess","","")
						} else {
							// UPLOAD FILES
							uploadFile(formData)
						}
					break
					
					default:
						// SHOW SUCCESS AND CLEAR FORM FIELDS
						showModal("","mSuccess","","")
				}
			},
			error	     : function(data) { console.log("ERROR" + JSON.stringify(data)) }
		})
	}
	return false
}

//-------------------------------------------------------------------------------------------//
// UPLOAD FILES -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function uploadFile(formData) {
	console.log("%c uploadFile(formData) ", "color: #ff7b00")
	var data = new FormData()
	$.each($(':input[type=file]')[0].files, function(i, file) {
		data.append('file-'+i, file)
	})

	$.ajax({
		type		: 'POST',
		url         : 'doFileUpload.asp',
		data		: data,
		async		: true,
		cache		: false,
		contentType : false,
		processData : false,
		success		: function(data) {
			// SHOW SUCCESS AND CLEAR FORM FIELDS
			showModal("","mSuccess","","")
		},
		error       : function(data) {
			// SHOW ERROR
			console.log("ERROR" + JSON.stringify(data))
		}
 	})
}
//-------------------------------------------------------------------------------------------//
// ADD DATA ---------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function addData(currentForm) {
 	console.log("%c addData(currentForm) ", "color: #ff7b00")
	// VALIDATE FORM DATA BEFORE PROCEEDING
	formData = getFormData("", currentForm, "")
	
	if(formData != false) {
  		$.ajax({
            type		: 'POST',
            url         : 'doData.asp?sqlType='+currentForm+'',
            data        : formData, 
            dataType    : 'HTML',
            encode      : true,
			success     : function(data) {
				$("#"+currentForm+"")[0].reset()
				showModal("","mSuccess","","")
				loadPageData()
			},
			error       : function(data) { console.log("ERROR" + JSON.stringify(data)) }
        })	
 	}
 	return false
}

//-------------------------------------------------------------------------------------------//
// FORM SUBMIT ------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
// FORM SUBMIT FIND ID AND PASS TO ADD DATA
$("body").on("submit", "form", function(e) {
    var currentForm = this.id
	if(currentForm == "contentSearch") {
		var searchValue = this[0].value.trim()
		if(searchValue.length <= 0) {
			e.preventDefault
		} else {
		    $("#mainSection").fadeOut(100, function() {
							doData("content", "docallback", function(data) { 
				doSearch(""+searchValue+"", data, function(result) {
					showResults("searchDetails", result)
				})
			})
			
			})

		
		}
	} else {
 		addData(currentForm)
	}
	return false
	e.preventDefault
})


//-------------------------------------------------------------------------------------------//
// SHOW MODAL -------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function showModal(data, modalType, id, dbTable) {
	console.log("%c showModal(data, modalType, id, dbTable) ", "color: #ff7b00")

	// SHOW SUCCESS AND CLEAR FORM FIELDS
 	$('form').find('input, select, textarea').val('')
	// RESET MODAL BUTTONS
	$("#siteModal #saveBtn, #siteModal #deleteBtn").removeAttr("style")
	
	// SUCCESS FORM
	if(modalType === 'mSuccess') {
		$("#siteModal .modal-title").text("SUCCESS")
		$("#siteModal .modal-body").text(data)
		$("#siteModal #saveBtn, #siteModal #deleteBtn").css("display","none")
	}
	
	// DELETE FORM
	if (modalType === 'mDelete') {
 		// SHOW YES NO PROMPT IN MODAL
		$("#siteModal .modal-body").addClass("delete")
 		$("#siteModal .modal-title").text("DELETE")
 		$("#siteModal .modal-body").text("Are you sure you want to delete "+data[''+dbTable+''+"Title"]+"?")
 		$("#siteModal #saveBtn").css("display","none")
 		$("#modal-footer").removeAttr("")
		$("#deleteBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")
	}
	
	// CATEGORY UPDATE FORM
	if (modalType === 'mUpdate' && dbTable === 'category') {
		console.log("update category" + data.categoryTitle)
		$("#siteModal .modal-title").text("UPDATE CATEGORY")
 		$("#siteModal .modal-body").html("<p><form id='categoryUpdate'> "+
 		"<div class='form-group'>"+
 		"<label>Category Title: </label>"+
 		"<input type='text' name='categoryTitle' class='form-control' value='"+data.categoryTitle+"'> "+
 		"</div>"+
 		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")
	}

	// CATEGORY ADD FORM 
	if (modalType === 'mAdd' && dbTable === 'category') {
		console.log("added content")
		var contentCategoryId = data.categoryId
		$("#siteModal .modal-title").text("ADD CATEGORY")
 		$("#siteModal .modal-body").html("Add a new record:<P><form id='categoryInsert'> "+
 		"<div class='form-group'>"+
 		"<label>Category Title: </label>"+
 		"<input class='form-control' name='categoryTitle' type='text'>"+
 		"</div>"+
		"<input type='hidden' name='categoryDate' value="+getDate()+">"+
 		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick", "addData('categoryInsert')")
	}
	
	// KEYWORD ADD FORM
	if(modalType === 'mAdd' && dbTable === 'adminKeywords') {
		console.log("added keywords")
		$("#siteModal .modal-title").text("ADD KEYWORD")
 		$("#siteModal .modal-body").html("Add a new record:<P><form id='keywordsInsert'> "+
 		"<div class='form-group'>"+
 		"<label>Keyword: </label>"+
 		"<input class='form-control' name='keywordsTitle' type='text'>"+
 		"</div>"+
		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick", "addData('keywordsInsert')")
	}
	
	// KEYWORD UPDATE FORM
 	if(modalType === 'mUpdate' && dbTable === 'keywords') {
		console.log("update keywords" + data.keywordsTitle)
		$("#siteModal .modal-title").text("UPDATE KEYWORD")
 		$("#siteModal .modal-body").html("<p><form id='keywordsUpdate'> "+
 		"<div class='form-group'>"+
 		"<label>Keyword: </label>"+
 		"<input type='text' name='keywordsTitle' class='form-control' value='"+data.keywordsTitle+"'> "+
 		"</div>"+
 		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")
	}
	
	// CONTENT ADD FORM
	if(modalType === 'mAdd' && dbTable === 'content') {
		console.log("added content")
		var contentCategoryId = data.categoryId
		$("#siteModal .modal-title").text("ADD CONTENT")
 		$("#siteModal .modal-body").html("Add a new record:<P><form id='contentInsert'>\
		<div class='form-group'>\
		<label>Category Title: </label>\
 		<select class='form-control categorySelect' name='categoryTitle'></select>\
 		</div>\
		<div class='form-group'>\
 		<label>User Level: </label>\
 		<select class='form-control' name='userLevel'>\
 		<option value='1' selected>Internal</option>\
 		<option value='2'>External</option>\
 		</select>\
		</div>\
 		<div class='form-group'>\
 		<label>Post Title: </label>\
 		<input type='text' name='contentTitle' class='form-control' placeholder='Post title'>\
 		</div>\
		<div class='form-group'>\
 		<label>Post Content:</label>\
 		<textarea id='contentContent' name='contentContent' class='form-control' rows='4'></textarea>\
 		</div>\
		<label>Search Tags</label>\
		<div class='input textarea clearfix custom taggleTags'></div>\
		<input type='file' name='file1' id='file1' class='hidden'/>\
		<input name='image' type='file' id='upload' class='hidden' onchange=''>\
		<input type='hidden' name='contentDate' value="+getDate()+">\
		</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick", "modifyData('','"+dbTable+"','"+modalType+"')")
		doData("category", "runCb", function(data) { showCategories(data)}) // build category dropdown
		initTaggle()
 		initTinyMce()
	}
	
	// CONTENT UPDATE FORM
 	if (modalType === 'mUpdate' && dbTable === 'content') {
		console.log("update content" + data.contentTitle)
		var contentCategoryId = data.categoryId
		$("#siteModal .modal-title").text("UPDATE CONTENT")
 		$("#siteModal .modal-body").html("Update the following record:<P><form id='contentUpdate'> "+
 		"<div class='form-group'>"+
 		"<label>Category Title: </label>"+
 		"<select class='form-control categorySelect' name='categoryId'>"+
 		""+doData("category","runCb", function(data) { showCategories(data,contentCategoryId)  })+""+
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
 		"<textarea name='contentContent' class='form-control' rows='4'>"+htmlEntities(data.contentContent)+"</textarea>"+
 		"</div>"+
 		"<label>Search Tags</label>"+
		"<div class='input textarea clearfix custom taggleTags'></div>"+
		"<input name='image' type='file' id='upload' class='hidden' onchange=''>"+
		"<input type='hidden' name='contentDate' value="+getDate()+">"+
 		"</form>")
		$("#siteModal #deleteBtn").css("display","none")
		$("#saveBtn").attr("onClick","modifyData('"+id+"','"+dbTable+"','"+modalType+"')")	
		initTaggle(data)
		initTinyMce()
	}
	
 	// GET CURRENT DATE WHEN PAGE LOADS
	//getDate()
	
	// SHOW MODAL
	$('#siteModal').modal('toggle')
}

//-------------------------------------------------------------------------------------------//
// TAGGLE -----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function initTaggle(data) {
	console.log("%c initTaggle(data) ", "color: #ff7b00")
	// TAGGLE
	data = data || ""
		var tagField  = new Taggle($('.taggleTags.textarea')[0], {
			placeholder: 'Add search tags',
			allowDuplicates: false,
			allowedTags: ['html', 'javascript', 'js', 'jquery', 'xml', 'sharepoint', 'css', 'ecmascript'],
			duplicateTagClass: 'bounce'
		});
		var container = tagField.getContainer()
		var input = tagField.getInput()
		if(data) {
			var cTags = data.taggles.toString()
			var tags = cTags.split(",")
			tagField.add(tags)
		}

		$(input).autocomplete({
			source: function(request, response) {
				$.ajax({
					 type		: 'GET',
					 url        : 'doData.asp?sqlType=keywordsQuery',
					 dataType   : 'json',
					 encode     : true,
					 success	: function(data) {
						 response($.map( data, function( item ) {
							return {
								label: item.keywordsTitle,
								value: item.keywordsTitle
							}
						}));
 					},
					 error		: function(data) {
						console.log(JSON.stringify(data))
					 }
				})
			},
			appendTo: container,
			position: { at: "left bottom", of: container },
			select: function(event, data) {
				event.preventDefault();
				// ADD TAG IF USER SELECTS
				if (event.which === 1) {
					tagField.add(data.item.value)
				}
			}
		})
		
}
//-------------------------------------------------------------------------------------------//
// MODAL ------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
$('#siteModal').on('show.bs.modal', 
   function () { 
 		// $(this).find('.modal-body').css({'max-height':'100%','max-width':'100%'}) 
		if( $(this).find('.modal-title').text() == "UPDATE CONTENT" || $(this).find('.modal-title').text() == "ADD CONTENT" ) {
			$('.modal-content').css({'width':'80vw'})
			$('.modal-body').css({"height":"80vh"})
		}
 })

//-------------------------------------------------------------------------------------------//
// HIDE MODAL -------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
$('#siteModal').on('hidden.bs.modal', function () {
	$("#siteModal .modal-body").removeClass("delete")
	$(".modal-content, .modal-body").removeAttr("style")
 	var pageType = getParameterByName("pageType")
 	if(pageType != "category") {
		tinyMCE.remove()
	}
	// RESET MODAL POSITION ON HIDE
	$(".ui-draggable, .ui-resizable").removeAttr("style")
 	loadPageData()
})

//-------------------------------------------------------------------------------------------//
// TINY MCE 4.5 -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function initTinyMce() {
	console.log("%c initTinyMce() ", "color: #ff7b00")
	tinymce.init({
    selector: "textarea",
	height: 250,
    theme: "modern",
    paste_data_images: false,
	// ADD PLUGINS
    plugins: [
      "advlist autolink lists link image charmap print preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars fullscreen",
      "insertdatetime nonbreaking table contextmenu directionality",
      "template paste textcolor colorpicker textpattern codesample code"
    ],
	// BUILD TOOLBARS
    toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image uploadfile | codesample code | print | forecolor backcolor",
	// ADD BUTTON TO EDITOR
  	setup: function(editor) {
		// ADD FILE UPLOAD BUTTON
		editor.addButton('uploadfile', {
		  icon: 'browse',
		  tooltip: "Upload and attach a file",
		  onclick: function() {
		  	// OPEN WINDOW FOR FILE ADDING
			editor.windowManager.open({
				title: "Add a file",
				html: '<form id="file_attach_form"><div class="form-group"><label for="file_attach">Click below to choose a file</label><input type="file" class="form-control-file" name="file" id="file_attach"></div></form>',
				url: "",
				width: 400,
				height: 150,
				buttons: [{
					text: "Attach",
					subtype: "primary",
					onclick: function(e) {
						// APPEND FILENAME
						var file = $('#file_attach').get(0).files[0]
						var fileext = file.name.split(".")
 						var newFileName = fileext[0] + "_" + (new Date()).getTime() + "." + fileext[1]
						var formData = new FormData()
						formData.append('file', file, newFileName)
						// FILE UPLOAD
						//var formData = new FormData($("#file_attach_form")[0])
						 $.ajax ({
						    url: 'doFileUpload.asp',
							type: 'POST',
							data: formData,
							async: false,
							success: function (data) {
								// APPEND FILE LINK TO EDITOR
								var path = JSON.stringify(data)
								editor.insertContent("<a href=\"files"+data.location+"\" class=\"fileAttachment\">FILE</a>")
							},
							cache: false,
							contentType: false,
							processData: false
						})
						// END FILE UPLOAD
						this.parent().parent().close()
					}
 				},
					{
 					text: "Close",
 					onclick: function() {
 						this.parent().parent().close()
 					}
				}]
			})
		  }
		})
 	 },
	// CODESAMPLE SETTINGS
	content_css: ['css/prismDark.css'],
	codesample_dialog_height: 400,
    codesample_dialog_width: 600,
	codesample_languages: [
        {text: 'HTML/XML', value: 'markup'},
        {text: 'JavaScript', value: 'javascript'},
        {text: 'CSS', value: 'css'},
        {text: 'PHP', value: 'php'},
		{text: 'JSON', value: 'jsn'}
    ],
	// ALLOW IMAGE ATTACHMENTS AND UPLOAD
    image_advtab: false, // IMAGE ADVANCED TAB
	images_upload_url: 'doFileUpload.asp',
 	images_upload_base_path: 'files',
	images_upload_credentials: true,
 	automatic_uploads: true,
	file_picker_types: 'image',
    file_picker_callback: function(callback, value, meta) {

      if (meta.filetype =='image') {
          $('#upload').on('change', function() {
		  	var file = this.files[0]
 			var reader = new FileReader()
			 reader.onload = function(e) {
 				var name = file.name.split('.')[0]
 				var base64 = reader.result.split(',')[1] // OPTIONAL BASE 64 STORAGE 
 				var id = 'attachmentid' + (new Date()).getTime() // RANDOM ID
 				var blobCache = tinymce.activeEditor.editorUpload.blobCache
 				var blobInfo = blobCache.create(id, file, reader.result)
 				blobCache.add(blobInfo)
 				callback(blobInfo.blobUri(), {alt: file.name, title: name})
			  }
 			reader.readAsDataURL(file)
        })
 		$('#upload').trigger('click')
      }
	  
    }
  })
 	tinyMCE.triggerSave()
}

//-------------------------------------------------------------------------------------------//
// HTML ENTITIES CONVERSION FOR HTML CODE SNIPPETS ------------------------------------------//
//-------------------------------------------------------------------------------------------//
function htmlEntities(str) {
	console.log("%c htmlEntries(str) ", "color: #ff7b00")
    return String(str).replace(/&/g, '&').replace(/</g, '&lt;').replace(/>/g, '>').replace(/"/g, '"')
}

//-------------------------------------------------------------------------------------------//
// SHOW RESULTS -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function showResults(typeOf, data) {
	console.log("%c showResults(typeOf, data) ", "color: #ff7b00")
	var $catTitle = $("#categoryTitle")
	$catTitle.empty()
	// BUILDS A TABLE OR PANEL FOR DATA REQUESTED
	var result = ""
 
	// USER LEVEL CHECK - ADMIN OR INTERNAL - DISPLAY TABLE FOR ADMIN CATEGORY LISTINGS
	if(typeOf === "adminCategory" && sessionStorage.userLevel === "3" || typeOf === "adminCategory" && sessionStorage.userLevel === "1" ) {
		result += '<div class="panel panel-default">\
			  <div class="panel-heading">MANAGE CATEGORIES <div class="btn-group btn-group-xs float-right" role="group"><button type="button" class="btn btn-success align-left navbar-left" data-db="category" data-type="add"><i class="fa fa-1x fa-plus"></i></button></div></div>\
			  <div class="tableContainer">\
			  <table class="table" id="categoryDetailsResult"><tbody><tr><th>Category</th><th>Last Updated</th>'
 			
			// USER LEVEL CHECK - ADMIN OR INTERNAL - DISPLAY EDIT OPTION
 			if((sessionStorage.admin == "True" && sessionStorage.userLevel === "3") || (sessionStorage.admin == "True" && sessionStorage.userLevel === "1")) { 
				result += '<th>Edit</th>'
			}
			
 		result += '</tr>'
				
		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td><a href="?pageType=categoryDetails&categoryId='+data[i].categoryId+'" data-categoryId="'+data[i].categoryId+'" class="link">'+data[i].categoryTitle.trim()+'</a>&nbsp' + badgeStatus(data[i].countDifference) + '</td><td>'+convertDate(data[i].ctDate)+'</td><td>'
			
			// USER LEVEL CHECK - ADMIN - DISPLAY DELETE
			if(sessionStorage.admin == "True" && sessionStorage.userLevel === "3") {
				result += '<button type="button" class="btn btn-primary btn-danger" data-db='+typeOf+' data-type="delete" data-id='+data[i].categoryId+'><i class="fa fa-trash-o"></i></button>'  
			}
			// USER LEVEL CHECK - ADMIN OR INTERNAL - DISPLAY EDIT
			if((sessionStorage.admin == "True" && sessionStorage.userLevel === "3") || (sessionStorage.admin == "True" && sessionStorage.userLevel === "1") ) {
				result += '<button type="button" class="btn btn-primary btn-success" data-db='+typeOf+' data-type="update" data-id='+data[i].categoryId+'><i class="fa fa-pencil"></i></button>'
			}
			result +='</td></tr>'
		}
		result += '</tbody></table>'
 	    result += '</div></div></div>'
		// RECORDSET PAGER
		//result += '<nav><ul class="pager"><li><a href="#">Previous</a></li><li><a href="#">Next</a></li></ul></nav>'
		$catTitle.append("Category Management")
	}
	// DISPLAY TABLE FOR CATEGORY LISTINGS
	if(typeOf === "category") {
	console.log("data result: " + JSON.stringify(data))
		result += '<div class="panel panel-default">\
			  		<div class="panel-heading">AVAILABLE CATEGORIES <div class="btn-group btn-group-xs float-right" role="group">'

			   
 		result += '</div></div>\
			  		<div class="tableContainer">\
			  		<table class="table" id="categoryDetailsResult">\
			  		<tbody><tr><th>Category</th><th>Last Updated</th></tr>'

		 
				
		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td><a href="?pageType=categoryDetails&categoryId='+data[i].categoryId+'" data-categoryId="'+data[i].categoryId+'" class="link">'+data[i].categoryTitle.trim()+'</a>&nbsp; '+badgeStatus(data[i].countDifference)+'</td><td>'+convertDate(data[i].ctDate)+'</td>'
			
			result +='</tr>'
		}
		result += '</tbody></table>'
 	    result += '</div></div></div>'
		// RECORDSET PAGER
		//result += '<nav><ul class="pager"><li><a href="#">Previous</a></li><li><a href="#">Next</a></li></ul></nav>'
 		$catTitle.append("Available Categories")
	}

	// DISPLAY TABLE FOR CONTENT LISTINGS
	if(typeOf === "content") {
		result += '<div class="panel panel-default">\
				  <div class="panel-heading">AVAILABLE CONTENT <div class="btn-group btn-group-xs float-right" role="group"> <button type="button" class="btn btn-success align-left navbar-left" data-db="content" data-type="add"><i class="fa fa-1x fa-plus"></i></button>\
			  	  </div></div>\
				  <div class="panel-body">\
				  <div class="tableContainer">\
				  <table class="table" id="categoryDetailsResult">\
				  <tbody><tr><th>Content</th><th>Date</th><th>Category</th><th>User Level</th><th>Edit</th></tr>'
		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td><a href="?pageType=contentDetails&contentId='+data[i].contentId+'" data-contentid="'+data[i].contentId+'" class="link">'+data[i].contentTitle+'</a></td><td>'+convertDate(data[i].contentDate)+'</td><td>'+data[i].categoryTitle.trim()+'</td><td>'+getUserLevel(data[i].userLevel)+'</td><td><button type="button" class="btn btn-primary btn-danger" data-db='+typeOf+' data-type="delete" data-id='+data[i].contentId+'><i class="fa fa-trash-o"></i></button>  <button type="button" class="btn btn-primary btn-success" data-db='+typeOf+' data-type="update" data-id='+data[i].contentId+'><i class="fa fa-pencil"></i></button></td></tr>'
		}
		result += '</tbody></table>'
		result += '</div></div></div>'
		$catTitle.append("Content Management")
		getDate()
	}
	
	// USER LEVEL CHECK - ADMIN OR INTERNAL - DISPLAY TABLE FOR KEYWORD LISTINGS
	if( (typeOf === "adminKeywords" && sessionStorage.userLevel === "3") || (typeOf === "adminKeywords" && sessionStorage.userLevel === "1" )) {
		result += '<div class="panel panel-default">\
				  <div class="panel-heading">AVAILABLE KEYWORDS <div class="btn-group btn-group-xs float-right" role="group"> <button type="button" class="btn btn-success align-left navbar-left" data-db="adminKeywords" data-type="add"><i class="fa fa-1x fa-plus"></i></button>\
			  	  </div></div>\
				  <div class="panel-body">\
				  <div class="tableContainer">\
				  <table class="table" id="categoryDetailsResult">\
				  <tbody><tr><th>Content</th>'
				  
 			// USER LEVEL CHECK - ADMIN OR INTERNAL - EDIT KEYWORDS
 			if((sessionStorage.admin == "True" && sessionStorage.userLevel === "3") || (sessionStorage.admin == "True" && 		sessionStorage.userLevel === "1")) { 
				result += '<th>Edit</th>'
			}
			
 		result += '</tr>'
				  
		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td>'+data[i].keywordsTitle+'</td><td>'
			
			// USER LEVEL CHECK - ADMIN - DELETE KEYWORDS
			if(sessionStorage.admin == "True" && sessionStorage.userLevel === "3") {
				result += '<button type="button" class="btn btn-primary btn-danger" data-db='+typeOf+' data-type="delete" data-id='+data[i].keywordsId+'><i class="fa fa-trash-o"></i></button>'  
			}
			// USER LEVEL CHECK - ADMIN OR INTERNAL - EDIT KEYWORDS
			if((sessionStorage.admin == "True" && sessionStorage.userLevel === "3") || (sessionStorage.admin == "True" && sessionStorage.userLevel === "1") ) {
				result += '<button type="button" class="btn btn-primary btn-success" data-db='+typeOf+' data-type="update" data-id='+data[i].keywordsId+'><i class="fa fa-pencil"></i></button>'
			}
			result +='</td></tr>'
			
			
		}
		result += '</tbody></table>'
		result += '</div></div></div>'
				  
 		$catTitle.append("Keyword Management")
	}
	
	// USER LEVEL CHECK - ADMIN OR INTERNAL - DISPLAY TABLE FOR CONTENT LISTINGS
	if(typeOf === "adminContent" && sessionStorage.userLevel === "3" || typeOf === "adminContent" && sessionStorage.userLevel === "1" ) {
		result += '<div class="panel panel-default">\
				  <div class="panel-heading">AVAILABLE CONTENT <div class="btn-group btn-group-xs float-right" role="group"> <button type="button" class="btn btn-success align-left navbar-left" data-db="content" data-type="add"><i class="fa fa-1x fa-plus"></i></button>\
			  	  </div></div>\
				  <div class="panel-body">\
				  <div class="tableContainer">\
				  <table class="table" id="categoryDetailsResult">\
				  <tbody><tr><th>Content</th><th>Date</th><th>Category</th><th>User Level</th>'
				  
 			// USER LEVEL CHECK - ADMIN OR INTERNAL - CONTENT EDIT
 			if((sessionStorage.admin == "True" && sessionStorage.userLevel === "3") || (sessionStorage.admin == "True" && sessionStorage.userLevel === "1")) { 
				result += '<th>Edit</th>'
			}
			
 		result += '</tr>'
				  
		for (let i = 0, l = data.length; i < l; i++) {
			result += '<tr><td><a href="?pageType=contentDetails&contentId='+data[i].contentId+'" data-contentid="'+data[i].contentId+'" class="link">'+data[i].contentTitle+'</a></td><td>'+convertDate(data[i].contentDate)+'</td><td>'+data[i].categoryTitle.trim()+'</td><td>'+getUserLevel(data[i].userLevel)+'</td><td>'
			
			// USER LEVEL CHECK - ADMIN - DELETE CONTENT
			if(sessionStorage.admin == "True" && sessionStorage.userLevel === "3") {
				result += '<button type="button" class="btn btn-primary btn-danger" data-db='+typeOf+' data-type="delete" data-id='+data[i].contentId+'><i class="fa fa-trash-o"></i></button>'  
			}
			// USER LEVEL CHECK - ADMIN OR INTERNAL - EDIT CONTENT
			if((sessionStorage.admin == "True" && sessionStorage.userLevel === "3") || (sessionStorage.admin == "True" && sessionStorage.userLevel === "1") ) {
				result += '<button type="button" class="btn btn-primary btn-success" data-db='+typeOf+' data-type="update" data-id='+data[i].contentId+'><i class="fa fa-pencil"></i></button>'
			}
			result +='</td></tr>'
		}
		result += '</tbody></table>'
		result += '</div></div></div>'
		$catTitle.append("Content Management")
		getDate()
	}
	
	// DISPLAY TABLE FOR CATEGORY DETAIL LISTING
	if(typeOf === "categoryDetails") {
 		// USER LEVEL CHECK - EXTERNAL - REMOVE DATA NOT EQUAL TO EXTERNAL LEVEL
		if( sessionStorage.userLevel === "2") {
			data = data.filter(function(item) { return item.userLevel == "2" });		
		}
		
		// NO DATA RETURNED FOR CATEGORY DETAILS
		if(data.length <= 0) {
 			doData("categoryQuery", "-", function(data) { 
				 $catTitle.append(data[0].categoryTitle)
			})
			result += '<div class="panel panel-default">\
				  <div class="panel-heading">No content for this category</div>\
				  <div class="panel-body">\
				  <div class="tableContainer">\
				  </div>\
				  </div>\
				  </div>'
		} else {
			result += '<div class="panel panel-default">\
					  <div class="panel-heading">'+data[0].categoryTitle.trim()+'</div>\
					  <div class="panel-body">\
					  <div class="tableContainer">\
					  <table class="table" id="categoryDetailsResult">\
					  <tbody><tr><th>Title</th><th>Date</th><th>Link</th></tr>'
			for ( let i = 0, l = data.length; i < l; i++) {
				result += '<tr><td><a href="?pageType=contentDetails&contentId='+data[i].contentId+'" class="link">'+data[i].contentTitle+'</a></td><td>'+convertDate(data[i].contentDate)+'</td><td><div class="btn-group btn-group-xs" role="group"><a href="?pageType=contentDetails&contentId='+data[i].contentId+'" class="btn btn-tk">Read More</a></div></td></tr>'
			}
			result += '</tbody></table>'
			result += '</div></div></div>'
			$catTitle.append(data[0].categoryTitle.trim())
		}
	}
	
	// DISPLAY TABLE FOR CONTENT DETAILS
	if(typeOf === "contentDetails") {
		result += '<div class="panel panel-default">\
			     <div class="panel-heading" id="contentTitle">'+data[0].contentTitle+'</div>\
			  	 <div class="panel-body">\
			  	 <p id="contentContent">'+data[0].contentContent+'</p>\
				 <p>'+displayTags(data[0].taggles)+'</p>\
			  	 </div>'
		$catTitle.append("<a href='?pageType=categoryDetails&categoryId="+data[0].contCatId+"' class='link'>" + data[0].categoryTitle.trim() + "</a>")
	}

	// DISPLAY TABLE FOR SEARCH RESULTS
	if(typeOf === "searchDetails") {
 		// USER LEVEL CHECK - EXTERNAL - REMOVE DATA NOT EQUAL TO EXTERNAL LEVEL
		if( sessionStorage.userLevel === "2") {
			data = data.filter(function(item) { return item.userLevel == "2" });		
		}
		result += '<div class="panel panel-default searchResults">\
				  <div class="panel-heading">Search Results</div>\
				  <div class="panel-body">\
				  <div class="tableContainer">\
				  <table class="table" id="categoryDetailsResult">'
		if( data.length <= 0) {
			result += '<tr><td colspan="3">NO RESULTS FOUND</td></tr>'
		} else {
			// INITIAL SEARCH RESULT 	
			for ( let i = 0, l = data.length; i < l; i++) {
				result += '<tr colspan="3"><td><h4><a href="?pageType=contentDetails&contentId='+data[i].contentId+'">'+data[i].contentTitle+'</a></h4>'+
				'<p>'+ searchClean(data[i].contentContent.substring(0,200)) +'....</p>'+
				'<a href="?pageType=contentDetails&contentId='+data[i].contentId+'" class="searchurl">?pageType=contentDetails&contentId='+data[i].contentId+'</a> </td></tr>'
			}
		}
		result += '</tbody></table>'
 		result += '</div></div></div>'
		$catTitle.append("Search Results")
	}

 	// DISPLAY DATA
 	$("#"+typeOf+"Count, #"+typeOf+"Result").empty()
	$("#Result").empty()
 	$("#Result").append(result)
	$("#"+typeOf+"Count").append(data.length)
	
	// HIGHLIGHT CODE SECTIONS IF ADDED
	$("pre code").each(function() {
		Prism.highlightElement($(this)[0])
	})
	
	// ADD CODE COPY BUTTON
	$("pre").each(function () {
            $this = $(this)
            $button = $('<button>Copy</button>')
            $this.wrap('<div/>').removeClass('copy-button')
            $wrapper = $this.parent()
            $wrapper.addClass('copy-button-wrapper').css({position: 'relative'})
            $button.css({position: 'absolute', top: 10, right: 10}).appendTo($wrapper).addClass('copy-button btn btn-code')
			// INITIATE CLIPBOARDJS
            var copyCode = new ClipboardJS('button.copy-button', {
                target: function (trigger) {
                    return trigger.previousElementSibling
                }
            })
            copyCode.on('success', function (event) {
                event.clearSelection()
                event.trigger.textContent = 'Copied'
                window.setTimeout(function () {
                    event.trigger.textContent = 'Copy'
                }, 2000)
            })
            copyCode.on('error', function (event) {
                event.trigger.textContent = 'Press "Ctrl + C" to copy'
                window.setTimeout(function () {
                    event.trigger.textContent = 'Copy'
                }, 2000)
            })
        })
}

//-------------------------------------------------------------------------------------------//
// DISPLAY TAGS -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function displayTags(x) {
	console.log("%c displayTags(x) ", "color: #ff7b00")
	var result = '<hr /><ul class="taggle_list">'
	var xx = x
	x = x || ""
	if(x.length <= 0) {
		result = ''
	} else {
		x = x.split(",")
		$(x).each(function(index, elem) {
			result += '<li class="taggle"><span class="taggle_text">'+ elem +'</span></li>'
		})
		result += '</ul>'
	}
	return result
}

//-------------------------------------------------------------------------------------------//
// BADGE STATUS -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function badgeStatus(x) {
	console.log("%c badgeStatus(x) ", "color: #ff7b00")
	var result;
		if(x > 0) {
		result = '<span class="badge">'+x+'</span>'
		} else {
		result = '<span class="badge badge-0">'+x+'</span>'
		}
	return result
}

//-------------------------------------------------------------------------------------------//
// SEARCH CLEAN  ----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function searchClean(string) {
	console.log("%c searchClean(string) ", "color: #ff7b00")
	var output = string //JSON.stringify(string).replace(/\\n/g, '')
 	if(string.includes("<table")) {
 		 output = output.replace(/<\/?[^>]+(>|$)/g, "")
	}
 	return output
}

//-------------------------------------------------------------------------------------------//
// SEARCH HIGHLIGHT -------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function searchHighlight(string, indices) {
	console.log("%c searchHighlight(string, indices) ", "color: #ff7b00")
	var start, end, length, output
	start = indices[0]
	end = indices[1]
	length = end - start + 1
	// IMAGE OR ALT MATCH DO NOT HIGHLIGHT
	if(string.includes("<img")) {
 		output = string;
	} else {
		output = string.slice(0,start)+'<span class="searchHighlight">'+string.slice(start,start+length)+'</span>'+string.slice(start+length)
	}
	return output.substring(0, 150)
}

//-------------------------------------------------------------------------------------------//
// SEARCH SCORE -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function searchScore(a) {
	console.log("%c searchScore(a) ", "color: #ff7b00")
	var b = Math.max( Math.ceil(a * 10) / 10, 2.8 )
	return a
}

//-------------------------------------------------------------------------------------------//
// ESCAPE SPECIAL CHARS ---------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function specialChars(chars) {
 	console.log("%c specialChars(chars) ", "color: #ff7b00")
	return chars
         .replace(/&/g, "&")
         .replace(/</g, "&lt;")
         .replace(/>/g, ">")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "'")
 }
 
//-------------------------------------------------------------------------------------------//
// CONVERT DATE -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function convertDate(p) {
	console.log("%c convertDate(p) ", "color: #ff7b00")
 	if( p == null) {
		p = "No Updates"
	} else {
		p = p.slice(0, 10)
		p = p.replace(/-/g, '/')
		p = p.split('/')
		p = p[1].replace(/(^|-)0+/g, "$1") + '-' + p[2].replace(/(^|-)0+/g, "$1") + '-' + p[0]
	}
    return p 
}

//-------------------------------------------------------------------------------------------//
// CONVERT LEVELS TO TEXT -------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function getUserLevel(level) {
	console.log("%c getUserLevel(level) ", "color: #ff7b00")
	var strLevel
	if(level == 1) {
		strLevel = "Internal <i class='fa fa-user-secret'></i>"
	} else if(level == 2) {
		strLevel = "External <i class='fa fa-share-alt'></i>"
	} else if(level == 3) {
		strLevel = "Admin"
	}
	return strLevel
}

//-------------------------------------------------------------------------------------------//
// GET CATEGORY NAME ------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function getCategoryName(data, currCat) {
 	console.log("%c getCategoryName(data, currCat) ", "color: #ff7b00") // data[2].categoryId
	var currentCat = ""
	var flag = true
	for(var i = 0; i < data.length; i++) {
		if(data[i].categoryId == currCat) {
			console.log("matchs")
			currentCat == data[i].categoryTitle
 		 	flag = false
		  	return currentCat
		}
	}
}

//-------------------------------------------------------------------------------------------//
// SHOW CATEGORIES --------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function showCategories(data, currCat) {
 	console.log("%c showCategories(data, currCat) ", "color: #ff7b00")
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
	$(".categorySelect").append(categoryOptions)
}

//-------------------------------------------------------------------------------------------//
// GET DATE ---------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function getDate() {
	console.log("%c getDate() ", "color: #ff7b00")
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear()
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
	today = yyyy+"-"+mm+"-"+dd+"T"+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()
    document.getElementById("todaysDate").value = today
	return today
}

//-------------------------------------------------------------------------------------------//
// SHOW OPTIONS -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function showOptions(currRecord, currentLevel) {
	console.log("%c showOptions(currRecord, currentLevel) ", "color: #ff7b00")
	// GET CURRENT USER LEVEL AND APPEND SELECT 
 	var userLevelOptions=""
	var optionNum=2
 	for(var i=1;i<=optionNum;i++) {
 		if(currRecord == i) {
 			userLevelOptions+="<option value='"+i+"' selected>"+currentLevel+"</option>"
 		} else {
 			userLevelOptions+="<option value='"+i+"'>"+getUserLevel(i)+"</option>"
 		}
 	}
	return userLevelOptions
}