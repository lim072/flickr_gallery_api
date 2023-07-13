//74ff45c276722273f2a75a77593402e2

// https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
const body = document.querySelector("body");
const base = "https://www.flickr.com/services/rest/?";
const key = "74ff45c276722273f2a75a77593402e2"
const method = "flickr.interestingness.getList";
const method2 = "flickr.photos.search";
const per_page = 500;
const format = "json";
const frame = document.querySelector("#list");
const loading = document.querySelector(".loading");
const input = document.querySelector("#search");
const searchBtn = document.querySelector(".btnSearch");

let aaa = document.querySelector(".item a");
console.log(aaa);
/*
item는 동적으로 생성된 요소이기 때문에 직접적인 querySelector로 직접적인 참조를 할수가
없습니다. -> 해결책은 이벤트 위임입니다
즉 실제존재하는 부모태그인 #list에 이벤트를 위임해서 클릭이벤트를 전달해야합니다
*/

const url = `${base}method=${method}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;
const url2 = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=개&privacy_filter=1`;
/*
코딩이라는 것은 결국은 글쓰기 
중요한것은 혼자만의 일이 아니라는 것
협업을 항상생각해야합니다 -> 함수패키징을 해야합니다

개발자의 입장이 아닌(개발하고있는 내 자신의 입장이 아닌)
사용자의 입장에서(다른 개발자의 입장에서) 코딩을 해야합니다*/

callData(url2);

