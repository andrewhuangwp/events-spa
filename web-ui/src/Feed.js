import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Row, Col, Table } from "react-bootstrap";

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

function User({ user }) {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.email}</td>
    </tr>
  );
}

function Feed({ users, events }) {
  let eventFeed = (
    <Col md="8">
      <h2>Event Feed</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <Event event={event} key={event.id} />
          ))}
        </tbody>
      </Table>
    </Col>
  );

  let userFeed = (
    <Col md="8">
      <h2>User Feed</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <User user={user} key={user.id} />
          ))}
        </tbody>
      </Table>
    </Col>
  );

  return (
    <div>
      <h1 className="text-center">Events App</h1>

      <Row className="justify-content-center">{eventFeed}</Row>
      <Row className="justify-content-center">{userFeed}</Row>
    </div>
  );
}

export default connect(({ users, events }) => ({ users, events }))(Feed);
