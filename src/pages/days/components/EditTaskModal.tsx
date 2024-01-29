import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Modal } from 'react-bootstrap';
import { addTaskApi, editTaskApi } from '../../../api/task.service';
import { toast } from 'react-toastify';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { ITask, ITaskKind } from '../../../interface/task.interface';
import { editTaskKindApi } from '../../../api/taskKind.service';

const EditTaskModal = (props: any) => {
   const task: ITask = props.task;

   const [taskTitle, setTaskTitle] = useState<string>(task.title);
   const [taskKindsPrivate, setTaskKindsPrivate] = useState<ITaskKind[]>([]);

   const [selectedTaskKind, setSelectedTaskKind] = useState({
      _id: task.taskKind._id,
      title: task.taskKind.title,
      color: task.taskKind.color,
   });

   const {
      taskKindsConst,
      showEditModal,
      setShowEditModal,
      render,
      setRender,
   } = props;

   const editTaskClick = () => {
      setTaskTitle('');
      setTaskKindsPrivate(taskKindsConst);
      setSelectedTaskKind({
         _id: '',
         title: '',
         color: '',
      });
      // Edit Api
      editTaskApi(
         task._id,
         { title: taskTitle, taskKind: selectedTaskKind._id },
         (isOk, result) => {
            if(!isOk){
               console.log(result);
            }
         },
      );
   };

   return (
      <Modal
         show={showEditModal}
         onHide={() => {
            setShowEditModal(false);
         }}
      >
         <Modal.Header closeButton>
            <Modal.Title>Editing Task</Modal.Title>
         </Modal.Header>
         <Modal.Body className="pb-3">
            <Form>
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
            <Button className="w-100" variant="danger" onClick={editTaskClick}>
               Edit
            </Button>
         </Modal.Footer>
      </Modal>
   );
};

export default EditTaskModal;
