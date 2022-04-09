let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let searchButton = document.getElementById("search-button");
let url;

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "WMP3kmQaz56F15YahiCUstbWU2vhTomKHREEdW0FyCg",
    });
    url.searchParams.set("page", page); //&page=1
    console.log(url);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      } else {
        console.log(data);
        news = data.articles;
        total_pages = data.total_pages;
        page = data.page;
        render();
        pagenation();
      }
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는: ", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?page_size=10&q=${keyword}`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";

  newsHTML = news
    .map((item) => {
      return `<div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size"
            src="${item.media}"
          />
        </div>
        <div class="col-lg-8">
          <h2>${item.title}</h2>
          <p>${item.summary}</p>
          <div>${item.rights} * ${item.published_date}</div>
        </div>
      </div>`;
    })
    .join("");
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5 > total_pages? total_pages : pageGroup * 5;
  // let last = pageGroup * 5;
  //   if(last > total_pages){
  //     last = total_pages;
  //   }
  let first = last-4 <= 0 ? 1 : last - 4;
  // let first = last-4;
  //   if(first <= 0){
  //     first = 1;
  //   }

  if (first >= 6) {
    pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
    <span aria-hidden="true">&lt;&lt;</span>
  </a>
</li>
  <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  }

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  if (last < total_pages) {
    pagenationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>
<li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
    <span aria-hidden="true">&gt;&gt;</span>
  </a>
</li>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  console.log(page);
  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);

getLatestNews();
