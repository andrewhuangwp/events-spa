defmodule EventsSpaWeb.EventView do
  use EventsSpaWeb, :view
  alias EventsSpaWeb.EventView
  alias EventsSpa.Users

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("showAll.json", %{event: event}) do
    %{data: render_one(event, EventView, "eventAll.json")}
  end

  def render("event.json", %{event: event}) do
    %{id: event.id,
      name: event.name,
      date: event.date,
      description: event.description
    }
  end

  def render("eventAll.json", %{event: event}) do
    user = Users.get_user!(event.user_id)
    %{id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      invites: event.invites,
      comments: event.comments,
      user_name: user.name,
      user_id: user.id,
      user_email: user.email}
  end
end
