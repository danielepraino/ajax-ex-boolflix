moment.locale("it");
var typeArr = ["movie", "tv"];
var idArrMovie = [];
var idArrTv = [];
var castArr = [];
var genresArr = [];
var type, id;
var imgUrl = "https://image.tmdb.org/t/p/w300";

//dichiaro le variabili per handlebarjs
var sectionTemplate = $("#rail-template").html();
var railTemplate = Handlebars.compile(sectionTemplate);
var cardTemplate = $("#card-template").html();
var movieTemplate = Handlebars.compile(cardTemplate);

var card = {
  dataCard: 0,
  img: "",
  title: "",
  originalTitle: "",
  releaseDate: "",
  originalLanguage: "",
  voteAverage: "",
  overview: "",
  castList: "",
  genresType: ""
}

function retrieveInfo(obj, type){
  var cardInfo = obj.results;
  for (var i = 0; i < cardInfo.length; i++) {
    if (cardInfo[i].poster_path != null){
    if (type == "movie"){
      card.title = cardInfo[i].title;
      card.originalTitle = cardInfo[i].original_title;
      idArrMovie.push(cardInfo[i].id);
      card.dataCard = i;
      cardLastData = card.dataCard;
    } else {
      card.title = cardInfo[i].name;
      card.originalTitle = cardInfo[i].original_name;
      idArrTv.push(cardInfo[i].id);
      card.dataCard = cardLastData + i;
    }
    card.img = imgUrl + cardInfo[i].poster_path;
    card.releaseDate = moment(cardInfo[i].release_date).format('L');
    card.originalLanguage = cardInfo[i].original_language;
    card.voteAverage = cardInfo[i].vote_average;
    if (cardInfo[i].overview == ""){
      card.overview = "n/a";
    } else {
      card.overview = cardInfo[i].overview;
    }
      $(".rail").append(movieTemplate(card));
      $(".arrow.right").addClass("show");
    } else {
      i++;
    }
    setFlag(cardInfo[i].original_language, arrISO, i);
    setScore(cardInfo[i].vote_average, i);
  }
}

function retrieveCredits(obj){
  castArr = [];
  var creditsInfo = obj.cast;
  card.castList = "";
  if (creditsInfo.length > 0) {
    for (var i = 0; i < creditsInfo.length; i++) {
        castArr.push(creditsInfo[i].name);
        card.castList = castArr.slice(0, 5).join(", ");
        var castList = card.castList;
    }
  } else {
    castList = "n/a";
  }
  return castList;
}

function retrieveGenre(obj){
  genresArr = [];
  var genresInfo = obj.genres;
  if (genresInfo.length > 0) {
    for (var i = 0; i < genresInfo.length; i++) {
       genresArr.push(genresInfo[i].name);
       card.genresType = genresArr.slice().join(", ");
       var genresList = card.genresType;
    }
  } else {
    genresList = "n/a";
  }
  return genresList;
}

function setURL(type, id, i){
  var urlReturn = "";
  switch(i){
    case 0: {
      urlReturn = "https://api.themoviedb.org/3/search/" + type;
      break;
    }
    case 1: {
      urlReturn = "https://api.themoviedb.org/3/" + type + "/" + id + "/credits";
      break;
    }
    case 2: {
      urlReturn = "https://api.themoviedb.org/3/" + type + "/" + id;
      break;
    }
  }
  return urlReturn;
}

function call_TMDB_API(type, id, i, loop, searchedTitle){
  $.ajax({
    url: setURL(type, id, i),
    method: "GET",
    data: {
      api_key: "3b199fd55ebf57026e1a083c4f9869b3",
      query: searchedTitle,
      language: "it"
    },
    //creo uno switch con all'interno le varie funzioni che gestiscono le varie tipologie di chiamata
    success: function(data){
      switch(i){
        case 0: {
          retrieveInfo(data, type);
          for (var j = 1; j < 3; j++) {
            if (type == "movie") {
              for (var k = 0; k < idArrMovie.length; k++) {
                call_TMDB_API(type, idArrMovie[k], j, k, searchedTitle);
              }
            } else {
              for (var z = 0; z < idArrTv.length; z++) {
                call_TMDB_API(type, idArrTv[z], j, z, searchedTitle);
              }
            }
          }
          break;
        }
        case 1: {
          $(".card[data-card=" + loop + "]").find(".cast span").text("");
          if (type == "movie") {
            $(".card[data-card=" + loop + "]").find(".cast span").text(retrieveCredits(data));
          } else {
            $(".card[data-card=" + loop + "]").find(".cast span").text(retrieveCredits(data));
          }
          break;
        }
        case 2: {
          $(".card[data-card=" + loop + "]").find(".genre span").text("");
          if (type == "movie") {
            $(".card[data-card=" + loop + "]").find(".genre span").text(retrieveGenre(data));
          } else {
            $(".card[data-card=" + loop + "]").find(".genre span").text(retrieveGenre(data));
          }
          retrieveGenre(data);
          break;
        }
      }
    },
    error: function() {
      alert("errore");
    }
  });
}

function setScore(titleScore, j){
  var prepared = Math.ceil(titleScore/2);
  for (var i = 1; i <= prepared; i++) {
    $(".card[data-card=" + j + "]").find($(".star[data-star=" + i + "] i")).removeClass("far").addClass("fas yellow");
  }
}

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

function searchTitle(arr) {
  slideCount = 0;
  $(".rail").css({"left": 0});
  $(".rail").empty();
  $(".arrow").removeClass("show");
  var searchedTitle = $(".input-search").val();
  if (searchedTitle != "") {
    console.log("slideCount: " + slideCount);
    for (var a = 0; a < arr.length; a++) {
        call_TMDB_API(arr[a], "", 0, 0, searchedTitle);
    }
  }
  $(".input-search").val("");
}

$(".btn").click(function(){
  searchTitle(typeArr);
});

$(".input-search").keypress(function(event) {
  if(event.which == 13) {
    searchTitle(typeArr);
  }
});

function cardSlideCal(){
  viewPortWidth = $(window).width();
  cardWidth = $(".card").width();
  numCardinView = Math.floor(viewPortWidth / cardWidth);
  railLength = Math.floor(($(".rail").children().length) / numCardinView);
  railMove = viewPortWidth - cardWidth;
}

var slideCount = 0;

$(document).on("click", ".arrow", function(){
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


for (var a = 0; a < typeArr.length; a++) {
    call_TMDB_API(typeArr[a], "", 0, 0, "Matrix");
}
$(".boolflix").append(railTemplate());
setTimeout(cardSlideCal, 500);

/*****************************************************/

$(document).on("mouseover", ".card", function(){
  $(this).addClass("animate");
  $(this).find(".card-info").addClass("active");
});

$(document).on("mouseleave", ".card", function(){
  $(".card").removeClass("animate");
  $(".card-info").removeClass("active");
});
