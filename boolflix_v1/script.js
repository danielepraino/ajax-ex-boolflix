
//dichiaro le variabili per handlebarjs
var cardTemplate = $("#card-template").html();
var movieTemplate = Handlebars.compile(cardTemplate);

//creo l'oggetto da passare poi ad handlebarjs
var card = {
  img: "",
  title: "",
  originalTitle: "",
  language: "",
  vote: ""
};

//creo la funzione per richiamare l'API di IMDB, passandogli la chiave api e la query
//che sarà quello che l'utente scrive nel campo di ricerca
//dopo di che passo i valori che mi interessano all'oggetto card che andrò poi
//ad generare per ad ogni click
function callIMBDAPI(titleName){
  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data: {
      api_key: "3b199fd55ebf57026e1a083c4f9869b3",
      query: titleName
    },
    success: function(obj) {
      var cardInfo = obj.results;
      card.title = cardInfo[0].title;
      card.originalTitle = cardInfo[0].original_title;
      card.language = cardInfo[0].original_language;
      card.vote = cardInfo[0].vote_average;
      card.img = cardInfo[0].poster_path;
      console.log("card.title: " + card.title);
      console.log(cardInfo);
    },
    error: function() {
      alert("errore");
    }
  });
}

//al click del bottone faccio una chiamata all'API di IMDB e creo una card che contiene
//tutti i dati relativi al film cercato. Ho notato che c'è un piccolo ritardo nella chiamata
//se genero la card instantaneamente sarà vuota, ho dovuto quindi inserire un setTimeout
//per compensare il ritardo e aspettare che la chiamata sia completata
$(".btn").click(function(){
  $(".main").empty();
  var searchedTitle = $(".input-search").val();
  console.log("searchedTitle: " + searchedTitle);
  callIMBDAPI(searchedTitle);
  setTimeout(function(){
    $(".main").append(movieTemplate(card));
  }, 500);
});
