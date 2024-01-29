import { createContext } from 'react';

export const UserContext = createContext({
   isUserLogin: false,
   setIsUserLogin: (auth: boolean) => {},
   query: '',
   setQuery: (data: string) => {},
   paginationPage: 1,
   setPaginationPage: (data: number) => {},
   sort: '',
   setSort: any => {},
   type: '',
   setType: any => {},
   todayDate: {shamsiDBBarcode: '', todayDateObject: {}},
   users: [],
   setUsers: (data: any[]) => {},
   userC: 0,
   setUserC: (data: number) => {},
   // todayDate: '',
});
