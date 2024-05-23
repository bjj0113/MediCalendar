// Express 기본 모듈 불러오기
var express = require('express')
, http = require('http')
, path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
, cookieParser = require('cookie-parser')
, static = require('serve-static')
, errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');

// 클라이언트에서 ajax 요청 시 CORS 지원
var cors = require('cors')
, request = require('request');

// 익스프레스 객체 생성
var app = express();

// 기본 포트 설정
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(expressSession({
    secret:'my key', resave:true, saveUninitialized:true
}));
app.use(cors());

app.get('/favicon.ico', (req, res) => res.status(204));

// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

router.get('/pharmacy', function(req, res){
    var url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=약국&coordinate=${req.query.coordinate}`;

    var options = {
        url: url,
        headers: {
            'X-NCP-APIGW-API-KEY-ID': '4p1l06c97z',
            'X-NCP-APIGW-API-KEY': 'VqOfsxYp0W7LuoJj1Kz1dz2hR4DjFk1IYgf3pAvF'
        }
    };

    request.get(options, function(error, response, body){
        if(!error && response.statusCode == 200) {
            res.json(JSON.parse(body));
        } else {
            res.status(response.statusCode).json({error: error});
        }
    });
});

app.use('/', router);

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});