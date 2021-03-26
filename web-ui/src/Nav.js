import { Nav, Navbar, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { useState } from "react";

import { api_login } from "./api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function on_submit(ev) {
    ev.preventDefault();
    api_login(email, pass);
  }

  return (
    <Form onSubmit={on_submit} inline>
      <Form.Control
        name="email"
        type="text"
        placeholder="email"
        onChange={(ev) => setEmail(ev.target.value)}
        value={email}
      />
      <Form.Control
        name="password"
        type="password"
        placeholder="password"
        onChange={(ev) => setPass(ev.target.value)}
        value={pass}
      />
      <Button variant="primary" type="submit">
        Login
      </Button>
      <Button variant="outline-primary" className="ml-2">
        <Link to="/users/new">Register</Link>
      </Button>
    </Form>
  );
}

let SessionInfo = connect()(({ session, dispatch }) => {
  function logout() {
    dispatch({ type: "session/clear" });
  }
  return (
    <Nav.Item>
      Logged in as {session.name} &nbsp;
      <Button variant="outline-primary" size="sm">
        <Link to={`/users/${session.user_id}`}>Profile</Link>
      </Button>
      <Button
        variant="outline-success"
        className="ml-2 mr-2"
        size="sm"
      >
        <Link to="/events/new">New Event</Link>
      </Button>
      <Button variant="outline-primary" onClick={logout}>
        Logout
      </Button>
    </Nav.Item>
  );
});

function LOI({ session }) {
  if (session) {
    return <SessionInfo session={session} />;
  } else {
    return <LoginForm />;
  }
}

const LoginOrInfo = connect(({ session }) => ({ session }))(LOI);

function Link({ to, children }) {
  return (
    <Nav.Item>
      <NavLink to={to} exact className="nav-link" activeClassName="active">
        {children}
      </NavLink>
    </Nav.Item>
  );
}

function AppNav({ error }) {
  let error_row = null;

  if (error) {
    error_row = (
      <Row>
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <Navbar bg="light" variant="dark">
        <Navbar.Brand>
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse
          className="justify-content-end"
          style={{ width: "100%" }}
        >
          <LoginOrInfo />
        </Navbar.Collapse>
      </Navbar>
      {error_row}
    </div>
  );
}

export default connect(({ error }) => ({ error }))(AppNav);
