module.exports = {
    HTML:function(title, list, body, control, authStatusUI = ''){
      return `
      <!doctype html>
      <html>
      <head>
        <title>시간표 추천 서비스</title>
        <meta charset="utf-8">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script>
          function showLecture(item){
            if($("select[name=major1]").val()=="경영학"){
              $("#biz_req").css("display","inline-block");
              $("#biz_sel").css("display","inline-block");
            }
            else{
              $("#biz_req").css("display","none");
              $("#biz_sel").css("display","none");
            }
          }
        </script>
      </head>
      <body>
        <h1><a href="/">시간표 짜기 귀찮지?</a></h1>
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
        list = list + `<li><a href="/user/${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }
  }