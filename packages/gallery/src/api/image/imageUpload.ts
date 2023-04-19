import type { UploadedImage } from '../../utils/file';

interface ImageUpload {
    accessToken: string;
    file: File | string;
    referenceId?: string;
    personId: string;
    siteId?: string;
    url?: string;
}

/**
 * Uploads an image to the tsimg cloud service
 */
export const imageUpload = async ({
    accessToken,
    file,
    referenceId,
    personId,
    siteId,
    url = 'https://api.tsimg.cloud/image',
}: ImageUpload): Promise<UploadedImage> => {
    const headers = new Headers({ Accept: 'application/json' });

    if (referenceId) headers.set('X-Reference-Id', referenceId);
    if (personId) headers.set('X-Person-Id', personId);
    if (siteId) headers.set('X-Site-Id', siteId);

    headers.set('Authorization', `bearer ${accessToken}`);

    let body: string | ArrayBuffer;

    if (typeof file === 'string') {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify({ url: file });
    } else {
        headers.set('Content-Type', 'image/*');
        body = await getFileArrayBuffer(file);
    }

    const response = await fetch(url, { method: 'POST', body, headers });

    if (response.ok) {
        return (await response.json()) as Promise<UploadedImage>;
    }

    throw Error(`Uploading the image failed with status code ${response.status}.`);
};

const getFileArrayBuffer = (file: File): Promise<string | ArrayBuffer> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                resolve(e.target.result);
            } else {
                reject(Error('Could not get array buffer.'));
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
