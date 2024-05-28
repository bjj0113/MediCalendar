const config = require('../config/env');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const request = require('request');
const { UserModel } = require('../config/database');
const session = require('express-session');

var client_id = config.client_id;
var client_secret = config.client_secret;
var stateToken = generateStateToken(); //랜덤한문자열이나 해시값을 생성하는 함수를 사용 
var state = encodeURIComponent(stateToken);
var token;  // ='your token'
var currentUrl;
var info_id;
var info_email;
var info_name;

function generateStateToken() {
    // 32바이트 길이의 랜덤한 값을 생성하여 16진수 문자열로 반환
    return crypto.randomBytes(32).toString('hex');
}
router.use(session({
    secret: 'my-key',
    resave: true,
    saveUninitialized: true
}));

//콜백 주소
var redirectURI = encodeURI("http://localhost:8080/auth/navercallback");
var getinfoURI = encodeURI("http://localhost:8080/auth/member");

var api_url = "";

router.post('/logout', function (req, res) {
    // 세션 정보 제거
    req.session.destroy(function (err) {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // 로그아웃 성공적으로 완료되면 홈페이지로 리다이렉트
            res.redirect('/');
        }
    });
});

router.get('/checklogin', function (req, res) {
    // 세션에서 사용자 정보 확인
    if (req.session.user) {
        // 사용자가 로그인한 경우
        res.json({ loggedIn: true });
    } else {
        // 사용자가 로그인하지 않은 경우
        res.json({ loggedIn: false });
    }
});

router.get('/naverlogin', function (req, res) {
    currentUrl = req.query.currentUrl; // 클라이언트에서 hidden input에 추가한 현재 페이지의 URL

    if (req.session.user) {
        // 사용자가 로그인한 경우
        console.log('이미 로그인 되어 있음');
        console.log ('사용자id: ' + req.session.user.id);
        res.redirect(currentUrl);
    } else {
        // redirectURI = encodeURI(currentUrl);

        //로그인 인증 요청 주소
        api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
        res.redirect(api_url);
        //console.log('/navercallback으로');
    }
});

router.get('/navercallback', function (req, res) {
    code = req.query.code; //로그인 인증 요청 API 호출에 성공하고 리턴받은 인증코드값 (authorization code)
    state = req.query.state; //애플리케이션에서 생성한 상태 토큰값으로 URL 인코딩을 적용한 값

    //토큰 얻는 주소
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
        + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;

    //var request = require('request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    request.get(options, function (error, response, result) {
        if (!error && response.statusCode == 200) {
            //res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            //res.end(result);
            /*
            {
            "access_token": "접근 토큰",
            "refresh_token": "갱신 토큰",
            "token_type": //"bearer" 접큰 토큰의 타입,
            "expires_in": //"3600" 접큰 토큰의 유효 시간(초)
            }
            */
            //stirng 형태로 값이 담기니 json 형태로 parsing
            var r_token = JSON.parse(result).refresh_tokne_token;
            token = JSON.parse(result).access_token;
            //console.log('토큰값: ' + token);
            res.redirect(getinfoURI);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});


router.get('/member', function (req, res) {
    var header = "Bearer " + token; // Bearer 다음에 공백 추가
    var api_url = 'https://openapi.naver.com/v1/nid/me';
    var request = require('request');
    var options = {
        url: api_url,
        headers: { 'Authorization': header }
    };
    request.get(options, function (error, response, info_result) {
        if (!error && response.statusCode == 200) {
            //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            //res.end(info_result);
            //stirng 형태로 값이 담기니 json 형태로 parsing
            info_id = JSON.parse(info_result).response.id;
            info_email = JSON.parse(info_result).response.email;
            info_name = JSON.parse(info_result).response.name;

            console.log('id: ' + info_id + '//email: ' + info_email + '//name: ' + info_name);

            res.redirect('http://localhost:8080/auth/login');

        } else {
            console.log('error');
            if (response != null) {
                res.status(response.statusCode).end();
                console.log('error = ' + response.statusCode);
            }
        }
    });
});
// /auth/login 라우터에서 사용자 인증 후 세션에 사용자 정보 저장
router.get('/login', function (req, res) {
    console.log('/login 호출됨.');

    // 데이터베이스에서 사용자 조회
    UserModel.findOne({ id: info_id }, function (err, user) {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (!user) {
            // 사용자가 존재하지 않으면 새로 생성
            var newUser = new UserModel({
                id: info_id,
                email: info_email,
                name: info_name
            });
            // 새로운 사용자를 저장 및 바로 로그인 된 상태로
            newUser.save(function (err) {
                if (err) {
                    console.error('Error saving new user:', err);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('New user saved:', newUser);
                //세션에 저장
                req.session.user = {
                    id: info_id,
                    email: info_email,
                    name: info_name
                };
                // 로그인 성공 시 리다이렉트
                res.redirect(currentUrl);
            });
        } else {
            // 이미 존재하는 사용자이면 현재 페이지로 리다이렉트
            console.log('Existing user found:', user);
            //세션에 저장
            req.session.user = {
                id: info_id,
                email: info_email,
                name: info_name
            };
            res.redirect(currentUrl);
        }
    });
});


// 다른 라우터에서 세션 정보를 가져올 수 있는 함수
router.getSessionInfo = function() {
    return info_id;
};

module.exports = router;
