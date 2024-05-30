//세션스토리지에서 검색어와 라디오버튼 옵션 갖고 오기
const inputValue = sessionStorage.getItem('inputValue');
const radioValue = sessionStorage.getItem('radioValue');
// console.log(inputValue); // 입력 값 확인

var pageNo = 1; // 시작 페이지넘버
var totalCount = 0; // totalCount 선언 api에서 받아온 결과의 수

window.onload = function () {
    search();
}

//테이블 출력하기
function search() {
    let stable = document.getElementById("Main_Select");
    let context = "";
    stable.innerHTML = "";

    //현재 페이지 테이블위에 찍어보기
    //stable.innerHTML = pageNo;

    //공공데이터 포털에서 약 정보 받아오기
    var serviceKey = 'mDXichXudHiamKs2xLEvtHLg8mqZSUG1lAVx481XKZCLyRiv3LDEJkYtjE%2Baayo2CdIohYl2lQm0ir4o6ODZpQ%3D%3D';
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(pageNo);  //페이지번호
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); // 한페이지 결과 수

    if (radioValue == 'itemName') // 약품명을 선택한 경우
        queryParams += '&' + encodeURIComponent('itemName') + '=' + encodeURIComponent(inputValue);
    else if (radioValue == 'entpName') // 업체명을 선택한 경우
        queryParams += '&' + encodeURIComponent('entpName') + '=' + encodeURIComponent(inputValue);
    else if (radioValue == 'efcyQesitm') // 효능을 선택한 경우
        queryParams += '&' + encodeURIComponent('efcyQesitm') + '=' + encodeURIComponent(inputValue);

    queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); //요청 타입 설정 'json'

    xhr.open('GET', url + queryParams);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { // 요청 완료 되고 성공 되었을 때

            //콘솔api 요청 정보 찍어보기
            //console.log('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);

            var response = JSON.parse(this.responseText);

            // totalCount 값을 저장
            totalCount = response.body.totalCount;
            if (totalCount == 0) { // 검색결과가 없을 때
                stable.innerHTML += '<h1>검색 결과가 없습니다.<br>다시 검색해주세요.</h1>';
                return;

            }
            else {
                // 약 검색 결과 테이블
                context += ("<table id='stable'><thead><tr><th>약품명</th><th>품목기준코드</th><th>업체명</th><th>효능</th><th>추가</th></tr></thead><tbody>");
                var items = response.body.items; // 응답 데이터에서 items 추출

                // items 배열을 순회하며 테이블 행을 추가
                items.forEach(function (item) {
                    context += "<tr onclick='rowClicked(event)'>";
                    context += "<td>" + item.itemName + "</td>";
                    context += "<td>" + item.itemSeq + "</td>";
                    context += "<td>" + item.entpName + "</td>";
                    context += "<td>" + item.efcyQesitm + "</td>";
                    context += "<td name='addition' onclick = 'lastrowClicked(event)'>(+)</td>";
                    context += "</tr>";
                });

                context += "</tbody></table>";
                stable.innerHTML += context;

                // 페이지 이동 버튼
                stable.innerHTML += '<span></span><button type="button" class="page_change" onClick="previousPage()"> < </button><span id = "pageSpan">현재 페이지 : ' + pageNo + '</span>';
                stable.innerHTML += '<button type="button" class="page_change" onClick="nextPage()"> > </button><span></span>';
            }
        }
    };
    xhr.send('');
}

//테이블 행 눌렀을 때 세부정보 창 출력하기
function rowClicked(event) {
    var clickedRow = event.target.parentNode;
    var cells = clickedRow.querySelectorAll('td');
    var itemSeq = cells[1].innerText;

    console.log(itemSeq); // 가져온 값으로 약 api 재 호출해서 detail 열어 주기!

    //팝업창으로 세부사항 띄우기
    //window.open("Main_Detail.html", "_blank", "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1100, height=720, top=0,left=0");

    //modal로 띄우기
    sessionStorage.setItem('itemSeq', itemSeq, '*');

    // 부모 frame에서 띄워야함
    window.parent.show_detail();

}

//(+) 추가 버튼 눌렀을 때 품목기준코드로 내약에 추가하기
function lastrowClicked(event) {
    var clickedRow = event.target.parentNode;
    var cells = clickedRow.querySelectorAll('td');
    var itemName = cells[0].innerText; // 약품명
    var itemSeq = cells[1].innerText; // 품목기준코드

    //추가 버튼 눌렀을 때 그 행 정보 갖고 내 약에 추가하기  
    //세션스토리지에 추가
    sessionStorage.setItem('itemSeq', itemSeq, '*');    //세션에 품목기준코드 추가
    sessionStorage.setItem('itemName', itemName, '*');  //세션에 약품명 추가
    console.log("내약에 추가하기");
    console.log('현재 행의 품목 기준코드:' + itemSeq);

    // 추가 버튼을 눌렀을 때 서버로 데이터 전송
    fetch('/addMedicine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemName: itemName, itemSeq: itemSeq })
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 401 && body.redirect) {
                alert(body.message);
            } else if (body.success) {
                console.log('Medicine added successfully:', body);
                alert('약이 추가되었습니다.');
            } else {
                console.error('Error:', body.error);
                alert(`Error: ${body.error}`);
            }
        })

    event.stopPropagation(); // 아래 이벤트 수행 안되게 함.
}


//페이지 이동 버튼
function nextPage() {
    var maxPage = Math.ceil(totalCount / 10); // 페이지 수 계산

    if (pageNo < maxPage) {
        pageNo++;
        search();
    } else {
        alert("마지막 페이지입니다.");
    }
}

function previousPage() {
    if (pageNo > 1) {
        pageNo--;
        search();
    } else {
        alert("첫 페이지입니다.");
    }
}
