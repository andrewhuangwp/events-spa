defmodule EventsSpa.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:status, :email, :id]}


  schema "invites" do
    field :email, :string
    field :status, :string
    belongs_to :event, EventsSpa.Events.Event

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:status, :email, :event_id])
    |> validate_required([:status, :email, :event_id])
  end
end
