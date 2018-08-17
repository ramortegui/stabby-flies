defmodule Chat.GameTest do
  use Chat.Game

  # setup do
  #   {:ok, game_pid} = Game.start_link
  #   %{game_pid: game_pid}
  # end

  setup(_) do: setup end

  test "ping replies with status ok", %{game_pid: game_pid} do
    {:ok, game_pid} = Game.start_link
    assert game_pid != nil
  end

end
