import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-multi-date-picker";
import Nodata from "../../Assets/Images/Nodata.png";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { transactionList } from "../../ReduxTookit/UserInfoSlice";
import { apiResponse } from "../../Common Service/APIResponse";
import { apiCall } from "../../Common Service/AxiosService";
import { API_URL } from "../../Common Service/APIRoute";
import { Col, Form, Row } from "react-bootstrap";
import {
  DateFilterArray,
  commonservices,
} from "../../Common Service/CommonServices";
import DoughnutChart from "../../Components/DoughnutChart";
import CardCountComponent from "../../Components/CardCountComponent";
import GradientLineChart from "../../Components/GradientLineChart";
import BarchartComponent from "../../Components/BarchartComponent";
import RecentTarnsactionTable from "../../Components/RecentTarnsactionTable";
import Loader from "../../Components/Loader";
import NewLoader from "../../Components/NewLoader";

const Home = () => {
  const [DatePickShow, setDatePickShow] = useState(false);
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  const [CategoryObject, setCategoryObject] = useState({});
  const [BarchartObject, setBarchartObject] = useState({});
  const [RecentTransactionList, setRecentTransactionList] = useState([]);
  // const TLList = useSelector((state) => state.userinfo.TransactionList);
  const [TotalCounts, setTotalCounts] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    transactions: 0,
    users: 0,
    todoCount: 0
  });
  const [StartEndDate, setStartEndDate] = useState({
    startdate: null,
    enddate: null,
  });
  const [dates, setDates] = useState([
    moment().format("YYYY/MM/DD"),
    moment().format("YYYY/MM/DD"),
  ]);
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  // console.log("TLList home ::", TLList);

  async function bindList() {
    setLoading(true);
    let body = {
      userId:
        UserData?.createdBy !== null ? UserData?.createdBy : UserData?._id,
    };
    let resData = await apiCall(
      {
        method: "POST",
        url: API_URL.BASEURL + API_URL.EXPENSESLIST,
        body: body,
      },
      false
    );
    let response = apiResponse(false, resData, setLoading);
    if (response?.isValidate) {
      let temp;
      if (StartEndDate.startdate && StartEndDate.enddate) {
        temp = response?.data?.data?.filter((f) =>
          moment(f.date).isBetween(
            StartEndDate.startdate,
            StartEndDate.enddate,
            "day",
            "[]"
          )
        );
      } else {
        temp = response?.data?.data;
      }
      setRecentTransactionList(temp);
      let totalincomes = 0;
      let totalexpenses = 0;
      temp.forEach((element) => {
        if (element?.type === "Income") {
          totalincomes += element?.amount;
        } else {
          totalexpenses += element?.amount;
        }
      });

      setTotalCounts((prevState) => ({
        ...prevState,
        transactions: temp?.length,
        income: totalincomes,
        expenses: totalexpenses,
        balance: totalincomes - totalexpenses,
      }));

      let catPieObj = {};
      temp.forEach((element) => {
        if (catPieObj[element.category]) {
          catPieObj[element.category].total =
            parseInt(catPieObj[element.category].total) +
            parseInt(element.amount);
        } else {
          catPieObj[element.category] = {
            ...catPieObj[element.category],
            total: parseInt(element.amount),
          };
        }
      });
      setCategoryObject(catPieObj);

      //bar chart code
      let barObject = {};
      temp.forEach((element1) => {
        let date = commonservices.getDateInFormat(element1?.date);
        if (!barObject[date]) {
          barObject[date] = {};
        }
        if (!barObject[date][element1.type]) {
          barObject[date][element1.type] = [];
        }
        barObject[date][element1.type].push(
          element1.amount ? element1.amount : 0
        );
      });
      setBarchartObject(barObject);
    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  async function UserList() {

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
    let response = apiResponse(false, resData);
    if (response?.isValidate) {
      setTotalCounts((prevState) => ({
        ...prevState,
        users: response?.data?.data?.length,
      }));

    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }

  async function ToDoList() {

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
    let response = apiResponse(false, resData);
    if (response?.isValidate) {
      let temp = response?.data?.data?.filter((f) => f.status === "Incomplete")
      setTotalCounts((prevState) => ({
        ...prevState,
        todoCount: temp?.length,
      }));

    }
    if (!response?.isValidate) {
      console.log("Error  getting country list", response);
    }
  }
  function HandleDateChangeFilter(event) {
    setDatePickShow(false);
    // setSelectedDateFilter(event);

    const now = new Date();
    let startdate = null;
    let enddate = new Date(now);

    if (event === "Last 2 Days") {
      startdate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 3 Days") {
      startdate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 5 Days") {
      startdate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 10 Days") {
      startdate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 7 Days") {
      startdate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 28 Days") {
      startdate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    } else if (event === "All time") {
      startdate = new Date("1900-01-01");
    } else if (event === "Last 30 Days") {
      startdate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 90 Days") {
      startdate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (event === "Last 12 Months") {
      startdate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else if (event === "Yesterday") {
      startdate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      startdate.setHours(0, 0, 0, 0);
      enddate = new Date(startdate);
    } else if (event === "Tomorrow") {
      startdate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      startdate.setHours(0, 0, 0, 0);
      enddate = new Date(startdate);
    } else if (event === "Today") {
      startdate = new Date(now);
      startdate.setHours(0, 0, 0, 0);
      enddate = new Date(startdate);
    } else if (event === "Last Calendar Year") {
      const year = now.getFullYear();
      startdate = new Date(year - 1, 0, 1);
      enddate = new Date(year, 0, 1);
    } else if (event === "This Year (January - Today)") {
      const year = now.getFullYear();
      startdate = new Date(year, 0, 1);
    } else if (event === "Custom") {
      setDatePickShow(true);
    }

    setStartEndDate({
      ...StartEndDate,
      startdate,
      enddate,
    });
  }
  useEffect(() => {
    UserList()
    ToDoList()
  }, []);
  useEffect(() => {
    bindList();
  }, [StartEndDate]);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Home</h4>
        <div>
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
      </div>
      <div className="pt-3">
        <CardCountComponent Loading={Loading} data={TotalCounts} />
      </div>
      <div className="cardcount-body p-4 mb-3">
        <h5>Total Expenses</h5>
        {Loading ? (
          <NewLoader />
        ) : Object.keys(CategoryObject)?.length > 0 ? (
          <DoughnutChart data={CategoryObject} />
        ) : (
          <div className="text-center nodata-img">
            <img src={Nodata} alt="nodata" />
          </div>
        )}
      </div>
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <div className="cardcount-body p-4">
            <h5>Account Balance</h5>
            {Loading ? (
               <NewLoader />
            ) : Object.keys(BarchartObject)?.length > 0 ? (
              <GradientLineChart data={BarchartObject} />
            ) : (
              <div className="text-center nodata-img" >
                <img src={Nodata} alt="nodata" />
              </div>
            )}
          </div>
        </Col>
        <Col md={6} className="mb-3">
          <div className="cardcount-body p-4">
            <h5>Expenses - Income</h5>
            {Loading ? (
               <NewLoader />
            ) : Object.keys(BarchartObject)?.length > 0 ? (
              <BarchartComponent data={BarchartObject} />
            ) : (
              <div className="text-center nodata-img">
                <img src={Nodata} alt="nodata" />
              </div>
            )}
          </div>
        </Col>
        <Col md={12}>
          <div className="cardcount-body p-4">
            <h5>Recent Transaction</h5>
            {Loading ? (
               <NewLoader />
            ) : RecentTransactionList?.length > 0 ? (
              <RecentTarnsactionTable data={RecentTransactionList} />
            ) : (
              <div className="text-center nodata-img">
                <img src={Nodata} alt="nodata" />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Home;
