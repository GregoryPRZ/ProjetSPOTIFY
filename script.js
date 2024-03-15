window.addEventListener('load', () => {
    fetch('dataunform.json')
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
    d3.json('dataunform.json').then((data)=> {
        setTrackList(data);
        createChart(data);
        createPieChart(data);
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
      }
  }
}

function showNowPlayingBanner(trackName) {
  const banner = document.getElementById('nowPlayingBanner');
  const nowPlayingTrack = document.getElementById('nowPlayingTrack');
  nowPlayingTrack.textContent = trackName;
  banner.style.display = 'none';
}

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
    // Triez les pistes par popularité (ou tout autre critère pertinent)
    return tracks.sort((a, b) => b.popularity - a.popularity);
}

function displayTop3Albums(data) {
    const top3 = data.slice(0, 3);
    const carouselInner = document.querySelector('.carousel-inner');

    top3.forEach((track, index) => {
        const imageUrl = track.album.images[0].url;
        const activeClass = index === 0 ? 'active' : '';

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item', activeClass);

        const image = document.createElement('img');
        image.src = imageUrl;
        image.classList.add('d-block', 'w-100');

        carouselItem.appendChild(image);
        carouselInner.appendChild(carouselItem);
    });

    $('.carousel').carousel({
        interval: 3000
    });
}