<!-- #include file="fileUpload.asp" -->
<%

Dim objUpload
    Set objUpload=New ShadowUpload
    If objUpload.GetError<>"" Then
		Response.Status = "500 Internal Server Error"
    Else  
        For x=0 To objUpload.FileCount-1

            If (objUpload.File(x).ImageWidth>8000) Or (objUpload.File(x).ImageHeight>8000) Then
                Response.Write("Image to large. Unable to save.")
            Else  
                Call objUpload.File(x).SaveToDisk(Server.MapPath("files"), "")
 				' SEND LOCATION BACK
				Response.ContentType = "application/json"
				Response.Write("{ ""location"": ""/" & objUpload.File(x).FileName &"""}")
            End If

        Next

		Response.Status = "200 OK"
		
    End If
	


%>