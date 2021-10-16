const { Client, Intents } = require("discord.js")

const ENV = {
  botToken: "yourDiscordToken",
  channelId: "898666329521934347",
  interval: 60000,
  amount: 420,
  startIndex: 0,
  killerEmojis: ["🗡️", "🔫", "🔪", "⚔️"],
  killedEmojis: ["💀", "☠️", "🔥", "💥"],
}

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}
const randomIndex = (array) => {
  return Math.floor(Math.random() * array.length)
}

const startDiscordClient = () => {
  let client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES,
    ],
  })

  client.login(ENV.botToken)

  return client
}

const start = async () => {
  let client = startDiscordClient()

  let channel = await client.channels.fetch(ENV.channelId, {
    allowUnknownGuild: true,
  })

  let aliveKittens = Array.from({ length: ENV.amount }).map(
    (_, i) => i + ENV.startIndex
  )

  let killcount = {}

  aliveKittens.map((id) => {
    killcount[id] = []
  })

  const killOne = () => {
    let msg = ""
    let deadId = null
    let killerId = null

    // win condition
    if (aliveKittens.length === 1) {
      msg = `.\n\n🎉🎉🎉 **Winner: #${aliveKittens[0]}** 🎉🎉🎉\n\nVictims: ${
        killcount[aliveKittens[0]].length > 0
          ? killcount[aliveKittens[0]].map((x) => "#" + x).join(", ")
          : "none"
      }\n\n.`
      channel.send(msg)
      console.log(msg)
      clearInterval(timerId)
      return
    }

    const deadIndex = randomIndex(aliveKittens)

    deadId = aliveKittens[deadIndex]

    aliveKittens = aliveKittens
      .slice(0, deadIndex)
      .concat(aliveKittens.slice(deadIndex + 1, aliveKittens.length))

    killerId = randomItem(aliveKittens)

    killcount[killerId] = killcount[killerId].concat(deadId)

    msg += `.\n\n`
    msg += `${randomItem(
      ENV.killedEmojis
    )} **Kitten #${deadId} was slain.** Victims: ${
      killcount[deadId].length > 0
        ? killcount[deadId].map((x) => "#" + x).join(", ")
        : "none"
    }`
    msg += `\n\n`
    msg += `${randomItem(
      ENV.killerEmojis
    )} **Killed by #${killerId}.** Victims: ${
      killcount[killerId].length > 0
        ? killcount[killerId].map((x) => "#" + x).join(", ")
        : "none"
    }`
    msg += `\n\n`
    msg += `Total Alive: ${aliveKittens.length}`
    msg += `\n\n.`

    console.log(msg)
    channel.send(msg)
  }

  let timerId = setInterval(killOne, ENV.interval)
}

start()
