class Topic {
    constructor(label, volume, sentimentScore) {
        this.label = label
        this.volume = volume
        this.sentimentScore = sentimentScore

        this.left = 0
        this.width = 0
        this.down = 0
        this.height = 0
    }
    intersects(other) {
        if (this.left >= other.left + other.width || other.left >= this.left + this.width) return false;
        if (this.down >= other.down + other.height || other.down >= this.down + this.height) return false;
        return true
    }
}

export default Topic