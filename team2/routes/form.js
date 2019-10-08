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
    <option value="grade1">15~18</option>
    <option value="grade2">19~21</option>
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
  <p>
    <input type="submit">
  </p>
</form>
`