defmodule EventsSpa.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  # Getting some Jason Encoder error, followed suggestion given.
  @derive {Jason.Encoder, only: [:date, :description, :name, :id]}

  schema "events" do
    field :date, :utc_datetime
    field :description, :string
    field :name, :string
    belongs_to :user, EventsSpa.Users.User

    has_many :invites, EventsSpa.Invites.Invite, on_delete: :delete_all
    has_many :comments, EventsSpa.Comments.Comment, on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:name, :date, :description, :user_id])
    |> validate_required([:name, :date, :description, :user_id])
  end
end
