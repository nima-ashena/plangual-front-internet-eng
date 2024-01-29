import DatePicker, { DateObject } from 'react-multi-date-picker';
// import DatePicker, { DateObject } from 'react-multi-date-picker';

import persian from 'react-date-object/calendars/persian';
import persian_en from 'react-date-object/locales/persian_en';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian_fa from 'react-date-object/locales/gregorian_fa';
import { useState, useEffect, FC, useContext } from 'react';
import 'react-multi-date-picker/styles/colors/red.css';
import {
   shamsiBarcodeToGregorianDate,
   shamsiToGregorianN,
   shamsiDayToPersianN,
   shamsiMonthToPersianN,
   shamsiBarcodeToJSDate,
} from '../../utils/convertor';
import { getDayApi } from '../../api/day.service';
import CustomDatePicker from './components/CustomDatePicker';
import { useNavigate, useParams } from 'react-router-dom';
import Task from './components/Task';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ITask, ITaskKind } from '../../interface/task.interface';
import { getTaskKindsApi } from '../../api/taskKind.service';
import { toast } from 'react-toastify';
import AddTaskModal from './components/AddTaskModal';
import { sortByCompleted } from '../tasks/Tasks';

// import shamsi from 'shamsi-date-converter';

const Days = () => {
   const { dayBarcode } = useParams();
   const navigate = useNavigate();
   const [today, setToday] = useState<DateObject>(new DateObject());
   const [shamsi, setShamsi] = useState<DateObject>(
      new DateObject(shamsiBarcodeToGregorianDate(dayBarcode)),
   );
   const [gregorian, setGregorian] = useState<any>({});
   const [addTaskModal, setAddTaskModal] = useState<boolean>(false);

   const [tasks, setTasks] = useState<ITask[]>([]);
   const [taskKinds, setTaskKinds] = useState<ITaskKind[]>([]);
   const [taskKindsConst, setTaskKindsConst] = useState<ITaskKind[]>([]);
   const [taskRender, setTaskRender] = useState<boolean>(false);

   useEffect(() => {
      getDayApi(dayBarcode, (isOk, result) => {
         setTasks(sortByCompleted(result.day.tasks).reverse());
      });
   }, [dayBarcode, taskRender]);

   useEffect(() => {
      getTaskKindsApi((isOk, result) => {
         if (isOk) {
            setTaskKinds(result.taskKinds);
            setTaskKindsConst(result.taskKinds);
         } else {
            toast.error(result.response.data.message);
         }
      });
   }, []);

   useEffect(() => {
      setGregorian(shamsiToGregorianN(shamsi));
      navigate(`/days/${shamsi.year}-${shamsi.month.number}-${shamsi.day}`);
   }, [shamsi]);

   const todayClick = () => {
      setShamsi(new DateObject(new Date()));
      navigate(`/days/${today.year}-${today.month.number}-${today.day}`);
   };

   const nextDayClick = () => {
      let date = shamsiBarcodeToJSDate(dayBarcode);
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
      setShamsi(new DateObject(date));
      navigate(
         `/days/${shamsiToGregorianN(new DateObject(date)).shamsiDBBarcode}`,
      );
   };

   const previousDayClick = () => {
      let date = shamsiBarcodeToJSDate(dayBarcode);
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
      setShamsi(new DateObject(date));
      navigate(
         `/days/${shamsiToGregorianN(new DateObject(date)).shamsiDBBarcode}`,
      );
   };

   return (
      <div>
         <div className="container">
            <div className="row mt-3 mb-2">
               <div className="col-12 col-sm-6">
                  <div
                     className="alert alert-primary d-flex align-items-center justify-content-between"
                     style={{
                        marginBottom: 5,
                     }}
                  >
                     <div>{shamsi.year}</div>
                     <div>{shamsiMonthToPersianN(shamsi.month.name)}</div>
                     <div>{shamsi.day}</div>
                     <div>{shamsiDayToPersianN(shamsi.weekDay.name)}</div>
                  </div>
               </div>
               <div className="col-12 col-sm-6">
                  <div
                     className="alert alert-primary d-flex align-items-center justify-content-between"
                     style={{
                        marginBottom: 5,
                     }}
                  >
                     <div>{gregorian.year}</div>
                     <div>{gregorian.month}</div>
                     <div>{gregorian.day}</div>
                     <div>{gregorian.weekDay}</div>
                  </div>
               </div>
            </div>
            <div className="mb-2">
               <DatePicker
                  locale={persian_en}
                  calendar={persian}
                  value={shamsi}
                  className="red"
                  onChange={(date: DateObject) => setShamsi(date)}
                  render={<CustomDatePicker />}
               />
               {gregorian.gregorianBarcode !== today.toString() && (
                  <button
                     className="btn btn-lg btn-secondary mx-2"
                     style={{width: 150}}
                     onClick={todayClick}
                  >
                     Today
                  </button>
               )}
            </div>
            <div className="row">
               <div className="col-12 col-lg-8 mb-3">
                  <ListGroup className="mb-3">
                     <ListGroup.Item
                        className="d-flex justify-content-between align-items-start bg-secondary"
                        style={{ fontSize: 20 }}
                     >
                        <p> Day Tasks </p>
                        <div>
                           <button
                              className="btn btn-info"
                              onClick={() => {
                                 setAddTaskModal(true);
                              }}
                           >
                              <FontAwesomeIcon icon={faPlus} />
                              Add Task
                           </button>
                        </div>
                     </ListGroup.Item>
                     {tasks.length === 0 && (
                        <div className="alert alert-warning" role="alert">
                           There Are No Tasks
                        </div>
                     )}
                     {tasks.map(item => (
                        <Task
                           key={item._id}
                           task={item}
                           taskRender={taskRender}
                           setTaskRender={setTaskRender}
                           tasks={tasks}
                           setTasks={setTasks}
                           taskKinds={taskKinds}
                           setTaskKinds={setTaskKinds}
                           taskKindsConst={taskKindsConst}
                        />
                     ))}
                  </ListGroup>
                  <div className="mb-2">
                     <button
                        className="btn btn-danger btn-lg  me-2 col-lg-3"
                        onClick={previousDayClick}
                     >
                        Previous Day
                     </button>
                     <button
                        className="btn btn-success btn-lg col-lg-3"
                        onClick={nextDayClick}
                     >
                        Next Day
                     </button>
                  </div>
               </div>
            </div>
            <AddTaskModal
               taskKindsConst={taskKindsConst}
               addTaskModal={addTaskModal}
               setAddTaskModal={setAddTaskModal}
               taskRender={taskRender}
               setTaskRender={setTaskRender}
               dayBarcode={dayBarcode}
            />
         </div>
      </div>
   );
};

export default Days;

export const TaskKindLabelForm = ({ item }) => {
   return (
      <span
         className="hoverPointer"
         style={{
            backgroundColor: item.color,
            fontSize: 14,
            color: item.textColor,
            padding: 6,
            borderRadius: '40%',
            display: 'inline',
            margin: 5,
         }}
      >
         {item.title}
      </span>
   );
};

export const TaskKindLabel = props => {
   const item = props.item;
   const onClick = props.onClick;

   return (
      <span
         onClick={onClick}
         className="hoverPointer"
         style={{
            backgroundColor: item.color,
            color: item.textColor,
            padding: 8,
            borderRadius: '40%',
            display: 'inline',
            margin: 5,
            height: 40,
         }}
      >
         {item.title}
      </span>
   );
};
