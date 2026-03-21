import { apiClient } from "./apiClient";

export interface ModerationResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

export const adminModerationService = {
  /**
   * Approves a Delivery Partner's Profile Photo.
   * Once both documents AND photo are approved, the account is auto-activated.
   * 
   * @param deliveryPersonId - The ID of the delivery partner
   */
  approveProfilePhoto: async (deliveryPersonId: string | number): Promise<ModerationResponse> => {
    try {
      const response = await apiClient.post(
        `/admin-panel/api/delivery-persons/${deliveryPersonId}/approve-photo`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to approve profile photo for partner ${deliveryPersonId}:`, error);
      throw error;
    }
  },

  /**
   * Rejects a Delivery Partner's Profile Photo with remarks.
   * 
   * @param deliveryPersonId - The ID of the delivery partner
   * @param adminId - The ID of the moderating admin
   * @param remarks - Reason for rejection
   */
  rejectProfilePhoto: async (
    deliveryPersonId: string | number,
    adminId: string | number,
    remarks: string
  ): Promise<ModerationResponse> => {
    try {
      const response = await apiClient.post(
        `/admin-panel/api/delivery-persons/${deliveryPersonId}/reject-photo`,
        {
          adminId,
          remarks
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to reject profile photo for partner ${deliveryPersonId}:`, error);
      throw error;
    }
  },

  /**
   * Requests the Delivery Partner to re-upload their Profile Photo.
   * 
   * @param deliveryPersonId - The ID of the delivery partner
   * @param adminId - The ID of the moderating admin
   * @param remarks - Reason for re-upload request
   */
  requestPhotoReupload: async (
    deliveryPersonId: string | number,
    adminId: string | number,
    remarks: string
  ): Promise<ModerationResponse> => {
    try {
      const response = await apiClient.post(
        `/admin-panel/api/delivery-persons/${deliveryPersonId}/request-photo-reupload`,
        {
          adminId,
          remarks
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to request photo reupload for partner ${deliveryPersonId}:`, error);
      throw error;
    }
  }
};
