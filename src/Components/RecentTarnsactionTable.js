import React from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { commonservices } from "../Common Service/CommonServices";
import moment from "moment";

const RecentTarnsactionTable = (props) => {
  return (
    <div className="pt-2 Recent-Transaction">
      <Row>
        <Col className="expense-detail">
          <div className="expense-detail-one p-0">
            <Table striped responsive className="m-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Time</th>

                  {/* <th>Category</th> */}
                  <th>Payment</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {props?.data?.length > 0 &&
                  props?.data?.reverse()?.map(
                    (item, index) =>
                      index < 5 && (
                        <tr key={item} className="expense-detail-one">
                          <td className="width-500px">{item?.title}</td>
                          <td className="width-500px">
                            {/* {moment(item?.date).format("DD/MM/yyyy")}  */}

                            {moment(item?.date).fromNow()}
                          </td>

                          {/* <td className="width-300px">{item?.category}</td> */}
                          <td className="width-300px">{item?.paymentMode}</td>
                          <td>₹ {item?.amount}</td>
                        </tr>
                      )
                  )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RecentTarnsactionTable;
