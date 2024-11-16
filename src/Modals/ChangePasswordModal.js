import { default as React, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
// import { toast } from "react-toastify";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import { commonservices } from "../Common Service/CommonServices";
import { useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';

const ChangePasswordModal = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);

  const [Loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    oldPassword: "",
    confirmNewPassword: "",
    newPassword: "",
    errors: {
      oldPassword: "",
      confirmNewPassword: "",
      newPassword: "",
      ValidationRules: [
        {
          FieldName: "oldPassword",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "confirmNewPassword",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
        {
          FieldName: "newPassword",
          ValidationType: "required",
          ValidationMessage: "This Field is a required field",
        },
      ],
    },
  });

  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    if (input.newPassword !== input.confirmNewPassword) {
      return toast.error("confirm password not match with new password");
    }
    if (obj.isValid) {
      setLoading(true);
      let body = {
        oldPassword: input.oldPassword.trim(),
        newPassword: input.newPassword.trim(),
      };

      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.CHANGEPASSWORD,
          body: body,
        },
        false
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
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
            Change Password({UserData?.emailid})
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => HandleSubmit(e)}>
          <Modal.Body>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="maximum 10 digit or number"
                maxLength={10}
                value={input.oldPassword}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["oldPassword"]: e.target.value,
                  })
                }
                isInvalid={input.errors.oldPassword}
              />
              {input.errors.oldPassword && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.oldPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="maximum 10 digit or number"
                maxLength={10}
                value={input.newPassword}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["newPassword"]: e.target.value,
                  })
                }
                isInvalid={input.errors.newPassword}
              />
              {input.errors.newPassword && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.newPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="maximum 10 digit or number"
                maxLength={10}
                value={input.confirmNewPassword}
                onChange={(e) =>
                  setInput({
                    ...input,
                    ["confirmNewPassword"]: e.target.value,
                  })
                }
                isInvalid={input.errors.confirmNewPassword}
              />
              {input.errors.confirmNewPassword && (
                <Form.Control.Feedback type="invalid">
                  {input.errors.confirmNewPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>
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

export default ChangePasswordModal;
