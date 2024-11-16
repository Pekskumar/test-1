import { default as React, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import {
  PaymentModeArray,
  StatusArray,
  TransactionCategoryArray,
  TransactionTypeArray,
  commonservices,
} from "../Common Service/CommonServices";
import { userInfo, userToken } from "../ReduxTookit/UserInfoSlice";

const AddEditTodoModal = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  let dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    date: new Date(),
    description: "",
    status: StatusArray[0],
    errors: {
      title: "",
      date: "",
      description: "",
      status: "",
      ValidationRules: [
        {
          FieldName: "status",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "title",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "date",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
      ],
    },
  });

  useEffect(() => {
    if (props?.data) {
      setInput({
        ...input,
        ["title"]: props?.data?.title,
        ["description"]: props?.data?.description,
        ["date"]: props?.data?.date,
        ["status"]: props?.data?.status,
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
      let body = {
        userId: UserData._id,
        title: input.title.trim(),
        date: input.date,
        description: input.description.trim(),
        status: input.status,
      };
      if (props?.type === "Edit") {
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.TODOS + `/${props?.data?._id}`,
            body: body,
          },
          false
        );
      } else {
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.TODOS,
            body: body,
          },
          false
        );
      }

      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        props?.bindList();
        props.onHide()
        // dispatch(userToken(response?.data?.data?.token));
        // dispatch(userInfo(response?.data?.data?.user));
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
            {props?.type} Task
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => HandleSubmit(e)}>
        <Modal.Body>
        
            <Row>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="title"
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
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="description"
                    maxLength={146}
                    value={input.description}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        ["description"]: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
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
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Select Status</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    value={input.status}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        status: e.target.value,
                      })
                    }
                  >
                    {StatusArray.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            
         
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={Loading}
              type="submit"
            >
              {Loading
                ? "Loading..."
                : props?.type === "Edit"
                ? "Edit Task"
                : "Add Task"}
            </Button>
          </Modal.Footer>
          </Form>
      </Modal>
    </>
  );
};

export default AddEditTodoModal;
