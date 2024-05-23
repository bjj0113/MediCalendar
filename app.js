const config = require('./config/env');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

var express = require('express')
    , http = require('http')
    , path = require('path');

//bodyParser 모듈
var bodyParser = require('body-parser')
    , static = require('serve-static');

// 익스프레스 객체 생성
var app = express();

//클라이언트에서 ajax로 요청 시 cors(다중 서버 접속) 지원
var cors = require('cors');

//favicon.ico 잡아내기
app.get('/favicon.ico', (req, res) => res.status(204));

// 기본 속성 설정
app.set('port', process.env.PORT || 8080);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

//public 폴더 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use(static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port '  + app.get("port"));
});