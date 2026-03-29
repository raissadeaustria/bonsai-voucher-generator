export default async function handler(req, res) {
  const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'KV store not configured' });
  }

  const headers = { Authorization: `Bearer ${KV_REST_API_TOKEN}` };

  if (req.method === 'GET') {
    // Get current voucher index
    const response = await fetch(`${KV_REST_API_URL}/get/voucher_index`, { headers });
    const data = await response.json();
    const index = data.result !== null ? parseInt(data.result) : 0;
    return res.status(200).json({ index });
  }

  if (req.method === 'POST') {
    // Advance to next voucher index
    const getResponse = await fetch(`${KV_REST_API_URL}/get/voucher_index`, { headers });
    const getData = await getResponse.json();
    const currentIndex = getData.result !== null ? parseInt(getData.result) : 0;
    const newIndex = currentIndex + 1;
    await fetch(`${KV_REST_API_URL}/set/voucher_index/${newIndex}`, { headers });
    return res.status(200).json({ index: newIndex });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
