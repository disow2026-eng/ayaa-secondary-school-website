'use strict';

const express  = require('express');
const multer   = require('multer');
const fs       = require('fs').promises;
const path     = require('path');
const https    = require('https');
const session  = require('express-session');
const archiver = require('archiver');

const app          = express();
const PORT         = process.env.PORT || 3002;
const SITE_DIR     = path.resolve(__dirname, '..');
const CFG_FILE     = path.join(__dirname, 'config.json');
const CONTENT_FILE = path.join(SITE_DIR, 'content.json');

// ── Config ───────────────────────────────────────────────────
let config = { password: 'ayaa2024' };
async function loadConfig(){
  try { config = { ...config, ...JSON.parse(await fs.readFile(CFG_FILE, 'utf8')) }; } catch{}
}
async function saveConfig(){
  await fs.writeFile(CFG_FILE, JSON.stringify(config, null, 2));
}

// ── Netlify deploy ────────────────────────────────────────────
async function netlifyDeploy(){
  const token  = process.env.NETLIFY_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  if(!token || !siteId){ console.warn('Deploy skipped — NETLIFY_TOKEN or NETLIFY_SITE_ID not set'); return; }
  console.log('Packaging site for Netlify deploy...');
  const zipBuffer = await new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 6 } });
    const chunks  = [];
    archive.on('data',  c => chunks.push(c));
    archive.on('end',   () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);
    archive.glob('**/*', { cwd: SITE_DIR, ignore: ['admin/**', '**/*.bak', '.git/**', 'node_modules/**'], dot: false });
    archive.finalize();
  });
  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.netlify.com',
      path:     `/api/v1/sites/${siteId}/deploys`,
      method:   'POST',
      headers:  { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/zip', 'Content-Length': zipBuffer.length }
    }, res => {
      let body = '';
      res.on('data', d => (body += d));
      res.on('end', () => {
        if(res.statusCode < 300){ console.log('Netlify deploy successful'); resolve(); }
        else reject(new Error(`Netlify ${res.statusCode}: ${body}`));
      });
    });
    req.on('error', reject);
    req.write(zipBuffer);
    req.end();
  });
}

// ── Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'ayaa-school-admin-secret', resave: false, saveUninitialized: false, cookie: { maxAge: 24*60*60*1000 } }));

// Admin UI
const ADMIN_HTML = path.join(__dirname, 'public', 'index.html');
app.get('/admin',  (req, res) => res.sendFile(ADMIN_HTML));
app.get('/admin/', (req, res) => res.sendFile(ADMIN_HTML));

// Static site
app.use('/', express.static(SITE_DIR, { index: 'index.html' }));

// ── Auth ──────────────────────────────────────────────────────
const auth = (req, res, next) => req.session.authenticated ? next() : res.status(401).json({ error: 'Unauthorized' });

app.get('/api/auth', (req, res) => res.json({ ok: !!req.session.authenticated }));

app.post('/api/login', async (req, res) => {
  await loadConfig();
  if(req.body.password === config.password){ req.session.authenticated = true; res.json({ ok: true }); }
  else res.status(401).json({ error: 'Wrong password' });
});

app.post('/api/logout', (req, res) => { req.session.destroy(); res.json({ ok: true }); });

// ── Preview (in-memory, no disk write) ───────────────────────
let previewContent = null;
app.post('/api/content/preview', auth, (req, res) => {
  previewContent = req.body;
  res.json({ ok: true });
});
app.get('/api/content/preview', async (req, res) => {
  if(previewContent) return res.json(previewContent);
  try { res.json(JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8'))); }
  catch { res.status(404).json({ error: 'No content' }); }
});

// ── Content ───────────────────────────────────────────────────
app.get('/api/content', auth, async (req, res) => {
  try { res.json(JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8'))); }
  catch { res.status(404).json({ error: 'content.json not found' }); }
});

app.post('/api/content', auth, async (req, res) => {
  try { await fs.copyFile(CONTENT_FILE, CONTENT_FILE + '.bak'); } catch{}
  await fs.writeFile(CONTENT_FILE, JSON.stringify(req.body, null, 2), 'utf8');
  res.json({ ok: true });
  netlifyDeploy().catch(err => console.error('Deploy error:', err.message));
});

// Check if content backup exists
app.get('/api/content/has-backup', auth, async (req, res) => {
  const bak = CONTENT_FILE + '.bak';
  try { await fs.access(bak); res.json({ hasBak: true }); }
  catch { res.json({ hasBak: false }); }
});

// Restore content from backup
app.post('/api/content/restore', auth, async (req, res) => {
  const bak = CONTENT_FILE + '.bak';
  try { await fs.access(bak); } catch { return res.status(404).json({ error: 'No backup found' }); }
  await fs.copyFile(CONTENT_FILE, CONTENT_FILE + '.restored-bak');
  await fs.copyFile(bak, CONTENT_FILE);
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf8'));
  res.json({ ok: true, content });
  netlifyDeploy().catch(err => console.error('Deploy error:', err.message));
});

// ── Images ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: SITE_DIR,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-').toLowerCase())
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => /\/(image)\//i.test(file.mimetype) ? cb(null, true) : cb(new Error('Images only')),
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.get('/api/images', auth, async (req, res) => {
  const files = await fs.readdir(SITE_DIR);
  res.json(files.filter(f => /\.(jpe?g|png|gif|webp|svg|avif|WEBP)$/i.test(f)));
});

app.post('/api/images', auth, upload.single('image'), (req, res) => {
  if(!req.file) return res.status(400).json({ error: 'No file received' });
  res.json({ name: req.file.filename });
});

app.delete('/api/images/:name', auth, async (req, res) => {
  await fs.unlink(path.join(SITE_DIR, path.basename(req.params.name)));
  res.json({ ok: true });
});

// ── Deploy ────────────────────────────────────────────────────
app.post('/api/deploy', auth, async (req, res) => {
  try { await netlifyDeploy(); res.json({ ok: true }); }
  catch(err){ res.status(500).json({ error: err.message }); }
});

// ── Settings ──────────────────────────────────────────────────
app.post('/api/settings', auth, async (req, res) => {
  await loadConfig();
  if(req.body.newPassword) config.password = req.body.newPassword;
  await saveConfig();
  res.json({ ok: true });
});

// ── Start ─────────────────────────────────────────────────────
loadConfig().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅  Ayaa School Admin  →  http://localhost:${PORT}/admin`);
    console.log(`    Password : ${config.password}`);
    console.log(`    Site dir : ${SITE_DIR}\n`);
  });
});
