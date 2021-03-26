import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Accordion,
  Card,
  Table,
  ListGroup,
  Alert,
} from "react-bootstrap";
import {
  fetch_events,
  get_event,
  delete_event,
  create_invite,
  delete_invite,
  put_invite,
  create_comment,
  delete_comment,
} from "../api";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Unauthorized } from "../Error";

function NewInvite({ event }) {
  const [email, setEmail] = useState("");

  function updateEmail(ev) {
    setEmail(ev.target.value);
  }

  function onSubmit(ev) {
    ev.preventDefault();
    create_invite({
      email: email,
      event_id: parseInt(event),
      status: "none",
    }).then(() => {
      setEmail("");
      alert(
        `Successfully created invite. Share this link: http://events-spa.normalwebsite.art/events/${event}`
      );
    });
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Create Invite</Form.Label>
        <div className="flex-row">
          <Form.Control
            type="text"
            onChange={updateEmail}
            value={email}
            placeholder="Email"
          />
          <Button variant="outline-primary" type="submit">
            Save
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

function NewResponse({ session, event, id }) {
  const [status, setStatus] = useState(null);

  function onSubmit(ev) {
    ev.preventDefault();

    put_invite(id, {
      id: id,
      invite: {
        email: session.email,
        event_id: event.id,
        status: status,
      },
    }).then((resp) => {});
  }
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Response:</Form.Label>
        <div className="flex-row">
          <Form.Control
            as="select"
            onChange={(ev) => {
              setStatus(ev.target.value);
            }}
          >
            <option value={null}>Select one of the options below.</option>
            <option value={"yes"}>yes</option>
            <option value={"no"}>no</option>
            <option value={"maybe"}>maybe</option>
          </Form.Control>
          <Button variant="success" type="submit">
            Save
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

function NewComment({ event, session }) {
  const [body, setBody] = useState("");

  function updateBody(ev) {
    setBody(ev.target.value);
  }

  function onSubmit(ev) {
    ev.preventDefault();
    create_comment({
      body: body,
      event_id: parseInt(event),
      user_id: session.user_id,
    }).then(() => {
      setBody("");
    });
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Create Comment</Form.Label>
        <div className="flex-row">
          <Form.Control
            type="text"
            onChange={updateBody}
            value={body}
            placeholder="Text"
          />
          <Button variant="outline-primary" type="submit">
            Save
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

function EventLayout({ session, event }) {
  const history = useHistory();
  const [responses, setResponses] = useState({
    yes: 0,
    no: 0,
    maybe: 0,
    none: 0,
  });

  const [invites, setInvites] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log(event);
    let newinvites = event.invites;
    setInvites(newinvites);
    setComments(event.comments);
    let newResponses = {
      yes: 0,
      no: 0,
      maybe: 0,
      none: 0,
    };

    event.invites.forEach((inv) => {
      switch (inv.status) {
        case "yes":
          newResponses.yes++;
          break;
        case "no":
          newResponses.no++;
          break;
        case "maybe":
          newResponses.maybe++;
          break;
        default:
          newResponses.noResponse++;
      }
    });
    setResponses(newResponses);
  }, [event]);

  function deleteEvent() {
    delete_event(event.id).then((data) => {
      fetch_events();
      history.push("/");
    });
  }

  function deleteInvite(inv) {
    console.log(inv);
    delete_invite(inv).then((data) => {});
  }

  function deleteComment(comm) {
    delete_comment(comm).then((data) => {});
  }
  return (
    <div>
      {session ? (
        <Row>
          <Col md="6">
            <p> Note: Refresh page to see changes.</p>
            <Card>
              <Card.Body>
                <h1>{event.name}</h1>
                <p>Description: {event.description}</p>
                <p>DateTime: {event.date}</p>
              </Card.Body>
              <Card>
                <Card.Body>
                  <h3>Event Owner: {event.user_name}</h3>
                  <p>Email: {event.user_email}</p>
                </Card.Body>
              </Card>
            </Card>
            <Card>
              <Card.Body>
                <h3>Responses</h3>
                <p>Yes: {responses.yes}</p>
                <p>No: {responses.no}</p>
                <p>Maybe: {responses.maybe}</p>
                <p>Haven't Responded: {responses.none}</p>
              </Card.Body>
            </Card>
            {Invitee(session.email, invites) !== false ? (
              <Card>
                <Card.Body>
                  <NewResponse
                    event={event}
                    id={Invitee(session.email, invites)}
                    session={session}
                  />
                </Card.Body>
              </Card>
            ) : null}
          </Col>
          <Col md="6">
            <Card>
              <Card.Body>
                <ListGroup>
                  <h2>Invites</h2>
                  {invites.map((inv) => {
                    return (
                      <ListGroup.Item key={inv.id}>
                        Email: {inv.email}. Status: {inv.status}
                        {session.user_id === event.user_id ? (
                          <Button
                            className="ml-2"
                            variant="danger"
                            onClick={() => {
                              deleteInvite(inv.id);
                            }}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <h2>Comments</h2>
                  {comments.map((comm) => {
                    return (
                      <ListGroup.Item key={comm.id}>
                        Name: {comm.user.name}
                        <p>{comm.body}</p>
                        {session.user_id === comm.user_id ||
                        session.user_id === event.user_id ? (
                          <Button
                            variant="danger"
                            onClick={() => {
                              deleteComment(comm.id);
                            }}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
            {session.user_id === event.user_id ? (
              <Card>
                <Card.Body>
                  <NewInvite event={event.id} />
                </Card.Body>
              </Card>
            ) : null}
            {session.user_id === event.user_id ||
            Invitee(session.email, invites) !== false ? (
              <Card>
                <Card.Body>
                  <NewComment event={event.id} session={session} />
                </Card.Body>
              </Card>
            ) : null}
            {session.user_id === event.user_id ? (
              <Button
                variant="danger"
                onClick={() => {
                  deleteEvent();
                }}
              >
                Delete Event
              </Button>
            ) : null}
          </Col>
        </Row>
      ) : null}
    </div>
  );
}

let EventView = connect(({ session }, props) => ({
  session: session,
  event: props.event,
}))(EventLayout);

function Invitee(email, invites) {
  for (let i = 0; i < invites.length; i++) {
    if (invites[i].email == email) {
      return invites[i].id;
    }
  }
  return false;
}

export default function EventProfile() {
  const { id } = useParams();
  const [event, setEvent] = useState({
    name: "",
    description: "",
    date: "",
    user_name: "",
    user_id: null,
    user_email: "",
    invites: [],
    comments: [],
    id: id,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    get_event(id)
      .then((result) => {
        if (result === false || result.error) {
          setError(true);
        } else {
          setEvent({
            name: result.data.name,
            description: result.data.description,
            date: result.data.date,
            user_name: result.data.user_name,
            user_id: result.data.user_id,
            user_email: result.data.user_email,
            invites: result.data.invites,
            comments: result.data.comments,
            id: id,
          });
        }
      })
      .catch((err) => {
        setError(true);
      });
  }, [id]);
  return <div>{error ? <Unauthorized /> : <EventView event={event} />}</div>;
}
