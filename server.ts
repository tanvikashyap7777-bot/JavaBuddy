import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { executeJavaCode, explainAndFixError, askTutor } from './server/gemini';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Compile & Execute Java Code endpoint
  app.post('/api/compile', async (req, res) => {
    try {
      const { code, stdin, testCases } = req.body;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Code is required.' });
      }

      const result = await executeJavaCode(code, stdin || '');

      // If testCases were provided, evaluate them
      if (testCases && Array.isArray(testCases) && testCases.length > 0) {
        const testResults = testCases.map((tc: any) => {
          const expected = (tc.expectedOutput || '').trim();
          const actual = (result.stdout || '').trim();
          const passed = result.success && (actual === expected || actual.includes(expected));
          return {
            name: tc.name || 'Test Case',
            passed,
            expected,
            actual,
            input: tc.input || ''
          };
        });
        result.testResults = testResults;
      }

      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/compile:', err);
      res.status(500).json({
        success: false,
        stdout: '',
        stderr: 'Internal execution error: ' + (err.message || 'Unknown error'),
        exitCode: 1,
        executionTimeMs: 0,
        compilationErrors: []
      });
    }
  });

  // Diagnose & Fix Error
  app.post('/api/explain-error', async (req, res) => {
    try {
      const { code, errorMessage } = req.body;
      const diagnosis = await explainAndFixError(code || '', errorMessage || '');
      res.json(diagnosis);
    } catch (err: any) {
      console.error('Error in /api/explain-error:', err);
      res.status(500).json({ error: err.message || 'Failed to explain error' });
    }
  });

  // Ask AI Java Mentor
  app.post('/api/tutor', async (req, res) => {
    try {
      const { message, contextCode, history } = req.body;
      const response = await askTutor(message || '', contextCode || '', history || []);
      res.json(response);
    } catch (err: any) {
      console.error('Error in /api/tutor:', err);
      res.status(500).json({ error: err.message || 'Failed to query tutor' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Java Learning & Compiler Server running on http://localhost:${PORT} (bound to 0.0.0.0:${PORT})`);
  });
}

startServer();
