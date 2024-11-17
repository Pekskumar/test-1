import { default as React, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { apiResponse } from "../Common Service/APIResponse";
import { API_URL } from "../Common Service/APIRoute";
import { apiCall } from "../Common Service/AxiosService";
import {
  commonservices
} from "../Common Service/CommonServices";
// import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { useRef } from "react";

import { Row } from "react-bootstrap";
import UserPlaceholder from '../Assets/Images/userimages.jpg';

const AddEditUserModal = (props) => {
  const UserData = useSelector((state) => state.userinfo.UserInfo);

  let dispatch = useDispatch();
  const inputFile = useRef();
  // const [Loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    emailid: "",
    displayname: "",
    password: "",
    profilepic: "",
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
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return toast.error("Only PNG and JPEG images are allowed.");
    }

    // Image compression options
    const options = {
      maxSizeMB: 0.05, // 50 KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setInput({
        ...input,
        profilepic: compressedFile,
      });
      setFile(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Image compression failed:", error);
      toast.error("Image compression failed. Please try again.");
    }
  };
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
        profilepic: input.profilepic,
        createdBy: UserData._id,
      };
      if (props?.type === "Edit") {
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.USERS + `/${props?.data?._id}`,
            body: body,
          },
          true
        );
      } else {
        resData = await apiCall(
          {
            method: "POST",
            url: API_URL.BASEURL + API_URL.CREATECLIENTUSER,
            body: body,
          },
          true
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

  // useEffect(() => {
  //   if (props?.data) {
  //     setInput({
  //       ...input,
  //       ["emailid"]: props?.data?.emailid,
  //       ["displayname"]: props?.data?.displayname,
  //       ["createdAt"]: new Date(),
  //       ["password"]: "123456",
  //     });
  //   }
  // }, [props]);

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
            <Row>
              <Form.Group className="mb-3" controlId="formProfilePic">
                <div className="file-input">
                  <input
                    type="file"
                    className="form-control d-none"
                    id="profileImg"
                    ref={inputFile}
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                  />
                  <label className="file-input__label" htmlFor="profileImg">
                    {file ? (
                      <img
                        src={file}
                        alt={input.profilepic ? file : UserPlaceholder}
                      />
                    ) : (
                      <img
                        src={input.profilepic || UserPlaceholder}
                        alt={input.profilepic ? file : UserPlaceholder}
                      />
                    )}
                  </label>
                </div>
              </Form.Group>
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
                  placeholder="Use your any email address"
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
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="maximum 10 digit or number"
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
            </Row>

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
