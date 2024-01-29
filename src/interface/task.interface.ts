import { DateObject } from "react-multi-date-picker";

export interface IAddTask {
   title: string;
   taskKind: string;
   dayBarcode?: string;
   user?: string;
   date?: DateObject;
}

export interface ITask {
   _id: string;
   title: string;
   completed: boolean;
   taskKind?: ITaskKind;
   priority?: number;
   remarkable?: string;
   kind?: string;
   user?: string;
   dayBarcode?: string;
   date?: string;
   archived?: boolean;
}
export interface ITaskFilter {
   query?: string;
   title?: string;
   notCompleted?: boolean;
   unAssigned?: boolean;
   taskKind?: ITaskKind;
   priority?: number;
   kind?: string;
   user?: string;
   dayBarcode?: string;
   archived?: boolean;
   archivedValue?: string;
}

export interface ITaskKind {
   _id: string;
   title: string;
   color?: string;
   textColor?: string;
   user?: string;
}

export interface IAddTaskKind {
   title: string;
   color?: string;
   textColor?: string;
}