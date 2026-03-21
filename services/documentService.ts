import { apiClient } from './apiClient';

export const documentService = {
  uploadDocument: async (deliveryPersonId: number, documentType: string, documentNumber: string | null, fileUri: string) => {
    const formData = new FormData();
    formData.append('deliveryPersonId', deliveryPersonId.toString());
    formData.append('documentType', documentType);
    if (documentNumber) formData.append('documentNumber', documentNumber);
    
    // Parse file info
    const filename = fileUri.split('/').pop() || 'document.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('file', { uri: fileUri, name: filename, type } as any);
    
    const res = await apiClient.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getValidationRules: async () => {
    const res = await apiClient.get('/api/documents/validation-rules');
    return res.data;
  }
};
