var postUrl = 'slackの着信webフックのURL';
var Id = 'SpreadsheetのID';

// slackに投げる
function postSlack(e){
  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : e.parameter.payload
  };
  UrlFetchApp.fetch(postUrl, options);
}

// シートを配列で取得
function getSlackMemberArray() {
  var memoSheet = SpreadsheetApp.openById(Id);
  var arr = memoSheet.getSheetValues(1, 1, memoSheet.getLastRow(), memoSheet.getLastColumn());
  return arr;
}


// jsonの中身を修正
function get_mention(body){
  var slackMemberArray = getSlackMemberArray();
  for(var i in slackMemberArray){
    if(slackMemberArray[i][4]==""){
    }else{
      var kibelaId = new RegExp('@'+slackMemberArray[i][4], 'g');
      body.attachments[0].text = body.attachments[0].text.replace(kibelaId, '<@'+slackMemberArray[i][0]+'> ');
    }
  }
  return body;
}
