var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var template = require('../lib/template.js');
// var form = require('form.js');

// create data 데이터 입력 route
router.get('/create',function(request, response){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = ``;
      var html = template.HTML(title, list, 
      // 입력 폼 html
      `
      <form action="/user/create_process" method="post">
        <h2>개인정보</h2>
        <p><input type="text" name="user_name" placeholder="이름"></p>
        <p><input type="text" name="user_number" placeholder="학번(뒤의 연도 2자리만 입력해주세요)"></p>
        <select name="semester">
          <option value="">학기</option>
          <option value="1학기">1학기</option>
          <option value="2학기">2학기</option>
          <option value="3학기">3학기</option>
          <option value="4학기">4학기</option>
          <option value="5학기">5학기</option>
          <option value="6학기">6학기</option>
          <option value="7학기">7학기</option>
          <option value="8학기">8학기</option>
          <option value="9학기">9학기</option>
          <option value="9학기초과">9학기초과</option>
        </select>
        <br>
        <select name="major1" onchange="showLecture(this);">
          <option value="">제1전공</option>
          <option value="국어국문학">국어국문학</option>
          <option value="경영학">경영학</option>
          <option value="컴퓨터공학">컴퓨터공학</option>
          <option value="화학">화학</option>
        </select>
        <select name="major2">
          <option value="">제2전공</option>
          <option value="없음">없음</option>
          <option value="융합소프트웨어">융합소프트웨어</option>
          <option value="국어국문학">국어국문학</option>
          <option value="경영학">경영학</option>
          <option value="컴퓨터공학">컴퓨터공학</option>
          <option value="화학">화학</option>
        </select>
        <select name="major3">
          <option value="">제3전공</option>
          <option value="없음">없음</option>
          <option value="국어국문학">국어국문학</option>
          <option value="경영학">경영학</option>
          <option value="컴퓨터공학">컴퓨터공학</option>
          <option value="화학">화학</option>
        </select>
        <h2>이수과목입력</h2>
        <select id="biz_req" name="business_req" multiple style="display: none;">
          <option value="">경영전필</option>
          <option value="생산관리론">생산관리론</option>
          <option value="경영정보시스템">경영정보시스템</option>
          <option value="조직행동이론">조직행동이론</option>
          <option value="회계학원론">회계학원론</option>
          <option value="국제경영론">국제경영론</option>
        </select>
        <select id="biz_sel" name="business_sel" multiple style="display: none;>
          <option value="">경영전선</option>
          <option value="경영과학">경영과학</option>
          <option value="투자론">투자론</option>
          <option value="응용경영통계">응용경영통계</option>
          <option value="통계자료분석">통계자료분석</option>
          <option value="CEO경영특강">CEO경영특강</option>
        </select>
        <select name="general_req" multiple>
          <option value="">교양필수</option>
          <option value="그리스도교윤리">그리스도교윤리</option>
          <option value="종교와세계문화">종교와세계문화</option>
          <option value="철학산책">철학산책</option>
        </select>
        <select name="general_sel" multiple>
          <option value="">교양선택</option>
          <option value="축구">축구</option>
          <option value="레크리에이션의이론과실제">레크리에이션의이론과실제</option>
          <option value="뮤지컬의이해">뮤지컬의이해</option>
        </select>
        <select name="other_major" multiple>
          <option value="">타전공</option>
          <option value="알고리즘설계와분석">알고리즘설계와분석</option>
          <option value="운영체제">운영체제</option>
          <option value="정치학개론">정치학개론</option>
        </select>

        <h2>시간표 구성 조건</h2>
        <select name="grade_count">
          <option value="">학점수 선택</option>
          <option value="grade1">14~16</option>
          <option value="grade2">17~19</option>
          <option value="grade3">20이상</option>
        </select>    
        <p><input type="text" name="major_req_count" placeholder="전공필수개수"></p>
        <p><input type="text" name="major_sel_count" placeholder="전공선택개수"></p>
        <p><input type="text" name="general_req_count" placeholder="교양필수개수"></p>
        <p><input type="text" name="general_sel_count" placeholder="교양선택개수"></p>
        <p><input type="text" name="must" placeholder="이건 무조건 들을거야!"></p>
        <select name="su">
          <option value="">S/U강의</option>
          <option value="전공">전공</option>
          <option value="교양">교양</option>
          <option value="듣지않음">듣지않음</option>
        </select>
        <select name="blank_day">
          <option value="">공강요일</option>
          <option value="없음">없음</option>
          <option value="월">월</option>
          <option value="화">화</option>
          <option value="수">수</option>
          <option value="목">목</option>
          <option value="금">금</option>
        </select>
        <p>기피시간대</p>
        <select name="mon_hate" multiple>
          <option value="">월요일</option>
          <option value="1">1교시</option>
          <option value="2">2교시</option>
          <option value="3">3교시</option>
          <option value="3">4교시</option>
          <option value="3">5교시</option>
          <option value="3">6교시</option>
        </select>
        <select name="tue_hate" multiple>
          <option value="">화요일</option>
          <option value="1">1교시</option>
          <option value="2">2교시</option>
          <option value="3">3교시</option>
          <option value="3">4교시</option>
          <option value="3">5교시</option>
          <option value="3">6교시</option>
        </select>
        <select name="wed_hate" multiple>
          <option value="">수요일</option>
          <option value="1">1교시</option>
          <option value="2">2교시</option>
          <option value="3">3교시</option>
          <option value="3">4교시</option>
          <option value="3">5교시</option>
          <option value="3">6교시</option>
        </select>
        <select name="thu_hate" multiple>
          <option value="">목요일</option>
          <option value="1">1교시</option>
          <option value="2">2교시</option>
          <option value="3">3교시</option>
          <option value="3">4교시</option>
          <option value="3">5교시</option>
          <option value="3">6교시</option>
        </select>
        <select name="fri_hate" multiple>
          <option value="">금요일</option>
          <option value="1">1교시</option>
          <option value="2">2교시</option>
          <option value="3">3교시</option>
          <option value="3">4교시</option>
          <option value="3">5교시</option>
          <option value="3">6교시</option>
        </select>

        <p>
          <input type="submit">
        </p>
      </form>
      `, ``, ``);
      response.send(html);
  });
  });

