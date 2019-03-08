function setRecordingState(isRecording) {
    chrome.runtime.sendMessage({
        type: 'recordingState',
        enabled: isRecording
    }, function(response) {
        console.log(response);
    });
}

function getAbsPath(path)
{
    try
    {
        new URL(path);
        return path;
    }
    catch(e)
    {
        return new URL(window.location.href+"/"+path).href;
    }
}

function makeElIfNotExist(id,tagname)
{
    if(!document.getElementById(String(id)))
    {
        var newel=document.createElement(tagname);
        newel.setAttribute("id",id);
        document.body.appendChild(newel);
    }
    else
    {
        document.getElementById(String(id)).innerHTML="";
    }
}

var divId="divzzzz";
var styleId="stylezzz";

function closeLinks()
{
    document.getElementById(divId).outerHTML="";
}

function showLinksHTML(txt)
{
    

    console.log(txt);

    var res=findLinkInPage(txt);

    var synth = window.speechSynthesis;
    var message = '';
    if (res.length == 0)
        message = 'We found nothing, try again..';
    else
        message = 'We found ' + res.length + ' results for ' + txt;

    var utterThis = new SpeechSynthesisUtterance(message);
    var voices = synth.getVoices();
    utterThis.voice = voices[0];
    synth.speak(utterThis);

    var showArr=[];
    for(var i=0;i<res.length;i++)
    {
        var el=res[i];

        showArr.push({
            link:getAbsPath(el.getAttribute("href")),
            txt:el.innerText
        })
    }
    
    if(document.getElementById(styleId))
        document.getElementById(styleId).innerHTML="";
    if(document.getElementById(divId))
        document.getElementById(divId).innerHTML="";
    
    makeElIfNotExist(styleId,"style");
    makeElIfNotExist(divId,"div");

    if(document.getElementById(styleId))
        document.getElementById(styleId).innerHTML="";
    if(document.getElementById(divId))
        document.getElementById(divId).innerHTML="";
        
    if(showArr.length)
    {

    }

    var divTxt="<b onclick='"+"document.getElementById(\""+divId+"\").outerHTML=\"\";"+"'>Exit</b>";
    for(var i=0;i<showArr.length;i++)
    {
        divTxt+="<div><a href='"+showArr[i].link+"' target='_blank'>";
        divTxt+="<span>Text: "+showArr[i].txt+"</span><br/><br/>";
        divTxt+="<span id='link'>Link: "+showArr[i].link+"</span>";
        
        divTxt+="</a></div>";
    }
    var cssTxt=`
    #divzzzz {      filter: invert(100%);box-shadow: rgba(0,0,0,0.7) 0px 0px 100px 1000px;overflow-y:auto;position: fixed; left: 10%; top: 10%; width: 80%; height: 80%; background-color: white; z-index: 9999999;}
    div#divzzzz > div {
        border: black solid;
        margin: 20px;
        font-size: 50px;
        cursor:pointer;
    }
    div#divzzzz > b
    {
        text-align: center;
    float: left;
    left: 0;
    width: auto;
    height: auto;
    position: relative;
    font-size: 5rem;
    border: red 1px solid;
    left: 50%;
    transform: translateX(-50%);
    cursor:pointer;
    }
    div#divzzzz > div:nth-child(2)
    {
        margin-top:200px;
    }

    div#divzzzz a
    {
        color: darkblue !important;
    }
    `;
    document.getElementById(divId).innerHTML=divTxt;
    document.getElementById(styleId).innerHTML=cssTxt;
}

function findLinkInPage(txt)
{
    function isIncludedInText(element)
    {
        var eltxt = element.innerText.toLowerCase();

        if (!eltxt)
            return false;

        if (eltxt.indexOf(txt.toLowerCase()) > -1)
            return true;

        return false;
    }

    function checkIfIsLink(doc)
    {
        arr = [];
        if (doc.tagName.toLowerCase() == "a")
        {
            if (isIncludedInText(doc))
            {
                arr.push(doc);
            }
        }
        var children = Array.from(doc.children||[]);

        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];
            arr=arr.concat(checkIfIsLink(child));
        }

        return arr;
    }

    var dp = new DOMParser();
    var doc = document.documentElement;
    var arr=checkIfIsLink(doc);
   
    return arr;
}
