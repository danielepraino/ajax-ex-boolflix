
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

//creo una funzione che converte il punteggio in un range da 1 a 5 e lo arrotonda
//in base al punteggio assegno le stelline
function setScore(titleScore){
  var prepared = Math.round(titleScore)/2;
  for (var i = 1; i <= prepared; i++) {
    $(".star[data-star=" + i + "]").find("i").removeClass("far").addClass("fas yellow");
  }
}

//NOTA: problema lingua da iso 639-1 a 639-2 da risolvere
function setFlag(titleLanguage){
  if (titleLanguage == "en"){
    $(".flag").find("span").addClass("flag-icon flag-icon-gb");
  } else {
    $(".flag").find("span").addClass("flag-icon flag-icon-" + titleLanguage);
  }
}

//al click del bottone faccio una chiamata all'API di IMDB e creo una card che contiene
//tutti i dati relativi al film cercato. Ho notato che c'è un piccolo ritardo nella chiamata
//se genero la card instantaneamente sarà vuota, ho dovuto quindi inserire un setTimeout
//per compensare il ritardo e aspettare che la chiamata sia completata
$(".btn").click(function(){
  $(".main").empty();
  var searchedTitle = $(".input-search").val();
  if (searchedTitle != "") {
    console.log("searchedTitle: " + searchedTitle);
    callIMBDAPI(searchedTitle);
    setTimeout(function(){
      $(".main").append(movieTemplate(card));
      setFlag(card.language);
      setScore(card.vote);
    }, 500);
  }
});
