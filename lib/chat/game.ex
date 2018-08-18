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
    x = Enum.random(0..200)
    y = 0 # Enum.random(0..n)
    player = %{name: name, x: x, y: y}

    Agent.update(__MODULE__, fn(state) -> 
      Map.put(state, :players, [player | state.players] )
    end)
    player
  end

  def reset() do
    Agent.update(__MODULE__, fn(_state) -> %{} end)
  end

  def get_players do
    Agent.get(__MODULE__, fn(state) ->
      state.players
    end)
  end

  # TODO: Should probably be get_player and then just use the documentation thing to document it
  def get_player_by_name(name) do
    get_players |> Enum.find([], fn x -> x[:name] == name end )
  end

  # def move_player(name, direction) do
  #   Agent.update(__MODULE__, fn(state) -> 
  #     player = get_player_by_name(name)

  #     Map.replace(state, player, count + 1)
  #   end)
  # end

  
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

  # def start do
  #   {:ok, pid} = Chat.Game.start_link
    
  #   Chat.Game.add_player("George")
  #   Chat.Game.add_player("Lopez")
  #   Chat.Game.add_player("Lee")


  #   Chat.Game.get_players()

  #   # {:ok, pid} 
  # end
end