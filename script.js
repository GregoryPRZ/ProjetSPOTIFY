fetch('dataunform.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });


window.addEventListener('load', () =>{
    d3.json('dataunform.json').then((data)=> {
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
        const previewUrl = data[i].preview_url;
        const audio = new Audio(previewUrl);
        clone.querySelector('.card').addEventListener('click', () => {
            toggleAudio(audio);
        });
      trackListContainer.appendChild(clone);
    }
}

function toggleAudio(audio) {
  if (currentAudio && currentAudio !== audio) {
      currentAudio.pause(); // Mettre en pause l'audio actuel s'il est différent du nouveau
  }
  if (currentAudio !== audio) {
      currentAudio = audio;
      currentAudio.play(); // Démarrer la lecture de l'audio sélectionné
  } else {
      if (currentAudio.paused) {
          currentAudio.play(); // Reprendre la lecture si en pause
      } else {
          currentAudio.pause(); // Mettre en pause si en cours de lecture
      }
  }
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