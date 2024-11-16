import { default as React, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import toast, { Toaster } from 'react-hot-toast';
import {
  PaymentModeArray,
  TransactionCategoryArray,
  TransactionTypeArray,
  commonservices,
} from "../Common Service/CommonServices";
import { userInfo, userToken } from "../ReduxTookit/UserInfoSlice";
// import { toast } from "react-toastify";

const AddEditUserModal = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);
  let dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    emailid: "",
    displayname: "",
    password: "",
    errors: {
      emailid: "",
      displayname: "",
      password: "",
      ValidationRules: [
        {
          FieldName: "password",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "emailid",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "emailid",
          ValidationType: "email",
          ValidationMessage: "Incorrect email address",
        },
        {
          FieldName: "displayname",
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
        ["emailid"]: props?.data?.emailid,
        ["displayname"]: props?.data?.displayname,
        ["createdAt"]: new Date(),
        ["password"]: "123456",
      });
    }
  }, [props]);
  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    let existingEmail = props?.UserList?.filter(
      (f) => f.emailid === input.emailid
    );
    if (existingEmail?.length > 0) {
      return toast.error('User Already exist.')
    }
    if (obj.isValid) {
      setLoading(true);
      let resData = "";
      let body = {
        emailid: input?.emailid.trim(),
        password: input?.password.trim(),
        displayname: input?.displayname.trim(),
        createdBy: UserData._id,
      };
      if (props?.type === "Edit") {
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.USERS + `/${props?.data?._id}`,
            body: body,
          },
          false
        );
      } else {
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.CREATECLIENTUSER,
            body: body,
          },
          false
        );
      }

      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        props?.bindList();
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
            {props?.type} User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => HandleSubmit(e)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                maxLength={146}
                value={input.displayname}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["displayname"]: e.target.value,
                  })
                }
                isInvalid={input.errors.displayname}
              />
              {input.errors.displayname && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.displayname}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                maxLength={146}
                value={input.emailid}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["emailid"]: e.target.value,
                  })
                }
                isInvalid={input.errors.emailid}
              />
              {input.errors.emailid && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.emailid}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                disabled={props?.type === "Edit"}
                placeholder="Enter only 10 digit or number"
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
            </Form.Group>
            <Button
              variant="primary w-100 my-4"
              disabled={Loading}
              type="submit"
            >
              {Loading
                ? "Loading..."
                : props?.type === "Edit"
                ? "Edit User"
                : "New User"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddEditUserModal;
