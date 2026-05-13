import crypto from 'crypto';

/**
 * Utility for verifying eSewa payment signatures.
 * eSewa v2 uses HMAC-SHA256 with a secret key.
 */
export function verifyEsewaSignature(data: any, secretKey: string): boolean {
  try {
    const { signature, signed_field_names } = data;
    if (!signature || !signed_field_names) return false;

    const fieldNames = signed_field_names.split(',');
    const message = fieldNames
      .map((field: string) => `${field}=${data[field]}`)
      .join(',');

    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(message)
      .digest('base64');

    return hash === signature;
  } catch (error) {
    console.error('[ESEWA SECURITY ERROR]', error);
    return false;
  }
}

/**
 * Utility for verifying Khalti payment integrity.
 * While Khalti uses a lookup API, we can also verify incoming webhook payloads
 * if they provide a signature header in future updates.
 */
export async function verifyKhaltiPayment(pidx: string, secretKey: string) {
  const lookupUrl = process.env.NODE_ENV === 'production' 
    ? 'https://khalti.com/api/v2/epayment/lookup/' 
    : 'https://a.khalti.com/api/v2/epayment/lookup/';

  const response = await fetch(lookupUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${secretKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pidx })
  });

  if (!response.ok) {
    throw new Error(`Khalti lookup failed with status: ${response.status}`);
  }

  return await response.json();
}
