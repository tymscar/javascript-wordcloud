import Topic from "./modules/topic.js"

var fontSlider = document.getElementById("fontSlider");
var paddingSlider = document.getElementById("paddingSlider");
const canvas = document.getElementById("cloudCanvas")
const canvasCtx = canvas.getContext('2d');


//REFACTOR THIS. Only for testing
let temporaryTopics

const jumpDistance = 5
let fontSize = fontSlider.value
let padding = paddingSlider.value

canvas.width = window.innerWidth * 0.7
canvas.height = canvas.width * 0.5625

fontSlider.oninput = () => {
  fontSize = fontSlider.value
  drawCloud(temporaryTopics)
}

paddingSlider.oninput = () => {
  padding = paddingSlider.value;
  drawCloud(temporaryTopics)
}





const drawCloud = (topics) => {
  canvasCtx.fillStyle = "black"
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
  canvasCtx.fillStyle = "white"

  const placedTopics = []
  let directionOfDrawing = 0
  let startPos = [canvas.width / 2, canvas.height / 2]

  let tilesNotDrawn = 0

  topics.forEach(topic => {
    canvasCtx.font = `${fontSize * topic.textSize}px sans serif`
    const word = topic.label
    const currTextSize = canvasCtx.measureText(word)




    topic.padding = padding
    topic.left = startPos[0] - currTextSize.width / 2
    topic.width = currTextSize.width
    topic.down = startPos[1] + currTextSize.actualBoundingBoxAscent / 2 + currTextSize.actualBoundingBoxDescent / 2
    topic.height = currTextSize.actualBoundingBoxAscent + currTextSize.actualBoundingBoxDescent


    let canBePlaced = true

    let directionsTried = 0

    do {
      canBePlaced = true

      switch (directionOfDrawing) {
        case 0:
          topic.down -= jumpDistance
          break;
        case 1:
          topic.left += jumpDistance
          break;
        case 2:
          topic.down += jumpDistance
          break;
        case 3:
          topic.left -= jumpDistance
      }


      placedTopics.forEach(placedTopic => {
        if (topic.intersects(placedTopic)) {
          canBePlaced = false
        }
      })

      if (topic.left < 0 || (topic.left + topic.width > canvas.width) || topic.down > canvas.height || (topic.down - topic.height < 0)) {
        topic.left = canvas.width / 2
        topic.width = currTextSize.width
        topic.down = canvas.height / 2
        topic.height = currTextSize.actualBoundingBoxAscent + currTextSize.actualBoundingBoxDescent
        canBePlaced = false
        directionOfDrawing = (directionOfDrawing + 1) % 4
        directionsTried += 1
      }


    } while (!canBePlaced && directionsTried < 4);



    canvasCtx.fillText(word, topic.left, topic.down)
    placedTopics.push(topic)
    directionOfDrawing = (directionOfDrawing + 1) % 4
    startPos = [topic.left, topic.down]
    if (!canBePlaced) {
      tilesNotDrawn++
    }
  })
  if (tilesNotDrawn > 0) {

    if (padding > 0) {
      padding--
    } else if (fontSize > 1) {
      fontSize--
    } else {
      console.error(`couldnt draw ${tilesNotDrawn} tiles`)
    }

    drawCloud(topics)
  }

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

  topics.sort((a, b) => (a.value > b.value) ? 1 : -1)
  for (let i = 0; i < topics.length; i++) {
    topics[i].textSize = i / (topics.length / 6) + 1
  }

  temporaryTopics = topics

  drawCloud(topics)
})
