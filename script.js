window.addEventListener('load', () => {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const sortedTracks = sortTracksByPopularity(data);
            const top3Tracks = sortedTracks.slice(0, 3);
            displayTop3Albums(top3Tracks);
            createPieChart(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

window.addEventListener('load', () =>{
    d3.json('./data.json').then((data)=> {
        setTrackList(data);
        createChart(data);
    });
});

let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        document.getElementById("navbar").classList.remove("hidden");
    } else {
        document.getElementById("navbar").classList.add("hidden");
    }

    if (currentScroll === 0) {
        document.getElementById("navbar").classList.add("hidden");
    } else {
        document.getElementById("navbar").classList.remove("hidden");
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

function closeNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
    }
}

let currentAudio = null;

function setTrackList(data){
    let template = document.getElementById('trackCard');
    let trackListContainer = document.getElementById('trackList');
    trackListContainer.innerHTML = '';

    data.sort((a, b) => {
        const artistA = a.artists[0].name.toLowerCase();
        const artistB = b.artists[0].name.toLowerCase();
        if (artistA < artistB) return -1;
        if (artistA > artistB) return 1;
        return 0;
    });

    for (let i = 0; i < data.length; i++) {
        const clone = template.content.cloneNode(true);


        clone.querySelector('.card-title').textContent = data[i].name;
        clone.querySelector('.card-img-top').src = data[i].album.images[0].url;
        clone.querySelector('.card-img-top').alt = data[i].name;
        const artists = data[i].artists.map(artist => artist.name).join(', ');
        clone.querySelector('.card-text').textContent = artists;
        const spotifyLink = data[i].external_urls.spotify;
        clone.querySelector('.btn').setAttribute('href', spotifyLink);
        const followersTotal = data[i].artists[0].followers.total;
        clone.querySelector('.followers').textContent = `Followers : ${followersTotal}`;
        const popularity = data[i].popularity;
        clone.querySelector('.blockquote-footer').textContent = `Popularité : ${popularity}`;
        const previewUrl = data[i].preview_url;
        const albumImageUrl = data[i].album.images[0].url;
        const audio = new Audio(previewUrl);
        clone.querySelector('.card').addEventListener('click', () => {
            toggleAudio(audio, data[i].name, albumImageUrl);
        });
      trackListContainer.appendChild(clone);
    }
}

let selectedCard = null;

function toggleHover(card) {
    if (selectedCard !== card) {
        if (selectedCard !== null) {
            selectedCard.classList.remove('hover');
        }
        selectedCard = card;
        card.classList.add('hover');
    }
}

function toggleAudio(audio, trackName, albumImageUrl) {
  if (currentAudio && currentAudio !== audio) {
      currentAudio.pause(); 
      currentAudio.currentTime=0;
  }
  if (currentAudio !== audio) {
      currentAudio = audio;
      currentAudio.play();
      showNowPlayingBanner(trackName);
      document.body.style.backgroundImage = `url(${albumImageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundRepeat = 'no-repeat';
  } else {
      if (currentAudio.paused) {
          currentAudio.play();
          showNowPlayingBanner(trackName);
          document.body.style.backgroundImage = `url(${albumImageUrl})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundAttachment = 'fixed';
          document.body.style.backgroundRepeat = 'no-repeat';
      } else {
          currentAudio.pause();
      }
  }

  const volumeRange = document.getElementById('volumeRange');
  currentAudio.volume = volumeRange.value / 100;
  
  volumeRange.addEventListener('input', function() {
    currentAudio.volume = volumeRange.value / 100;
  });
}


function attachCloseButtonEvent() {
    document.getElementById('closeBannerBtn').addEventListener('click', function() {
        currentAudio.pause(); 
        currentAudio.currentTime=0;
        hideNowPlayingBanner();
        selectedCard.classList.remove('hover');
        document.body.style.backgroundImage = 'none';
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
            document.body.style.backgroundImage = 'none';
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
        trackName.textContent = index+1 + "." + " " + track.name;
        carouselCaption.appendChild(trackName);

        const artistName = document.createElement('p');
        artistName.textContent = track.artists[0].name;
        carouselCaption.appendChild(artistName);

        carouselItem.appendChild(carouselCaption);
        carouselInner.appendChild(carouselItem);
    }
}

function createPieChart(data) {
    const artistCounts = {};
    const artistColors = {};

    data.forEach(track => {
        track.artists.forEach(artist => {
            if (artist.name in artistCounts) {
                artistCounts[artist.name]++;
            } else {
                artistCounts[artist.name] = 1;
                const color = getRandomColor();
                artistColors[artist.name] = color;
            }
        });
    });

    const labels = Object.keys(artistCounts);
    const dataValues = Object.values(artistCounts);
    const backgroundColors = labels.map(label => artistColors[label]);

    const pieData = {
        labels: labels,
        datasets: [{
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: 'white',
            borderWidth: 1
        }]
    };

    const pieConfig = {
        type: 'pie',
        data: pieData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Répartition des musiques par artiste'
                }
            }
        }
    };

    const ctx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(ctx, pieConfig);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}