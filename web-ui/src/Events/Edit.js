import { Row, Col, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import {
  put_event,
  get_event,
  delete_event,
  fetch_events,
  fetch_users,
} from "../api";
import { Unauthorized } from "../Error";

import "flatpickr/dist/themes/material_green.css";
import pick from "lodash/pick";

function EditEvent({ session }) {
  const history = useHistory();
  const { id } = useParams();
  const [event, setEvent] = useState({
    name: "",
    description: "",
    user_id: "",
  });
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(event, ["name", "description"]);
    data.user_id = session.user_id;
    data.date = date[0];
    put_event(id, {id, event: data}).then((result) => {
      if (result.error) {
        alert("Invalid Params. Try again.");
      } else {
        history.push(`/events/${result.data.id}`);
      }
    });
  }

  function deleteEvent() {
    delete_event(id).then((data) => {
      if (data.error) {
        alert("Invalid Params. Try again.");
      } else {
        fetch_events();
        fetch_users();
        history.push("/");
      }
    });
  }

  function validate(u1) {
    if (u1.name === "" || u1.description === "") {
      return "Name and description cannot be empty.";
    }

    return "";
  }

  function update(field, ev) {
    let u1 = Object.assign({}, event);
    u1[field] = ev.target.value;
    u1.pass_msg = validate(u1);
    setEvent(u1);
  }

  function updateDate(newDate) {
    setDate(newDate);
  }

  return (
    <div>
      {session !== null ? (
        error ? (
          <Unauthorized />
        ) : (
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(ev) => update("name", ev)}
                value={event.name}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="textarea"
                onChange={(ev) => update("description", ev)}
                value={event.description}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="mr-2">DateTime</Form.Label>
              <Flatpickr
                data-enable-time
                value={event.date}
                onChange={(newDate) => updateDate(newDate)}
              />
            </Form.Group>
            <p className="text-danger">{event.pass_msg}</p>
            <Button
              variant="primary"
              type="submit"
              disabled={event.pass_msg !== ""}
            >
              Save
            </Button>
            <Button className="ml-2" variant="danger" onClick={deleteEvent}>
              Delete
            </Button>
          </Form>
        )
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(EditEvent);
