// https://www.flickr.com/services/rest/?
//74ff45c276722273f2a75a77593402e2

// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg

const base = "https://www.flickr.com/services/rest/?"
const key = "74ff45c276722273f2a75a77593402e2"
const method = "flickr.interestingness.getList";
const method2 = "flickr.photos.search"
const per_page = 500;
const format = "json";
const frame = document.querySelector("#list");
const input = document.querySelector("#search");
const searcBtn = document.querySelector(".btnSearch");
const url = `${base}method=${method}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;
const url2 = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=개&privacy_filter=1`;
const loading = document.querySelector(".loading");
/*
코딩이라는 것은 결국은 글쓰기
중요한것은 혼자만의 일이 아니라는 것
코워킹(co-working)
협업을 항상생각해야합니다. -> 함수패키징을 해야합니다.

개발자의 입장이 아닌(개발하고있는 내 자신의 입장이 아닌)
사용자의 입장에서(다른 개발자를 입장에서) 코딩을 해야합니다.
*/

callData(url2);

searcBtn.addEventListener("click", () => {
    //버튼을 클릭하면 input태그에 사용자가 넣은 값을 가져와서 url안의 tags에 넣고
    //해당 url을 callData()의 인수자리에 넣어서 해당값을 검색하도록 하는 코딩
    let tag = input.value;
    const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;

    callData(url)
})

function callData(url) {
    frame.innerHTML = "";
    frame.classList.remove("on");
    loading.classList.remove("off");

    fetch(url)
        .then((data) => {
            console.log(data);
            let result = data.json();
            //가져온 데이터 중에 json의 형태의 값만 변수로 담음
            console.log(result);
            return result;
        })
        .then((json) => {
            let items = json.photos.photo;
            console.log(items);
            createList(items);
            delayLoading();
        })
}
function createList(items) {
    let htmls = "";
    items.map((el) => {
        let imgSrc = `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_m.jpg`;
        //이미지의 썸네일 주소
        let imgSrcBig = `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_b.jpg`;
        //큰이미지의 주소
        htmls += `
    <li class="item">
        <div>
            <a href=${imgSrcBig}> 
                <img src=${imgSrc} alt="${el.title}">
            </a>
            <p>${el.title}</p>
        
        </div>
    </li>
    `;
    })
    // htmls의 상태는 500개가 만들어진 상태입니다
    frame.innerHTML = htmls;
}
function delayLoading() {
    const imgs = frame.querySelectorAll("img");
    const len = imgs.length; //이미지태그의 갯수

    let count = 0; //실제 로드한 정보 갯수

    for (let el of imgs) {
        el.addEventListener("load", () => {
            count++
            if (count == len) isoLayout()
        })

        el.addEventListener("error", (e) => {
            //1 에러가 발생하는 대상을 완전히 지워버리는 방법
            //e.currentTarget.closet().item.style.display = "none";

            //2 에러가 발생하면 대체이미지로 해결하는 방법
            e.currentTarget.setAttribute('src', "img/6.gif")
        })
    }
}
function isoLayout() {
    loading.classList.add("off"); //off클래스를 붙여서 로딩바를 지워줍니다.
    frame.classList.add("on");
    new Isotope("#list", {
        itemSelection: ".item",
        columnWidth: ".item",
        transitionDuration: "0.5s"
    })
} 