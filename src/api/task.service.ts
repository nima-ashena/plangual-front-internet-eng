import axios from 'axios';

import { BASEURL } from '.';
import { IAddTask } from '../interface/task.interface';

type ApiFunction = (isOk: boolean, resultData?: any) => void;

// Get Task
export const getTaskApi = (taskBarcode: any, callBack: ApiFunction) => {
   axios
      .get(`${BASEURL}/tasks/${taskBarcode}`, {
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

// Get Tasks
export const getTasksApi = (callBack: ApiFunction, filters?: any[]) => {
   let url = `${BASEURL}/tasks`;
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

// Add Task
export const addTaskApi = (data: IAddTask, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tasks`, data, {
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

// Edit Task
export const editTaskApi = (
   taskId: any,
   formData: any,
   callBack: ApiFunction,
) => {
   axios
      .put(`${BASEURL}/tasks/${taskId}`, formData, {
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

// Delete Task
export const deleteTaskApi = (taskId: any, callBack: ApiFunction) => {
   axios
      .delete(`${BASEURL}/tasks/${taskId}`, {
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

// plus true guess Task
export const plusTrueTaskApi = (taskId: any, callBack: ApiFunction) => {
   axios
      .post(
         `${BASEURL}/tasks/plus-true-guess/${taskId}`,
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

// sync task audio
export const syncTaskAudioApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tasks/sync-task-audio`, data, {
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

// Add Sentence to task
export const addSentenceToTaskApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tasks/add-sentence`, data, {
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

// Clone task
export const cloneTaskApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tasks/clone`, data, {
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

// Delete Sentence to Task
export const deleteSentenceOfTaskApi = (data: any, callBack: ApiFunction) => {
   axios
      .post(`${BASEURL}/tasks/delete-sentence`, data, {
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
