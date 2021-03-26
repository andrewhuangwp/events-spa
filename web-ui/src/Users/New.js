import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import pick from "lodash/pick";

import { create_user, fetch_users } from "../api";

function NewUser() {
  let history = useHistory();
  const [user, setUser] = useState({
    name: "",
    email: "",
    pass1: "",
    pass2: "",
  });

  function onSubmit(ev) {
    ev.preventDefault();
    console.log(ev);
    console.log(user);

    let data = pick(user, ["name", "email", "password"]);
    create_user(data).then((result) => {
      if (result.error) {
        alert("Invalid Params. Try again.");
      } else {
        fetch_users();
        history.push("/");
      }
    });
  }

  function validate(u1) {
    // This is for user experience only,
    // validation logic goes on the server.
    if (u1.pass1 !== u1.pass2) {
      return "Passwords don't match.";
    }
    if (u1.pass1 === "" || u1.name === "" || u1.email === ""){
      return "No fields can be empty."
    }

    return "";
  }

  function update(field, ev) {
    let u1 = Object.assign({}, user);
    u1[field] = ev.target.value;
    u1.password = u1.pass1;
    u1.pass_msg = validate(u1);
    setUser(u1);
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            onChange={(ev) => update("name", ev)}
            value={user.name}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            onChange={(ev) => update("email", ev)}
            value={user.email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(ev) => update("pass1", ev)}
            value={user.pass1}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(ev) => update("pass2", ev)}
            value={user.pass2}
          />
        </Form.Group>
        <p className="text-danger">{user.pass_msg}</p>
        <Button variant="primary" type="submit" disabled={user.pass_msg !== ""}>
          Save
        </Button>
      </Form>
    </div>
  );
}

function state2props(_state) {
  return {};
}

export default connect(state2props)(NewUser);
