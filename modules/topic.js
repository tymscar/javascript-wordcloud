class Topic {
    constructor(label, volume, sentimentScore) {
        this.label = label
        this.volume = volume
        this.sentimentScore = sentimentScore


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
}

export default Topic