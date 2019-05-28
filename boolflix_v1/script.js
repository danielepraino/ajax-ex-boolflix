
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
  vote: ""
};

//creo la funzione per richiamare l'API di IMDB, passandogli la chiave api e la query
//che sarà quello che l'utente scrive nel campo di ricerca
//dopo di che passo i valori che mi interessano all'oggetto card che andrò poi
//ad generare per ad ogni click
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
      addCardData(obj, i);
    },
    error: function() {
      alert("errore");
    }
  });
}

function addCardData(obj, arr){
  var cardInfo = obj.results;
  console.log(cardInfo);
  for (var i = 0; i < cardInfo.length; i++) {
    card.cardNum = i;
    if (cardInfo[i].poster_path == null){
      card.img = "img/notavaiable.jpg";
    } else {
      card.img = imgUrl + cardInfo[i].poster_path;
    }
    if (arr == "movie") {
      card.title = cardInfo[i].title;
      card.originalTitle = cardInfo[i].original_title;
    } else {
      card.title = cardInfo[i].name;
      card.originalTitle = cardInfo[i].original_name;
    }
    card.language = cardInfo[i].original_language;
    card.vote = cardInfo[i].vote_average;
    $(".main").append(movieTemplate(card));
    setFlag(cardInfo[i].original_language, arrISO, i);
    setScore(cardInfo[i].vote_average, i);
  }
}

//creo una funzione che converte il punteggio in un range da 1 a 5 e lo arrotonda
//in base al punteggio assegno le stelline
function setScore(titleScore, j){
  var prepared = Math.ceil(titleScore/2);
  for (var i = 1; i <= prepared; i++) {
    $(".card[data-card=" + j + "]").find($(".star[data-star=" + i + "] i")).removeClass("far").addClass("fas yellow");
  }
}

//NOTA: problema lingua da iso 639-1 a 639-2 da risolvere
var arrISO = {
    "aa": "dj", "af": "za", "ak": "gh", "sq": "al", "am": "et", "ar": "aa", "hy": "am", "ay": "wh", "bm": "ml", "be": "by", "bn": "bd", "bi": "vu", "bs": "ba", "my": "mm", "ca": "ad", "zh": "cn", "cs": "cz", "da": "dk", "dv": "mv", "dz": "bt", "en": "gb", "et": "ee", "ee": "ew", "fil": "ph", "gaa": "gh", "ka": "ge", "el": "gr", "gn": "gx", "gu": "in", "he": "il", "hi": "in", "ho": "pg", "ig": "ng", "ga": "ie", "ja": "jp", "kr": "ne", "kk": "kz", "km": "kh", "kmb": "ao", "kg": "cg", "ko": "kr", "kj": "ao", "ku": "iq", "ky": "kg", "lo": "la", "la": "va", "ln": "cg", "lu": "cd", "lb": "lu", "ms": "my", "mi": "nz", "mos": "bf", "ne": "np", "nd": "zw", "nso": "za", "nb": "no", "nn": "no", "ny": "mw", "pap": "aw", "ps": "af", "fa": "ir", "pa": "in", "qu": "wh", "rm": "ch", "rn": "bi", "sg": "cf", "sr": "rs", "srr": "sn", "sn": "zw", "si": "lk", "sl": "si", "snk": "sn", "nr": "za", "st": "ls", "ss": "sz", "sv": "se", "tl": "ph", "tg": "tj", "ta": "lk", "te": "in", "tet": "tl",
    "ti": "er", "tpi": "pg", "ts": "za", "tn": "bw", "tk": "tm", "uk": "ua", "umb": "ao", "ur": "pk", "ve": "za", "vi": "vn", "cy": "gb", "wo": "sn", "xh": "za", "zu": "za"
}

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

function switchApiUrl(arr, i){
    var apiUrl = "https://api.themoviedb.org/3/search/" + arr[i];
    console.log("apiUrl: " + apiUrl);
    return apiUrl;
}
//al click del bottone, o all'invio, faccio una chiamata all'API di IMDB e creo una card che contiene
//tutti i dati relativi al film cercato. Ho notato che c'è un piccolo ritardo nella chiamata
//se genero la card instantaneamente sarà vuota, ho dovuto quindi inserire un setTimeout
//per compensare il ritardo e aspettare che la chiamata sia completata
function searchTitle(arr) {
  $(".main").empty();
  var searchedTitle = $(".input-search").val();
  if (searchedTitle != "") {
    console.log("searchedTitle: " + searchedTitle);
    for (var i = 0; i < arr.length; i++) {
      callIMBDAPI(searchedTitle, arr, i);
    }
  }
}

$(".btn").click(function(){
  searchTitle(queryArr);
});

$(".input-search").keypress(function(event) {
  if(event.which == 13) {
    searchTitle(queryArr);
  }
});
