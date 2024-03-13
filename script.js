fetch('dataunform.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });


window.addEventListener('load', () =>{
    d3.json('dataunform.json').then((data)=> {
    for (var i=0; i < data.length; i++){
        console.log(data[i].album.name);
        setTrackList(data)
    }
});
});

function setTrackList(data){
    let template = document.getElementById('trackCard');

    for (let i = 0; i < data.length; i++) {
        const clone = template.content.cloneNode(true);


        clone.querySelector('.card-title').textContent = data[i].name;
        clone.querySelector('.card-img-top').src = data[i].album.images[0].url;
        clone.querySelector('.card-img-top').alt = data[i].name;

        document.getElementById('trackList').appendChild(clone);
    }
}
