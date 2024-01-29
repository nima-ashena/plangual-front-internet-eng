import { useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';

import { toast } from 'react-toastify';
import {
   addTaskKindApi,
   deleteTaskKindApi,
   editTaskKindApi,
} from '../../../api/taskKind.service';
import { ITaskKind } from '../../../interface/task.interface';
import { TaskKindLabel } from '../../days/Days';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const TaskKind = props => {
   const { taskKinds, taskKindRender, setTaskKindRender, render, setRender } =
      props;

   const emptyTaskKindData: ITaskKind = {
      _id: '',
      title: '',
      color: '',
      textColor: 'black',
   };
   const [taskKind, setTaskKind] = useState<ITaskKind>(emptyTaskKindData);
   const [addTaskKindModal, setAddTaskKindModal] = useState<boolean>(false);

   const addTaskKindClick = () => {
      addTaskKindApi(taskKind, (isOk, result) => {
         if (isOk) {
            setAddTaskKindModal(false);
            setTaskKind(emptyTaskKindData);
            setTaskKindRender(!taskKindRender);
            setRender(!render);
         } else {
            toast.error(result.response.data.message);
         }
      });
   };

   return (
      <>
         <ListGroup>
            <ListGroup.Item
               key={1}
               className="d-flex justify-content-between align-items-start bg-secondary"
               style={{ fontSize: 20 }}
            >
               <p> TaskKinds </p>
               <button
                  className="btn btn-info"
                  onClick={() => {
                     setAddTaskKindModal(true);
                  }}
               >
                  <FontAwesomeIcon icon={faPlus} />
                  Add TaskKind
               </button>
            </ListGroup.Item>
            {taskKinds.length === 0 && (
               <div className="alert alert-warning mt-2" role="alert">
                  There Are No TaskKinds
               </div>
            )}
            {taskKinds.map(item => (
               <TaskKindItem
                  item={item}
                  taskKindRender={taskKindRender}
                  setTaskKindRender={setTaskKindRender}
                  render={render}
                  setRender={setRender}
               />
            ))}
         </ListGroup>

         <Modal
            show={addTaskKindModal}
            onHide={() => {
               setAddTaskKindModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Adding TaskKind</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3">
               <Form>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Title: </Form.Label>
                     <Form.Control
                        value={taskKind.title}
                        onChange={e => {
                           setTaskKind({ ...taskKind, title: e.target.value });
                        }}
                        placeholder="title"
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Color: </Form.Label>
                     <Form.Control
                        value={taskKind.color}
                        onChange={e => {
                           setTaskKind({ ...taskKind, color: e.target.value });
                        }}
                        placeholder="color"
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Text Color: </Form.Label>
                     <Form.Control
                        value={taskKind.textColor}
                        onChange={e => {
                           setTaskKind({
                              ...taskKind,
                              textColor: e.target.value,
                           });
                        }}
                        placeholder="background color"
                     />
                  </Form.Group>
                  <div className="mt-3">
                     <TaskKindLabel
                        item={{
                           title: taskKind.title,
                           color: taskKind.color,
                           textColor: taskKind.textColor,
                        }}
                     />
                  </div>
               </Form>
            </Modal.Body>
            <Modal.Footer className="pt-0">
               <Button
                  className="w-100"
                  variant="danger"
                  onClick={addTaskKindClick}
               >
                  Add
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default TaskKind;

const TaskKindItem = ({
   item,
   taskKindRender,
   setTaskKindRender,
   render,
   setRender,
}) => {
   const [taskKind, setTaskKind] = useState<ITaskKind>(item);
   const [editTaskKindModal, setEditTaskKindModal] = useState<boolean>(false);
   const [deleteTaskKindModal, setDeleteTaskKindModal] = useState(false);

   const editTaskKindClick = () => {
      editTaskKindApi(taskKind._id, taskKind, (isOk, result) => {
         if (isOk) {
            setEditTaskKindModal(false);
            setTaskKindRender(!taskKindRender);
         } else {
            toast.error(result.response.data.message);
         }
      });
   };

   const deleteTaskKindClick = () => {
      setDeleteTaskKindModal(false);
      deleteTaskKindApi(taskKind._id, (isOk, result) => {
         if (isOk) {
            setDeleteTaskKindModal(false);
            setTaskKindRender(!taskKindRender);
         } else {
            toast.error(result.response.data.message);
         }
      });
   };

   return (
      <>
         <ListGroup.Item className="py-2 d-flex justify-content-between">
            <TaskKindLabel key={item._id} item={item} />
            <div>
               <button
                  type="button"
                  className="btn btn-sm btn-secondary my-auto mx-1"
                  onClick={() => setEditTaskKindModal(true)}
               >
                  <i className="bi bi-pen" />
               </button>
               <button
                  type="button"
                  className="btn btn-sm btn-primary my-auto mx-1"
                  onClick={() => setDeleteTaskKindModal(true)}
               >
                  <i className="bi bi-trash" />
               </button>
            </div>
         </ListGroup.Item>

         <Modal
            show={editTaskKindModal}
            onHide={() => {
               setEditTaskKindModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Editing TaskKind</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pb-3">
               <Form>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Title: </Form.Label>
                     <Form.Control
                        value={taskKind.title}
                        onChange={e => {
                           setTaskKind({ ...taskKind, title: e.target.value });
                        }}
                        placeholder="title"
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Color: </Form.Label>
                     <Form.Control
                        value={taskKind.color}
                        onChange={e => {
                           setTaskKind({ ...taskKind, color: e.target.value });
                        }}
                        placeholder="color"
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label className="me-3">Text Color: </Form.Label>
                     <Form.Control
                        value={taskKind.textColor}
                        onChange={e => {
                           setTaskKind({
                              ...taskKind,
                              textColor: e.target.value,
                           });
                        }}
                        placeholder="background color"
                     />
                  </Form.Group>
                  <div className="mt-3">
                     <TaskKindLabel
                        item={{
                           title: taskKind.title,
                           color: taskKind.color,
                           textColor: taskKind.textColor,
                        }}
                     />
                  </div>
               </Form>
            </Modal.Body>
            <Modal.Footer className="pt-0">
               <Button
                  className="w-100"
                  variant="danger"
                  onClick={editTaskKindClick}
               >
                  Edit
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal
            show={deleteTaskKindModal}
            onHide={() => {
               setDeleteTaskKindModal(false);
            }}
         >
            <Modal.Header closeButton>
               <Modal.Title>Delete TaskKind: ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{taskKind.title}</Modal.Body>
            <Modal.Footer>
               <Button
                  style={{ width: '48%' }}
                  variant="secondary"
                  onClick={() => {
                     setDeleteTaskKindModal(false);
                  }}
               >
                  Close
               </Button>
               <Button
                  style={{ width: '48%' }}
                  variant="primary"
                  onClick={deleteTaskKindClick}
               >
                  Yes
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
