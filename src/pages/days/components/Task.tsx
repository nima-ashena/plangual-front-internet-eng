import { useState } from 'react';
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
import { TaskKindLabel, TaskKindLabelForm } from '../Days';
import EditTaskModal from './EditTaskModal';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { getToday } from '../../../utils/convertor';
import CustomDatePicker from './CustomDatePicker';

const Task = props => {
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [showUnAssignModal, setShowUnAssignModal] = useState(false);
   const [selectedDayBarcode, setSelectedDayBarcode] = useState<string>('');
   const [shamsi, setShamsi] = useState<DateObject>(new DateObject());

   const task: ITask = props.task;
   // console.log(task);
   const [editedTask, setEditedTask] = useState<ITask>(props.task);
   const tasks: ITask[] = props.tasks;
   const setTasks = props.setTasks;

   const taskRender: boolean = props.taskRender;
   const setTaskRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setTaskRender;

   // const { taskKinds, setTaskKinds, taskKindsConst } = props;
   const { taskKinds, setTaskKinds, taskKindsConst } = props;
   const [selectedTaskKind, setSelectedTaskKind] = useState<ITaskKind>({
      _id: task.taskKind._id,
      title: task.taskKind.title,
      color: task.taskKind.color,
      textColor: task.taskKind.textColor,
   });

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
      editTaskApi(
         task._id,
         {
            title: editedTask.title,
            taskKind: selectedTaskKind._id,
            archived: editedTask.archived,
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

   const completedClick = completed => {
      editTaskApi(task._id, { completed }, (isOk, result) => {
         if (isOk) {
            setTaskRender(!taskRender);
         } else {
            toast.error(result.result.response.data.message);
         }
      });
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

   return (
      <>
         <ListGroup.Item style={{ position: 'relative' }}>
            <div className="row">
               <div className="col-12 col-lg-8 d-flex">
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

               <div className="col-12 col-lg-4 d-flex align-items-center justify-content-end">
                  <TaskKindLabel item={task.taskKind} />
                  <button
                     type="button"
                     className="btn btn-sm btn-warning text-dark my-auto mx-1"
                     onClick={() => setShowUnAssignModal(true)}
                  >
                     <i className="bi bi-arrow-down-right"></i>
                  </button>
                  <button
                     type="button"
                     className="btn btn-sm btn-secondary my-auto mx-1"
                     onClick={() => setShowEditModal(true)}
                  >
                     <i className="bi bi-pen" />
                  </button>
                  <button
                     type="button"
                     className="btn btn-sm btn-danger my-auto mx-1"
                     onClick={() => setShowDeleteModal(true)}
                  >
                     <i className="bi bi-trash" />
                  </button>
               </div>
            </div>
            <div style={{ position: 'absolute', left: 2, bottom: 2 }}>
               {task.archived && (
                  <Badge bg="danger" text="light">
                     Archived
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
                  variant="secondary"
                  onClick={() => {
                     setShowDeleteModal(false);
                  }}
               >
                  Close
               </Button>
               <Button variant="danger" onClick={trashClick}>
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
                  <Form.Group className="mb-3">
                     <Form.Label className="w-100">
                        <span>Kind:</span>
                        <TaskKindLabel item={selectedTaskKind} />
                        {selectedTaskKind.title && (
                           <FontAwesomeIcon
                              className="hoverPointer"
                              style={{ fontSize: 22, color: 'red' }}
                              onClick={() => {
                                 setTaskKinds(taskKindsConst);
                                 setSelectedTaskKind({
                                    _id: '',
                                    title: '',
                                    color: '',
                                    textColor: '',
                                 });
                              }}
                              icon={faClose}
                           />
                        )}
                     </Form.Label>
                     <div className="mt-3 d-flex flex-wrap">
                        {taskKinds.map(item => (
                           <TaskKindLabel
                              onClick={() => {
                                 setSelectedTaskKind({
                                    _id: item._id,
                                    title: item.title,
                                    color: item.color,
                                    textColor: item.textColor,
                                 });
                                 setTaskKinds([]);
                              }}
                              item={item}
                           />
                        ))}
                     </div>
                  </Form.Group>

                  <Form.Group>
                     <div className="mb-1 d-flex">
                        <Form.Check
                           type="switch"
                           label="Archived"
                           checked={editedTask.archived}
                           className="me-2"
                           onChange={e => {
                              setEditedTask({
                                 ...editedTask,
                                 archived: e.target.checked,
                              });
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
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer className="pt-0">
               <Button
                  className="w-100"
                  variant="danger"
                  onClick={editTaskClick}
               >
                  Edit
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
                     editTaskApi(
                        task._id,
                        { dayBarcode: task.dayBarcode, assign: 'unassign' },
                        (isOk, result) => {
                           if (!isOk) {
                              toast.error(result.response.data.message);
                           }
                        },
                     );
                     setShowAssignModal(true);
                  }}
               >
                 UnAssign And Assign To Another Day
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default Task;
