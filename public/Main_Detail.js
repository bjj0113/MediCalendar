//세션스토리지에서 품목기준코드 가져오기
const itemSeq = sessionStorage.getItem('itemSeq');

window.onload = function () {
    load_detail();
}

function load_detail() {
    let title = document.getElementById("title");
    let Info = document.getElementById("Info");
    let context = "";
    Info.innerHTML = "";
    title.innerHTML = "";

    //공공데이터 포털에서 약 세부정보 받아오기
    //api 키 서버로 보내서 보안 강화하기
    var serviceKey = 'mDXichXudHiamKs2xLEvtHLg8mqZSUG1lAVx481XKZCLyRiv3LDEJkYtjE%2Baayo2CdIohYl2lQm0ir4o6ODZpQ%3D%3D';
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
    queryParams += '&' + encodeURIComponent('itemSeq') + '=' + encodeURIComponent(itemSeq);  //페이지번호
    queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); //요청 타입 설정 'json'

    xhr.open('GET', url + queryParams);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { // 요청 완료 되고 성공 되었을 때
            var response = JSON.parse(this.responseText);

            //콘솔api 요청 정보 찍어보기
            //console.log('Status: ' + this.status + 'nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + 'nBody: ' + this.responseText);

            //상세정보 받아오기
            var items = response.body.items; // 응답 데이터에서 items 추출
            var itemImage;
            var entpName;
            // items 배열을 순회하며 테이블 행을 추가
            items.forEach(function (item) {
                itemImage = item.itemImage//의약품 사진
                entpName = item.entpName; //업체명
                //-----------------------------------품목기준코드 itemSeq
                itemName = item.itemName; //약품명
                efcyQesitm = item.efcyQesitm // 효능
                useMethodQesitm = item.useMethodQesitm//사용법
                atpnWarnQesitm = item.atpnWarnQesitm//사용하기 전 반드시 알아야 할 사항
                atpnQesitm = item.atpnQesitm//주의 사항
                intrcQesitm = item.intrcQesitm//상호 작용
                seQesitm = item.seQesitm//부작용
                depositMethodQesitm = item.depositMethodQesitm//보관법
            });


            //header 
            title.innerHTML += '<img src="' + itemImage + '" width="50" height="50">';
            title.innerHTML += '<span>' + itemName + '</span>';
            title.innerHTML += '<button id="close" type="button" onclick="window.parent.modal_close()"><span class="material-symbols-outlined" id="cancel_button">cancel</span></button><hr>';

            //상세정보 목록 배열
            let infolist = ['업체명', '품목기준코드', '효능', '사용법', '사용하기 전 반드시 알아야 할 사항', '주의 사항', '상호 작용', '부작용', '보관법'];
            let infoarray = [entpName, itemSeq, efcyQesitm, useMethodQesitm, atpnWarnQesitm, atpnQesitm, intrcQesitm, seQesitm, depositMethodQesitm]

            //약 상세정보 출력
            context += "<section><span>업체명 :&nbsp" + entpName + "</span><br><span>품목기준코드 :&nbsp" + itemSeq + "</span>";
            context += "<br><br>";

            //아이템 이미지
            context += "<article><br><h3>[의약품 사진]</h3><div>";
            context += '<img src="' + itemImage + '" width="150" height="100"></img>';
            context += '</div><br></article>';
            for (let i = 0; i < infoarray.length; i++) {
                if (infoarray[i] == null) // 내용이 null 일때
                    context += "<article><br><h3>[" + infolist[i] + ']</h3><div>내용이 없습니다.</div><br></article>';
                else
                    context += "<article><br><h3>[" + infolist[i] + ']</h3><div>' + infoarray[i] + '</div><br></article>';
            }

            context += '</section>'

            Info.innerHTML += context;

        }
    };
    xhr.send('');
}