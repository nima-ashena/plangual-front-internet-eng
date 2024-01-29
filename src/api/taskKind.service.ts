import axios from 'axios';

import { BASEURL } from '.';
import { IAddTaskKind } from '../interface/task.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get TaskKind
export const getTaskKindApi = (taskKindBarcode: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/tasks-kind/${taskKindBarcode}`, {
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

// Get TaskKinds
export const getTaskKindsApi = (callBack: ApiFunction) => {
   let url = `${BASEURL}/tasks-kind`;
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

// Add TaskKind
export const addTaskKindApi = (data: IAddTaskKind, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tasks-kind`, data, {
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

// Edit TaskKind
export const editTaskKindApi = (
   taskKindId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/tasks-kind/${taskKindId}`, formData, {
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

// Delete TaskKind
export const deleteTaskKindApi = (taskKindId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/tasks-kind/${taskKindId}`, {
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



