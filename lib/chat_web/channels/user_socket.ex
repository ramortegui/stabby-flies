defmodule ChatWeb.UserSocket do
  use Phoenix.Socket

  require Logger
  ## Channels
  # channel "room:*", ChatWeb.RoomChannel
  channel "room:lobby", ChatWeb.RoomChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket
  # transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  # {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.

  def connect(params, socket) do
    # Logger.debug "Params are #{params}"
    Logger.debug "CONNECT FREN"
    id = Chat.SocketIdGen.gen_id
    IO.inspect params
    {:ok, assign(socket, :user_id, id)}
  end

  # def connect(%{"token" => token}, socket) do
  #   Logger.debug "connecting"
  #   # max_age: 1209600 is equivalent to two weeks in seconds
  #   case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
  #     {:ok, user_id} ->
  #       {:ok, assign(socket, :user, user_id)}
  #     {:error, reason} ->
  #       :error
  #   end
  # end
  

  # Socket id's are topics that allow you to identify all sockets for a given user:
  def id(socket), do: "#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  # ChatWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  # def id(_socket), do: nil
end
