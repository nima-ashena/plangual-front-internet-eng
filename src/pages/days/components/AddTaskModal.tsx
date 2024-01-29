import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Modal } from 'react-bootstrap';
import { addTaskApi } from '../../../api/task.service';
import { toast } from 'react-toastify';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { shamsiBarcodeToGregorianDate } from '../../../utils/convertor';
import { ITaskKind } from '../../../interface/task.interface';
import { TaskKindLabel } from '../Days';
import { getTaskKindsApi } from '../../../api/taskKind.service';

const AddTaskModal = (props: any) => {
   const {
      taskKindsConst,
      addTaskModal,
      setAddTaskModal,
      taskRender,
      setTaskRender,
      taskKindRender,
      setTaskKindRender,
      dayBarcode,
   } = props;

   const [taskKindsPrivate, setTaskKindsPrivate] = useState<ITaskKind[]>([]);
   const [taskTitle, setTaskTitle] = useState<string>('');
   const [d, setD] = useState(false);

   // useEffect(() => {
   //    console.log(taskKindsConst);
   //    setTaskKindsPrivate(taskKindsConst);
   //    if (taskKindsPrivate.length === 0) setD(!d);
   // }, [d, taskKindRender]);

   useEffect(() => {
      getTaskKindsApi((isOk, result) => {
         if (isOk) {
            setTaskKindsPrivate(result.taskKinds);
         } else {
            toast.error(result.response.data.message);
         }
      });
   }, [taskKindRender]);

   const [selectedTaskKind, setSelectedTaskKind] = useState<ITaskKind>({
      _id: '',
      title: '',
      color: '',
      textColor: '',
   });

   const addTaskClick = () => {
      if (taskTitle == '' || selectedTaskKind._id == '') {
         return toast.warn('Please fill the fields');
      }

      let d: any = '';
      if (dayBarcode) {
         d = shamsiBarcodeToGregorianDate(dayBarcode);
      }
      addTaskApi(
         {
            title: taskTitle,
            taskKind: selectedTaskKind._id,
            dayBarcode,
            date: d,
         },
         (isOk, result) => {
            if (isOk) {
               setAddTaskModal(false);
               setTaskTitle('');
               setTaskKindsPrivate(taskKindsConst);
               setSelectedTaskKind({
                  _id: '',
                  title: '',
                  color: '',
                  textColor: '',
               });
               setTaskRender(!taskRender);
               setTaskKindRender(!taskKindRender);
               setD(!d)
            } else {
               toast.error(result.response.data.message);
            }
         },
      );
   };

   return (
      <Modal
         show={addTaskModal}
         onHide={() => {
            setAddTaskModal(false);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>Adding Task</Modal.Title>
         </Modal.Header>
         <Modal.Body className="pb-3">
            <form>
               <Form.Group className="mb-3">
                  <Form.Label className="me-3">Title: </Form.Label>
                  <Form.Control
                     value={taskTitle}
                     onChange={e => {
                        setTaskTitle(e.target.value);
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
                                 textColor: '',
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
               <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={e => {
                     e.preventDefault();
                     addTaskClick();
                  }}
                  autoFocus
               >
                  Add
               </button>
            </form>
         </Modal.Body>
      </Modal>
   );
};

export default AddTaskModal;
