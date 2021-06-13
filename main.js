import Topic from "./modules/topic.js"

const topicsDiv = document.getElementById("topics__div")
const canvas = document.getElementById("cloudCanvas")
const canvasCtx = canvas.getContext('2d');

const gap = 10
canvas.width = window.innerWidth * 0.7
canvas.height = canvas.width * 0.5625


canvasCtx.fillStyle = "black"
canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
canvasCtx.fillStyle = "white"



const drawCloud = (topics) => {

  const placedTopics = []
  let directionOfDrawing = 0
  let startPos = [canvas.width / 2, canvas.height / 2]

  topics.forEach(topic => {
    canvasCtx.font = '20px sans serif'
    const word = topic.label
    const currTextSize = canvasCtx.measureText(word)





    topic.left = startPos[0] - currTextSize.width / 2
    topic.width = currTextSize.width
    topic.down = startPos[1] + currTextSize.actualBoundingBoxAscent / 2 + currTextSize.actualBoundingBoxDescent / 2
    topic.height = currTextSize.actualBoundingBoxAscent + currTextSize.actualBoundingBoxDescent


    let canBePlaced = true

    do {
      console.log(directionOfDrawing)
      canBePlaced = true

      switch (directionOfDrawing) {
        case 0:
          topic.down -= gap
          break;
        case 1:
          topic.left += gap
          break;
        case 2:
          topic.down += gap
          break;
        case 3:
          topic.left -= gap
      }


      placedTopics.forEach(placedTopic => {
        if (topic.intersects(placedTopic)) {
          canBePlaced = false
        }
      })

      if (topic.left < 0 || (topic.left + topic.width > canvas.width) || topic.down > canvas.height || (topic.down - topic.height < 0)) {
        topic.left = canvas.width / 2 - currTextSize.width / 2
        topic.width = currTextSize.width
        topic.down = canvas.height / 2 + currTextSize.actualBoundingBoxAscent / 2 + currTextSize.actualBoundingBoxDescent / 2
        topic.height = currTextSize.actualBoundingBoxAscent + currTextSize.actualBoundingBoxDescent
        canBePlaced = false
        directionOfDrawing = (directionOfDrawing + 1) % 4
      }


    } while (!canBePlaced);


    canvasCtx.fillText(word, topic.left, topic.down)
    placedTopics.push(topic)
    directionOfDrawing = (directionOfDrawing + 1) % 4
    startPos = [topic.left, topic.down]
  })
}


const getTopicsJson = async (URL) => {
  const topicsResponse = await fetch(URL)
  const topicsJson = await topicsResponse.json()
  const topics = topicsJson["topics"]
  console.log(topics.length)
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
