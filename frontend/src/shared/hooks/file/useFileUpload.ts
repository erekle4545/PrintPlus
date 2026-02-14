// hooks/useFileUpload.ts
import { useState, useCallback } from 'react';
import { axiosInstance } from '@/shared/hooks/useHttp';
import { toast } from 'react-toastify';

export interface UploadedFile {
    file_id: number;
    url?: string;
    name: string;
    quantity?: number;
    cover_type?: string;
}

export const useFileUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // fileable add (FileUploader onComplete)
    const addFiles = useCallback((files: UploadedFile[]) => {
        setUploadedFiles(files);
    }, []);

    // delete from  backend
    const deleteFile = useCallback(async (fileId: number, index: number) => {
        setIsDeleting(true);

        try {
            const response = await axiosInstance.delete(`/image/${fileId}`);


            if (response.status === 204 || response.data.success) {
                //  local state
                setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                toast.success('ფაილი წაიშალა');
                return true;
            }
        } catch (error: any) {
            console.error('❌ Delete error:', error);
            toast.error('ფაილის წაშლის შეცდომა');
            return false;
        } finally {
            setIsDeleting(false);
        }
    }, []);

    //delete
    const clearFiles = useCallback(() => {
        setUploadedFiles([]);
    }, []);

    //  cover_id  cover_type arrays
    const getCoverData = useCallback(() => {
        const cover_ids = uploadedFiles.map(f => f.file_id);
        const cover_types = uploadedFiles.map(f => f.cover_type || 'image');
        const quantity = uploadedFiles.map(f => f.quantity || 1);

        return {
            cover_ids: cover_ids.length > 0 ? cover_ids : undefined,
            cover_types: cover_types.length > 0 ? cover_types : undefined,
            cover_quantity: quantity.length > 0 ? quantity : undefined,
            uploaded_file: uploadedFiles.length > 0
                ? JSON.stringify(uploadedFiles)
                : undefined,
        };
    }, [uploadedFiles]);

    return {
        uploadedFiles,
        addFiles,
        deleteFile,
        clearFiles,
        getCoverData,
        isDeleting,
    };
};