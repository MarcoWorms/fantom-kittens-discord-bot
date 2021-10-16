const { Client, Intents } = require("discord.js")

const start = async () => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES,
    ],
  })

  client.login("")

  const channel = await client.channels.fetch("898666329521934347", {
    allowUnknownGuild: true,
  })

  let liveKittens = Array.from({ length: 420 }).map((_, i) => i)

  let killCount = {}

  liveKittens.map((id) => {
    killCount[id] = 0
  })

  let timerId = setInterval(() => {
    let msg = ""

    if (liveKittens.length === 1) {
      msg = `🎉 Winner: #${liveKittens[0]}! Kill count: ${
        killCount[liveKittens[0]]
      }`
      channel.send(msg)
      console.log(msg)
      clearInterval(timerId)
      return
    }

    const deadIndex = Math.floor(Math.random() * liveKittens.length)

    deadId = liveKittens[deadIndex]
    liveKittens = liveKittens
      .slice(0, deadIndex)
      .concat(liveKittens.slice(deadIndex + 1, liveKittens.length))

    const killerId = liveKittens[Math.floor(Math.random() * liveKittens.length)]

    killCount[killerId] += 1

    msg += `💀 **Kitten #${deadId} was slain** with a kill count of ${killCount[deadId]}`
    msg += `\n\n`
    msg += `🔪 Killed by #${killerId} with a kill count of ${killCount[killerId]}`
    msg += `\n\n`
    msg += `🐈 Total Alive: ${liveKittens.length}`
    console.log(msg)
    channel.send(msg)
  }, 60000)
}

start()
