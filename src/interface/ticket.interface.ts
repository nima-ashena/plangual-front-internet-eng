export interface ITicket {
   _id?: string;
   type: string;
   context: string;
   note?: string;
   user?: any;
   created_at?: string;
}

export interface IAddTicket {
   context: string;
   type: string;
   note?: string;
   user?: string;
}

export interface ITicketFilter {
   query?: string;
   type?: string;
   sort?: string;
   user?: string;
}

