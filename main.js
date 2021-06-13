import Topic from "./modules/topic.js"

const topicsDiv = document.getElementById("topics__div")
const canvas = document.getElementById("cloudCanvas")
const canvasCtx = canvas.getContext('2d');

const gap = 1
canvas.width = window.innerWidth * 0.7
canvas.height = canvas.width * 0.5625


canvasCtx.fillStyle = "black"
canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
canvasCtx.fillStyle = "white"



const drawCloud = (topics) => {
  const placedTopics = []

  topics.forEach(topic => {
    canvasCtx.font = '20px sans serif'
    const word = topic.label
    const currTextSize = canvasCtx.measureText(word)




    let increment = 0

    topic.left = canvas.width / 2 - currTextSize.width / 2
    topic.width = currTextSize.width
    topic.down = canvas.height / 2 + currTextSize.actualBoundingBoxAscent / 2 + currTextSize.actualBoundingBoxDescent / 2
    topic.height = currTextSize.actualBoundingBoxAscent + currTextSize.actualBoundingBoxDescent


    let canBePlaced = true
    let goUp = true

    do {
      console.log(placedTopics.length)
      canBePlaced = true
      if (goUp) {
        topic.down += increment
        goUp = false
      } else {
        topic.left += increment
        increment += gap
        goUp = true
      }


      placedTopics.forEach(placedTopic => {
        if (topic.intersects(placedTopic)) {
          canBePlaced = false
        }
      })

    } while (!canBePlaced);


    canvasCtx.fillText(word, topic.left, topic.down)
    placedTopics.push(topic)
  })
}


const getTopicsJson = async (URL) => {
  const topicsResponse = await fetch(URL)
  const topicsJson = await topicsResponse.json()
  const topics = topicsJson["topics"]
  return topics
}


getTopicsJson("topics.json").then(topicsJson => {
  const topics = []

  topicsJson.forEach(topicJson => {
    topics.push(new Topic(topicJson["label"], topicJson["volume"], topicJson["sentimentScore"]))
  })

  topics.forEach(topic => {
    const currentTopicP = document.createElement("p")
    currentTopicP.appendChild(document.createTextNode(`${topic.label} ---> volume: ${topic.volume}, sentiment: ${topic.sentimentScore}`))
    topicsDiv.appendChild(currentTopicP)
  })

  drawCloud(topics)
})
