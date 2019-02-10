<%
Option Explicit
Response.LCID = 1033 ' USA LCID '
%>
<!--#include file="jsonObject.class.asp" -->
<%
' DECLARE VARIABLES '
dim JSON, jsonObj, JSONarr, sqlType, sqlRecordId, categoryId, contentId, cn, rs, sqlSelect

' SET VALUES '
set sqlType = Request.QueryString("sqlType")
set sqlRecordId = Request.QueryString("sqlRecordId")
set categoryId = Request.QueryString("categoryId")
set contentId = Request.QueryString("contentId")

set JSONarr = new JSONarray

' FLAG FOR SELECT RECORDSET '
sqlSelect = "true"

' LOAD RECORDS FROM RECORDSET '
set cn = Server.CreateObject("ADODB.Connection")
cn.Open "Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\inetpub\datasources\tk\tk.mdb"


' SELECT QUERIES DRIVEN BY QUERYSTRING PARAMETER PASSED OVER FROM AJAX GET'
Select Case sqlType
	' SELECT '
 	Case "content-old"
		set rs = cn.execute("SELECT contentId, contentTitle, contentDate, categoryId, userLevel FROM CONTENT ORDER BY contentId ASC")	
 	
	Case "content", "adminContent"

		 ' implemented isDeleted flag 0 no 1 yes
		 set rs = cn.execute("SELECT CATEGORY.categoryId AS CatId, CATEGORY.categoryTitle, CONTENT.contentId, CONTENT.contentTitle, CONTENT.contentContent, CONTENT.contentDate, CONTENT.taggles, CONTENT.fileId, CONTENT.userLevel FROM CATEGORY INNER JOIN CONTENT ON CATEGORY.categoryId = CONTENT.categoryId WHERE (((CATEGORY.isDeleted)=0) AND ((CONTENT.isDeleted)=0)) ORDER BY CONTENT.contentTitle")
	
	Case "categoryQuery", "adminCategoryQuery"
		set rs = cn.execute("SELECT categoryId, categoryTitle FROM CATEGORY WHERE categoryId=" & sqlRecordId & "")

	Case "keywords", "adminKeywords"
		set rs = cn.execute("SELECT * FROM KEYWORDS")
	
 	Case "keywordsQuery", "adminKeywordsQuery"
		set rs = cn.execute("SELECT keywordsTitle FROM KEYWORDS WHERE keywordsId=" & sqlRecordId & "")
	
	Case "keywordsDelete", "adminKeywordsDelete"
		cn.execute("DELETE FROM KEYWORDS WHERE keywordsId=" & sqlRecordId & "")
		sqlSelect = "false"
		
 	Case "keywordsInsert", "adminKeywordsInsert"
		cn.execute("INSERT INTO KEYWORDS (keywordsTitle) VALUES ('" & Request.Form("keywordsTitle") & "') ")
		sqlSelect = "false"
		
 	Case "keywordsUpdate", "adminKeywordsUpdate"
 		cn.execute("UPDATE KEYWORDS SET keywordsTitle='" & Request.Form("keywordsTitle") & "' WHERE keywordsId=" & Request.Form("keywordsId") & "")
		sqlSelect = "false"

 	Case "contentQuery", "adminContentQuery"
		set rs = cn.execute("SELECT contentId, contentTitle, contentDate, taggles, contentContent, categoryId, userLevel FROM CONTENT WHERE contentId=" & sqlRecordId & "")
	
 	Case "contentDetails"
		'To pull in category title for content details'
		set rs = cn.execute("SELECT CONTENT.contentId AS contId, CONTENT.contentTitle, CONTENT.contentDate, CONTENT.contentContent, CONTENT.taggles, CONTENT.categoryId AS contCatId, CONTENT.userLevel, CATEGORY.categoryTitle, CATEGORY.categoryId FROM CONTENT INNER JOIN CATEGORY ON CONTENT.categoryId = CATEGORY.categoryId WHERE (((CONTENT.contentId)=" & contentId & ")) ")

	Case "categoryDetails"
		set rs = cn.execute("SELECT CONTENT.contentTitle, CONTENT.contentDate, CONTENT.contentId, CONTENT.userLevel, CONTENT.categoryId, CONTENT.isDeleted, CATEGORY.categoryTitle FROM CATEGORY INNER JOIN CONTENT ON CATEGORY.categoryId = CONTENT.categoryId WHERE (((CATEGORY.categoryId)=" & categoryId &") AND ((CONTENT.isDeleted)=0)) ORDER BY CONTENT.contentTitle")

 	Case "categoryNav"
		If Session("userLevel")="2" Then
			
			' SHOW ADJUSTED COUNTS FOR AVAILABLE CONTENT IN EACH CATEGORY
			set rs = cn.execute("SELECT CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, Last(CONTENT.contentDate) AS ctDate, CATEGORY.isDeleted AS catDel, Count(IIf(CONTENT.isDeleted=0,1,0)) AS countTotal, Count(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null)) AS countOfDeleted, Count([CONTENT.categoryId])-Count(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null)) AS countDifference1, SUM(IIf([CONTENT.userLevel]=2 AND [CONTENT.isDeleted]=0,1,0)) AS countDifference, SUM(IIf([CONTENT.isDeleted]=0,1,0)) - COUNT(IIf([CONTENT.userLevel]=2,1,NULL)) AS userLevelCount FROM CATEGORY LEFT JOIN CONTENT ON CATEGORY.categoryId = CONTENT.categoryId GROUP BY CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, CATEGORY.isDeleted HAVING (((CATEGORY.isDeleted)=0)) ORDER BY CATEGORY.categoryTitle")
			
		Else
		
			' SHOW ALL COUNTS
			set rs = cn.execute("SELECT CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, Last(CONTENT.contentDate) AS ctDate, CATEGORY.isDeleted AS catDel, COUNT(IIF(CONTENT.isDeleted=0,1,0)) AS countTotal, COUNT(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null)) AS countOfDeleted, COUNT([CONTENT.categoryId]) - COUNT(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null))AS countDifference FROM CATEGORY LEFT JOIN CONTENT ON CATEGORY.categoryId = CONTENT.categoryId GROUP BY CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, CATEGORY.isDeleted HAVING (((CATEGORY.isDeleted)=0)) ORDER BY CATEGORY.categoryTitle")
		
		End If
	
	Case "category","adminCategory"

		If Session("userLevel")="2" Then
		
			set rs = cn.execute("SELECT CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, Last(CONTENT.contentDate) AS ctDate, CATEGORY.isDeleted AS catDel, Count(IIf(CONTENT.isDeleted=0,1,0)) AS countTotal, Count(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null)) AS countOfDeleted, Count([CONTENT.categoryId])-Count(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null)) AS countDifference1, SUM(IIf([CONTENT.userLevel]=2 AND [CONTENT.isDeleted]=0,1,0)) AS countDifference, SUM(IIf([CONTENT.isDeleted]=0,1,0)) - COUNT(IIf([CONTENT.userLevel]=2,1,NULL)) AS userLevelCount FROM CATEGORY LEFT JOIN CONTENT ON CATEGORY.categoryId = CONTENT.categoryId GROUP BY CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, CATEGORY.isDeleted HAVING (((CATEGORY.isDeleted)=0)) ORDER BY CATEGORY.categoryTitle")

		Else
		
			set rs = cn.execute("SELECT CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, Last(CONTENT.contentDate) AS ctDate, CATEGORY.isDeleted AS catDel, COUNT(IIF(CONTENT.isDeleted=0,1,0)) AS countTotal, COUNT(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null)) AS countOfDeleted, COUNT([CONTENT.categoryId]) - COUNT(IIf([CONTENT.isDeleted]=1,[CONTENT.contentID],Null))AS countDifference FROM CATEGORY LEFT JOIN CONTENT ON CATEGORY.categoryId = CONTENT.categoryId GROUP BY CATEGORY.categoryId, CATEGORY.categoryTitle, CATEGORY.categoryDate, CATEGORY.isDeleted HAVING (((CATEGORY.isDeleted)=0)) ORDER BY CATEGORY.categoryTitle")
		
		
		End If
	
	Case "categoryManage"
		set rs = cn.execute("SELECT categoryId, categoryTitle, categoryDate, userLevel FROM CATEGORY ORDER BY categoryId ASC")
 	
 	' END SELECT '
	
	' UPDATE DELETE INSERT '
	Case "categoryUpdate"
		cn.execute("UPDATE CATEGORY SET modifiedBy='" & Request.Form("adminName") & "', modifiedDate='" & Request.Form("modifiedDate") & "', categoryTitle='" & Request.Form("categoryTitle") & "' WHERE categoryId=" & Request.Form("categoryId") & "")
		sqlSelect = "false"
	
	Case "categoryDelete"
		cn.execute("UPDATE CATEGORY SET isDeleted='1', modifiedBy='" & Request.Form("adminName") & "', modifiedDate='" & Request.Form("modifiedDate") & "' WHERE categoryId=" & sqlRecordId & "")
 		sqlSelect = "false"
	
	Case "categoryInsert"
		cn.execute("INSERT INTO CATEGORY (categoryTitle, categoryDate, isDeleted) VALUES ('" & Request.Form("categoryTitle") & "','" & Request.Form("categoryDate") & "',' 0')")
		sqlSelect = "false"
	
	Case "contentUpdate"
		cn.execute("UPDATE CONTENT SET modifiedBy='" & Request.Form("adminName") & "', modifiedDate='" & Request.Form("modifiedDate") & "', contentTitle='" & Request.Form("contentTitle") & "', contentContent='" & Request.Form("contentContent") & "', contentDate='" & Request.Form("contentDate") & "', taggles='" & Request.Form("taggles") & "', categoryId='" & Request.Form("categoryId") & "', userLevel='" & Request.Form("userLevel") & "' WHERE contentId=" & Request.Form("contentId") & "")
		sqlSelect = "false"
	
 	Case "contentDelete"
		cn.execute("UPDATE CONTENT SET isDeleted='1', modifiedBy='" & Request.Form("adminName") & "', modifiedDate='" & Request.Form("modifiedDate") & "' WHERE contentId=" & sqlRecordId & "")
 		sqlSelect = "false"
	
 	Case "contentInsert"
		cn.execute("INSERT INTO CONTENT (contentTitle, contentContent, contentDate, taggles, categoryId, userLevel) VALUES ('" & Request.Form("contentTitle") & "','" & Request.Form("contentContent") & "','" & Request.Form("contentDate") & "','" & Request.Form("taggles") & "','" & Request.Form("categoryTitle") & "','" & Request.Form("userLevel") & "')")
		sqlSelect = "false"

	' END UPDATE DELETE INSERT '
	
End Select

' RETURN RECORDSET FORMATTED JSON'
If(sqlType <> "") AND (sqlSelect = "true") Then
	JSONarr.LoadRecordset rs
End If

' CLOSE RECORDSET '
If(sqlType <> "") AND (sqlSelect = "true") Then
	rs.Close
End If

' CLOSE CONNECTION '
cn.Close

' SET RS TO NOTHING '
If(sqlType <> "") AND (sqlSelect = "true") Then
	set rs = Nothing
End If

' SET CONNECTION TO NOTHING '
set cn = Nothing

' RETURN JSON FOR USE ON PAGE'
If (sqlType <> "") AND (sqlSelect = "true") Then
	JSONarr.Write()
End If

%>