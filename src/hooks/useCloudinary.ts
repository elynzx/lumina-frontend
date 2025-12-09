import { useState } from 'react';

interface UploadResponse {
    secure_url: string;
    public_id: string;
    format: string;
}

export const useCloudinary = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const CLOUD_NAME = 'dq5cwd3uz';
    const UPLOAD_PRESET = 'alquiler_eventos_receipts';

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            setError(null);

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('El archivo no debe superar los 5MB');
            }

            // Validar formato
            const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validFormats.includes(file.type)) {
                throw new Error('Formato no válido. Solo se permiten JPG, PNG o PDF');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('folder', 'payment_receipts');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

            const data: UploadResponse = await response.json();
            return data.secure_url;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir archivo';
            setError(errorMessage);
            console.error('Error uploading to Cloudinary:', err);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error };
};
