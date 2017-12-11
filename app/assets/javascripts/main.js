  $(function(){
  let form = $('#movie-search');
  form.submit(function(e){
    e.preventDefault();

    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie?api_key=3deceb9041e72a8856191ddeaf96a293',
      data: form.serialize()
    })
    .done(function(data){
      displayMovies(data);
    });
    
    
  });

  $('#movies').on('click','img.movie_poster',function(e){
  e.preventDefault();

  let id = $(e.target).data('id');

  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/' + id + '?',
    data: {'api_key' : '3deceb9041e72a8856191ddeaf96a293'}
  })
  .done(function(data){
    displayMovie(data)
  });
});



function displayMovies(data){
  let container = $("#movies");
  let htmlString = "";

  container.empty();

  let imageUrl = getBaseImageUrl();

  if (data["results"].length == 0) {
    htmlString = `<div class="alert alert-danger text-center" role="alert">No Data Found!</div>`;
  }
  else{
    data["results"].forEach(function(movie){
      htmlString += `<img src=${movie["poster_path"] == null ? "/assets/image.png" : imageUrl + "/" + movie["poster_path"]} data-id="${movie['id']}" class = "movie_poster"/>
                     <p>${movie["title"]}</p>
                     <p>${movie["overview"]}</p>`;
    });
  }

  container.append(htmlString);
}



function getBaseImageUrl(){
  var url = "";
  var settings = {
    "async": false,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/configuration?api_key=3deceb9041e72a8856191ddeaf96a293",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {
    url = response["images"]["base_url"] + response["images"]["poster_sizes"][3];
  });
  return url;
}



  


    function displayMovie(data){
        let container = $("#movies");
        let htmlString = "";
        container.empty();
        let imageUrl = getBaseImageUrl();
        
        htmlString +=
        `
            <img src=${data["poster_path"] == null ? "/assets/image.png" : imageUrl + "/" + data["poster_path"]} data-id="${data['id']}" class = "movie_poster"/>
            <h1>${data["title"]}</h2>
            <h3>Vote Average:${data["vote_average"]}</h3>
           <b> Adult:</b> ${data["adult"]}<br />
            <b>Overview: </b> ${data["overview"]}<br />
            <b>Original Title: </b> ${data["original_title"]}<br />
            <b>Original Language: </b> ${data["original_language"]}<br />
            <b>Release Date: </b> ${data["release_date"]}<br />
            <b>Popularity: </b> ${data["popularity"]}<br />
        `;
        
        
        container.append(htmlString);
}
}); 







