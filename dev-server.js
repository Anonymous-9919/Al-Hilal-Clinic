import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    console.log('Contact form submission:', { name, phone, email, service, message });

    // Try Supabase if configured
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project-id.supabase.co') {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from('contacts')
          .insert([{ name, phone, email, service, message }]);

        if (error) {
          console.warn('Supabase insert warning:', error.message);
          // Still return success - form data is logged
        }
      } else {
        console.log('Supabase not configured. Data logged to console.');
      }
    } catch (dbError) {
      console.warn('Database not available:', dbError.message);
    }

    res.json({ success: true, message: 'Thank you! We\'ll contact you shortly.' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n  Al Hilal International Clinic\n  http://localhost:${PORT}\n`);
});
