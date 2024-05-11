let isTitleSmall = false;
function search() {
    const inputValue = document.getElementById('inputField').value; // 검색어

    if(inputValue.length == 0){ // 검색어 없을 때
        alert("검색어를 입력해주세요!");
        return 0;
    }

    if (!isTitleSmall) { // 메인 첫페이지에서 1회만 수행
        const pageTitle = document.getElementById('page-title');
        const mainPage = document.getElementById('main-page');
        const mainImg = document.getElementById('main-img');

        pageTitle.classList.add('shrink-title');
        mainPage.classList.add('shrink-main');
        mainImg.classList.add('shrink-img');
        isTitleSmall = true;

    }

    //검색어와 라디오버튼 옵션을 세션스토리지에 저장
    const radioValueList = document.getElementsByName('option');
    sessionStorage.setItem('inputValue', inputValue);
    radioValueList.forEach(element => {
        if(element.checked){
            sessionStorage.setItem('radioValue', element.value);
        }
    });

    // 검색 결과 iframe출력 
    let div = document.getElementById('Main_Select');
    div.innerHTML ='';
    let str = ''

    str += '<iframe src="Main_Select.html" width="100%" height= "570px"></iframe>'
    div.innerHTML += str;
}
