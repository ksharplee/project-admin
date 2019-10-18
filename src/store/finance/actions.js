import * as R from 'ramda';
import axios from '@/plugins/axios';

export default {
  async getInvoiceListAsync(context, payload) {
    try {
      const res = await axios.post('/finance/invoice_type_list.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_INVOICE_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addEditInvoiceAsync(context, payload) {
    try {
      const res = await axios.post('/finance/add_save_invoice_type.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getInvoiceListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteInvoiceAsync(context, payload) {
    try {
      const res = await axios.post('/finance/del_invoice_type.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getInvoiceListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getPaymentListAsync(context, payload) {
    try {
      const res = await axios.post('/finance/payment_list.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_PAYMENT_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addEditPaymentAsync(context, payload) {
    try {
      const res = await axios.post('/finance/add_save_payment.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getPaymentListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deletePaymentAsync(context, payload) {
    try {
      const res = await axios.post('/finance/del_payment.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getPaymentListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加/编辑银行
  async addOrEditBankAsync(context, payload) {
    try {
      const res = await axios.post('/finance/add_save_bank.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getBankListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteBankAsync(context, payload) {
    try {
      const res = await axios.post('/finance/del_bank.html', payload);
      if (res.data.status === 1) {
        context.dispatch('getBankListAsync');
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getBankListAsync(context, payload) {
    try {
      const res = await axios.post('/finance/bank_list.html', payload);
      if (res.data.status === 1) {
        context.commit('SET_BANK_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 收款单列表
  async getPaymentOrderListAsync(context, payload) {
    try {
      const res = await axios.post('/re/lists.html', R.mergeRight({
        pageSize: process.env.VUE_APP_PAGESIZE,
        timeLimit: context.state.paymentOrderList.data.timeLimit,
        p: context.state.paymentOrderList.data.p,
      }, payload));
      if (res.data.status === 1) {
        context.commit('SET_PAYMENT_ORDER_LIST', res.data);
        return Promise.resolve(res.data.status);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getPaymentOrderDetailAsync(context, payload) {
    try {
      const res = await axios.post('/re/receiptDesc.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async rejectPaymentOrderAsync(context, payload) {
    try {
      const res = await axios.post('/re/receiptReject.html', payload);
      if (res.data.status === 1) {
        return Promise.resolve(res.data.data);
      }
      return Promise.reject(new Error(res.data.info));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
