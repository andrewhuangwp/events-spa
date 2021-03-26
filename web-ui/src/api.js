import store from './store';

const url = "http://localhost:4000/api/v1";

async function api_get(path) {
  let text = await fetch(url + path, {});
  let resp = await text.json();
  return resp.data;
}

async function api_get_verified(path) {
  let state = store.getState();
  let session = state?.session;
  if (session === undefined) {
    return false;
  }
  let token = session?.token;

  let opts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    }
  };
  let text = await fetch(url + path, opts);
  return await text.json();
}

async function api_post(path, data) {
  let state = store.getState();
  let token = state?.session?.token;

  let opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    },
    body: JSON.stringify(data),
  };
  let text = await fetch(url + path, opts);
  return await text.json();
}

// HTTP Delete Request using fetch
async function api_delete(path) {
  let state = store.getState();
  let token = state?.session?.token;

  let opts = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    }
  }
  let text = await fetch(url + path, opts);
  return await text.text();
}

// HTTP Put Request using fetch
async function api_put(path, data) {
  let state = store.getState();
  let token = state?.session?.token;
  
  let opts = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token,
    },
    body: JSON.stringify(data)
  }
  let text = await fetch(url + path, opts);
  return await text.json();
}

export function fetch_users() {
  api_get("/users").then((data) => {
    let action = {
      type: 'users/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function fetch_events() {
  api_get("/events").then((data) => {
    let action = {
      type: 'events/set',
      data: data,
    }
    store.dispatch(action);
  });
}

export function api_login(email, password) {
  api_post("/session", {email, password}).then((data) => {
    console.log("login resp", data);
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
    else if (data.error) {
     let action = {
        type: 'error/set',
        data: data.error,
      }
      store.dispatch(action);
    }
  });
}

export function create_user(user) {
  return api_post("/users", {user});
}

export function get_user(user) {
  return api_get("/users/" + user);
}

export function put_user(user, data) {
  return api_put("/users/" + user, data);
}

export function delete_user(user) {
  return api_delete("/users/" + user);
}

export function create_event(event) {
  return api_post("/events", {event});
}

export function get_event(event) {
  return api_get_verified("/events/" + event);
}

export function put_event(event, data) {
  return api_put("/events/" + event, data);
}

export function delete_event(event) {
  return api_delete("/events/" + event);
}

export function create_invite(invite) {
  return api_post("/invites", {invite});
}

export function get_invite(invite) {
  return api_get("/invites/" + invite);
}

export function put_invite(invite, data) {
  return api_put("/invites/" + invite, data);
}

export function delete_invite(invite) {
  console.log(invite);
  return api_delete("/invites/" + invite);
}

export function create_comment(comment) {
  return api_post("/comments", {comment});
}

export function get_comment(comment) {
  return api_get("/comments/" + comment);
}

export function put_comment(comment, data) {
  return api_put("/comments/" + comment, data);
}

export function delete_comment(comment) {
  return api_delete("/comments/" + comment);
}

export function load_defaults() {
    fetch_events();
    fetch_users();
}