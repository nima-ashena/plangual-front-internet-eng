import { CustomComponentProps } from 'react-multi-date-picker';

import { useState, useEffect, FC, useContext } from 'react';
import 'react-multi-date-picker/styles/colors/red.css';

import { UserContext } from '../../context/common';
import { redirect, useNavigate, useParams } from 'react-router-dom';

import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPlus, fas } from '@fortawesome/free-solid-svg-icons';
import { ITask, ITaskFilter, ITaskKind } from '../../interface/task.interface';
import { getTaskKindsApi } from '../../api/taskKind.service';
import { toast } from 'react-toastify';

import TaskKind from './components/TaskKind';
import AddTaskModal from '../days/components/AddTaskModal';
import { getTasksApi } from '../../api/task.service';
import Task from './components/Task';
import { TaskKindLabel } from '../days/Days';
import PaginationN, {
   generatePaginationItems,
} from '../../components/pagination/Pagination';
import { IPaginationItem } from '../../interface/common.interface';
import { getTodayJSDate } from '../../utils/convertor';

const Tasks = () => {
   const [searchModal, setSearchModal] = useState<boolean>(false);
   const [addTaskModal, setAddTaskModal] = useState<boolean>(false);

   const [tasks, setTasks] = useState<ITask[]>([]);
   const [taskKinds, setTaskKinds] = useState<ITaskKind[]>([]);
   const [taskKindsPrivate, setTaskKindsPrivate] = useState<ITaskKind[]>([]);
   const [taskKindsConst, setTaskKindsConst] = useState<ITaskKind[]>([]);
   const [render, setRender] = useState<boolean>(false);
   const [taskRender, setTaskRender] = useState<boolean>(false);
   const [taskKindRender, setTaskKindRender] = useState<boolean>(false);

   const [filter, setFilter] = useState<ITaskFilter>({
      query: '',
      archivedValue: 'not-archived',
   });
   const [selectedTaskKind, setSelectedTaskKind] = useState<ITaskKind>({
      _id: '',
      title: '',
      color: '',
   });

   const limit = 30;
   const [pages, setPages] = useState<number>(1);
   const [paginationItems, setPaginationItems] = useState<IPaginationItem[]>(
      [],
   );
   const { paginationPage, setPaginationPage } = useContext(UserContext);

   useEffect(() => {
      getTasksApi(
         (isOk, result) => {
            if (isOk) {
               setTasks(
                  sortByCompleted(sortByDateAssign(result.tasks)).reverse(),
               );
               setPages(result.responseFilter.pages);
               setPaginationItems(
                  generatePaginationItems(
                     result.responseFilter.pages,
                     paginationPage,
                  ),
               );
            } else {
               console.log(result.response);
            }
         },
         [
            { name: 'user', value: localStorage.getItem('userId') },
            { name: 'query', value: filter.query },
            { name: 'notCompleted', value: filter.notCompleted },
            { name: 'unAssigned', value: filter.unAssigned },
            { name: 'taskKindId', value: selectedTaskKind._id },
            { name: 'archived', value: filter.archivedValue },
            { name: 'page', value: paginationPage },
            { name: 'limit', value: limit },
            { name: 'sort', value: '-date' },
            { name: 'sort2', value: 'created_at' },
         ],
      );
   }, [render, taskRender, paginationPage]);

   useEffect(() => {
      getTaskKindsApi((isOk, result) => {
         if (isOk) {
            setTaskKinds(result.taskKinds);
            setTaskKindsPrivate(result.taskKinds);
            setTaskKindsConst(result.taskKinds);
         } else {
            toast.error(result.response.data.message);
         }
      });
   }, [taskKindRender]);


   return (
      <div className="container">
         <button
            className="btn btn-lg btn-outline-info w-100 my-2"
            onClick={() => {
               setSearchModal(true);
            }}
         >
            Enable Filter...
         </button>

         <div className="row">
            <div className="col-12 col-lg-8 mb-2">
               <ListGroup>
                  <ListGroup.Item
                     key={1}
                     className="d-flex justify-content-between align-items-start bg-secondary"
                     style={{ fontSize: 20 }}
                  >
                     <p> Tasks </p>
                     <button
                        className="btn btn-info"
                        onClick={() => {
                           setAddTaskModal(true);
                        }}
                     >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Task
                     </button>
                  </ListGroup.Item>
                  {tasks.length === 0 && (
                     <div className="alert alert-warning mt-2" role="alert">
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
               <div className="my-2 d-flex justify-content-center">
                  <PaginationN
                     page={paginationPage}
                     setPage={setPaginationPage}
                     pages={pages}
                     paginationItems={paginationItems}
                     setPaginationItems={setPaginationItems}
                  />
               </div>
            </div>
            <div className="col-12 col-lg-4 mb-4">
               <TaskKind
                  taskKinds={taskKinds}
                  taskKindRender={taskKindRender}
                  setTaskKindRender={setTaskKindRender}
                  render={render}
                  setRender={setRender}
               />
            </div>
         </div>
         <AddTaskModal
            taskKinds={taskKinds}
            setTaskKinds={setTaskKinds}
            taskKindsConst={taskKindsConst}
            addTaskModal={addTaskModal}
            setAddTaskModal={setAddTaskModal}
            taskRender={taskRender}
            setTaskRender={setTaskRender}
            taskKindRender={taskKindRender}
            setTaskKindRender={setTaskKindRender}
         />

         {/* Search Modal */}
         <Modal
            show={searchModal}
            onHide={() => {
               setSearchModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Searching...</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3">
               <form className="pt-3">
                  <div className="mb-3">
                     <label className="form-label">Search</label>
                     <input
                        type="text"
                        className="form-control"
                        value={filter.query}
                        onChange={e => {
                           setFilter({
                              ...filter,
                              query: e.target.value,
                           });
                        }}
                     />
                  </div>

                  <div className="mb-3">
                     <Form.Check
                        type="switch"
                        label="Not Completed"
                        checked={filter.notCompleted}
                        onChange={e =>
                           setFilter({
                              ...filter,
                              notCompleted: e.target.checked,
                           })
                        }
                     />
                  </div>

                  <div className="mb-3 d-flex">
                     <Form.Check
                        type="switch"
                        label="UnAssigned"
                        checked={filter.unAssigned}
                        className="me-2"
                        onChange={e =>
                           setFilter({
                              ...filter,
                              unAssigned: e.target.checked,
                           })
                        }
                     />
                     <i
                        className="bi bi-arrow-up-right bg-success text-light"
                        style={{
                           padding: '0px 4px 0px 4px',
                           borderRadius: 3,
                        }}
                     ></i>
                  </div>

                  <div className="mb-3 d-flex">
                     <Form.Check
                        type="switch"
                        label="Archived"
                        checked={filter.archived}
                        className="me-2"
                        onChange={e => {
                           if (e.target.checked)
                              setFilter({
                                 ...filter,
                                 archived: true,
                                 archivedValue: 'archived',
                              });
                           else {
                              setFilter({
                                 ...filter,
                                 archived: false,
                                 archivedValue: 'not-archived',
                              });
                           }
                        }}
                     />
                     <i
                        className="bi bi-archive-fill bg-danger text-light"
                        style={{
                           padding: '0px 4px 0px 4px',
                           borderRadius: 3,
                        }}
                     ></i>
                  </div>

                  <div className="mb-3">
                     <Form.Group className="">
                        <Form.Label className="w-100">
                           <span>Kind:</span>
                           <span
                              style={{
                                 backgroundColor: selectedTaskKind.color,
                                 color: selectedTaskKind.textColor,
                                 padding: 8,
                                 borderRadius: '40%',
                                 display: 'inline',
                                 margin: 5,
                              }}
                           >
                              {selectedTaskKind.title}
                           </span>
                           {selectedTaskKind.title && (
                              <FontAwesomeIcon
                                 className="hoverPointer"
                                 style={{ fontSize: 22, color: 'red' }}
                                 onClick={() => {
                                    setTaskKindsPrivate(taskKindsConst);
                                    setSelectedTaskKind({
                                       _id: '',
                                       title: '',
                                       color: '',
                                    });
                                 }}
                                 icon={faClose}
                              />
                           )}
                        </Form.Label>
                        <div className="mt-3 d-flex flex-wrap">
                           {taskKindsPrivate.map(item => (
                              <TaskKindLabel
                                 item={item}
                                 onClick={() => {
                                    setSelectedTaskKind({
                                       _id: item._id,
                                       title: item.title,
                                       color: item.color,
                                       textColor: item.textColor,
                                    });
                                    setTaskKindsPrivate([]);
                                 }}
                              />
                           ))}
                        </div>
                     </Form.Group>
                  </div>

                  <button
                     type="submit"
                     className="btn btn-primary btn-lg w-100"
                     onClick={e => {
                        e.preventDefault();
                        setSearchModal(false);
                        setTaskRender(!taskRender);
                     }}
                  >
                     Search
                  </button>
               </form>
            </Modal.Body>
         </Modal>
      </div>
   );
};

export default Tasks;

const CustomDatePicker: FC<CustomComponentProps> = ({
   value,
   openCalendar,
   onChange,
}) => {
   return (
      <button className="btn btn-primary btn-lg w-100" onClick={openCalendar}>
         Open Calendar
      </button>
   );
};

export const sortByCompleted = (array: ITask[]): ITask[] => {
   let a1 = array.filter(item => {
      if (item.completed === true) return item;
   });
   let a2 = array.filter(item => {
      if (item.completed !== true) return item;
   });
   return a1.concat(a2);
};

export const sortByDateAssign = (array: ITask[]): ITask[] => {
   let a1 = array.filter(item => {
      if (item.date === null) return item;
   });
   let a2 = array.filter(item => {
      if (item.date !== null) return item;
   });
   return a1.concat(a2);
};
