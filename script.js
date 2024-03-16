window.addEventListener('load', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const sortedTracks = sortTracksByPopularity(data);
            const top3Tracks = sortedTracks.slice(0, 3);
            displayTop3Albums(top3Tracks);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

window.addEventListener('load', () =>{
    d3.json('data.json').then((data)=> {
        setTrackList(data);
        createChart(data);
    });
});

let currentAudio = null;

function setTrackList(data){
    let template = document.getElementById('trackCard');
    let trackListContainer = document.getElementById('trackList');
    trackListContainer.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const clone = template.content.cloneNode(true);


        clone.querySelector('.card-title').textContent = data[i].name;
        clone.querySelector('.card-img-top').src = data[i].album.images[0].url;
        clone.querySelector('.card-img-top').alt = data[i].name;
        const artists = data[i].artists.map(artist => artist.name).join(', ');
        clone.querySelector('.card-text').textContent = artists;
        const previewUrl = data[i].preview_url;
        const audio = new Audio(previewUrl);
        clone.querySelector('.card').addEventListener('click', () => {
            toggleAudio(audio, data[i].name);
        });
      trackListContainer.appendChild(clone);
    }
}

function toggleAudio(audio, trackName) {
  if (currentAudio && currentAudio !== audio) {
      currentAudio.pause(); 
      currentAudio.currentTime=0;
  }
  if (currentAudio !== audio) {
      currentAudio = audio;
      currentAudio.play();
      showNowPlayingBanner(trackName);
  } else {
      if (currentAudio.paused) {
          currentAudio.play();
          showNowPlayingBanner(trackName);
      } else {
          currentAudio.pause();
          hideNowPlayingBanner();
      }
  }
}

function attachCloseButtonEvent() {
    document.getElementById('closeBannerBtn').addEventListener('click', function() {
        currentAudio.pause(); 
        currentAudio.currentTime=0;
        hideNowPlayingBanner();
    });
}

function showNowPlayingBanner(trackName, artists) {
    const banner = document.getElementById('nowPlayingBanner');
    const nowPlayingTrack = document.getElementById('nowPlayingTrack');
    nowPlayingTrack.textContent = trackName;
    banner.classList.add('visible');
    attachCloseButtonEvent();
    const audio = currentAudio;
    audio.addEventListener('timeupdate', function() {
        if (audio.currentTime >= audio.duration) {
            hideNowPlayingBanner();
        }
    });
}



function hideNowPlayingBanner() {
    const banner = document.getElementById('nowPlayingBanner');
    banner.classList.remove('visible');
}

document.getElementById('closeBannerBtn').addEventListener('click', function() {
    hideNowPlayingBanner();
});

document.getElementById('nowPlayingBanner').addEventListener('click', function() {
    showNowPlayingBanner("Nom de la piste");
});

function createChart(data) {
  const musicNames = data.map(track => track.name);
  const popularity = data.map(track => track.popularity);

  const ctx = document.getElementById('popularityChart').getContext('2d');
  const popularityChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: musicNames,
          datasets: [{
              label: 'Popularité',
              data: popularity,
              backgroundColor: 'rgba(255, 0, 0, 0.75)',
              borderColor: 'rgba(255, 0, 0, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

function sortTracksByPopularity(tracks) {
    return tracks.sort((a, b) => b.popularity - a.popularity);
}

function displayTop3Albums(data) {
    const carouselInner = document.querySelector('.carousel-inner');

    for (let index = 0; index < data.length && index < 3; index++) {
        const track = data[index];
        const images = track.album.images;
        const imageUrl = images.length > 0 ? images[0].url : '';

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }

        const image = document.createElement('img');
        image.src = imageUrl;
        image.classList.add('d-block', 'w-100');
        carouselItem.appendChild(image);

        const carouselCaption = document.createElement('div');
        carouselCaption.classList.add('carousel-caption');

        const trackName = document.createElement('h5');
        trackName.textContent = track.name;
        carouselCaption.appendChild(trackName);

        const artistName = document.createElement('p');
        artistName.textContent = track.artists[0].name;
        carouselCaption.appendChild(artistName);

        carouselItem.appendChild(carouselCaption);
        carouselInner.appendChild(carouselItem);
    }
}