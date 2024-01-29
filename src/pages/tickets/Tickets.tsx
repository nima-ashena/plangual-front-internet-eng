import { time } from 'console';
import { useContext, useEffect, useState } from 'react';
import { Button, Form, Modal, Pagination, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addTicketApi, getTicketsApi } from '../../api/ticket.service';
import PaginationN, {
   generatePaginationItems,
} from '../../components/pagination/Pagination';
import Ticket from './components/Ticket';
import { IPaginationItem } from '../../interface/common.interface';
import { ITicket, ITicketFilter } from '../../interface/ticket.interface';
import { UserContext } from '../../context/common';
import { getUsersApi } from '../../api/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Tickets = () => {
   const [loading, setLoading] = useState(true);
   const TicketsTypes = [
      { name: 'Pulse', value: 'Tweet' },
      { name: 'Conclusion', value: 'Motto' },
   ];

   const limit = 12;
   const [tickets, setTickets] = useState<ITicket[]>([]);
   const [render, setRender] = useState<boolean>(false);
   const [searchModal, setSearchModal] = useState<boolean>(false);

   const [filter, setFilter] = useState<ITicketFilter>({
      query: '',
      sort: '-created_at',
      type: '',
      user: '',
   });

   const primaryData = { context: '', type: TicketsTypes[0].value };
   const [ticket, setTicket] = useState<ITicket>(primaryData);
   const [pages, setPages] = useState<number>(1);
   const [addTicketModal, setAddTicketModal] = useState(false);

   const [paginationPage, setPaginationPage] = useState<number>(1);
   const [paginationItems, setPaginationItems] = useState<IPaginationItem[]>(
      [],
   );

   const { users } = useContext(UserContext);
   // const [sort, setSort] = useState<string>('-created_at');

   useEffect(() => {
      getTicketsApi(
         (isOk, result) => {
            if (isOk) {
               setTickets(result.tickets);
               setPages(result.responseFilter.pages);
               setPaginationItems(
                  generatePaginationItems(
                     result.responseFilter.pages,
                     paginationPage,
                  ),
               );
               setLoading(false);
            } else {
               console.log(result.message);
            }
         },
         [
            { name: 'sort', value: filter.sort },
            { name: 'limit', value: limit },
            { name: 'page', value: paginationPage },
            { name: 'query', value: filter.query },
            { name: 'type', value: filter.type },
            { name: 'user', value: filter.user },
         ],
      );
   }, [paginationPage, render]);

   const addTicketClick = () => {
      if (ticket.context === '') return toast.warn('Please fill context');
      if (ticket.type === '') return toast.warn('Please select type');

      addTicketApi(ticket, (isOk, result) => {
         if (isOk) {
            setAddTicketModal(false);
            setTicket(primaryData);
            setRender(!render);
         } else {
            console.log(result.message);
            toast.error(result.response.data.message);
         }
      });
   };

   return (
      <>
         <div className="container">
            <button
               className="btn btn-lg btn-outline-info w-100 my-2"
               onClick={() => {
                  setSearchModal(true);
               }}
            >
               Enable Filter...
            </button>

            <button
               className="btn btn-info mb-2 w-100 mt-2"
               onClick={() => {
                  setAddTicketModal(true);
               }}
            >
               <FontAwesomeIcon icon={faPlus} />
               Add Pulse
            </button>

            {loading && (
               <Button className="w-100 py-3" variant="primary" disabled>
                  <Spinner
                     className="mx-2"
                     as="span"
                     animation="grow"
                     size="sm"
                     role="status"
                     aria-hidden="true"
                  />
                  Loading...
               </Button>
            )}

            <div className="col-lg-8">
               {tickets.length === 0 && (
                  <div className="alert alert-warning" role="alert">
                     There isn't any ticket
                  </div>
               )}
               {tickets.map(item => (
                  <Ticket
                     ticket={item}
                     render={render}
                     setRender={setRender}
                     key={item._id}
                  />
               ))}
            </div>

            <div className="my-4 d-flex justify-content-center">
               <PaginationN
                  page={paginationPage}
                  setPage={setPaginationPage}
                  pages={pages}
                  paginationItems={paginationItems}
                  setPaginationItems={setPaginationItems}
               />
            </div>

            <Modal
               show={addTicketModal}
               onHide={() => {
                  setAddTicketModal(false);
               }}
            >
               <Modal.Header closeButton>
                  <Modal.Title>Adding Pulse</Modal.Title>
               </Modal.Header>
               <Modal.Body className="pb-3">
                  <Form>
                     <Form.Group className="mb-3">
                        <div className="mb-3">
                           <label className="form-label">
                              Context (*required)
                           </label>
                           <textarea
                              style={{ direction: 'rtl' }}
                              className="form-control"
                              onChange={e => {
                                 setTicket({
                                    ...ticket,
                                    context: e.target.value,
                                 });
                              }}
                              value={ticket.context}
                              rows={5}
                           />
                        </div>
                     </Form.Group>
                     <Form.Group>
                        <label className="form-label">Type:</label>
                        <select
                           className="form-select mb-3"
                           aria-label="Default select example"
                           onChange={e => {
                              setTicket({ ...ticket, type: e.target.value });
                           }}
                        >
                           {TicketsTypes.map(item => {
                              return (
                                 <option value={item.value}>{item.name}</option>
                              );
                           })}
                        </select>
                     </Form.Group>
                  </Form>
               </Modal.Body>
               <Modal.Footer className="pt-0">
                  <Button
                     className="w-100"
                     variant="danger"
                     onClick={addTicketClick}
                  >
                     Add
                  </Button>
               </Modal.Footer>
            </Modal>

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
                     <label className="form-label">Type:</label>
                     <select
                        className="form-select mb-3"
                        aria-label="Default select example"
                        value={filter.type}
                        onChange={e => {
                           setFilter({ ...filter, type: e.target.value });
                        }}
                     >
                        <option value={''}>All Types</option>
                        {TicketsTypes.map(item => {
                           return <option value={item.value}>{item.name}</option>;
                        })}
                     </select>
                     <label className="form-label">User</label>
                     <select
                        className="form-select mb-3"
                        aria-label="Default select example"
                        value={filter.user}
                        onChange={e => {
                           setFilter({ ...filter, user: e.target.value });
                        }}
                     >
                        <option value={''}>All</option>
                        {users.map((item, index) => (
                           <option value={item._id}>{item.username}</option>
                        ))}
                     </select>
                     <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        onClick={e => {
                           e.preventDefault();
                           setSearchModal(false);
                           setRender(!render);
                           console.log(filter.user);
                        }}
                     >
                        Search
                     </button>
                  </form>
               </Modal.Body>
            </Modal>
         </div>
      </>
   );
};

export default Tickets;
