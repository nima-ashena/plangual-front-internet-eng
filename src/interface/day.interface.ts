export interface IAddDay {
   dayBarcode: string;
   day?: Date;
   user: string;
}

export interface IDay {
   _id: string;
   dayBarcode: string;
   day?: Date;
   sleep?: string;
   tasks?: string[];
   events?: string[];
   MST?: number;
   MSTTime?: string;
   user: string;
}
