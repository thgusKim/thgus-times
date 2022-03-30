let news = [];
let keyword = "";
let topic = "sport";
let condition = "countries=KR&topic=sport&page_size=10";
let endPoint = "latest_headlines?";
let menus = document.querySelectorAll(".menus button");
let searchInput = document.getElementById("search-input");
let searchInputButton = document.getElementById("search-input-button");

menus.forEach((menu) =>
  menu.addEventListener("click", (item) => moveUrl(item))
);

searchInputButton.addEventListener("click", () => searchUrl());

const getLatestNews = async (topic) => {
  console.log(`topic:${topic}`);
  let url = new URL(
    `https://api.newscatcherapi.com/v2/${endPoint}${condition}`
  );
  let header = new Headers({
    "x-api-key": "WMP3kmQaz56F15YahiCUstbWU2vhTomKHREEdW0FyCg",
  });

  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  console.log(news);

  render(news);
};

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function searchButton() {
  if (document.getElementById("search-input").style.display == "none") {
    document.getElementById("search-input").style.display = "inline";
    document.getElementById("search-input-button").style.display = "inline";
  } else {
    document.getElementById("search-input").style.display = "none";
    document.getElementById("search-input-button").style.display = "none";
  }
}

function render(news) {
  console.log(news);
  let list = "";

  for (let i = 0; i < news.length; i++) {
    if (news[i].excerpt.length > 200) {
      console.log(`길이는 ${news[i].excerpt.length}`);
      news[i].excerpt = news[i].excerpt.slice(200) + "...";
      console.log(`수정후 길이는 ${news[i].excerpt.length}`);
    } else if (news[i].excerpt == "") {
      news[i].excerpt = "내용없음";
    }

    if (news[i].media == "") {
      news[i].media =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvHdRZDerGbZ57-ps_PwHdfI90X4p1sr8I4w&usqp=CAU";
    }

    if (news[i].clean_url == "") {
      news[i].clean_url = "no source";
    }

    news[i].published_date = moment(news[i].published_date).fromNow();
    console.log(news[i].published_date);

    list += `<div class="row news" id="new-list">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${news[i].media}"
      />
    </div>
    <div class="col-lg-8">
      <h2>${news[i].title}</h2>
      <p>
      ${news[i].excerpt}
      </p>
      <div>${news[i].clean_url} * ${news[i].published_date}</div>
    </div>
  </div>`;
  }
  console.log(list);
  document.getElementById("news-list").innerHTML = list;
}

function moveUrl(item) {
  console.log(item.target.textContent);
  topic = item.target.textContent.toLowerCase();
  console.log(`topic ${topic}`);
  condition = `countries=KR&topic=${topic}&page_size=10`;
  getLatestNews(topic);
}

function searchUrl() {
  keyword = searchInput.value;
  console.log(keyword);
  endPoint = "search?";
  condition = `q=${keyword}`;
  getLatestNews();
}
getLatestNews(topic);
