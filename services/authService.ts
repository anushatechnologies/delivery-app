import { apiClient } from './apiClient';

export const authService = {
  checkPhone: async (phoneNumber: string) => {
    const res = await apiClient.get(`/api/delivery/auth/check-phone/${encodeURIComponent(phoneNumber)}`);
    return res.data;
  },
  signup: async (data: { firebaseIdToken: string, firstName: string, lastName: string, vehicleType: string, vehicleModel: string, registrationNumber: string, profilePhotoUrl: string }) => {
    const res = await apiClient.post('/api/delivery/auth/signup', data);
    return res.data;
  },
  login: async (firebaseIdToken: string) => {
    const res = await apiClient.post('/api/delivery/auth/login', { firebaseIdToken });
    return res.data;
  }
};
