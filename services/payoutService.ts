import { apiClient } from './apiClient';

export const payoutService = {
  getPayouts: async (deliveryPersonId: number) => {
    const res = await apiClient.get(`/api/payouts/delivery-person/${deliveryPersonId}`);
    return res.data;
  },
  getRecentPayouts: async (deliveryPersonId: number, limit: number = 5) => {
    const res = await apiClient.get(`/api/payouts/delivery-person/${deliveryPersonId}/recent?limit=${limit}`);
    return res.data;
  },
  getTotalPaid: async (deliveryPersonId: number) => {
    const res = await apiClient.get(`/api/payouts/delivery-person/${deliveryPersonId}/total-paid`);
    return res.data;
  }
};
