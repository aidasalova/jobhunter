/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 *
 * @param {object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  DocumentApp.getUi()
      .createMenu('One More CV')
      .addItem('Open Assistant', 'openSidebar')
      .addToUi();
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('One More CV Editor');
  DocumentApp.getUi().showSidebar(html);
}

/**
 * Saves user settings (API key and Master Profile) to user properties.
 *
 * @param {object} payload Object containing apiKey and masterProfile.
 * @return {boolean} True if successful.
 */
function saveUserSettings(payload) {
  try {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperties({
      'GEMINI_API_KEY': payload.apiKey || '',
      'MASTER_PROFILE': JSON.stringify(payload.masterProfile || {})
    });
    return true;
  } catch (error) {
    throw new Error('Failed to save settings: ' + error.message);
  }
}

/**
 * Retrieves user settings from user properties.
 *
 * @return {object} Object containing apiKey and masterProfile.
 */
function getUserSettings() {
  const userProperties = PropertiesService.getUserProperties();
  const apiKey = userProperties.getProperty('GEMINI_API_KEY') || '';
  const profileString = userProperties.getProperty('MASTER_PROFILE');
  let masterProfile = {};
  
  try {
    if (profileString) {
      masterProfile = JSON.parse(profileString);
    }
  } catch (e) {
    Logger.log('Error parsing profile JSON: ' + e.message);
  }
  
  return {
    apiKey: apiKey,
    masterProfile: masterProfile
  };
}

/**
 * Gets the text from the active Google Doc.
 *
 * @return {string} The text content of the document.
 */
function getDocumentText() {
  try {
    return DocumentApp.getActiveDocument().getBody().getText();
  } catch (error) {
    throw new Error('Failed to extract document text: ' + error.message);
  }
}

/**
 * Analyzes the document text against a job description using the Gemini API.
 *
 * @param {string} jobDescription The job description to align the document against.
 * @return {Array<object>} An array of objects with exact_original_text, suggested_replacement, and reason_for_change.
 */
function analyzeWithGemini(jobDescription) {
  try {
    // 1. Retrieve the stored API Key and Master Profile
    const settings = getUserSettings();
    if (!settings.apiKey) {
      throw new Error('API Key missing. Please save your Gemini API Key in the settings.');
    }
    const apiKey = settings.apiKey;
    const masterProfile = JSON.stringify(settings.masterProfile || {});

    // 2. Extract Document Text
    const documentText = getDocumentText();
    if (!documentText || documentText.trim() === '') {
      throw new Error('The document is empty.');
    }

    // 3. Construct System Prompt
    const prompt = `You are an expert resume writer.
Analyze the 'Document Text' against the 'Job Description' and the user's 'Master Profile'.
Identify specific sentences or phrases in the 'Document Text' that should be rewritten to better match the 'Job Description', leveraging information from the 'Master Profile'.

Master Profile:
${masterProfile}

Job Description:
${jobDescription}

Document Text:
${documentText}
`;

    // 4. Gemini API Call with JSON Schema Enforcement
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              exact_original_text: {
                type: "STRING",
                description: "The exact sentence or phrase from the original Document Text to be replaced."
              },
              suggested_replacement: {
                type: "STRING",
                description: "The newly rewritten text to replace the original."
              },
              reason_for_change: {
                type: "STRING",
                description: "A brief explanation of why this change improves alignment."
              }
            },
            required: ["exact_original_text", "suggested_replacement", "reason_for_change"]
          }
        }
      }
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    // 5. Execute API Call and Return Data
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode !== 200) {
      throw new Error(`Gemini API Error (${responseCode}): ${responseBody}`);
    }

    const data = JSON.parse(responseBody);

    if (data.candidates && data.candidates.length > 0) {
      const jsonResponseText = data.candidates[0].content.parts[0].text;
      return JSON.parse(jsonResponseText);
    } else {
      throw new Error('Invalid response format from Gemini API.');
    }
  } catch (error) {
    Logger.log('Error in analyzeWithGemini: ' + error.message);
    throw new Error(error.message);
  }
}

/**
 * Searches the document body for the original text and highlights it in yellow.
 *
 * @param {string} originalText The text to search for.
 * @return {boolean} True if found and highlighted, false otherwise.
 */
function highlightTextInDoc(originalText) {
  const body = DocumentApp.getActiveDocument().getBody();
  // Escape regex special characters since findText uses regex-like string
  const searchPattern = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const foundElement = body.findText(searchPattern);
  
  if (foundElement) {
    const textElement = foundElement.getElement().asText();
    const startOffset = foundElement.getStartOffset();
    const endOffset = foundElement.getEndOffsetInclusive();
    textElement.setBackgroundColor(startOffset, endOffset, '#FFFF00');
    return true;
  }
  return false;
}

/**
 * Searches the document body for the original text and replaces it verbatim.
 * Clears any background color applied to the replacement text.
 *
 * @param {string} originalText The text to search for.
 * @param {string} replacementText The text to replace it with.
 * @return {boolean} True if found and replaced, false otherwise.
 */
function replaceTextInDoc(originalText, replacementText) {
  const body = DocumentApp.getActiveDocument().getBody();
  const searchPattern = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const foundElement = body.findText(searchPattern);
  
  if (foundElement) {
    const textElement = foundElement.getElement().asText();
    const startOffset = foundElement.getStartOffset();
    const endOffset = foundElement.getEndOffsetInclusive();
    
    // Delete the original text and insert the replacement text
    textElement.deleteText(startOffset, endOffset);
    textElement.insertText(startOffset, replacementText);
    
    // Clear any background highlight on the new text
    const newEndOffset = startOffset + replacementText.length - 1;
    if (newEndOffset >= startOffset) {
      textElement.setBackgroundColor(startOffset, newEndOffset, null);
    }
    
    return true;
  }
  return false;
}
