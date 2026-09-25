' SellerBoost Silent Launcher
' Runs the app without showing console window

Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
scriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)

' Change to script directory
WshShell.CurrentDirectory = scriptDir

' Check if node_modules exists, if not run npm install
If Not FSO.FolderExists(scriptDir & "\node_modules") Then
    ' Run npm install silently
    WshShell.Run "cmd /c npm install", 0, True
End If

' Check if cookies.txt exists, if not create it
If Not FSO.FileExists(scriptDir & "\cookies.txt") Then
    FSO.CreateTextFile(scriptDir & "\cookies.txt", True).Close
End If

' Run Electron app silently (window style 0 = hidden)
WshShell.Run "cmd /c npx electron .", 0, False