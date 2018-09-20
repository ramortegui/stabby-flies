defmodule ChatWeb.Router do
  use ChatWeb, :router

  require Logger

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    # plug :put_unique_socket_id
    plug :put_user_token
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ChatWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  defp put_user_token(conn, _) do
    Logger.debug "put_user_token"

    if current_user = conn.assigns[:current_user] do
      token = Phoenix.Token.sign(conn, "user socket", current_user.id)
      Logger.debug "User token put #{token}"

      assign(conn, :user_token, token)
    else
      conn
    end
  end

  defp put_unique_socket_id(conn, _) do
    # assign(conn, :current_user, "ONE")
    # conn.assigns[:current_user] 
    assign(conn, :current_user, 1)

  end

  # Other scopes may use custom stacks.
  # scope "/api", ChatWeb do
  #   pipe_through :api
  # end
end
