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
import NewLoader from "../../Components/NewLoader";

const Users = () => {
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

  async function bindList() {
    setLoading(true);
    let body = {
      userId:
        UserData?.createdBy !== null ? UserData?.createdBy : UserData?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.USERS,
        body: body,
      },
      false
    );
    let response = apiResponse(false, resData, setLoading);
    if (response?.isValidate) {
      setUserList(response?.data?.data);
      let dateGrouping = {};
      response?.data?.data?.forEach((element) => {
        if (element?.createdAt) {
          let date = commonservices.getDateInFormat(element?.createdAt);
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
        url: API_URL.BASEURL + API_URL.USERS + `/${value?._id}`,
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

  function HandleDateChangeFilter(event) {
    setDatePickShow(false);

    if (event === "Last 7 Days") {
      setStartEndDate({
        startdate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        enddate: new Date(),
      });
    } else if (event === "Last 28 Days") {
      setStartEndDate({
        startdate: new Date(new Date().getTime() - 28 * 24 * 60 * 60 * 1000),
        enddate: new Date(),
      });
    } else if (event === "All time (Till - Today)") {
      setStartEndDate({
        startdate: new Date("1900-01-01"),
        enddate: new Date(),
      });
    } else if (event === "Last 30 Days") {
      setStartEndDate({
        startdate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        enddate: new Date(),
      });
    } else if (event === "Last 90 Days") {
      setStartEndDate({
        startdate: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000),
        enddate: new Date(),
      });
    } else if (event === "Last 12 Months") {
      setStartEndDate({
        startdate: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
        enddate: new Date(),
      });
    } else if (event === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      setStartEndDate({
        startdate: yesterday,
        enddate: yesterday,
      });
    } else if (event === "Tomorrow") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() + 1);
      yesterday.setHours(0, 0, 0, 0);
      setStartEndDate({
        startdate: yesterday,
        enddate: yesterday,
      });
    } else if (event === "Today") {
      setStartEndDate({
        startdate: new Date(),
        enddate: new Date(),
      });
    } else if (event === "Last Calendar Year") {
      const today = new Date();
      const year = today.getFullYear();
      setStartEndDate({
        startdate: new Date(year - 1, 0, 1),
        enddate: new Date(year, 0, 1),
      });
    } else if (event === "This Year (January - Today)") {
      const today = new Date();
      const year = today.getFullYear();
      setStartEndDate({
        startdate: new Date(year, 0, 1),
        enddate: new Date(),
      });
    } else if (event === "Custom") {
      setDatePickShow(true);
    }
  }
  
  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h4>All Users</h4>
          {UserData?.usertype !== "client" && (
            <div className="d-flex align-items-center">
              <div
                onClick={() => fnAddEditTransactions("New", null)}
                className="filter-btn me-2"
              >
                <PlusIcon />
              </div>
              {/* <OffCanvasExample
              placement="end"
              name="Filter"
              data={FilterDataList}
              FilterData={setFilterDataList}
              bindList={bindList}
            /> */}
            </div>
          )}
          {/* <div>
            <Form.Select
              onChange={(e) => HandleDateChangeFilter(e.target.value)}
              aria-label="Default select example"
            >
              {DateFilterArray.map((itemd, indexd) => (
                <option key={indexd} value={itemd}>
                  {itemd}
                </option>
              ))}
            </Form.Select>
          </div> */}
        </div>

        {DatePickShow && (
          <div>
            <DatePicker
              range
              placeholder={
                moment(dates[0]).format("YYYY/MM/DD") +
                "~" +
                moment(dates[0]).format("YYYY/MM/DD")
              }
              calendarPosition="top-left"
              value={dates}
              maxDate={new Date()}
              onChange={(dateObjects) => {
                setDates(dateObjects);
                if (dateObjects[0] && dateObjects[1]) {
                  setStartEndDate({
                    startdate: new Date(dateObjects[0]),
                    enddate: new Date(dateObjects[1]),
                  });
                }
              }}
              plugins={[<DatePanel eachDaysInRange />]}
            />
          </div>
        )}
      </div>
      <div className="my-3">
        {Loading ? (
          <NewLoader />
        ) : (
          <>
            {Object.keys(TransactionList)?.length > 0 ? (
              Object.keys(TransactionList)?.sort()
                ?.reverse()
                .map((item, index) => (
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
                                    <td className="width-75px ">
                                      <div
                                        className="pro-img"
                                        style={{
                                          color: '#fff',
                                          backgroundColor: `rgba(${Math.floor(
                                            Math.random() * 256
                                          )}, ${Math.floor(
                                            Math.random() * 256
                                          )}, ${Math.floor(
                                            Math.random() * 256
                                          )}, 0.6)`,
                                        }}
                                      >
                                        {itemE?.displayname[0]}
                                      </div>
                                    </td>
                                    <td className="width-500px">
                                      {itemE?.emailid}
                                    </td>
                                    {/* <td className="width-500px tbl-title">
                                      <p className="text-color m-0">
                                        {itemE?.displayname}
                                      </p>
                                    </td> */}
                                    {/* <td className="width-500px">
                                      {moment(itemE?.createdAt).format(
                                        "hh:mm A"
                                      )}{" "}
                                      ({moment(itemE?.createdAt).fromNow()})
                                    </td> */}
                                    <td className="width-300px tbl-title">
                                    {moment(itemE?.createdAt).format("hh:mm A")}<span> (
                                      {moment(itemE?.createdAt).fromNow()})</span>
                                  </td>

                                    <td className="width-500px text-center">
                                      {itemE?.usertype === "admin"
                                        ? "Administrator"
                                        : "User"}
                                    </td>
                                    {UserData?.usertype !== "client" && itemE?.createdBy !== null && (
                                      <td className="width-500px">
                                        <div className="d-flex     justify-content-end">
                                          {/* <span
                                            onClick={() =>
                                              fnAddEditTransactions(
                                                "Edit",
                                                itemE
                                              )
                                            }
                                            className="me-2"
                                          >
                                            <EditIcon />
                                          </span> */}
                                          <span
                                            onClick={() => {
                                              confirmAlert({
                                                title: "Confirm to Delete?",
                                                // message:
                                                //   "Are you sure to do this.",
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
        <AddEditUserModal
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

export default Users;
