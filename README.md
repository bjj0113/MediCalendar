24년도 봄학기 고급 웹프로그래밍 팀 프로젝트
공공데이터 활용한 약 검색 사이트 만들기


사용 기술스택 – html, css, javascript, node.js, mongodb
사용 오픈 api – 공공데이터포털 의약품정보개요(e 약은요), 네이버 로그인 api, 카카오 지도 api
사용 라이브러리 – fullcalendar, google material icon

네이버 로그인 api 사용을 위해서는 배포 전이기에 테스터 아이디만 사용 가능.


1. mongodb path 설정 : (cmd) mongod --dbpath ~/database

2. mongodb 실행 : (cmd) mongo -> use MediCalendar

3. node_modules 다운로드 : (terminal) npm install

4. 서버 실행 : (terminal) node app.js

5. 브라우저 접속 : (chrome) http://localhost:8080/MainPage.html
