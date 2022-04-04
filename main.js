let url;
let news = [];
let page = 1;
let total_pages;
let keyword = "";
let topic = "sport";
let condition = "countries=KR&topic=sport&page_size=10";
let endPoint = "latest_headlines?";
let menus = document.querySelectorAll(".menus button");
let sideMenus = document.querySelectorAll(".side-menu-list button")
let searchInput = document.getElementById("search-input");
let searchInputButton = document.getElementById("search-input-button");

menus.forEach((menu) =>
  menu.addEventListener("click", (item) => moveUrl(item))
);

sideMenus.forEach((menu) => 
  menu.addEventListener("click", (item) => moveUrl(item))
);

searchInputButton.addEventListener("click", () => searchUrl());

const getLatestNews = async () => {
  try {
    url = new URL(`https://api.newscatcherapi.com/v2/${endPoint}${condition}`);
    let header = new Headers({
      "x-api-key": "WMP3kmQaz56F15YahiCUstbWU2vhTomKHREEdW0FyCg",
    });
    url.searchParams.set("page", page);
    console.log(url);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status != "200") {
      throw new Error(data.message);
    } else {
      if (news == undefined) {
        document.getElementById("news-list").innerHTML =
          '<div class="alert alert-danger text-center" role="alert">No matches for your search</div>';
      } else {
        news = data.articles;
        total_pages = data.total_pages;
        page = data.page;
        console.log(data);
        render(news);
        pagenations();
      }
    }
  } catch (error) {
    document.getElementById(
      "news-list"
    ).innerHTML = `<div class="alert alert-danger text-center" role="alert">${error}</div>`;
  }
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
      //   console.log(`길이는 ${news[i].excerpt.length}`);
      news[i].excerpt = news[i].excerpt.slice(200) + "...";
      //   console.log(`수정후 길이는 ${news[i].excerpt.length}`);
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
    // console.log(news[i].published_date);

    list += `<div class="row news" id="new-list">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src="${news[i].media}"
      />
    </div>
    <div class="col-lg-8">
      <h2><a href="${news[i].link}">${news[i].title}</a></h2>
      <p>
      ${news[i].excerpt}
      </p>
      <div>${news[i].clean_url} * ${news[i].published_date}</div>
    </div>
  </div>`;
  }
  //   console.log(list);
  document.getElementById("news-list").innerHTML = list;
}

function moveUrl(item) {
  //   console.log(item.target.textContent);
  topic = item.target.textContent.toLowerCase();
  //   console.log(`topic ${topic}`);
  condition = `countries=KR&topic=${topic}&page_size=10`;
  page = 1;
  closeNav();
  getLatestNews();
}

function searchUrl() {
  keyword = searchInput.value;
  //   console.log(keyword);
  endPoint = "search?";
  condition = `q=${keyword}`;
  getLatestNews();
}

const pagenations = () => {
  let pagenationHTML = "";
  let last = 1;
  let first = 1;

  let pageGroup = Math.ceil(page / 5);
  if (total_pages < 5) {
    console.log("total_pages < 5");
    last = total_pages;
    first = 1;
  } else if (pageGroup == Math.ceil(total_pages / 5)) {
    console.log("pageGroup == Math.ceil(total_pages / 5)");
    last = total_pages;
    first = pageGroup * 5 - 4;
  } else {
    console.log("pageGroup");
    last = pageGroup * 5;
    first = last - 4;
  }

  if (pageGroup == 1) {
    pagenationHTML = "";
  } else {
    pagenationHTML = `
    <li class="page-item">
        <a class="page-link" onclick="moveToPage(1)" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item">
    <a class="page-link" onclick="moveToPage(${
      page - 1
    })" href="#" aria-label="Previous">
      <span aria-hidden="true">&lt;</span>
    </a>
    </li>`;
  }

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" onclick="moveToPage(${i})" href="#">${i}</a></li>`;
  }

  if (pageGroup != Math.ceil(total_pages / 5)) {
    pagenationHTML += ` 
    <li class="page-item">
  <a class="page-link" onclick="moveToPage(${
    page + 1
  })" href="#" aria-label="Next">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>
<li class="page-item">
      <a class="page-link" onclick="moveToPage(${total_pages})" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  //1. 이동하고 싶은 페이지를 알아야함
  page = pageNum;
  console.log(`page: ${page}`);
  //2. 이동하고 싶은 페이지를 가지고 api를 다시 호출
  getLatestNews();
};

getLatestNews();
