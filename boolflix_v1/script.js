//dichiaro le variabili per la chiamata API
var queryArr = ["movie", "tv"];
var imgUrl = "https://image.tmdb.org/t/p/w300";

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
  vote: "",
  overview: ""
};

//creo la funzione per richiamare l'API di IMDB, passandogli la chiave api e la query
//che sarà quello che l'utente scrive nel campo di ricerca.
//Ho notato che c'è un piccolo ritardo nella chiamata se genero la card instantaneamente
//sarà vuota, ho dovuto quindi inserire un setTimeout per compensare il ritardo e aspettare che la chiamata sia completata
function callIMBDAPI(titleName, arr, i){
  $.ajax({
    url: switchApiUrl(arr, i),
    method: "GET",
    data: {
      api_key: "3b199fd55ebf57026e1a083c4f9869b3",
      query: titleName,
      language: "it"
    },
    success: function(obj) {
      setTimeout(function(){
        addCardData(obj, i);
      }, 500);
    },
    error: function() {
      alert("errore");
    }
  });
}

//creo la funzione che popola ogni card, in base se è movie o tv
//gestisco il caso in cui non ci sia nessuna immagine caricandone una di default n/a
function addCardData(obj, arr){
  var cardInfo = obj.results;
  console.log("cardInfo.length: " + cardInfo.length);
  if (cardInfo.length == 0 && arr == 0) {
    $(".rail").html("<p class='noSearchResults'><span>OPS!</span><br> Sembra che tu abbia cercato qualcosa che non esiste!<br> Prova con un altro nome</p>");
  }
  console.log(cardInfo);
  for (var i = 0; i < cardInfo.length; i++) {
    card.cardNum = i;
    card.img = imgUrl + cardInfo[i].poster_path;
    if (arr == 0) {
      card.title = cardInfo[i].title;
      card.originalTitle = cardInfo[i].original_title;
    } else {
      card.title = cardInfo[i].name;
      card.originalTitle = cardInfo[i].original_name;
    }

    card.language = cardInfo[i].original_language;
    card.vote = cardInfo[i].vote_average;

    if (cardInfo[i].overview == ""){
      card.overview = "n/a";
    } else {
      card.overview = cardInfo[i].overview;
    }
    //se il film o telefilm non ha l'immagine non genero la card relativa
    if (cardInfo[i].poster_path != null){
      $(".rail").append(movieTemplate(card));
      $(".arrow.right").addClass("show");
    }
    setFlag(cardInfo[i].original_language, arrISO, i);
    setScore(cardInfo[i].vote_average, i);
  }

  $(".card").mouseover(function(){
    $(this).addClass("animate");
    $(this).find(".card-info").addClass("active");
  });

  $(".card").mouseleave(function(){
    $(".card").removeClass("animate");
    $(".card-info").removeClass("active");
  });
  //richiamo la funzione per calcolare tutti i dati che mi servono per fare lo slide delle cards
  setTimeout(cardSlideCal, 500);
}

//creo una funzione che converte il punteggio in un range da 1 a 5 e lo arrotonda
//in base al punteggio assegno le stelline
function setScore(titleScore, j){
  var prepared = Math.ceil(titleScore/2);
  for (var i = 1; i <= prepared; i++) {
    $(".card[data-card=" + j + "]").find($(".star[data-star=" + i + "] i")).removeClass("far").addClass("fas yellow");
  }
}

