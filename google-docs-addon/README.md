# One More CV: Google Docs Addon


This project also features a companion Google Workspace Add-on built with Google Apps Script. 
It allows users to import their .json backup directly into a Google Doc sidebar and use Gemini to dynamically highlight and replace CV text on the page based on the job description.

# Instructions

1.**Open the Apps Script Editor**:Open a new or existing Google Doc.In the top menu bar, click Extensions > Apps Script.This will open a new browser tab with Google's code editor.
2.**Paste Code.gs**:You will see a file on the left sidebar already created called Code.gs.Delete the empty function myFunction() {} that is sitting in there.Paste all the backend JavaScript code from Code.gs.
3.**Create the Sidebar.html file**:Click the + (Plus) icon next to the "Files" header in the left sidebar.Select HTML from the dropdown.Name the file exactly Sidebar (Google will automatically add the .html extension).Delete the default HTML inside it, and paste Sidebar.html code.
4.**Save and Reload**:Click the Save icon (the little floppy disk) at the top of the editor.Close the Apps Script tab and go back to your Google Doc.Refresh the page.
5.**Authorize the Script**:Google will show a warning screen.Wait about 5-10 seconds after refreshing. Look at the top menu bar (next to Help). You should see a new custom menu (One More CV).Click it, and select Open Assistant.A popup will say "Authorization Required." Click Continue and select your Google account.Google will throw up a warning. Click the small Advanced link at the bottom of the warning.Click Go to Untitled project (unsafe).Review the permissions (it needs to read your document and connect to an external API like Gemini), and click Allow.Once you hit Allow, the Add-on will open right there on the right side of your screen.
6. You can upload your JSON backup from the main One More CV app, type in your API key, paste a job description, and watch it analyze your actual document.