var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var cookie = require('cookie');

var template = {
  HTML:function(title, list, body, control, authStatusUI = '<a href="/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>시츄 - 시간표 추천 시스템</title>
      <meta charset="utf-8">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
      <script>
        function showLecture(item){
          if($("select[name=major1]").val()=="경영학"){
            $("#biz_req").css("display","inline-block");
            $("#biz_sel").css("display","inline-block");
          }
        }
      </script>
    </head>
    <body>
      <h1><a href="/">시간표 짜기 귀찮지?</a></h1>
      ${authStatusUI}
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}

function authIsOwner(request, response){
  var isOwner = false;
  var cookies ={}
    if(request.headers.cookie){
      cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.email === 'jy2045@sogang.ac.kr' && cookies.password === '111111'){
      isOwner = true;
    }
  return isOwner;
}

function authStatusUI(request, response){
  var authStatusUI = '<a href="/login">login</a>';
  if(authIsOwner(request, response)){
    authStatusUI ='<a href="/logout_process">logout</a>';
  }
  return authStatusUI;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = '취향에 맞는 시간표를 만들어드립니다';
          var description = '로그인 후 개인정보 / 시간표 취향을 입력하세요';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">시작하기</a>`,
            authStatusUI(request, response)
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = ``;
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">새 정보 입력</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
                </form>`, authStatusUI(request, response)
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      if(authIsOwner(request, response) === false){
        response.end('Login required!!');
        return false;
      }
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = ``;
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
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

            <h2>취향선택</h2>
            <p><input type="text" name="major_req_count" placeholder="전공필수개수"></p>
            <p><input type="text" name="major_sel_count" placeholder="전공선택개수"></p>
            <p><input type="text" name="general_req_count" placeholder="교양필수개수"></p>
            <p><input type="text" name="general_sel_count" placeholder="교양선택개수"></p>
            <p><input type="text" name="su_count" placeholder="S/U강의"></p>
            <select name="blank_day">
              <option value="">공강요일</option>
              <option value="없음">없음</option>
              <option value="월">월</option>
              <option value="화">화</option>
              <option value="수">수</option>
              <option value="목">목</option>
              <option value="금">금</option>
            </select>
            <select name="am_pm">
              <option value="">오전파/오후파</option>
              <option value="오전파">오전파(1,2,3교시)</option>
              <option value="오후파">오후파(4,5,6교시)</option>
            </select>    
            <p>
              <input type="submit">
            </p>
          </form>
        `, '', authStatusUI(request, response));
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      if(authIsOwner(request, response) === false){
        response.end('Login required!!');
        return false;
      }
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var user = qs.parse(body);
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
          var other_major = user.other_major;
          var major_req_count = user.major_req_count;
          var major_sel_count = user.major_sel_count;
          var general_req_count = user.general_req_count;
          var general_sel_count = user.general_sel_count;
          var su_count = user.su_count;
          var blank_day = user.blank_day;
          var am_pm = user.am_pm;
          var html =
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
          <h3>취향</h3>
          <p>전공필수개수 : ${major_req_count}</p>
          <p>전공선택개수 : ${major_sel_count}</p>
          <p>교양필수개수 : ${general_req_count}</p>
          <p>교양선택개수 : ${general_sel_count}</p>
          <p>S/U과목개수 : ${su_count}</p>
          <p>공강요일 : ${blank_day}</p>
          <p>오전파/오후파 : ${am_pm}</p>
          `;
          fs.writeFile(`data/${user_name}`, html,'utf8', function(err){
            response.writeHead(200);
            response.end(`
            <p>success</p>
            <a href="/">home<a>
            `);
          })
      });
    } 
    // else if(pathname === '/update'){
    //   if(authIsOwner(request, response) === false){
    //     response.end('Login required!!');
    //     return false;
    //   }
    //   fs.readdir('./data', function(error, filelist){
    //     fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
    //       var title = queryData.id;
    //       var list = template.list(filelist);
    //       var html = template.HTML(title, list,
    //         `
    //         <form action="/update_process" method="post">
    //           <input type="hidden" name="id" value="${title}">
    //           <p><input type="text" name="title" placeholder="title" value="${title}"></p>
    //           <p>
    //             <textarea name="description" placeholder="description">${description}</textarea>
    //           </p>
    //           <p>
    //             <input type="submit">
    //           </p>
    //         </form>
    //         `,
    //         ``, 
    //         authStatusUI(request, response)
    //       );
    //       response.writeHead(200);
    //       response.end(html);
    //     });
    //   });
    // } else if(pathname === '/update_process'){
    //   if(authIsOwner(request, response) === false){
    //     response.end('Login required!!');
    //     return false;
    //   }
    //   var body = '';
    //   request.on('data', function(data){
    //       body = body + data;
    //   });
    //   request.on('end', function(){
    //       var post = qs.parse(body);
    //       var id = post.id;
    //       var title = post.title;
    //       var description = post.description;
    //       fs.rename(`data/${id}`, `data/${title}`, function(error){
    //         fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    //           response.writeHead(302, {Location: `/?id=${title}`});
    //           response.end();
    //         })
    //       });
    //   });
    // } 
     else if(pathname === '/delete_process'){
      if(authIsOwner(request, response) === false){
        response.end('Login required!!');
        return false;
      }
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          fs.unlink(`data/${id}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else if (pathname === '/login'){
      fs.readdir('./data', function(error, filelist){
        var title = 'Login';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          `
          <form action="login_process" method="post">
          <p><input type="email" name="email" placeholder="이메일"></p>
          <p><input type="password" name="password" placeholder="비밀번호"></p>
          <p><input type="submit"></p>
          </form>`,
          `<a href="/create">시작하기</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } 
    else if (pathname === '/login_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          if(post.email === 'jy2045@sogang.ac.kr' && post.password === '111111'){
            response.writeHead(302, {
              'Set-Cookie':[
                `email=${post.email}`,
                `password=${post.password}`,
                'nickname=jypark'
              ],
              Location: `/`
            });
            response.end();
          } else{
            response.end('로그인 실패');
          }
      });
    }
    else if (pathname === '/logout_process'){
      if(authIsOwner(request, response) === false){
        response.end('Login required!!');
        return false;
      }
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          response.writeHead(302, {
              'Set-Cookie':[
                `email=; Max-Age=0`,
                `password=; Max-Age=0`,
                `nickname=; Max-Age=0`
              ],
              Location: `/`
            });
            response.end();
      });
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
