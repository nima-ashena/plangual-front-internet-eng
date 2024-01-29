import axios from 'axios';

import { BASEURL } from '.';
import { IAddDay } from '../interface/day.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Day
export const getDayApi = (dayBarcode: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/days/${dayBarcode}`, {
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

// Get Days
export const getDaysApi = (callBack: ApiFunction, filters?: any[]) => {
   let url = `${BASEURL}/days`;
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

// Add Day
export const addDayApi = (data: IAddDay, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/days`, data, {
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

// Edit Day
export const editDayApi = (
   dayId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/days/${dayId}`, formData, {
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

// Delete Day
export const deleteDayApi = (dayId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/days/${dayId}`, {
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

// plus true guess Day
export const plusTrueDayApi = (dayId: any, callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/days/plus-true-guess/${dayId}`,
         {},
         {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
            },
         },
      )
      .then(result => {
         callBack(true, result.data);
      })
      .catch(err => {
         callBack(false, err);
      });
};

// sync day audio
export const syncDayAudioApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/days/sync-day-audio`, data, {
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

// Add Sentence to day
export const addSentenceToDayApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/days/add-sentence`, data, {
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

// Clone day
export const cloneDayApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/days/clone`, data, {
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

// Delete Sentence to Day
export const deleteSentenceOfDayApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/days/delete-sentence`, data, {
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
