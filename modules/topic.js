class Topic {
    constructor(label, volume, sentimentScore, sentiment) {
        this.label = label
        this.volume = volume
        this.sentimentScore = sentimentScore
        this.sentiment = sentiment
        if (this.sentiment["positive"] == undefined) {
            this.sentiment["positive"] = 0
        }
        if (this.sentiment["neutral"] == undefined) {
            this.sentiment["neutral"] = 0
        }
        if (this.sentiment["negative"] == undefined) {
            this.sentiment["negative"] = 0
        }


        this.padding = 0

        this.textSize = 0

        this.left = 0
        this.width = 0
        this.down = 0
        this.height = 0
    }
    intersects(other) {
        if (this.left >= other.left + other.width + other.padding || other.left >= this.left + this.width + this.padding) return false;
        if (this.down >= other.down + other.height + other.padding || other.down >= this.down + this.height + this.padding) return false;
        return true
    }
    contains(point) {
        if (this.left < point[0] &&
            this.left + this.width > point[0] &&
            this.down - this.height < point[1] &&
            this.down > point[1])
            return true
        return false
    }
}

export default Topic