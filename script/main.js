// https://www.flickr.com/services/rest/?
//74ff45c276722273f2a75a77593402e2

// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg

const base = "https://www.flickr.com/services/rest/?"
const key = "74ff45c276722273f2a75a77593402e2"
const method = "flickr.interestingness.getList"
const per_page = 500;
const format = "json";

const frame = document.querySelector("#list");

const url = `${base}method=${method}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;

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


        const imgs = frame.querySelectorAll("img");
        const len = imgs.length; //이미지태그의 갯수

        let count = 0; //실제 로드한 정보 갯수

        for (let el of imgs) {
            el.addEventListener("load", () => {
                count++
                if (count == len) isoLayout()
            })
        }
    })




function isoLayout() {
    frame.classList.add("on");
    new Isotope("#list", {
        itemSelection: ".item",
        columnWidth: ".item",
        transitionDuration: "0.5s"
    })
} 