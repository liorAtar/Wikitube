'use-strict'

const API_KEY = 'AIzaSyDvNWPglsgM2BWKO2-oEsUtl0En9Q3YnPo'
const STORAGE_KEY = 'videos'
const API_START = 'https://www.googleapis.com/youtube/v3/'

var gSearchValue = 'beatles'

const gVideos = {
    [gSearchValue]: {
        pageInfo: {
            totalResults: 0,
            resultsPerPage: 0
        },
        videos: [],
        wiki: []
    }
}

const gCurrVideo = {
    etag: '',
    id: {},
    kind: '',
    snippet: {}
}

function getVideos() {
    return gVideos
}

function getSearchValue() {
    return gSearchValue
}

function getDataFromUrl(url) {
    const prm1 = axios.get(url)
    return prm1.then(res => {
        return res.data
    })
}

function createVideos(onSuccess) {
    var videos = loadFromStorage(STORAGE_KEY)

    if (!videos) {
        getDataFromUrl(`${API_START}search?part=snippet&videoEmbeddable=true&type=video&q=${gSearchValue}&key=${API_KEY}`).then(res => {
            updateVideosData(res.pageInfo, res.items)
            updateCurrVideo(0)
            getWikiInfo(onSuccess)
            // saveToStorage(STORAGE_KEY, gVideos)
            // onSuccess()
        })
    } else {
        updateVideosData(videos[gSearchValue].pageInfo, videos[gSearchValue].videos)
        gVideos[gSearchValue].wiki = videos[gSearchValue].wiki
        updateCurrVideo(0)
        onSuccess()
    }
}

function updateVideosData(pageInfo, videos) {
    gVideos[gSearchValue].pageInfo = pageInfo
    gVideos[gSearchValue].videos = videos
}

function getCurrVideo() {
    return gCurrVideo
}

function updateCurrVideo(idx) {
    gCurrVideo.etag = gVideos[gSearchValue].videos[idx].etag
    gCurrVideo.id = gVideos[gSearchValue].videos[idx].id
    gCurrVideo.kind = gVideos[gSearchValue].videos[idx].kind
    gCurrVideo.snippet = gVideos[gSearchValue].videos[idx].snippet
}

function getVideosBySearch(searchValue, onSuccess) {
    if (!gVideos[searchValue]) {
        gSearchValue = searchValue
        gVideos[gSearchValue] = {
            pageInfo: {
                totalResults: 0,
                resultsPerPage: 0
            },
            videos: [],
            wiki: []
        }
        getDataFromUrl(`${API_START}search?part=snippet&videoEmbeddable=true&type=video&q=${gSearchValue}&key=${API_KEY}`).then(res => {
            updateVideosData(res.pageInfo, res.items)
            updateCurrVideo(0)
            getWikiInfo(onSuccess)

            // saveToStorage(STORAGE_KEY, gVideos)
            // onSuccess()
        })
    }else {
        updateCurrVideo(0)
    }
}

function getWikiInfo(onSuccess) {
    getDataFromUrl(`https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&srsearch=${gSearchValue}&format=json`).then(res => {
        gVideos[gSearchValue].wiki = res.query.search
        saveToStorage(STORAGE_KEY, gVideos)
        onSuccess()
    })
}