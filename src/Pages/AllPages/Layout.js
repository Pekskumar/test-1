import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Components/Header";
import Container from "react-bootstrap/esm/Container";
import Footer from "../../Components/Footer";

const Layout = () => {
  return (
    <>
      <div id="layout-wrapper">
        <Header />
        <Container className="py-4 pb-5">
          <Outlet/>
        </Container>
        <Footer/>
      </div>
    </>
  );
};

export default Layout;
