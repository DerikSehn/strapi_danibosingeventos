import { getStrapiURL } from '@/lib/utils';

export async function mutatePublicData(
  method: string,
  path: string,
  payload?: any,
) {
  const baseUrl = getStrapiURL();
  const url = new URL(path, baseUrl);

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload }),
    });

    if (method === 'DELETE') {
      return response.ok;
    }

    const data = await response?.json();
    return data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
}
