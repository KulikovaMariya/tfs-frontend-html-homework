export default class SearchHistoryStorage {
    constructor() {
        this.storage = new Map();
        this.storageByImdbId = new Map();
    }
}