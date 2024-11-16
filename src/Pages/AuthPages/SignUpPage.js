import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";

import { apiResponse } from "../../Common Service/APIResponse";
import UserPlaceholder from '../../Assets/Images/userimages.jpg'
import { API_URL } from "../../Common Service/APIRoute";
import { apiCall } from "../../Common Service/AxiosService";
import { commonservices } from "../../Common Service/CommonServices";
import { userInfo, userToken } from "../../ReduxTookit/UserInfoSlice";
import { toast } from "react-toastify";
import { Row } from "react-bootstrap";

const SignUpPage = (props) => {
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

  const reset = () => {
    inputFile.current.value = "";
    setFile("");
    setInput({
      ...input,
      profilepic: "",
    });
  };

  async function HandleSubmit(e) {
    e.preventDefault();
    let obj = commonservices.fnCheckValidationOfObject(input);
    setInput({
      ...obj.obj,
    });
    if (obj.isValid) {
      setLoading(true);
      let body = {
        emailid: input?.emailid.trim(),
        password: input?.password.trim(),
        displayname: input?.displayname.trim(),
        profilepic: input.profilepic,
      };
      let resData = await apiCall(
        {
          method: "POST",
          url: API_URL.BASEURL + API_URL.SIGNUP,
          body: body,
        },
        true
      );
      let response = apiResponse(true, resData, setLoading);
      if (response?.isValidate) {
        dispatch(userToken(response?.data?.data?.token));
        dispatch(userInfo(response?.data?.data?.user));
      }
      if (!response?.isValidate) {
        console.log("Error  getting country list", response);
      }
    }
  }
  return (
    <>
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
        <Button variant="primary w-100 my-4" disabled={Loading} type="submit">
          {Loading ? "Loading..." : "Sign Up"}
        </Button>
      </Form>
      <p className="text-center">
        Already had an account?{" "}
        <span onClick={() => props.data(false)} className="cursor-pointer">
          <b>Login</b>
        </span>
      </p>
    </>
  );
};

export default SignUpPage;
