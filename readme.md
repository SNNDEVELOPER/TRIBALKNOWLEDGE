# TRIBAL KNOWLEDGE

A bare bones CMS system designed to work on legacy systems using Classic ASP and MS ACCESS. Offering the ability for users to add, edit, delete, search, attach and upload files and include formatted code snippets.

# GETTING STARTED

Download and copy the contents to a folder on a Windows IIS server. 

Point the paths to the local MDB file to reflect your path and directory structure in the following files.
DBQ=C:\inetpub\datasources\tk\tk.mdb

checkUser.asp
navigation.asp
doData.asp

Adjust the cUser value in the following files below depending on your network setup.

checkUser.asp 
navigation.asp

# ADDITIONAL SETUP

Optional configuration can be made to the URL QUERYSTRING APPEND section within tk.js as well as mime type configuration in the web.config file.

# AUTHOR 

Shaun Nelson - [snndeveloper]
(https://github.com/snndeveloper)





