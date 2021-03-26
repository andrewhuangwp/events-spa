import { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Button, Table } from "react-bootstrap";
import { get_user } from "../api";
import { NotFound } from "../Error";

function Event({ event }) {
  return (
    <tr>
      <td>
        <Link to={`/events/${event.id}`}>{event.name}</Link>
      </td>
      <td>{event.date}</td>
    </tr>
  );
}

function UserProfile({ session }) {
  const { id } = useParams();
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    email: "",
    events: [],
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    get_user(id)
      .then((data) => {
        setUser({
          name: data.name,
          email: data.email,
          events: data.events,
        });
      })
      .catch((err) => {
        setError(true);
      });
  }, [id, user]);
  return (
    <div>
      {error ? (
        <NotFound />
      ) : (
        <Row>
          <Col>
            <h1>{user.name}'s Profile</h1>
            <h2>email: {user.email}</h2>
            <h3> Events Owned</h3>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {user.events.map((event) => (
                  <Event event={event} key={event.id} />
                ))}
              </tbody>
            </Table>
            {session ? (
              session.user_id.toString() === id ? (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    history.push(`/users/edit/${id}`);
                  }}
                >
                  Edit Profile
                </Button>
              ) : null
            ) : null}
          </Col>
        </Row>
      )}
    </div>
  );
}

export default connect(({ session }) => ({ session }))(UserProfile);
