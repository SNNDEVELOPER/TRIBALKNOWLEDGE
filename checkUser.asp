<%
Option Explicit
Response.LCID = 1033 ' USA LCID '
%>
<!--#include file="jsonObject.class.asp" -->

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

Dim cn, rs, JSONarr
set cn = Server.CreateObject("ADODB.Connection")
cn.Open "Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\inetpub\datasources\tk\tk.mdb"

set rs = cn.execute("SELECT Count(USERS.[userName]) AS userFound, userLevel as uLevel FROM USERS WHERE (((USERS.userName)='" & fUser & "')) GROUP BY userLevel")

set JSONarr = new JSONarray

If rs.EOF Then
	' NO ADMIN FOUND SET TO EXTERNAL
 	' Response.Write("0")
	Response.Write("{ ""admin"": """& false &""", ""adminName"":"""& fUser & """, ""userLevel"":""2""}")
	' Set session user level in ASP
	Session("userLevel")="2"
Else
 	Response.ContentType = "application/json"
	If rs("userFound") = 1  Then
		Response.Write("{ ""admin"": """& true &""", ""adminName"":"""& fUser & """, ""userLevel"": """& rs("uLevel") &""" }")
		
		Session("userLevel")=""&rs("uLevel")&""
	Else
		Response.Write("{ ""admin"": """& false &""", ""adminName"":"""", ""userLevel"":""2""}")
	End If

End If

rs.close
cn.close
set rs = Nothing
set cn = Nothing
%>