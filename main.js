
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////                                    百度敏感图片识别
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


//请求悬浮窗权限, 用来显示提示和结果
alert("项目启动,在图片界面按音量减按键");

// 项目启动,获取最新的token
var strKey = "qa31LiAYPnm1PefGGFnBxsrp";            //这个是我的数据,可能会有使用上限
var strSec = "98aKqFLCyduDaxIKiO9WkQpp6NxeEa3P";

var tokenUrl = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id="+strKey+"&client_secret="+strSec;
var res = http.postJson(tokenUrl, {});
var tokenObj = res.body.string();
tokenObj = JSON.parse(tokenObj);
//拿到token
var token = tokenObj.access_token;
console.log("token======== " + token);

//调用无障碍权限,开启后脚本运行
auto.waitFor();
var url = "https://aip.baidubce.com/rest/2.0/solution/v1/img_censor/v2/user_defined?access_token=";
//截图权限
if (!requestScreenCapture())
{
    toast("请求截图失败，请打开截图权限后使用");
    exit();
}

events.setKeyInterceptionEnabled("volume_down", true);
events.observeKey();
events.onKeyDown("volume_down", function (event)
{
    toast("识别中..");
    main();
});


function main()
{
    //截图,转成Base64的图片码;
    var img = captureScreen();
    imgBase64 = images.toBase64(img, "jpg", 100);


    let picRes = http.post(url + token, {
        image: imgBase64,
        imgType: 0,
    });

    var picInfo = picRes.body.string();

    console.error("LKX", " picInfopicInfo==" + picInfo);
    picInfo = JSON.parse(picInfo);

    if (!picInfo.error_code)
    {
        var strResult = "";
        var conclusion = picInfo.conclusion;

        strResult += "图片" + conclusion+": ";

        var conclusionType = picInfo.conclusionType;
        switch(conclusionType)
        {
            case 1:
                strResult = "不够色!!你管这个叫色图????";
                break;
            case 2:
                strResult += SetResult(picInfo.data);
                break;
            case 3:
                strResult += SetResult(picInfo.data);
                break;
            case 4:
                strResult = "审核失败!!你传的什么鬼图片????";
                break
            default:
                break;
        }

        toast(strResult);
    } 
    else
    {
        alert("请求失败: " + picInfo.error_code + ", " + picInfo.error_msg)
    }
}

function SetResult(dataArr)
{
    var strRRR = "";
    for(let i in dataArr)
    {
        var oneData = dataArr[i];
        var strMsg = oneData.msg;
        strMsg = strMsg.replace("不合规", " ");
        var nProbability = oneData.probability;
        nProbability = nProbability.toFixed(2) * 100;
        strRRR += "..."+strMsg+",可信度"+nProbability+"%...";
    }

    return strRRR;
}