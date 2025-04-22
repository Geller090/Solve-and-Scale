# Setting Up Google Sheets Integration for Contact Form

Follow these steps to connect your contact form to Google Sheets for form data collection.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename it to something like "Solve and Scale - Contact Form Submissions"
4. Add the following headers in the first row:
   - Timestamp
   - Name
   - Business
   - Email
   - Phone
   - Message

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on `Extensions` > `Apps Script`
2. Replace the default code with the following script:

```javascript
const sheetName = 'Sheet1';
const scriptProps = PropertiesService.getScriptProperties();

function doGet(e) {
  return handleResponse(e);
}

function doPost(e) {
  return handleResponse(e);
}

function handleResponse(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(sheetName);
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;
    
    const newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header];
    });
    
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    // Return HTML page with success message
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            .success { color: #2f855a; }
          </style>
        </head>
        <body>
          <h2 class="success">Form submitted successfully!</h2>
          <p>Your contact information has been received.</p>
          <p>You can close this window now.</p>
        </body>
      </html>`
    );
  }
  
  catch(error) {
    // Return error message
    return HtmlService.createHtmlOutput(
      `<html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            .error { color: #c53030; }
          </style>
        </head>
        <body>
          <h2 class="error">Error submitting form</h2>
          <p>There was a problem processing your submission.</p>
          <p>Please try again or contact us directly.</p>
          <p>Error: ${error.toString()}</p>
        </body>
      </html>`
    );
  }
  
  finally {
    lock.releaseLock();
  }
}

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = doc.getSheetByName(sheetName);
  
  // Check if headers are already set up
  const headers = ['timestamp', 'name', 'business', 'email', 'phone', 'message'];
  const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  
  // If headers don't match, set them up
  if (JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
```

3. Save the project with a name like "Contact Form Handler"
4. Run the `setup` function by selecting it from the dropdown menu and clicking the play button
5. You'll be asked to authorize the script - follow the prompts to do so

## Step 3: Deploy the Web App

1. Click on `Deploy` > `New deployment`
2. Select `Web app` as the deployment type
3. Set the following options:
   - Description: "Contact Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone" (This allows your form to submit data without authentication)
4. Click `Deploy`
5. Copy the Web App URL provided - this is what you'll need for your form

## Step 4: Update Your Website Code

1. Open the file: `/js/contact.js`
2. Replace the placeholder URL with your Google Apps Script Web App URL:

```javascript
const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // Replace with your URL from Step 3
```

3. Save the file and upload it to your website

## Step 5: Test the Form

1. Fill out and submit the contact form on your website
2. Check your Google Sheet to verify the data was recorded correctly

## Additional Notes

- The form uses a loading spinner to indicate submission is in progress
- Success and error messages are displayed to the user after submission
- The form fields are cleared after successful submission
- Consider setting up email notifications from your Google Sheet using add-ons or additional Apps Script code
- You may need to adjust the field names in the Apps Script if you change the form field names

## Troubleshooting

If the form isn't working:

1. Check the browser console for JavaScript errors
2. Verify the Web App URL is correct in your contact.js file
3. Make sure the script is deployed as a web app with appropriate permissions
4. Confirm the header names in the Google Sheet match the field names in your form
5. **CORS Issues**: If you're getting CORS errors when testing locally:
   - Make sure you're using the updated Google Apps Script code that supports iframe submission
   - The form uses an iframe approach to bypass CORS restrictions when submitting from a local file
   - When deployed to a real web server, CORS issues should not occur
6. **Redeploying**: If you make changes to the Apps Script code:
   - Click Deploy > New deployment (don't update existing deployments)
   - This will give you a new Web App URL that you'll need to update in contact.js