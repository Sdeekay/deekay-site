// Deekay Consulting — api/contact.js
// Fonction serverless Vercel : reçoit le formulaire de contact et crée une ligne dans une base Notion.
// Variables d'environnement requises (Vercel > Settings > Environment Variables) :
//   NOTION_TOKEN        secret de l'intégration Notion interne
//   NOTION_DATABASE_ID  identifiant de la base "Demandes de contact"

const NOTION_VERSION = '2022-06-28';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILS = {
  'independant': 'Indépendant / Freelance',
  'startup': 'Start-up',
  'tpe-pme': 'TPE / PME',
  'autre': 'Autre'
};
const BUDGETS = {
  'moins-1000': 'Moins de 1 000 €',
  '1000-2000': 'Entre 1 000 € et 2 000 €',
  '2000-5000': 'Entre 2 000 € et 5 000 €',
  'plus-5000': 'Plus de 5 000 €'
};
const SOURCES = {
  'tiktok': 'TikTok',
  'bouche-a-oreille': 'Bouche à oreille',
  'recherche-web': 'Recherche web',
  'autre': 'Autre'
};

function str(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function text(v) {
  return { rich_text: v ? [{ text: { content: v } }] : [] };
}

function select(v) {
  return { select: v ? { name: v } : null };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    console.error('NOTION_TOKEN ou NOTION_DATABASE_ID manquant');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  // Honeypot anti-spam : un humain ne remplit jamais ce champ caché
  if (str(body.website, 200)) return res.status(200).json({ ok: true });

  const nom = str(body.nom, 100);
  const prenom = str(body.prenom, 100);
  const email = str(body.email, 200);
  const tel = str(body.tel, 40);
  const entreprise = str(body.entreprise, 200);
  const besoin = str(body.besoin, 2000);
  const profilAutre = str(body.profilAutre, 200);
  const sourceAutre = str(body.sourceAutre, 200);
  const profil = PROFILS[body.profil] || null;
  const budget = BUDGETS[body.budget] || 'Non renseigné';
  const source = SOURCES[body.source] || null;

  if (!nom || !prenom || !EMAIL_RE.test(email) || !besoin || !profil || !source || body.rgpd !== true) {
    return res.status(400).json({ error: 'Champs invalides ou manquants' });
  }

  const properties = {
    'Nom': { title: [{ text: { content: prenom + ' ' + nom } }] },
    'Email': { email: email },
    'Téléphone': { phone_number: tel || null },
    'Entreprise': text(entreprise),
    'Profil': select(profil),
    'Profil (autre)': text(body.profil === 'autre' ? profilAutre : ''),
    'Besoin': text(besoin),
    'Budget': select(budget),
    'Source': select(source),
    'Source (autre)': text(body.source === 'autre' ? sourceAutre : ''),
    'Statut': select('Nouveau')
  };

  try {
    const r = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parent: { database_id: databaseId }, properties: properties })
    });
    if (!r.ok) {
      console.error('Erreur Notion', r.status, await r.text());
      return res.status(502).json({ error: 'Enregistrement impossible' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Erreur réseau Notion', e);
    return res.status(502).json({ error: 'Enregistrement impossible' });
  }
};
