<%
Option Explicit
Response.LCID = 1033 ' USA LCID '
%>
<!--#include file="jsonObject.class.asp" -->

<nav class="navbar navbar-default">
  <div class="container-fluid nopadRight">

    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
	  <a class="navbar-brand" href="tk.html"><span class="navbar-icons">T<div class="k">K</div></span></a>
    </div>

    
    <div class="collapse navbar-collapse" id="navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Categories <span class="caret"></span></a>
          <ul class="dropdown-menu" id="categoriesMenu">
		  	<!-- DATA BUILT DYNAMICALLY -->		
          </ul>
        </li>
		<!-- DYNAMIC NAVBAR -->
		<%
		''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
		' GET USER INFORMATION '''''''''''''''''''''''''''''''''''
		''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
		' DECLARE VARIABLES
		Dim cUser, endStr, tLength, rRemove, fUser
		' GET USER STRING
		
		' Change cUser to reflect use case. For local example hard code user name to match user in database else use LOGON_USER - checkUser.asp and navigation.asp

		' cUser =  Request.ServerVariables("LOGON_USER")
		cUser =  "users\some.body"

		' FIND BACKSLASH IN STRING
		endStr = InStrRev(cUser,"\")
		' GET LENGTH OF TOTAL SRING
		tLength = Len(cUser)
		' FIND DIFFERENCE IN LENGTH
		rRemove = tLength - endStr
		' REMOVE DIFFERENCE IN LENGTH TO GET USER NAME
		fUser = Right(cUser,rRemove)
		' RETURN USER NAME

		Dim cn, rs, JSONarr, x
		set cn = Server.CreateObject("ADODB.Connection")
		cn.Open "Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\inetpub\datasources\tk\tk.mdb"
		set rs = cn.execute("SELECT Count([userName]) AS userFound FROM USERS WHERE (((USERS.[userName])='" & fUser & "'))")
		set JSONarr = new JSONarray

		If rs.EOF Then
		  Response.Write("{ ""admin"": """& false &""", ""adminName"":""USER"", ""userLevel"":""2""}")
		Else
		
		Do Until rs.EOF
			for each x in rs.fields
				If x.value = 1 Then ' user found
					response.write("<li class='dropdown' id='adminbtn'><a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Admin <span class='caret'></span></a><ul class='dropdown-menu'><li><a href='?pageType=adminCategory'>Manage Categories</a></li><li><a href='?pageType=adminContent'>Manage Content</a></li><li><a href='?pageType=adminKeywords'>Manage Keywords</a></li></ul></li>")
				End If
			next
			rs.MoveNext
		Loop
		End If


		rs.close
		cn.close
		set rs = Nothing
		set cn = Nothing
		%>
		<!-- END DYNAMIC NAVBAR -->
      </ul>

      <ul class="nav navbar-nav navbar-right">
	  <li class="hidden-xs"><div id="userName"></div></li>
	  <li>
              <form class="navbar-form navbar-left" action="" id="contentSearch">
        <div class="form-group">
          <input type="text" class="form-control" name="searchField" placeholder="What are you looking for?">
        </div>
		<button type="submit" class="btn btn-success"><i class="fa fa-search"></i></button>
      </form>
	  </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

