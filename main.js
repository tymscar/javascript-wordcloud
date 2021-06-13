import Topic from "./modules/topic.js"

const topicsDiv = document.getElementById("topics__div")


const getTopicsJson = async (URL)=>{
  const topicsResponse = await fetch(URL)
  const topicsJson = await topicsResponse.json()
  const topics = topicsJson["topics"]
  return topics
}


getTopicsJson("topics.json").then(topicsJson => {
  const topics = []

  topicsJson.forEach(topicJson =>{
    topics.push(new Topic(topicJson["label"],topicJson["volume"],topicJson["sentimentScore"]))
  })

  topics.forEach(topic=>{
    const currentTopicP = document.createElement("p")
    currentTopicP.appendChild(document.createTextNode(`${topic.label} ---> volume: ${topic.volume}, sentiment: ${topic.sentimentScore}`))
    topicsDiv.appendChild(currentTopicP)
  })
})