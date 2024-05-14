//세션스토리지에서 검색어와 라디오버튼 옵션 갖고 오기
const inputValue = sessionStorage.getItem('inputValue');
const radioValue = sessionStorage.getItem('radioValue');
console.log(inputValue); // 입력 값 확인

window.onload = function () {
    search();
    rowClicked();
}
//테이블 출력하기
function search() {
    let stable = document.getElementById("Main_Select");
    let context = "";
    stable.innerHTML = "";
    stable.innerHTML += inputValue + " ___ " + radioValue; // 검색어 버튼 출력해보기
    context += ("<table id='stable'><thead><tr><th>약품명</th><th>품목기준코드</th><th>업체명</th><th>효능</th><th>추가</th></tr></thead><tbody>");
    //약 찾아서 i범위, 내용 수정해야함 임의로 30
    for (let i = 0; i < 30; i++) {
        context += ("<tr><td>" + i + 5000000 + "</td><td>" + i + 33341111444 + "</td><td>" + i + "sssssssss" + "</td><td>" + i + "최초의 스마트폰은 사이먼(Symon)으로 추정된다.IBM사가 1992년에 설계하여 그 해에 미국 네바다 주의라스베이거스서 열린 컴댁스에서 컨셉 제품으로 전시되었다." + "</td><td name='addition'>(+)</td></tr>");
    }
    context += "</tbody></table>";
    stable.innerHTML += context;
    rowClicked();
}

//테이블 행 눌렀을 때 세부정보 창 출력하기
function rowClicked() {

    var table = document.getElementById('stable');
    var rowList = table.rows;

    for (i = 1; i < rowList.length; i++) {//thead부분 제외.

        var row = rowList[i];

        var lastCell = row.cells[4];
        
        lastCell.onclick = function () {
            //추가 버튼 눌렀을 때 그 행 정보 갖고 내 약에 추가하기
            console.log("내약에 추가하기");
            var value = this.parentNode.cells[1].innerHTML;// 현재 행의 품목 기준코드를 가져오기.
            console.log('현재 행의 품목 기준코드' + value);

            event.stopPropagation(); // 아래 이벤트 수행 안되게 함.
        }

        row.onclick = function () {
            var row_value = this.cells[1].innerHTML; //선택 행의 품목기준코드 가져오기
            console.log(row_value); // 가져온 값으로 약 api 재 호출해서 detail 열어 주기!
            
            //팝업창으로 세부사항 띄우기
            //window.open("Main_Detail.html", "_blank", "toolbar=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1100, height=720, top=0,left=0");


            //modal로 띄우기
            sessionStorage.setItem('itemSeq', row_value,'*');
            // 부모 frame에서 띄워야함
            window.parent.show_detail();

        }
    }
}





