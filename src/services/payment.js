import api from './api';

export const paymentService = {
  createRazorpayOrder: async (orderId) => {
    const response = await api.post('/payments/razorpay/create-order', {
      orderId,
    });

    return response.data;
  },

  verifyRazorpayPayment: async (orderId, paymentData = {}) => {
    const response = await api.post('/payments/razorpay/verify', {
      orderId,
      ...paymentData,
    });

    return response.data;
  },
};

export default paymentService;
