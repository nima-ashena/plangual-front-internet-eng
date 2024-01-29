import { FC, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteTicketApi } from '../../../api/ticket.service';
import { ITicket } from '../../../interface/ticket.interface';
import { text } from 'stream/consumers';
import { DateObject } from 'react-multi-date-picker';
import { gregorianToPersianString } from '../../../utils/convertor';

const Ticket = (props: any) => {
   const ticket: ITicket = props.ticket;
   const render: boolean = props.render;
   const setRender: React.Dispatch<React.SetStateAction<boolean>> =
      props.setRender;

   const JSDate = new Date(ticket.created_at);
   const dateObject = new DateObject(JSDate);

   const [bgColor, setBgColor] = useState('');
   const [textColor, setTextColor] = useState('');

   useEffect(() => {
      if (ticket.type === 'Tweet') {
         setBgColor('#1DA1F2');
         setTextColor('#fff');
      } else if (ticket.type === 'Motto') {
         setBgColor('#f0e68c ');
         setTextColor('black');
      }
   }, []);

   const [showDeleteModal, setShowDeleteModal] = useState(false);

   const deleteTicketClick = () => {
      setShowDeleteModal(false);
      deleteTicketApi(ticket._id, (isOk, result) => {
         const t = toast.loading('Deleting Ticket...');
         if (isOk) {
            setRender(!render);
            toast.update(t, {
               render: 'ticket deleted successfully',
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
         } else {
            console.log(result.message);
            toast.update(t, {
               render: result.message,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         }
      });
   };

   return (
      <>
         <div className="my-2">
            <div
               className={`card`}
               id="ticket"
               style={{ backgroundColor: bgColor, color: textColor }}
            >
               <div
                  className="card-body text-center"
                  style={{ position: 'relative' }}
               >
                  <p
                     className="card-title mb-3 pb-3"
                     style={{ direction: 'rtl' }}
                  >
                     {ticket.context}
                  </p>
                  <div>
                     <div
                        className="d-flex align-items-center"
                        style={{ position: 'absolute', right: 4, bottom: 4 }}
                     >
                        {gregorianToPersianString(
                           new DateObject(new Date(ticket.created_at)),
                        )}
                        <span
                           style={{
                              backgroundColor: 'blue',
                              color: '#fff',
                              borderRadius: 3,
                              paddingRight: 3,
                              paddingLeft: 3,
                              margin: '0 0 0 10px',
                           }}
                        >
                           {ticket.user.name}
                        </span>
                     </div>
                     <div
                        className="d-flex align-items-center"
                        style={{
                           position: 'absolute',
                           bottom: 4,
                           margin: 'auto',
                        }}
                     ></div>
                     <div
                        className="d-flex align-items-center"
                        style={{ position: 'absolute', left: 4, bottom: 0 }}
                     >
                        {ticket.user._id === localStorage.getItem('userId') && (
                           <Link
                              to={``}
                              className="btn"
                              style={{
                                 color: 'black',
                                 marginBottom: 0,
                                 paddingRight: 0,
                              }}
                              onClick={() => {
                                 setShowDeleteModal(true);
                              }}
                           >
                              <i className="bi bi-trash" />
                           </Link>
                        )}
                     </div>
                  </div>
               </div>
               <Modal
                  show={showDeleteModal}
                  onHide={() => {
                     setShowDeleteModal(false);
                  }}
               >
                  <Modal.Header closeButton>
                     <Modal.Title>Delete : {ticket.context} ?</Modal.Title>
                  </Modal.Header>
                  <Modal.Footer>
                     <Button
                        variant="secondary"
                        onClick={() => {
                           setShowDeleteModal(false);
                        }}
                     >
                        Close
                     </Button>
                     <Button variant="danger" onClick={deleteTicketClick}>
                        Yes
                     </Button>
                  </Modal.Footer>
               </Modal>
            </div>
         </div>
      </>
   );
};

export default Ticket;
