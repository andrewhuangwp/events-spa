import { Container } from "react-bootstrap";

import "./App.scss";

import { Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import Feed from "./Feed";
import NewUser from "./Users/New";
import UserProfile from "./Users/Show";
import EditUser from "./Users/Edit";
import NewEvent from "./Events/New";
import EditEvent from "./Events/Edit";
import EventProfile from "./Events/Show";


function App() {
  return (
    <div>
      <Nav />
      <Container>
        <Switch>
          <Route path="/" exact>
            <Feed />
          </Route>
          <Route path="/users/new" exact>
            <NewUser />
          </Route>
          <Route path="/users/:id" exact>
            <UserProfile />
          </Route>
          <Route path="/users/edit/:id" exact>
            <EditUser />
          </Route>
          <Route path="/events/new" exact>
            <NewEvent />
          </Route>
          <Route path="/events/:id" exact>
            <EventProfile />
          </Route>
          <Route path="/events/edit/:id" exact>
            <EditEvent />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
