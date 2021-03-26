import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Button } from "react-bootstrap";

import { put_user, fetch_users, delete_user } from "../api";
import pick from "lodash/pick";
import {Unauthorized} from "../Error";

function EditUser({ session }) {
  const history = useHistory();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  function deleteUser() {
    delete_user(id).then((data) => {
      fetch_users();
      history.push("/");
    });
  }

  function onSubmit(ev) {
    ev.preventDefault();
    console.log(ev);
    console.log(user);

    let data = pick(user, ["name", "email", "password"]);
    put_user(id, {id: id, user: data}).then((result) => {
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
    if (u1.pass1 === "" || u1.name === "" || u1.email === "") {
      return "No fields can be empty.";
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
      {session ? (
        session.user_id.toString() === id ? (
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
            <Button
              variant="primary"
              type="submit"
              disabled={user.pass_msg !== ""}
            >
              Save
            </Button>
            <Button className="ml-2" variant="danger" onClick={deleteUser}>
              Delete
            </Button>
          </Form>
        ) : <Unauthorized />
      ) : <Unauthorized/>}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(EditUser);
