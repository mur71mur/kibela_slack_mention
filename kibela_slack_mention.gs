var postUrl = "{yourf slack incoming webhook url}";
var spreadSheetId = "{your spreadSheetId}";

// kibalaからのpostを受け取るメインfunction
function doPost(e){
  var body = JSON.parse(e.parameter.payload);
  var converted_body = get_mention(body); //メンション化
  e.parameter.payload = JSON.stringify(converted_body);
  postSlack(e);
}

function postSlack(e){
  var payload = JSON.parse(e.parameter.payload);
  payload['channel'] = e.parameter.group; //このGASの実行urlの最後尾に?group=slackChannelIdをつける
  
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  UrlFetchApp.fetch(postUrl, options);
  
}

// メンバーシートを配列で取得
function getSlackMemberArray() {
  var memberSheet = SpreadsheetApp.openById(spreadSheetId);
  var arr = memberSheet.getSheetValues(1, 1, memberSheet.getLastRow(), memberSheet.getLastColumn());
  return arr;
}

// jsonの中身を修正
function get_mention(body){
  var slackMemberArray = getSlackMemberArray();
  for(var i in slackMemberArray){
    if(slackMemberArray[i][1]==""){
      
    }else{
      var kibelaId = new RegExp('@'+slackMemberArray[i][1], 'g');
      body.attachments[0].text = body.attachments[0].text.replace(kibelaId, '<@'+slackMemberArray[i][0]+'> ');
    }
  }
  body.username = "your bot name";
  body.icon_url = "your bot icon url";
  return body;
}

