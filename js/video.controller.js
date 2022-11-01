'use-strict'

function onInit() {
    createVideos(renderVideos)
}

function renderVideos() {
    const currVideo = getCurrVideo()
    const videos = getVideos()
    const searchValue = getSearchValue()
    var strHTMLvideo = ''
    var strHTMLinfo = ''

    videos[searchValue].videos.forEach(
        (video, idx) => 
        strHTMLvideo += `<a href="#main-video" class="video-item-link"><div class="video-item" onclick="updateVideo(${idx})">`
        + `<img src="${video.snippet.thumbnails.default.url}" alt="">`+
        `<h3>${video.snippet.title}</h3></div></a>`
    )

    videos[searchValue].wiki.forEach(
        (info, idx) =>
        strHTMLinfo += `<div class="video-info-item"><h3>${info.title}</h3><p>${info.snippet}</p></div>`
    )

    document.querySelector('.video-frame').src = `https://www.youtube.com/embed/${currVideo.id.videoId}`
    document.querySelector('.videos').innerHTML = strHTMLvideo
    document.querySelector('.video-info').innerHTML = strHTMLinfo
}

function updateVideo(idx) {
    updateCurrVideo(idx)
    const currVideo = getCurrVideo()
    document.querySelector('.video-frame').src = `https://www.youtube.com/embed/${currVideo.id.videoId}`
}

function searchVideos(ev, input) {
    if(ev.key === 'Enter'){
        getVideosBySearch(input.value, renderVideos)
    }
}

function search(){
    const value = document.querySelector('.search').value
    getVideosBySearch(value, renderVideos)
}