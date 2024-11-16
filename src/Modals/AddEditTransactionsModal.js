import { default as React, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import {
  PaymentModeArray,
  TransactionCategoryArray,
  TransactionTypeArray,
  commonservices,
} from "../Common Service/CommonServices";

const AddEditTransactionsModal = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  let dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    userId: "",
    title: "",
    amount: "",
    date: new Date(),
    description: "",
    type: TransactionTypeArray[0],
    category: TransactionCategoryArray[0],
    paymentMode: PaymentModeArray[0],
    errors: {
      userId: "",
      title: "",
      amount: "",
      date: "",
      description: "",
      type: "",
      category: "",
      paymentMode: "",
      ValidationRules: [
        {
          FieldName: "title",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "amount",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
      ],
    },
  });

  useEffect(() => {
    if (props?.data) {
      debugger
      setInput({
        ...input,
        ["userId"]: props?.data?.userId,
        ["title"]: props?.data?.title,
        ["amount"]: props?.data?.amount,
        ["date"]: new Date(props?.data?.date),
        ["description"]: props?.data?.description,
        ["type"]: props?.data?.type,
        ["category"]: props?.data?.category,
        ["paymentMode"]: props?.data?.paymentMode,
      });
    }
  }, [props]);

  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    if (obj.isValid) {
      setLoading(true);
      let resData = "";
      let body = {};
      if (props?.type === "Edit") {
        body = {
          userId: UserData?._id,
          id: props?.data?._id,
          title: input?.title?.trim(),
          amount: input?.amount,
          date: input?.date,
          description: input?.description?.trim(),
          type: input?.type,
          category: input?.category,
          paymentMode: input?.paymentMode,
        };
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.EXPENSES + `/${props?.data?._id}`,
            body: body,
          },
          false
        );
      } else {
        body = {
          userId: UserData?._id,
          title: input?.title?.trim(),
          amount: input?.amount,
          date: input?.date,
          description: input?.description?.trim(),
          type: input?.type,
          category: input?.category,
          paymentMode: input?.paymentMode,
          createdBy:UserData?._id
        };
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.EXPENSES,
            body: body,
          },
          false
        );
      }

      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        props.onHide();
        props.bindList();
      }
      if (!response?.isValidate) {
        console.log("Error  getting country list", response);
      }
    }
  }

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props?.type} Transaction
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => HandleSubmit(e)}>
          <Modal.Body>
            <div className=" ">
              <Row>
              {TransactionTypeArray.map((itemR, indexR) => (
                <>
                <Col md={6}>
                  <div className="radio-btn-wrap-one">
                    <Form.Check
                      inline
                      checked={input.type === itemR}
                      label={itemR}
                      name="group1"
                      type="radio"
                      id={itemR}
                      value={itemR}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          ["type"]: e.target.value,
                        })
                      }
                    />
                    {/* <label className="me-2">
                      <input
                        key={indexR}
                        type="radio"
                        id={itemR}
                        name="fav_language"
                        value={itemR}
                        checked={input.type === itemR}
                        // onChange={fnRadioHandle}
                        onChange={(e) =>
                          setInput({
                            ...input,
                            ["type"]: e.target.value,
                          })
                        }
                      />
                      <label className="p-0" for={itemR}>
                        {itemR}
                      </label>
                      <div className="checkmark-radio"></div>
                    </label> */}
                  </div>
                  </Col>
                </>
              ))}
              </Row>
            </div>
            <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                maxLength={146}
                value={input.title}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["title"]: e.target.value,
                  })
                }
                isInvalid={input.errors.title}
              />
              {input.errors.title && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.title}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Enter Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="₹"
                    maxLength={146}
                    value={input.amount}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        ["amount"]: e.target.value,
                      })
                    }
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    isInvalid={input.errors.amount}
                  />
                  {input.errors.amount && (
                    <Form.Control.Feedback type="invalid">
                      {input.errors.amount}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Select Category</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    value={input.category}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        category: e.target.value,
                      })
                    }
                  >
                    {TransactionCategoryArray.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Label>Choose Date & Time</Form.Label>
                <input
                  type="datetime-local"
                  value={commonservices.getDateTimeFormat(input.date)}
                  className="form-control"
                  // max={commonservices.getDateTimeFormat(new Date())}
                  onChange={(e) => {
                    setInput({
                      ...input,
                      date: e.target.value,
                    });
                  }}
                />
              </Col>
              <Col md={6}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Descriptions</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    maxLength={146}
                    value={input.description}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        ["description"]: e.target.value,
                      })
                    }
                    isInvalid={input.errors.description}
                  />
                  {input.errors.description && (
                    <Form.Control.Feedback type="invalid">
                      {input.errors.description}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="radio-btn-wrap my-3">
              <Row>
              {PaymentModeArray.map((itemR, indexR) => (
                <>
                <Col md={6}>
                  <div className="radio-btn-wrap-one">
                    <Form.Check
                      inline
                      checked={input.paymentMode === itemR}
                      label={itemR}
                      name="group2"
                      type="radio"
                      id={itemR}
                      value={itemR}
                      onChange={(e) =>
                        setInput({
                          ...input,
                          ["paymentMode"]: e.target.value,
                        })
                      }
                    />
                    {/* <label className="me-2">
                      <input
                        key={indexR}
                        type="radio"
                        id={itemR}
                        name="fav_language1"
                        value={itemR}
                        checked={input.paymentMode === itemR}
                        // onChange={fnPaymenyHandle}
                        onChange={(e) =>
                          setInput({
                            ...input,
                            paymentMode: e.target.value,
                          })
                        }
                      />
                      <label className="p-0" for={itemR}>
                        {itemR}
                      </label>
                      <div className="checkmark-radio"></div>
                    </label> */}
                  </div>
                  </Col>
                </>
              ))}
              </Row>
            </div>

            {/*<Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="*****"
                maxLength={10}
                value={input.password}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["password"]: e.target.value,
                  })
                }
                isInvalid={input.errors.password}
              />
              {input.errors.password && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group> */}
            {/* <Button
              variant="primary w-100 my-4"
              disabled={Loading}
              type="submit"
            >
              {Loading ? "Loading..." : "Login"}
            </Button> */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" disabled={Loading} type="submit">
              {Loading ? "Loading..." : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddEditTransactionsModal;
