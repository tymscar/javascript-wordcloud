class Cloud {
    constructor(topics, canvas, fontSlider, paddingSlider) {
        this.topics = topics
        this.canvas = canvas

        this.fontSlider = fontSlider
        this.fontSlider.oninput = this.fontSliderChangeHandler
        this.fontSize = this.fontSlider.value

        this.paddingSlider = paddingSlider
        this.paddingSlider.oninput = this.paddingSliderChangeHandler
        this.padding = this.paddingSlider.value

        this.jumpDistance = 5

        this.context = this.canvas.getContext('2d')
        this.canvas.width = window.innerWidth * 0.7
        this.canvas.height = this.canvas.width * 0.5625
    }

    fontSliderChangeHandler = () => {
        this.fontSize = this.fontSlider.value
        this.orderCloud()
    }

    paddingSliderChangeHandler = () => {
        this.padding = this.paddingSlider.value
        this.orderCloud()
    }

    drawCloud = (offset) => {
        this.context.fillStyle = "#aaaaaa"
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.topics.forEach(topic => {
            this.context.fillStyle = "#414a4c"
            if (topic.sentimentScore > 60)
                this.context.fillStyle = "#007f5c"
            if (topic.sentimentScore < 40)
                this.context.fillStyle = "#9b111e"
            this.context.font = `${this.fontSize * topic.textSize}px sans serif`
            this.context.fillText(topic.label, topic.left + offset[0], topic.down + offset[1])
        })
    }

    orderCloud = () => {
        let topmostPos = this.canvas.height
        let botmostPos = 0
        let leftmostPos = this.canvas.width
        let rightmostPos = 0
        const placedTopics = []
        let directionOfDrawing = 0
        let startPos = [this.canvas.width / 2, this.canvas.height / 2]

        let tilesNotDrawn = 0

        this.topics.forEach(topic => {
            this.context.font = `${this.fontSize * topic.textSize}px sans serif`
            const word = topic.label
            const currTextSize = this.context.measureText(word)




            topic.padding = this.padding
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
                        topic.down -= this.jumpDistance
                        break;
                    case 1:
                        topic.left += this.jumpDistance
                        break;
                    case 2:
                        topic.down += this.jumpDistance
                        break;
                    case 3:
                        topic.left -= this.jumpDistance
                }


                placedTopics.forEach(placedTopic => {
                    if (topic.intersects(placedTopic)) {
                        canBePlaced = false
                    }
                })

                if (topic.left < 0 || (topic.left + topic.width > this.canvas.width) || topic.down > this.canvas.height || (topic.down - topic.height < 0)) {
                    topic.left = this.canvas.width / 2
                    topic.width = currTextSize.width
                    topic.down = this.canvas.height / 2
                    topic.height = currTextSize.actualBoundingBoxAscent + currTextSize.actualBoundingBoxDescent
                    canBePlaced = false
                    directionOfDrawing = (directionOfDrawing + 1) % 4
                    directionsTried += 1
                }


            } while (!canBePlaced && directionsTried < 4);



            placedTopics.push(topic)
            directionOfDrawing = (directionOfDrawing + 1) % 4
            startPos = [topic.left, topic.down]
            if (!canBePlaced) {
                tilesNotDrawn++
            } else {
                if (topic.down + topic.height < topmostPos)
                    topmostPos = topic.down + topic.height
                if (topic.left < leftmostPos)
                    leftmostPos = topic.left
                if (topic.left + topic.width > rightmostPos)
                    rightmostPos = topic.left + topic.width
                if (topic.down > botmostPos)
                    botmostPos = topic.down
            }
        })
        if (tilesNotDrawn > 0) {

            if (this.padding > 0) {
                this.padding--
            } else if (this.fontSize > 1) {
                this.fontSize--
            } else {
                console.error(`couldnt draw ${tilesNotDrawn} tiles`)
            }

            this.orderCloud()
        } else {
            const leftGap = leftmostPos
            const rightGap = this.canvas.width - rightmostPos
            const leftOffset = (rightGap - (rightGap + leftGap) / 2)

            const topGap = topmostPos
            const botGap = this.canvas.height - botmostPos
            const topOffset = (botGap - (botGap + topGap) / 2) / 2

            this.drawCloud([leftOffset, topOffset])
        }


    }
}

export default Cloud