import axios from 'axios';

import { BASEURL } from '.';
import { IAddTicket } from '../interface/ticket.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Ticket
export const getTicketApi = (ticketBarcode: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/tickets/${ticketBarcode}`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

// Get Tickets
export const getTicketsApi = (callBack: ApiFunction,  filters?: any[]) => {
   let url = `${BASEURL}/tickets`;
   if (filters?.length)
      for (let i = 0; i < filters?.length; i++) {
         if (i === 0) url += `?${filters[i].name}=${filters[i].value}`;
         else url += `&${filters[i].name}=${filters[i].value}`;
      }

   axios
      .get(url, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

// Add Ticket
export const addTicketApi = (data: IAddTicket, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tickets`, data, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

// Edit Ticket
export const editTicketApi = (
   ticketId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/tickets/${ticketId}`, formData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

// Delete Ticket
export const deleteTicketApi = (ticketId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/tickets/${ticketId}`, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
         },
      })
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

