defmodule EventsSpa.Repo do
  use Ecto.Repo,
    otp_app: :events_spa,
    adapter: Ecto.Adapters.Postgres
end
