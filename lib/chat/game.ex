defmodule Chat.Game do
  require Logger

  @background [
    ["1", "~", "~", "~"],
    ["~", "~", "~", "~"]
  ]

  def background do
    @background
  end

  def start_link do
    Logger.info "HELLO FREIND"
    # Agent.stop(__MODULE__)
    Agent.start_link(fn -> %{ "players": [] } end, name: __MODULE__)
  end

  def add_player(name) do
    Agent.update(__MODULE__, fn(state) -> 
      player = %{"name" => name, "x" => 0, "y" => 0}
      # Map.put(state, :players, state.players ++ [player])
      Map.put(state, :players, [player | state.players] )
    end)
  end

  def reset() do
    Agent.update(__MODULE__, fn(_state) -> %{} end)
  end

  # get number of watches a player has. Each hand can have several
  def get_players do
    Agent.get(__MODULE__, fn(state) ->
      state.players
    end)
  end

  
  # not properly implemented d : 
  # def delete_player(player) do
  #   Agent.get_and_update(__MODULE__, &Map.pop(&1, player))
  # end

  def watch(player) do
    Agent.update(__MODULE__, fn(state) -> 
      count = Map.get(state, player)
      Map.replace(state, player, count + 1)
    end)
  end

  def start do
    {:ok, pid} = Chat.Game.start_link
    
    Chat.Game.add_player("George")
    Chat.Game.add_player("Lopez")
    Chat.Game.add_player("Lee")


    Chat.Game.get_players()

    # {:ok, pid} 
  end
end