//creo un oggetto che contiene la conversione da lingua a paese
//questo mi serve per gestire la libreria delle bandiere
var arrISO = {
    "aa": "dj", "af": "za", "ak": "gh", "sq": "al", "am": "et", "ar": "aa", "hy": "am", "ay": "wh", "bm": "ml", "be": "by", "bn": "bd", "bi": "vu", "bs": "ba", "my": "mm", "ca": "ad", "zh": "cn", "cs": "cz", "da": "dk", "dv": "mv", "dz": "bt", "en": "gb", "et": "ee", "ee": "ew", "fil": "ph", "gaa": "gh", "ka": "ge", "el": "gr", "gn": "gx", "gu": "in", "he": "il", "hi": "in", "ho": "pg", "ig": "ng", "ga": "ie", "ja": "jp", "kr": "ne", "kk": "kz", "km": "kh", "kmb": "ao", "kg": "cg", "ko": "kr", "kj": "ao", "ku": "iq", "ky": "kg", "lo": "la", "la": "va", "ln": "cg", "lu": "cd", "lb": "lu", "ms": "my", "mi": "nz", "mos": "bf", "ne": "np", "nd": "zw", "nso": "za", "nb": "no", "nn": "no", "ny": "mw", "pap": "aw", "ps": "af", "fa": "ir", "pa": "in", "qu": "wh", "rm": "ch", "rn": "bi", "sg": "cf", "sr": "rs", "srr": "sn", "sn": "zw", "si": "lk", "sl": "si", "snk": "sn", "nr": "za", "st": "ls", "ss": "sz", "sv": "se", "tl": "ph", "tg": "tj", "ta": "lk", "te": "in", "tet": "tl",
    "ti": "er", "tpi": "pg", "ts": "za", "tn": "bw", "tk": "tm", "uk": "ua", "umb": "ao", "ur": "pk", "ve": "za", "vi": "vn", "cy": "gb", "wo": "sn", "xh": "za", "zu": "za"
}

//creo la funzione per impostare la bandiera corretta in base alla Lingua
//controllo se la lingua è presente nell'array di conversione aggiunge la classe "convertita", altrimenti
//aggiunge la classe con la lingua presa direttamente da IMDB
function setFlag(titleLanguage, arr, j){
  for (var i = 0; i < Object.values(arr).length; i++) {
    if (titleLanguage.includes(Object.keys(arr)[i])){
      $(".card[data-card=" + j + "]").find(".flag span").addClass("flag-icon flag-icon-" + Object.values(arr)[i]);
      i = Object.values(arr).length;
    } else {
      $(".card[data-card=" + j + "]").find(".flag span").addClass("flag-icon flag-icon-" + titleLanguage);
    }
  }
}

//creo una funzione per lo switch dell'url dell'API, tra movie e tv
function switchApiUrl(arr, i){
    var apiUrl = "https://api.themoviedb.org/3/search/" + arr[i];
    console.log("apiUrl: " + apiUrl);
    return apiUrl;
}

//creo una funzione per chiamare l'API:
//pulisco il div che conviene le cards
//dopo di che prendo l'input dell'utente e l'array con il tipo di chiamata API
//e li passo come parametro alla chiamata API
function searchTitle(arr) {
  $(".rail").empty();
  $(".arrow").removeClass("show");
  var searchedTitle = $(".input-search").val();
  if (searchedTitle != "") {
    for (var i = 0; i < arr.length; i++) {
      callIMBDAPI(searchedTitle, arr, i);
    }
  }
  $(".input-search").val("");
}

//al click del bottone, o all'invio, faccio una chiamata all'API di IMDB e creo una card che contiene
//tutti i dati relativi al film o telefilm cercato
$(".btn").click(function(){
  searchTitle(queryArr);
});

$(".input-search").keypress(function(event) {
  if(event.which == 13) {
    searchTitle(queryArr);
  }
});

//creo una funzione per calcolarmi tutti dati che mi servono per creare lo slide dinamico che fa muovere le cards
function cardSlideCal(){
  viewPortWidth = $(window).width();
  cardWidth = $(".card").width();
  numCardinView = Math.floor(viewPortWidth / cardWidth);
  railLength = Math.floor(($(".rail").children().length) / numCardinView);
  railMove = viewPortWidth - cardWidth;
}

var slideCount = 0;

//al click sulla freccia faccio i vari controlli per far si che lo slide si muova verso sinistra o verso destra
//l'utente non può scorrere prima del primo elemento e dopo l'ultimo elemento
//per facilitare la comprensione di questo meccanismo elimino la freccia sinistra o destra
$(".arrow").click(function(){
  if ($(this).hasClass("right") && slideCount < railLength) {
    slideCount++;
    $(".rail").css({"left": -(railMove * slideCount)});
  } else if ($(this).hasClass("left") && slideCount > 0) {
    slideCount--;
    $(".rail").css({"left": -(railMove * slideCount)});
  }
  if (slideCount == railLength){
    $(".arrow.right").removeClass("show");
  } else if (slideCount == 0) {
    $(".arrow.left").removeClass("show");
  } else {
    $(".arrow").addClass("show");
  }
});

//richiamo di default l'API di IMDB per popolare Boolflix 
for (var i = 0; i < queryArr.length; i++) {
  callIMBDAPI("Star Trek", queryArr, i);
}
