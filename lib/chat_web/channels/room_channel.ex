defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel
  require Logger

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      # Logger.debug socket
      # IO.inspect socket

      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
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

  def handle_info(:after_join, socket) do


    name = ["Hassan", "George", "Jane"] |> Enum.shuffle |> hd

    new_player = %{
      :name => name, 
      # :transport_pid => socket[:transport_pid], 
      :x => 0, 
      :y => 0
    }

    Logger.debug name
    Chat.Game.add_player(name)

    # Logger.debug Game.background
    Chat.Message.get_messages()
    |> Enum.each(fn msg -> push(socket, "shout", %{
        name: msg.name,
        message: msg.message,
      }) end)
      push(socket, "initialize", %{
        map: Chat.Game.background(),
      })
    {:noreply, socket} # :noreply
  end



  def handle_in("keydown", payload, socket) do
    Logger.debug "keydown #{payload["key"]}" 
    cond do 
      payload["key"] == "d" -> Logger.debug "right"
      payload["key"] == "a" -> Logger.debug "left"
    end
    {:reply, {:ok, payload}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
