defmodule EventsSpaWeb.EventController do
  use EventsSpaWeb, :controller

  alias EventsSpa.Events
  alias EventsSpa.Events.Event
  alias EventsSpaWeb.Plugs

  action_fallback EventsSpaWeb.FallbackController

  plug Plugs.RequireAuth when action in [:create]
  plug :inviteOrOwnerRequired when action in [:show]
  plug :eventOwnerRequired when action in [:update, :delete]

  # Require event owner to make changes to event.
  # TODO token change?
  def eventOwnerRequired(conn, _args) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        event = EventsSpa.Events.get_event!(conn.params["id"])
        if event.user_id == user_id do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Unauthorized: only event owner may change event."}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  # Must be invited or event owner to view event.
  def inviteOrOwnerRequired(conn, _params) do
    token = Enum.at(get_req_header(conn, "x-auth"), 0)
    case Phoenix.Token.verify(conn, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        event = EventsSpa.Events.get_event!(conn.params["id"])
        user = EventsSpa.Users.get_user!(user_id)
        invite = EventsSpa.Invites.get_invite_by_email(conn.params["id"], user.email)
        if (invite != nil) || (user_id == event.user_id) do
          conn
        else
          conn
          |> put_resp_header("content-type", "application/json; charset=UTF-8")
          |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Unauthorized: only event owner and invited users can view event."}))
          |> halt()
        end
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.json", events: events)
  end

  # TODO error ver
  def create(conn, %{"event" => event_params}) do
    case Events.create_event(event_params) do
      {:ok, %Event{} = event} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.event_path(conn, :show, event))
        |> render("show.json", event: event)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "failed"}))
    end
  end

  def show(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    render(conn, "showAll.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
      render(conn, "show.json", event: event)
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
