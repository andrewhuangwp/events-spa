defmodule EventsSpaWeb.SessionController do
  use EventsSpaWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    user = EventsSpa.Users.authenticate(email, password)
    if user do
      session = %{
        user_id: user.id,
        name: user.name,
        email: user.email,
        token: Phoenix.Token.sign(conn, "user_id", user.id)
      }
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:created, Jason.encode!(%{"session" => session}))
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "failed"}))
    end
  end
end