// 데이터 입력 후 저장 route
router.post('/create_process',function(request, response){
  var user = request.body;
  var user_name = user.user_name;
  var user_number = user.user_number;
  var semester = user.semester;
  var major1 = user.major1;
  var major2 = user.major2;
  var major3 = user.major3;
  var business_req = user.business_req;
  var business_sel = user.business_sel;
  var general_req = user.general_req;
  var general_sel = user.general_sel;
  var must = user.must;
  var other_major = user.other_major;
  var major_req_count = user.major_req_count;
  var major_sel_count = user.major_sel_count;
  var general_req_count = user.general_req_count;
  var general_sel_count = user.general_sel_count;
  var su = user.su;
  var blank_day = user.blank_day;
  var grade_count = user.grade_count;
  var mon_hate=user.mon_hate;
  var tue_hate=user.tue_hate;
  var wed_hate=user.wed_hate;
  var thu_hate=user.thu_hate;
  var fri_hate=user.fri_hate;
  
  var html =
  // 입력된 데이터를 보여주는 html
  `
  <h3>개인정보</h3>
  <p>학번 : ${user_number}</p>
  <p>학기 : ${semester}</p>
  <p>1전공 : ${major1}</p>
  <p>2전공 : ${major2}</p>
  <p>3전공 : ${major3}</p>
  <h3>수강이력</h3>
  <p>전공필수 : ${business_req}</p>
  <p>전공선택 : ${business_sel}}</p>
  <p>교양필수 : ${general_req}</p>
  <p>교양선택 : ${general_sel}</p>
  <p>타전공 : ${other_major}</p>
  <h3>시간표 구성 요건</h3>
  <p>학점수 : ${grade_count}</p>
  <p>전공필수개수 : ${major_req_count}</p>
  <p>전공선택개수 : ${major_sel_count}</p>
  <p>교양필수개수 : ${general_req_count}</p>
  <p>교양선택개수 : ${general_sel_count}</p>
  <p>무조건 듣겠다 : ${must}</p>
  <p>S/U과목 : ${su}</p>
  <p>공강요일 : ${blank_day}</p>
  <p>기피시간대</p>
  <p>월요일 : ${mon_hate}교시</p>
  <p>화요일 : ${tue_hate}교시</p>
  <p>수요일 : ${wed_hate}교시</p>
  <p>목요일 : ${thu_hate}교시</p>
  <p>금요일 : ${fri_hate}교시</p>
  `;
  fs.writeFile(`data/${user_name}`, html,'utf8', function(err){
    // 입력된 data를 보여주는 링크로 redirect  
    response.redirect(`/user/${user_name}`);
  })
});

// 삭제 route  
router.post('/delete_process', function(request, response){
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    // 삭제 후 home으로 redirect
    response.redirect('/');
  })
});

// 각 data를 보는 route
router.get('/:pageId', function(request, response){
  var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        ` <a href="/user/create">새 정보 입력</a>
          <form action="/user/delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="삭제">
          </form>`, ``//authStatusUI(request, response)
      );
      response.send(html);
    });
});
  
  
router.get('/:pageId', function(request, response){
  fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
    var title = queryData.id;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      ``, 
      ``
    );
    response.send(html);
  });
});

module.exports = router;