const config = require('../config/env');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

var client_id = config.client_id;
var client_secret = config.client_secret;

function generateStateToken() {
    // 32바이트 길이의 랜덤한 값을 생성하여 16진수 문자열로 반환
    return crypto.randomBytes(32).toString('hex');
}

//콜백 주소, 일단 로그인하면 마이페이지로 이동하게 
var redirectURI; // = encodeURI("http://localhost:8080/MainPage.html");

var api_url = "";

router.get('/naverlogin', function (req, res) {
    var currentUrl = req.query.currentUrl; // 클라이언트에서 hidden input에 추가한 현재 페이지의 URL
    redirectURI = encodeURI(currentUrl);

    var stateToken = generateStateToken(); //랜덤한문자열이나 해시값을 생성하는 함수를 사용 
    var state = encodeURIComponent(stateToken);
    
    //로그인 인증 요청 주소
    api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
    res.redirect(api_url);
});

router.get('/callback', function (req, res) {
    code = req.query.code; //로그인 인증 요청 API 호출에 성공하고 리턴받은 인증코드값 (authorization code)
    state = req.query.state; //애플리케이션에서 생성한 상태 토큰값으로 URL 인코딩을 적용한 값

    //토큰 얻는 주소
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
        + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;

    var request = require('request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

module.exports = router;
