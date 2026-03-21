import { apiClient } from './apiClient';

export const profileService = {
  /** Gets the current logged in delivery person's status and profile using JWT */
  getStatus: async () => {
    const res = await apiClient.get('/delivery-app/api/status');
    return res.data;
  },
  updateOnlineStatus: async (isOnline: boolean) => {
    const res = await apiClient.put('/delivery-app/api/online-status', { isOnline });
    return res.data;
  },

  updateProfileDetails: async (data: { firstName: string, lastName: string, profilePhotoUrl?: string }) => {
    const res = await apiClient.put('/delivery-app/api/profile', data);
    return res.data;
  },
  updateProfilePhoto: async (fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('file', {
      uri: fileUri,
      name: filename,
      type
    } as any);

    const res = await apiClient.post('/delivery-app/api/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updateVehicle: async (data: { vehicleType: string, vehicleModel: string, registrationNumber: string }) => {
    const res = await apiClient.put('/delivery-app/api/vehicle', data);
    return res.data;
  },
  getDeliveryPersonByPhone: async (phoneNumber: string) => {
    const res = await apiClient.get(`/delivery-app/api/phone/${encodeURIComponent(phoneNumber)}`);
    return res.data;
  }
};
