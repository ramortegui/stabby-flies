// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import { Socket } from "phoenix";
import { Game } from "./game";
import Player from "./player";

let game = new Game();

let socket = new Socket("/socket", { params: { token: window.userToken } });

/* Begin Add */

var channel = socket.channel("room:lobby", {}); // connect to chat "room"

channel.on("shout", function(payload) {
  // listen to the 'shout' event
  var li = document.createElement("li"); // creaet new list item DOM element
  var { name, message } = payload; // get name from payload or set default
  li.innerHTML = "<b>" + name + "</b>: " + message; // set li contents
  ul.appendChild(li); // append to list
});

channel.on("connect", function(payload) {
  // listen to the 'shout' event
  var li = document.createElement("li"); // creaet new list item DOM element
  var name = payload.name || "guest"; // get name from payload or set default
  console.log(payload);
  li.innerHTML = "<b> SOMEONE CONNECTED</b>"; // set li contents
  ul.appendChild(li); // append to list

  const player = new Player({ x: 0, y: 0 });
  game.addPlayer(player);
});

channel.join(); // join the channel.

var ul = document.getElementById("msg-list"); // list of messages.
var msg = document.getElementById("msg"); // message input field

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener("keypress", function(event) {
  if (event.keyCode == 13 && msg.value.length > 0) {
    // don't sent empty msg.
    channel.push("shout", {
      // send the message to the server on "shout" channel
      name: "Guest", // get value of "name" of person sending the message
      message: msg.value // get message text (value) from msg input field.
    });
    msg.value = ""; // reset the message input field for next message.
  }
});

channel.push("connect", {
  // send the message to the server on "shout" channel
  // name: 'Admin',     // get value of "name" of person sending the message
  // message: 'Someone joined the server'    // get message text (value) from msg input field.
});

channel.on("initialize", function(payload) {
  // listen to the 'shout' event
  console.log(payload);
  game.setup({ map: payload.map });
});

/* End Add */

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect();

// Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("topic:subtopic", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

export default socket;
