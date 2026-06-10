const PORTAL_ID = '143687456';
const FORM_GUID = '8a7b651a-72ef-4835-b84f-1b0b416f0b7b';
const FIELD_NAMES = ['name', 'firma', 'email', 'telefon', 'nachricht'];
const FILE_FIELD = 'anhang';
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function tryParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function buildHubspotFields(data) {
  return FIELD_NAMES
    .filter(function (key) {
      return data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== '';
    })
    .map(function (key) {
      return { name: key, value: String(data[key]).trim() };
    });
}

async function submitJson(data) {
  const payload = {
    fields: buildHubspotFields(data),
    context: {
      pageUri: data.pageUri || '',
      pageName: data.pageName || 'Fenyx Website',
    },
  };

  if (data.hutk) {
    payload.context.hutk = data.hutk;
  }

  const response = await fetch(
    'https://api.hsforms.com/submissions/v3/integration/submit/' + PORTAL_ID + '/' + FORM_GUID,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  const text = await response.text();
  return { ok: response.ok, status: response.status, body: tryParse(text) };
}

async function submitMultipart(data) {
  const formData = new FormData();

  FIELD_NAMES.forEach(function (key) {
    if (data[key]) {
      formData.append(key, String(data[key]).trim());
    }
  });

  formData.append('hs_context', JSON.stringify({
    pageUrl: data.pageUri || '',
    pageName: data.pageName || 'Fenyx Website',
    hutk: data.hutk || undefined,
  }));

  (data.files || []).forEach(function (file) {
    const buffer = Buffer.from(file.data, 'base64');
    const blob = new Blob([buffer], { type: file.type || 'application/octet-stream' });
    formData.append(FILE_FIELD, blob, file.name || 'anhang');
  });

  const response = await fetch(
    'https://forms.hsforms.com/uploads/form/v2/' + PORTAL_ID + '/' + FORM_GUID,
    { method: 'POST', body: formData }
  );

  const text = await response.text();
  const parsed = tryParse(text);
  const ok = response.ok || (typeof parsed === 'object' && parsed.inlineMessage);

  return { ok: ok, status: response.status, body: parsed || text };
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const data = JSON.parse(event.body || '{}');

    if (!data.email || !data.name || !data.firma) {
      return json(400, { error: 'Pflichtfelder fehlen (Name, Firma, E-Mail).' });
    }

    if (Array.isArray(data.files)) {
      for (var i = 0; i < data.files.length; i++) {
        var file = data.files[i];
        if (!file || !file.data) continue;
        var size = Buffer.byteLength(file.data, 'base64');
        if (size > MAX_FILE_BYTES) {
          return json(400, { error: 'Datei zu groß (max. 10 MB).' });
        }
      }
    }

    const hasFiles = Array.isArray(data.files) && data.files.length > 0;
    const result = hasFiles ? await submitMultipart(data) : await submitJson(data);

    if (!result.ok) {
      return json(result.status || 502, {
        error: 'HubSpot hat die Anfrage abgelehnt.',
        details: result.body,
      });
    }

    return json(200, { ok: true });
  } catch (error) {
    return json(500, { error: error.message || 'Interner Serverfehler' });
  }
};
