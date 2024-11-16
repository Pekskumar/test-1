import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { useDispatch, useSelector } from "react-redux";
import { apiResponse } from "../../Common Service/APIResponse";
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import {
  DateFilterArray,
  StatusArray,
  commonservices,
} from "../../Common Service/CommonServices";
import AddEditTransactionsModal from "../../Modals/AddEditTransactionsModal";
import { transactionList } from "../../ReduxTookit/UserInfoSlice";
import OffCanvasExample from "../../Modals/OffCanvasExample";
import EditIcon from "../../Assets/Images/EditIcon";
import DeleteIcon from "../../Assets/Images/DeleteIcon";
import Nodata from "../../Assets/Images/Nodata.png";
import FoodIcon from "../../Assets/Images/FoodIcon";
import PlusIcon from "../../Assets/Images/PlusIcon";
import Loader from "../../Components/Loader";
import AddEditUserModal from "../../Modals/AddEditUserModal";
import AddEditTodoModal from "../../Modals/AddEditTodoModal";
import NewLoader from "../../Components/NewLoader";

const Todos = () => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  

  const [StartEndDate, setStartEndDate] = useState({
    startdate: new Date("1900-01-01"),
    enddate: new Date(),
  });
  const tableRef = useRef();
  const dispatch = useDispatch();
  const [DatePickShow, setDatePickShow] = useState(false);
  const [UserList, setUserList] = useState([]);
  const [dates, setDates] = useState([
    moment().format("YYYY/MM/DD"),
    moment().format("YYYY/MM/DD"),
  ]);
  
  const [Loading, setLoading] = useState(false);
  const [TransactionMOdalShow, setTransactionMOdalShow] = useState(false);
  const [TransactionType, setTransactionType] = useState();
  const [SelectedTransactionData, setSelectedTransactionData] = useState();
  const [TransactionList, setTransactionList] = useState({});

  async function bindList(status) {
    setLoading(true);
    let body = {
      userId:
        UserData?.createdBy !== null ? UserData?.createdBy : UserData?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.TODOLIST,
        body: body,
      },
      false
    );
    let response = apiResponse(false, resData, setLoading);
    if (response?.isValidate) {
      setUserList(response?.data?.data);
      let dateGrouping = {};
      if (status) {
        response?.data?.data
          ?.filter((f) => f.status === status)
          ?.forEach((element) => {
            if (element?.date) {
              let date = commonservices.getDateInFormat(element?.date);
              if (dateGrouping[date]) {
                dateGrouping[date].data = [
                  ...dateGrouping[date].data,
                  (dateGrouping[date].data = element),
                ];
              } else {
                dateGrouping[date] = {
                  ...dateGrouping[date],
                  data: [element],
                };
              }
            }
          });
        setTransactionList(dateGrouping);
      } else {
        response?.data?.data?.forEach((element) => {
          if (element?.date) {
            let date = commonservices.getDateInFormat(element?.date);
            if (dateGrouping[date]) {
              dateGrouping[date].data = [
                ...dateGrouping[date].data,
                (dateGrouping[date].data = element),
              ];
            } else {
              dateGrouping[date] = {
                ...dateGrouping[date],
                data: [element],
              };
            }
          }
        });
        setTransactionList(dateGrouping);
      }
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  useEffect(() => {
    bindList();
  }, []);

  function fnAddEditTransactions(type, data) {
    setTransactionType(type);
    setTransactionMOdalShow(true);
    setSelectedTransactionData(data);
  }

  async function fnDeleteExpense(value) {
    let body = {
      userId: UserData?._id,
      id: value?._id,
    };
    let resData = await apiCall(
      {
        method: "DELETE",
        url: API_URL.BASEURL + API_URL.TODOS + `/${value?._id}`,
        body: body,
      },
      false
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      bindList();
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  async function fnOnchangeType(event, data) {
    // const { value, checked } = event.target;
    let body = {
      userId: UserData?._id,
      status: data?.status === "Complete" ? "Incomplete" : "Complete",
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.TODOS + `/${data?._id}`,
        body: body,
      },
      false
    );
    let response = apiResponse(true, resData, setLoading);
    if (response?.isValidate) {
      bindList();
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }
  function HandleStatusChangeFilter(value) {
    bindList(value);
  }

  
  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="m-0">To Do List</h4>
          <div className="d-flex">
           
            <div>
              <Form.Select
                onChange={(e) => HandleStatusChangeFilter(e.target.value)}
                aria-label="Default select example"
              >
                <option>All</option>
                {StatusArray.map((itemd, indexd) => (
                  <option key={indexd} value={itemd}>
                    {itemd}
                  </option>
                ))}
              </Form.Select>
            </div>
            {UserData?.usertype !== "client" && (
              <div
                onClick={() => fnAddEditTransactions("New", null)}
                className="filter-btn ms-3"
              >
                <PlusIcon />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-3">
        {Loading ? (
          <NewLoader />
        ) : (
          <>
            {Object.keys(TransactionList)?.length > 0 ? (
              Object.keys(TransactionList)?.map((item, index) => (
                  <Row key={index}>
                    <Col className="expense-detail">
                      <h5 className="box-title-color">
                        {commonservices.getDaysName(item)}
                      </h5>
                      <div className="expense-detail-one my-4">
                        <Table striped responsive className="m-0">
                          <tbody>
                            {TransactionList[item]?.data.length > 0 &&
                              TransactionList[item]?.data.map(
                                (itemE, indexE) => (
                                  <tr key={indexE}>
                                    <td className="width-30px">
                                      <Form.Check
                                        inline
                                        checked={itemE?.status === "Complete"}
                                        disabled={
                                          UserData?.usertype === "client"
                                            ? true
                                            : false
                                        }
                                        name="group3"
                                        type="checkbox"
                                        id={itemE?.status}
                                        value={itemE?.status}
                                        onChange={(e) =>
                                          fnOnchangeType(e, itemE)
                                        }
                                      />
                                    </td>
                                    <td className="width-500px tbl-title">
                                      <p
                                        className={
                                          itemE?.status === "Complete"
                                            ? "text-color m-0 strike-text"
                                            : "text-color m-0"
                                        }
                                        // className="text-color m-0"
                                      >
                                        {itemE?.title}
                                      </p>
                                      <span>
                                        {moment(itemE?.date).format(
                                          "hh:mm A, DD-MM-yyyy"
                                        )}
                                      </span>
                                    </td>
                                    <td className="width-500px text-start">
                                      {itemE?.description}
                                    </td>
                                    {UserData?.usertype !== "client" && (
                                      <td className="width-100px">
                                        <div className="d-flex     justify-content-end">
                                          <span
                                            onClick={() =>
                                              fnAddEditTransactions(
                                                "Edit",
                                                itemE
                                              )
                                            }
                                            className="me-2"
                                          >
                                            <EditIcon />
                                          </span>
                                          {UserData?._id !== itemE?._id && (
                                            <span
                                              onClick={() => {
                                                confirmAlert({
                                                  title: "Confirm to Delete?",
                                                  // message: "Are you sure to do this.",
                                                  buttons: [
                                                    {
                                                      label: "Yes",
                                                      onClick: () =>
                                                        fnDeleteExpense(itemE),
                                                    },
                                                    {
                                                      label: "No",
                                                    },
                                                  ],
                                                });
                                              }}
                                            >
                                              <DeleteIcon />
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                ))
            ) : (
              <div className="text-center nodata-img">
                <img src={Nodata} alt="nodata" />
              </div>
            )}
          </>
        )}
      </div>
      {TransactionMOdalShow && (
        <AddEditTodoModal
          type={TransactionType}
          show={TransactionMOdalShow}
          UserList={UserList}
          data={SelectedTransactionData}
          bindList={bindList}
          onHide={() => setTransactionMOdalShow(false)}
        />
      )}
    </>
  );
};

export default Todos;
