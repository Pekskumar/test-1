import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  DateFilterArray,
  PaymentModeArray,
  TransactionCategoryArray,
  TransactionTypeArray,
  commonservices,
} from "../Common Service/CommonServices";
import moment from "moment";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { useDispatch, useSelector } from "react-redux";
import { transactionList } from "../ReduxTookit/UserInfoSlice";
import FiilterIcon from "../Assets/Images/FiilterIcon";

function OffCanvasExample(props) {
  const TLList = useSelector((state) => state.userinfo.TransactionList);
  let dispatch = useDispatch();
  const [selectedDateFilter, setSelectedDateFilter] = useState("select");
  const [NewCategoryArray, setNewCategoryArray] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  useEffect(() => {
    if (TransactionCategoryArray) {
      let temp = TransactionCategoryArray.map((element) => ({
        value: element,
        label: element,
      }));
      setNewCategoryArray(temp);
    }
  }, []);

  const [dates, setDates] = useState([
    moment().format("YYYY/MM/DD"),
    moment().format("YYYY/MM/DD"),
  ]);
  const [StartEndDate, setStartEndDate] = useState({
    startdate: null,
    enddate: null,
    type: [],
    paymentmode: [],
    category: [],
    min: "",
    max: "",
  });
  const [show, setShow] = useState(false);
  const [DatePickShow, setDatePickShow] = useState(false);
  const handleToggle = () => setShow(!show);
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
    if (props?.data) {
      let temp = props?.data?.filter(
        (f) =>
          (!StartEndDate.startdate ||
            moment(f.date).isBetween(
              StartEndDate.startdate,
              StartEndDate.enddate,
              "day",
              "[]"
            )) &&
          (StartEndDate.type.length === 0 ||
            (StartEndDate.type && StartEndDate.type.includes(f.type))) &&
          (StartEndDate.paymentmode.length === 0 ||
            (StartEndDate.paymentmode &&
              StartEndDate.paymentmode.includes(f.paymentMode))) &&
          (StartEndDate.category.length === 0 ||
            (StartEndDate.category &&
              StartEndDate.category.includes(f.category))) &&
          (!StartEndDate.min ||
            parseInt(StartEndDate.min) <= parseInt(f.amount)) &&
          (!StartEndDate.max ||
            parseInt(StartEndDate.max) >= parseInt(f.amount))
      );
      let dateGrouping = {};
      temp?.forEach((element) => {
        if (element?.date) {
          let date = commonservices.getDateInFormat(element?.date);
          if (dateGrouping[date]) {
            dateGrouping[date].data.push(element);
          } else {
            dateGrouping[date] = { data: [element] };
          }
        }
      });
      dispatch(transactionList(dateGrouping));
    }
  }, [StartEndDate]);

  function fnOnchangeType(event) {
    const { value, checked } = event.target;
    let updatedType = [...StartEndDate.type];
    if (checked) {
      updatedType.push(value);
    } else {
      updatedType = updatedType.filter((type) => type !== value);
    }
    setStartEndDate({
      ...StartEndDate,
      type: updatedType,
    });
  }

  function fnOnchangePaymentMode(event) {
    const { value, checked } = event.target;
    let updatedMode = [...StartEndDate.paymentmode];
    if (checked) {
      updatedMode.push(value);
    } else {
      updatedMode = updatedMode.filter((type) => type !== value);
    }
    setStartEndDate({
      ...StartEndDate,
      paymentmode: updatedMode,
    });
  }

  function fnOnchangeCategory(selectedOptions) {
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedCategory(selectedOptions);
    setStartEndDate({
      ...StartEndDate,
      category: selectedCategories,
    });
  }

  return (
    <>
      {/* <Button variant="primary" onClick={handleToggle} className="me-2">
        <FiilterIcon />
      </Button> */}
      <div className="filter-btn" onClick={handleToggle}>
        <FiilterIcon />
      </div>
      <Offcanvas show={show} onHide={handleToggle} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <label className="mb-2">Select Date range</label>
          <Form.Select
            onChange={(e) => HandleDateChangeFilter(e.target.value)}
            aria-label="Default select example"
            value={selectedDateFilter}
          >
            <option value="select">select</option>
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
                  moment(dates[1]).format("YYYY/MM/DD")
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
          <div className="my-4">
            <label className="mb-2">Category</label>
            <Select
            placeholder='Select'
              options={NewCategoryArray}
              isMulti
              value={selectedCategory}
              onChange={fnOnchangeCategory}
            />
          </div>
          <div className="">
            <label className="mb-2">Type</label>
            <Row>
              {TransactionTypeArray.map((itemR, indexR) => (
                // <label className="me-2" key={indexR}>
                //   <input
                //     type="checkbox"
                //     id={itemR}
                //     name="fav_language"
                //     value={itemR}
                //     checked={StartEndDate.type?.includes(itemR)}
                //     onChange={fnOnchangeType}
                //   />
                //   <label className="p-0" htmlFor={itemR}>
                //     {itemR}
                //   </label>
                //   <div className="checkmark-radio"></div>
                // </label>
                <Col md={6}>
                  <Form.Check
                    inline
                    checked={StartEndDate.type?.includes(itemR)}
                    label={itemR}
                    name="group3"
                    type="checkbox"
                    id={itemR}
                    value={itemR}
                    onChange={fnOnchangeType}
                  />
                </Col>
              ))}
            </Row>
          </div>
          <div className="my-3">
            <label className="mb-2">Payment Mode</label>
            <Row>
              {PaymentModeArray.map((itemR, indexR) => (
                // <label className="me-2" key={indexR}>
                //   <input
                //     type="checkbox"
                //     id={itemR}
                //     name="fav_language1"
                //     value={itemR}
                //     checked={StartEndDate.paymentmode?.includes(itemR)}
                //     onChange={fnOnchangePaymentMode}
                //   />
                //   <label className="p-0" htmlFor={itemR}>
                //     {itemR}
                //   </label>
                //   <div className="checkmark-radio"></div>
                // </label>
                <Col md={6}>
                  <Form.Check
                    inline
                    checked={StartEndDate.paymentmode?.includes(itemR)}
                    label={itemR}
                    name="group3"
                    type="checkbox"
                    id={itemR}
                    value={itemR}
                    onChange={fnOnchangePaymentMode}
                  />
                </Col>
              ))}
            </Row>
          </div>
          <div className="my-4">
            <label className="mb-2">Amount</label>
            <div className="d-flex">
              <Row>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Min</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Amount"
                      maxLength={146}
                      value={StartEndDate.min}
                      onChange={(e) =>
                        setStartEndDate({
                          ...StartEndDate,
                          min: e.target.value,
                        })
                      }
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Max</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Amount"
                      maxLength={146}
                      value={StartEndDate.max}
                      onChange={(e) =>
                        setStartEndDate({
                          ...StartEndDate,
                          max: e.target.value,
                        })
                      }
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvasExample;
