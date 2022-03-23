const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')

const apiURL = 'https://api.lyrics.ovh'

// Search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json()

    showData(data)
    console.log(data);
}

// Show song and artist in DOM
function showData(data) {
    // let output = ''
    // 
    // data.data.forEach(song => {
    //     output += `
    //         <li>
    //             <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //             <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    //         </li>
    //     `
    // });
    // result.innerHTML = `
    //     <ul class="songs">
    //         ${output}
    //     </ul>
    // `

    result.innerHTML = `
        <ul class="songs">
            ${data.data.map(song => `
                <li>
                    <div class="list-flex">
                        <img src="${song.album.cover_small}">
                        <div class="song-info">
                            <p>
                            <strong>${song.artist.name}</strong>
                            </p>
                    <p>${song.title}</p>
                        </div>
                    </div>
                    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                </li>
            `).join('')} 
        </ul>    
        `

    if(data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
            ${data.next ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `
    } else {
        more.innerHTML = ''
    }
}

// Get prev or next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json()

    showData(data)
}

// Get Lyrics for songs 
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    const data = await res.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    result.innerHTML = `
    <div class="back-btn" onClick="searchSongs('${artist}')">Go Back</div>
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
    `

    more.innerHTML = ''
    window.scrollTo(0, 0)
}

// function goBack(person) {
//     searchSongs(person)
// }


// Get lyrics button click
result.addEventListener('click', e => {
    const clickedEl = e.target

    if(clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist')
        const songTitle = clickedEl.getAttribute('data-songtitle')

        getLyrics(artist, songTitle)
    }
})

// Event Listeners
form.addEventListener('submit', e => {
    e.preventDefault()

    const searchTerm = search.value.trim()

    if(!searchTerm) {
        alert('Input a search')
    } else {
        searchSongs(searchTerm)
    }
})

// go to https://cors-anywhere.herokuapp.com/corsdemo to fix CORS