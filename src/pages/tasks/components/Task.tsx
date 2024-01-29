import { useEffect, useState } from 'react';
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import persian from 'react-date-object/calendars/persian';
import persian_en from 'react-date-object/locales/persian_en';
import * as Icon from 'react-bootstrap-icons';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ITask, ITaskKind } from '../../../interface/task.interface';
import { deleteTaskApi, editTaskApi } from '../../../api/task.service';
import { toast } from 'react-toastify';
import { sortByCompleted } from '../Tasks';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import CustomDatePicker from '../../days/components/CustomDatePicker';
import { log } from 'console';
import {
   getToday,
   getTodayJSDate,
   gregorianDayToPersianN,
} from '../../../utils/convertor';
import { TaskKindLabel } from '../../days/Days';

const Task = props => {
   const { taskKindsConst } = props;
   const taskRender: boolean = props.taskRender;
   const setTaskRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setTaskRender;
   const task: ITask = props.task;
   const [editedTask, setEditedTask] = useState<ITask>(props.task);
   const tasks: ITask[] = props.tasks;
   const setTasks = props.setTasks;

   const [taskKindsPrivate, setTaskKindsPrivate] =
      useState<ITaskKind[]>(taskKindsConst);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [showUnAssignModal, setShowUnAssignModal] = useState(false);
   const [showArchiveModal, setShowArchiveModal] = useState(false);
   const [showUnArchiveModal, setShowUnArchiveModal] = useState(false);

   const JSDateToday = getTodayJSDate();
   const JSDate = new Date(task.date);
   const dateObject = new DateObject(JSDate);

   const [selectedTaskKind, setSelectedTaskKind] = useState<ITaskKind>({
      _id: task.taskKind._id,
      title: task.taskKind.title,
      color: task.taskKind.color,
   });

   const [shamsi, setShamsi] = useState<DateObject>(new DateObject());
   const [selectedDayBarcode, setSelectedDayBarcode] = useState<string>('');

   const trashClick = () => {
      setShowDeleteModal(false);
      deleteTaskApi(task._id, (isOk, result) => {
         if (isOk) {
            setTasks(
               tasks.filter(item => {
                  if (item._id !== task._id) return item;
               }),
            );
         } else {
            toast.error(result.result.response.data.message);
         }
      });
   };

   const editTaskClick = () => {
      // Edit Api
      editTaskApi(
         task._id,
         {
            title: editedTask.title,
            taskKind: selectedTaskKind._id,
            completed: editedTask.completed,
         },
         (isOk, result) => {
            if (isOk) {
               setShowEditModal(false);
               setTaskRender(!taskRender);
            } else {
               console.log(result);
            }
         },
      );
   };

   const archiveTaskClick = (value: boolean) => {
      // Edit Api
      editTaskApi(
         task._id,
         {
            archived: value,
         },
         (isOk, result) => {
            if (isOk) {
               setShowArchiveModal(false);
               setTaskRender(!taskRender);
            } else {
               console.log(result);
            }
         },
      );
   };

   const completedClick = completed => {
      editTaskApi(task._id, { completed }, (isOk, result) => {
         if (isOk) {
            setTaskRender(!taskRender);
         } else {
            toast.error(result.result.response.data.message);
         }
      });
   };

   const assignTaskClick = () => {
      if (selectedDayBarcode === '') {
         return toast.warn('Please select a day');
      }
      editTaskApi(
         task._id,
         { dayBarcode: selectedDayBarcode, date: shamsi, assign: 'assign' },
         (isOk, result) => {
            if (isOk) {
               setTaskRender(!taskRender);
            } else {
               toast.error(result.response.data.message);
            }
         },
      );
      setShowAssignModal(false);
   };

   const unAssignTaskClick = () => {
      editTaskApi(
         task._id,
         { dayBarcode: task.dayBarcode, assign: 'unassign' },
         (isOk, result) => {
            if (isOk) {
               setTaskRender(!taskRender);
            } else {
               toast.error(result.response.data.message);
            }
         },
      );
      setShowUnAssignModal(false);
   };

   return (
      <div key={task._id}>
         <ListGroup.Item style={{ position: 'relative' }}>
            <div className="row">
               <div className="col-12 col-lg-6 d-flex mb-3">
                  <Form.Check
                     className="me-2"
                     type={'checkbox'}
                     checked={editedTask.completed}
                     onChange={e => {
                        setEditedTask({
                           ...editedTask,
                           completed: e.target.checked,
                        });
                        completedClick(e.target.checked);
                     }}
                  />
                  {!task.completed ? (
                     <div className="mb-2">{task.title}</div>
                  ) : (
                     <div
                        className="mb-2"
                        style={{ textDecoration: 'line-through' }}
                     >
                        {task.title}
                     </div>
                  )}
               </div>

               <div className="col-12 col-lg-6 d-flex align-items-center justify-content-end mb-3">
                  <TaskKindLabel item={task.taskKind} />

                  {task.dayBarcode === 'unassign' ? (
                     <button
                        type="button"
                        className="btn btn-sm btn-success my-auto mx-1"
                        onClick={() => setShowAssignModal(true)}
                     >
                        <i className="bi bi-arrow-up-right"></i>
                     </button>
                  ) : (
                     <Badge
                        className="my-auto hoverPointer py-2"
                        bg="dark"
                        style={{ fontWeight: 200, fontSize: 12 }}
                        onClick={() => {
                           setShowUnAssignModal(true);
                        }}
                     >
                        {task.dayBarcode}
                     </Badge>
                  )}

                  <button
                     type="button"
                     className="btn btn-sm btn-secondary my-auto mx-1"
                     onClick={() => setShowEditModal(true)}
                  >
                     <i className="bi bi-pen" />
                  </button>
                  {task.archived ? (
                     <button
                        type="button"
                        className="btn btn-sm btn-success my-auto mx-1"
                        onClick={() => setShowUnArchiveModal(true)}
                     >
                        <i className="bi bi-file-earmark-zip-fill"></i>
                     </button>
                  ) : (
                     <button
                        type="button"
                        className="btn btn-sm btn-danger my-auto mx-1"
                        onClick={() => setShowArchiveModal(true)}
                     >
                        <i className="bi bi-archive-fill"></i>
                     </button>
                  )}
                  <button
                     type="button"
                     className="btn btn-sm btn-primary my-auto mx-1"
                     onClick={() => setShowDeleteModal(true)}
                  >
                     <i className="bi bi-trash" />
                  </button>
               </div>
            </div>
            <div style={{ position: 'absolute', right: 2, bottom: 2 }}>
               {task.dayBarcode !== 'unassign' && (
                  <span>{gregorianDayToPersianN(dateObject.weekDay.name)}</span>
               )}
            </div>
            <div style={{ position: 'absolute', left: 2, bottom: 2 }}>
               {getToday(new DateObject()).shamsiDBBarcode ===
                  task.dayBarcode && <Badge bg="primary">Today</Badge>}

               {JSDateToday.getTime() > JSDate.getTime() &&
                  task.dayBarcode !== 'unassign' &&
                  task.completed === false && (
                     <Badge bg="dark" text="light">
                        Dead Task
                     </Badge>
                  )}
            </div>
         </ListGroup.Item>

         <Modal
            show={showDeleteModal}
            onHide={() => {
               setShowDeleteModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete Task: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{task.title}</Modal.Body>
            <Modal.Footer>
               <Button
                  style={{ width: '48%' }}
                  variant="secondary"
                  onClick={() => {
                     setShowDeleteModal(false);
                  }}
               >
                  Close
               </Button>
               <Button
                  style={{ width: '48%' }}
                  variant="primary"
                  onClick={trashClick}
               >
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal
            show={showEditModal}
            onHide={() => {
               setShowEditModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Editing Task </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3">
               <Form>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Title: </Form.Label>
                     <Form.Control
                        value={editedTask.title}
                        onChange={e => {
                           setEditedTask({
                              ...editedTask,
                              title: e.target.value,
                           });
                        }}
                        placeholder="title"
                     />
                  </Form.Group>
                  <Form.Group className="">
                     <Form.Label className="w-100">
                        <span>Kind:</span>
                        <span
                           style={{
                              backgroundColor: selectedTaskKind.color,
                              color: '#fff',
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
                           <div
                              onClick={() => {
                                 setSelectedTaskKind({
                                    _id: item._id,
                                    title: item.title,
                                    color: item.color,
                                 });
                                 setTaskKindsPrivate([]);
                              }}
                              className="hoverPointer"
                              style={{
                                 backgroundColor: item.color,
                                 color: '#fff',
                                 padding: 8,
                                 borderRadius: '30%',
                                 margin: 6,
                                 // userSelect: 'none',
                              }}
                           >
                              {item.title}
                           </div>
                        ))}
                     </div>
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer className="pt-0">
               <Button
                  className="w-100"
                  variant="secondary"
                  onClick={editTaskClick}
               >
                  Save
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal
            show={showAssignModal}
            onHide={() => {
               setShowAssignModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Assigning Task to a Day </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3">
               <DatePicker
                  locale={persian_en}
                  calendar={persian}
                  value={shamsi}
                  className="red"
                  onChange={(date: DateObject) => {
                     setShamsi(date);
                     setSelectedDayBarcode(
                        `${date.year}-${date.month.number}-${date.day}`,
                     );
                  }}
                  render={<CustomDatePicker />}
               />
               <button
                  className="btn btn-lg btn-secondary mx-2"
                  onClick={() => {
                     setSelectedDayBarcode(
                        getToday(new DateObject()).shamsiDBBarcode,
                     );
                  }}
               >
                  Set Today
               </button>
               <p className="my-3">
                  Selected day: {selectedDayBarcode}
                  {selectedDayBarcode && (
                     <FontAwesomeIcon
                        className="hoverPointer mx-2"
                        style={{ fontSize: 22, color: 'red' }}
                        onClick={() => {
                           setSelectedDayBarcode('');
                        }}
                        icon={faClose}
                     />
                  )}
               </p>
            </Modal.Body>
            <Modal.Footer className="pt-0">
               <Button
                  className="w-100"
                  variant="success"
                  onClick={assignTaskClick}
               >
                  Assign
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal
            show={showUnAssignModal}
            onHide={() => {
               setShowUnAssignModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Assigning a Task of Day </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3">
               <p className="my-3">Selected day: {task.dayBarcode}</p>
            </Modal.Body>
            <Modal.Footer className="pt-0">
               <Button
                  style={{ width: '100%' }}
                  className="text-dark"
                  variant="warning"
                  onClick={unAssignTaskClick}
               >
                  UnAssign
               </Button>
               <Button
                  style={{ width: '100%' }}
                  className="text-light"
                  variant="danger"
                  onClick={() => {
                     setShowUnAssignModal(false);
                     setShowAssignModal(true);
                  }}
               >
                  Assign To Another Day
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal
            show={showUnArchiveModal}
            onHide={() => {
               setShowUnArchiveModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>UnArchiving a Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>{task.title}</Modal.Body>
            <Modal.Footer className="">
               <Button
                  style={{ width: '48%' }}
                  variant="secondary"
                  onClick={() => {
                     setShowUnArchiveModal(false);
                  }}
               >
                  Close
               </Button>
               <Button
                  style={{ width: '48%' }}
                  className="text-light"
                  variant="danger"
                  onClick={() => {
                     archiveTaskClick(false);
                  }}
               >
                  Un Archive
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal
            show={showArchiveModal}
            onHide={() => {
               setShowArchiveModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Archiving a Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>{task.title}</Modal.Body>
            <Modal.Footer className="">
               <Button
                  style={{ width: '48%' }}
                  variant="secondary"
                  onClick={() => {
                     setShowArchiveModal(false);
                  }}
               >
                  Close
               </Button>
               <Button
                  style={{ width: '48%' }}
                  className="text-light"
                  variant="danger"
                  onClick={() => {
                     archiveTaskClick(true);
                  }}
               >
                  Archive
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

export default Task;
