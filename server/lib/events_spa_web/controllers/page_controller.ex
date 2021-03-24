defmodule EventsSpaWeb.PageController do
  use EventsSpaWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
