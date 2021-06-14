import Topic from "./modules/topic.js"
import Cloud from "./modules/cloud.js"

const fontSlider = document.getElementById("fontSlider")
const paddingSlider = document.getElementById("paddingSlider")
const canvas = document.getElementById("cloudCanvas")





// canvas.addEventListener("mousemove", function (e) {
//   var cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
//   var canvasX = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
//   var canvasY = Math.round(e.clientY - cRect.top);         // positions to get make (0,0) the top left of the 
//   console.log(canvasX, canvasY)
// });






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

  const currentCloud = new Cloud(topics, canvas, fontSlider, paddingSlider)

  currentCloud.orderCloud()
})
