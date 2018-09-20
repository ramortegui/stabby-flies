defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel
  require Logger

  alias Chat.Game

  @messages ["You are cool", "You suck"]

  def join("room:lobby", payload, socket) do
    socket = socket 
      |> assign(:message, Enum.random(@messages))
      |> assign(:albums, [])
      send(self(), :after_join)
      {:ok, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  def handle_in("shout", payload, socket) do
    Chat.Message.changeset(%Chat.Message{}, payload) |> Chat.Repo.insert  
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  def handle_in("connect", payload, socket) do
    broadcast socket, "connect", %{"one" => :two, 3 => %{"one" => :four}}
    {:noreply, socket}
  end

  def handle_in("move", payload, socket) do
    IO.inspect socket

    # cond do 
    #   payload["direction"] == "left" -> Game.move_player("name", "left")
    #   payload["direction"] == "right" ->Game.move_player("name", "right")
    # end

    {:reply, {:ok, payload}, socket}
  end


  def handle_info(:after_join, socket) do
    name = ["Hassan", "George", "Jane"] |> Enum.shuffle |> hd
    new_player = Game.add_player(name)

    Chat.Message.get_messages()
    |> Enum.each(fn msg -> push(socket, "shout", %{
        name: msg.name,
        message: msg.message,
      }) end)
      push(socket, "initialize", %{
        map: Game.background(),
        new_player: new_player
      })
    {:noreply, socket} # :noreply
  end



  def handle_in("keydown", payload, socket) do
    Logger.debug "keydown #{payload["key"]}" 

    {:reply, {:ok, payload}, socket}
  end


end
