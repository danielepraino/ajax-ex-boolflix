
//dichiaro le variabili per handlebarjs
var cardTemplate = $("#card-template").html();
var movieTemplate = Handlebars.compile(cardTemplate);

//creo l'oggetto da passare poi ad handlebarjs
var card = {
  cardNum: 0,
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
      console.log("cardInfo: " + cardInfo.length);
      for (var i = 0; i < cardInfo.length; i++) {
        card.cardNum = i;
        card.img = cardInfo[i].poster_path;
        card.title = cardInfo[i].title;
        card.originalTitle = cardInfo[i].original_title;
        card.language = cardInfo[i].original_language;
        card.vote = cardInfo[i].vote_average;
        $(".main").append(movieTemplate(card));
        setFlag(cardInfo[i].original_language, i);
        setScore(cardInfo[i].vote_average, i);
      }
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
function setScore(titleScore, j){
  var prepared = Math.round(titleScore)/2;
  for (var i = 1; i <= prepared; i++) {
    $(".card[data-card=" + j + "]").find($(".star[data-star=" + i + "] i")).removeClass("far").addClass("fas yellow");
  }
}

//NOTA: problema lingua da iso 639-1 a 639-2 da risolvere
function setFlag(titleLanguage, j){
  if (titleLanguage == "en"){
    $(".card[data-card=" + j + "]").find(".flag span").addClass("flag-icon flag-icon-gb");
  } else {
    $(".card[data-card=" + j + "]").find(".flag span").addClass("flag-icon flag-icon-" + titleLanguage);
  }
}

//al click del bottone, o all'invio, faccio una chiamata all'API di IMDB e creo una card che contiene
//tutti i dati relativi al film cercato. Ho notato che c'è un piccolo ritardo nella chiamata
//se genero la card instantaneamente sarà vuota, ho dovuto quindi inserire un setTimeout
//per compensare il ritardo e aspettare che la chiamata sia completata
function searchTitle() {
  $(".main").empty();
  var searchedTitle = $(".input-search").val();
  if (searchedTitle != "") {
    console.log("searchedTitle: " + searchedTitle);
    callIMBDAPI(searchedTitle);
  }
}

$(".btn").click(function(){
  searchTitle();
});

$(".input-search").keypress(function(event) {
  if(event.which == 13) {
    searchTitle();
  }
});
