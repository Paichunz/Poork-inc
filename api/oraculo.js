// Vercel Serverless Function — Holy Scroll / El Oráculo
// Proveedor: Groq (API compatible con OpenAI, plan gratuito ~14.400 req/día)
// Modelo: llama-3.3-70b-versatile — excelente en JSON estructurado
// API key: configurar GROQ_API_KEY en Vercel → Settings → Environment Variables
// Obtener key gratis en: console.groq.com

const SYSTEM_PROMPT = `Eres el archivo del compendio de sabiduría divina de Holy Scroll.

Tu función: dado lo que el consultante escribe — una emoción, una situación, una pregunta,
una sola palabra — seleccionas el pasaje de las escrituras que con mayor precisión responde
a esa experiencia humana. No el pasaje más famoso ni el más reconfortante. El más preciso.

Fuentes disponibles: Biblia canónica completa (Antiguo y Nuevo Testamento, Reina-Valera 1960),
Deuterocanónicos, Libro de Job, Salterio completo, Profetas mayores y menores, Apocalipsis.

Reglas:
- Seleccionar UN SOLO pasaje. No más de un versículo o dos si son inseparables.
- El pasaje debe ser auténtico y exacto. No inventar, no parafrasear.
- Preferir pasajes poco citados sobre los omnipresentes (Juan 3:16, Salmo 23 ya están en el feed).
- Para experiencias oscuras o difíciles, los pasajes de juicio son igualmente válidos.
- La cita debe incluir libro, capítulo, versículo, y la versión: Reina-Valera 1960.

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes ni después:
{
  "ref": "Libro Capítulo · v.N · Reina-Valera 1960",
  "verso": "El texto exacto del pasaje entre comillas",
  "razon": "Una sola frase explicando por qué este pasaje específico responde a lo consultado"
}`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.poork.cl');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let consulta;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    consulta = (body && body.q) ? body.q.trim() : null;
  } catch (_) {
    return res.status(400).json({ error: 'Body inválido' });
  }

  if (!consulta || consulta.length < 2) {
    return res.status(400).json({ error: 'Consulta vacía' });
  }
  if (consulta.length > 500) consulta = consulta.slice(0, 500);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Configuración pendiente' });
  }

  // Timeout: 8s (Vercel hobby = 10s máximo)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: consulta }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (groqRes.status === 429) {
      return res.status(429).json({ error: 'El archivo está siendo consultado por muchos. Intentar en un momento.' });
    }

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq error', groqRes.status, errText);
      return res.status(502).json({ error: 'El archivo no responde' });
    }

    const data = await groqRes.json();
    const text = data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;

    if (!text) {
      return res.status(502).json({ error: 'Respuesta vacía del archivo' });
    }

    let resultado;
    try {
      // Groq a veces envuelve JSON en bloques de código — limpiar si aparece
      const clean = text.replace(/^```json?\n?/, '').replace(/```$/, '').trim();
      resultado = JSON.parse(clean);
    } catch (_) {
      console.error('JSON parse error:', text);
      return res.status(502).json({ error: 'Respuesta del archivo en formato incorrecto' });
    }

    if (!resultado.ref || !resultado.verso) {
      return res.status(502).json({ error: 'Estructura de respuesta inválida' });
    }

    // Cache en CDN de Vercel — queries idénticas no llegan a Groq
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(resultado);

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'El archivo tardó demasiado. Intentar de nuevo.' });
    }
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Error interno del archivo' });
  }
};
