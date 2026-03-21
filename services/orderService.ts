import { apiClient } from './apiClient';

export const orderService = {
  getOrders: async (deliveryPersonId: number) => {
    const res = await apiClient.get(`/api/delivery-orders/delivery-person/${deliveryPersonId}`);
    return res.data;
  },
  getActiveOrders: async (deliveryPersonId: number) => {
    const res = await apiClient.get(`/api/delivery-orders/delivery-person/${deliveryPersonId}/active`);
    return res.data;
  },
  getCompletedOrders: async (deliveryPersonId: number) => {
    const res = await apiClient.get(`/api/delivery-orders/delivery-person/${deliveryPersonId}/completed`);
    return res.data;
  },
  getRecentOrders: async (deliveryPersonId: number, limit: number = 5) => {
    const res = await apiClient.get(`/api/delivery-orders/delivery-person/${deliveryPersonId}/recent?limit=${limit}`);
    return res.data;
  },
  getStatistics: async (deliveryPersonId: number) => {
    const res = await apiClient.get(`/api/delivery-orders/delivery-person/${deliveryPersonId}/statistics`);
    return res.data;
  },
  verifyPickupOtp: async (orderNumber: string, otp: string) => {
    const res = await apiClient.post('/api/delivery-orders/verify-pickup-otp', { orderNumber, otp });
    return res.data;
  },
  confirmPickup: async (orderNumber: string, otp: string) => {
    const res = await apiClient.post('/api/delivery-orders/confirm-pickup', { orderNumber, otp });
    return res.data;
  },
  verifyDeliveryOtp: async (orderNumber: string, otp: string) => {
    const res = await apiClient.post('/api/delivery-orders/verify-delivery-otp', { orderNumber, otp });
    return res.data;
  },
  confirmDelivery: async (orderNumber: string, otp: string) => {
    const res = await apiClient.post('/api/delivery-orders/confirm-delivery', { orderNumber, otp });
    return res.data;
  },
  cancelOrder: async (orderId: number, reason: string) => {
    const res = await apiClient.post(`/api/delivery-orders/${orderId}/cancel`, { reason });
    return res.data;
  }
};
