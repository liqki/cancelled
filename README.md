# Cancelled!

Cancelled! is a browser multiplayer game in the style of [Survive the Internet](https://www.jackboxgames.com/games/survive-the-internet). I created it as part of the Hackclub Arcade 2024 and sadly it's not hosted online right now, since I don't have the resources to host a socket server.

## Stack used

The project uses [NextJS](https://nextjs.org/) together with a custom Next server to integrate [Socket.IO](https://socket.io/). [TailwindCSS](https://tailwindcss.com) is used for styling and [ts-node](https://www.npmjs.com/package/ts-node) to run the server without having to compile it first. However I honestly wouldn't recommend going for a custom server but rather profit from the benefits of running Next with its standard server and host the socket server externally.

## How to play

On the homepage users can create rooms to invite their friends. Once created players can join by pasting the link containing the room code. The host can kick players and start the game as soon as there are at least 2 players waiting. The maximum room size is 10. After a short countdown the players will be presented with a prompt. After submitting their responses they are randomly switched and others have to think of an initial comment the response could have been headed to. Of course similar to Survive the Internet the goal is to make the others look bad (thus the name Cancelled!). Survive the Internet has a lot more functionality than this so you should definitely check it out.

## Testing locally

As I said the game isn't hosted as of now but of course you can still test it locally or even deploy it yourself. Just clone the repo and run `npm install` and `npm run dev`. The webserver will then be exposed on port 3000.

## Contributing

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
