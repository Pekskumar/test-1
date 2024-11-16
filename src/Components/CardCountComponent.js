import React from "react";
import { Col, Row } from "react-bootstrap";
import IncomeIcon1 from "../Assets/Images/IncomeIcon1";
import ExpensecountIcon from "../Assets/Images/ExpensecountIcon";
import BalanceIcon from "../Assets/Images/BalanceIcon";
import TransactionIcon from "../Assets/Images/TransactionIcon";
import UsersIcon from "../Assets/Images/UsersIcon";
import TodoIcon from "../Assets/Images/TodoIcon";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const CardCountComponent = (props) => {
  let navigate = useNavigate()
  return (
    <>
      <Row>
        <Col md={4} className="mb-3">
          <div onClick={() => navigate('/transactions')} style={{ background: '#bbdefb' }} className="cardcount-body p-4 d-flex justify-content-between">
            <div style={{ color: '#0d47a1' }}>
              <h4>₹ {props?.Loading ? <Loader /> : props?.data?.income}</h4>
              <span>Income</span>
            </div>
            <IncomeIcon1 />
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div onClick={() => navigate('/transactions')} style={{ background: '#ffccbc' }} className="cardcount-body p-4 d-flex     justify-content-between">
            <div style={{ color: '#e64a19' }}>
              <h4>₹ {props?.Loading ? <Loader /> : props?.data?.expenses}</h4>
              <span>Expenses</span>
            </div>
            <ExpensecountIcon />
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div onClick={() => navigate('/transactions')} style={{ background: '#c8e6c9' }} className="cardcount-body p-4 d-flex     justify-content-between">
            <div>              
              <h4 style={{ color: props?.data?.balance > 0 ? "#388e3c" : '#e64a19' }}>₹ {props?.Loading ? <Loader /> : props?.data?.balance}</h4>
              <span style={{ color: '#388e3c' }}>Balance</span>
            </div>
            <BalanceIcon />
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div onClick={() => navigate('/transactions')} style={{ background: '#999999' }} className="cardcount-body p-4 d-flex     justify-content-between">
            <div style={{ color: '#f3f3f3' }}>
              <h4>₹ {props?.Loading ? <Loader /> : props?.data?.transactions}</h4>
              <span>Transactions</span>
            </div>
            <TransactionIcon />
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div onClick={() => navigate('/users')} style={{ background: '#d1c4e9' }} className="cardcount-body p-4 d-flex     justify-content-between">
            <div style={{ color: '#7b1fa2' }}>              
              <h4>{props?.Loading ? <Loader /> : props?.data?.users}</h4>
              <span>Users</span>
            </div>
            <UsersIcon />
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div onClick={() => navigate('/todos')} style={{ background: '#b2dfdb' }} className="cardcount-body p-4 d-flex     justify-content-between">
            <div style={{ color: '#004d40' }}>
              <h4>{props?.data?.todoCount}</h4>
              <span>Pending Works</span>
            </div>
            <TodoIcon />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CardCountComponent;
