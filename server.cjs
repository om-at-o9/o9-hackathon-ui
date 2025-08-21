const express = require('express');
const cors = require('cors');
const fs = require('fs/promises'); // Modern file system module for async/await
const path = require('path');
const diff = require('diff'); // Library to generate GitHub-style diffs

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing so your React app can talk to this server
app.use(cors());
// Enable the server to parse incoming JSON requests
app.use(express.json());

// -----------------------------------------------------------------------------
// 2. CONFIGURATION
// -----------------------------------------------------------------------------
const PORT = 3001;
// This is the path to your source code. __dirname is the current directory (where server.js is).
const CODEBASE_PATH = path.join(__dirname, 'src');

// -----------------------------------------------------------------------------
// 3. THE MAIN API ENDPOINT
// -----------------------------------------------------------------------------
app.post('/api/modify-code', async (req, res) => {
  // Destructure the prompt and context from the incoming request body
  const { prompt, context } = req.body;

  console.log(`[INFO] Received request:`);
  console.log(`  - Prompt: "${prompt}"`);
  console.log(`  - Context: "${context}"`);

  // --- Basic validation ---
  if (!prompt || !context) {
    return res.status(400).json({ error: 'Prompt and context are required.' });
  }

  try {
    // -------------------------------------------------------------------------
    // STEP A: Find the relevant code file from the context
    // -------------------------------------------------------------------------
    // Example context: "Element in: src/pages/ListBoxPage.jsx:75"
    const filePathMatch = context.match(/in: (src[^\s:]+)/);
    if (!filePathMatch || !filePathMatch[1]) {
      return res.status(400).json({ error: 'Could not parse file path from context.' });
    }

    const relativeFilePath = filePathMatch[1];
    const absoluteFilePath = path.join(__dirname, relativeFilePath);
    console.log(`[INFO] Identified target file: ${absoluteFilePath}`);

    // -------------------------------------------------------------------------
    // STEP B: Read the original code from the file
    // -------------------------------------------------------------------------
    const originalCode = await fs.readFile(absoluteFilePath, 'utf-8');
    console.log(`[INFO] Successfully read original code from file.`);

    // -------------------------------------------------------------------------
    // STEP C: SIMULATE AI - Generate the code modification
    // -------------------------------------------------------------------------
    // In a real application, this block would contain a call to the Gemini API.
    // For this hackathon prototype, we'll hardcode the logic for a few specific prompts.
    let modifiedCode;
    let explanation;

    if (prompt.toLowerCase().includes('change the button to blue')) {
      explanation = "Okay, I'll change the primary button's style to have a blue background.";
      // Use .replace() to find the specific line and modify it.
      // This is a simple but effective way to simulate the AI's output.
      modifiedCode = originalCode.replace(
        'primary={true}',
        'style={{ backgroundColor: "blue", color: "white" }}'
      );
    } else if (prompt.toLowerCase().includes('remove the description')) {
        explanation = "Understood. I will remove the paragraph describing the component.";
        modifiedCode = originalCode.replace(
            '<p>This component shows a draggable list of employees and developers.</p>',
            '' // Replace with an empty string to remove it
        );
    } else {
      explanation = "I'm not sure how to handle that request yet, but here is the original code context.";
      modifiedCode = originalCode; // If the prompt is not recognized, make no changes.
    }

    console.log(`[INFO] Generated modified code based on intent.`);

    // -------------------------------------------------------------------------
    // STEP D: Create a "diff" string to show the changes
    // -------------------------------------------------------------------------
    // This creates a patch string in the same format you see on GitHub PRs.
    const diffString = diff.createPatch(
      relativeFilePath, // The original filename
      originalCode,
      modifiedCode
    );

    console.log(`[INFO] Generated diff successfully.`);

    // -------------------------------------------------------------------------
    // STEP E: Send the final response to the frontend
    // -------------------------------------------------------------------------
    res.json({
      explanation: explanation,
      diff: diffString,
      newCode: modifiedCode, // Also send the full new code for potential "apply" functionality
    });

  } catch (error) {
    console.error('[ERROR] An error occurred in /api/modify-code:', error);
    // Check if the error is a file-not-found error
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'The specified code file was not found on the server.' });
    }
    // For any other errors, send a generic server error message
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// -----------------------------------------------------------------------------
// 4. START THE SERVER
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[SUCCESS] GenAI Code Assistant server is running on http://localhost:${PORT}`);
});
