defmodule EventsSpaWeb.UserView do
  use EventsSpaWeb, :view
  alias EventsSpaWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  #TODO show events or password
  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email,
      events: user.events}
  end
end