frame.addEventListener("click", (e) => {
    e.preventDefault();
    //console.log(e.currentTarget);
    //콘솔에 어디클릭해도 모두 #list가 찍히는 이유는 querySelector로 index에 직접 코딩한
    //#list만 선택이 가능하다는 것을 반증하는 것입니다
    //따라서 이안에서 썸네일을 찾아야 합니다
    //console.log(e.target);
    //target을 이용해서 a태그를 찾아야합니다
    if (e.target == frame) return;
    //padding이 아닌 margin으로 거리를 계산하게되면 그 공간은
    //#list로 인식되기 때문에 위의 return이 실행됩니다


    let target = e.target.closest(".item").querySelector(".thumb");
    //console.log(target);
    //이미지를 클릭했을때 a태그를 추적해서 href속성을 뽑아야 
    //이후 큰이미지 주소에 해당하는 그림을 동적으로 띄워줄수있습니다

    //반드시 클릭한대상이 .thumb이어야지만 큰이미지가 보이도록 하는 코딩
    if (e.target == target) {
        //클릭한 곳에서 a태그를 찾고 href속성안에있는 큰이미지 주소를 변수에 담음
        let imgSrc = target.parentElement.getAttribute("href");

        //동적으로 popup을 aside태그로 만드는 코드
        let pop = document.createElement("aside");
        pop.classList.add("pop");
        let popup = `
    <div class="con">
        <img src="${imgSrc}">
    </div>
    <span class="close">닫기</span>
`;
        pop.innerHTML = popup;

        body.querySelector("main").append(pop);
        //body든 main이든 계단현상이 일어나지 않는 곳에 동적요소를 넣어주면 되겠습니다
        // body.append(pop);
        body.style.overflow = "hidden";
    }



})
body.addEventListener("click", (e) => {
    let pop = body.querySelector(".pop");
    //if (pop != null)
    if (pop) {
        let close = pop.querySelector(".close");
        if (e.target == close) {
            pop.remove();
            body.style.overflow = "auto";
        }
    }
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
            searchBtn.addEventListener("click", () => {
                //버튼을 클릭하면, input태그에 사용자가 넣은 값을 가져와서 url안의 tags에 넣고
                //해당 url을 callData()의 인수자리에 넣어서 해당값을 검색하도록 하는 코딩을 적습니다
                let tag = input.value;
                tag = tag.trim();
                const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;
                if (tag != "") {
                    if (!items.length == 0) {
                        callData(url);
                    } else {
                        //검색결과가 없다는 경고
                        frame.innerHTML = ""; //높이값을 초기화하기 위해서 우선 빈 html을 만들어줍니다
                        frame.style.height = "auto";
                        frame.classList.remove("on");
                        //p태그를 만들고 경고문구를 출력하는 코드를 만들기

                        let isErrMsgs = frame.parentElement.querySelectorAll("p");
                        if (isErrMsgs.length > 0) {
                            frame.parentElement.querySelector('p').remove();
                        }

                        let errMsgs = document.createElement("p");
                        errMsgs.append("검색결과가 없습니다. 검색어를 확인해주세요");
                        frame.parentElement.append(errMsgs);
                    }
                } else {
                    //로딩바를 없애고, 높이값도 초기화하고, p태그를 만들어서 경고문구를 출력
                    frame.innerHTML = ""; //높이값을 초기화하기 위해서 우선 빈 html을 만들어줍니다
                    frame.style.height = "auto";
                    frame.classList.remove("on");
                    //p태그를 만들고 경고문구를 출력하는 코드를 만들기

                    let isErrMsgs = frame.parentElement.querySelectorAll("p");
                    if (isErrMsgs.length > 0) {
                        frame.parentElement.querySelector('p').remove();
                    }

                    let errMsgs = document.createElement("p");
                    errMsgs.append("검색어를 쓰지 않았습니다, 검색어를 입력하세요");
                    frame.parentElement.append(errMsgs);
                    // frame.closest("#wrap").append(errMsgs);
                }




                //tag의 값이 없을경우 
                //검색어가 없습니다 검색어를 입력해주세요 라는 경고문구를 출력할 예정


            })

            input.addEventListener("keyup", (e) => {
                if (e.key === "Enter") {
                    let tag = input.value;
                    tag = tag.trim();
                    const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;
                    if (tag != "") {
                        if (!items.length == 0) {
                            callData(url);
                        } else {
                            //검색결과가 없다는 경고
                            frame.innerHTML = ""; //높이값을 초기화하기 위해서 우선 빈 html을 만들어줍니다
                            frame.style.height = "auto";
                            frame.classList.remove("on");
                            //p태그를 만들고 경고문구를 출력하는 코드를 만들기
                            let isErrMsgs = frame.parentElement.querySelectorAll("p");
                            if (isErrMsgs.length > 0) {
                                frame.parentElement.querySelector('p').remove();
                            }
                            let errMsgs = document.createElement("p");
                            errMsgs.append("검색결과가 없습니다. 검색어를 확인해주세요");
                            frame.parentElement.append(errMsgs);
                        }
                    } else {
                        //로딩바를 없애고, 높이값도 초기화하고, p태그를 만들어서 경고문구를 출력
                        frame.innerHTML = ""; //높이값을 초기화하기 위해서 우선 빈 html을 만들어줍니다
                        frame.style.height = "auto";
                        frame.classList.remove("on");
                        //p태그를 만들고 경고문구를 출력하는 코드를 만들기
                        let isErrMsgs = frame.parentElement.querySelectorAll("p");
                        if (isErrMsgs.length > 0) {
                            frame.parentElement.querySelector('p').remove();
                        }
                        let errMsgs = document.createElement("p");
                        errMsgs.append("검색어를 쓰지 않았습니다, 검색어를 입력하세요");
                        // errMsgs.textContent = "검색어를 쓰지 않았습니다, 검색어를 입력하세요";
                        // errMsgs.innerText = "검색어를 쓰지 않았습니다, 검색어를 입력하세요";
                        frame.parentElement.append(errMsgs);
                        // frame.closest("#wrap").append(errMsgs);
                    }
                }
                // if(e.keyCode == 13)
            })

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
                <img src=${imgSrc} alt="${el.title}" class="thumb">
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
            count++;
            if (count == len) isoLayout();
        })

        el.addEventListener("error", (e) => {
            //1 에러가 발생하는 대상을 완전히 지워버리는 방법
            //e.currentTarget.closet(".item").style.display = "none";
            //2 에러가 발생하면 대체이미지로 해결하는 방법
            e.currentTarget.setAttribute('src', "img/k1.jpg");
        })


    }
}



function isoLayout() {
    loading.classList.add("off"); //off클래스를 붙여서 로딩바를 지워줍니다
    frame.classList.add("on");

    new Isotope("#list", {
        itemSelection: ".item",
        columnWidth: ".item",
        transitionDuration: "0.5s"
    });
}