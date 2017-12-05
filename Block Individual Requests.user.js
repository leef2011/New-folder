// ==UserScript==
// @name           Block Individual Requests
// @author         Turksquatch
// @version        0.0.5
// @namespace      http://www.turksquatch.com/
// @homepage       http://mturkforum.com/showthread.php?4441-New-Script-to-Block-Individual-Hits&p=56939
// @description    Hide individual HITs you're not interested in.
// @include        https://www.mturk.com/mturk/findhits*
// @include        https://www.mturk.com/mturk/searchbar*
// @include        https://www.mturk.com/mturk/viewsearchbar*
// @include        https://www.mturk.com/mturk/sortsearchbar*
// @include        https://www.mturk.com/mturk/sorthits*
// @include        https://www.mturk.com/mturk/viewhits*
// ==/UserScript==

requestIndex = GM_getValue("requestIndex");
if(!requestIndex) {
  //alert(requestIndex);
  requestIndex="";
  
  GM_setValue("requestIndex","");
}


function showUpdates() {
  updated = GM_getValue('requestUpdated');
  if (updated) {
    tables = document.evaluate("//table",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
    table = tables.snapshotItem(6);
    action = updated.split(',');
    rId = action[1].split('::')[0];
    rName = action[1].split('::')[1];
    div = document.createElement('div');
    div.id = 'updated';
    status = "<div class='message success'><h6><span id='alertboxHeader'>"+action[0]+" "+rName;
    if (action[0]=='Blocked') {
      status+=" <a style='font-size:80%;' href='javascript:unblockRequest(\""+rId+"\",\""+rName+"\");' title='Unblock this request'>undo</a>";
    }
    div.innerHTML = status + "</h6></span></div>";
      table.parentNode.insertBefore(div, table);
    GM_deleteValue('requestUpdated');
  }
}

function hideHIT(element) {
  pa=element, step=0;
  while (step++ < 11) {
    ch = pa;
    pa = pa.parentNode;
  }
  pa.className = "rblocked";
}

function unhideHIT(element) {
  pa=element, step=0;
  while (step++ < 11) {
    ch = pa;
    pa = pa.parentNode;
  }
  pa.className = "";
}

function hideMatchingHITs() {
  var numBlocked=0;
  theseRequests = document.evaluate("//a[starts-with(@href,'/mturk/preview?groupId=')]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
  for (i=0; i<theseRequests.snapshotLength; i++) {
    rLink = theseRequests.snapshotItem(i);
	rLink.parentNode.nowrap = false;
	rName = "x";
    rId = rLink.href.toString().split('=')[1];
    if (requestIndex.indexOf(rId) != -1 && location.href.indexOf(rId) == -1) {
      newElement = document.createElement('a');
      newElement.innerHTML = "&nbsp;<a style='font-size:80%;' href='javascript:unblockRequest(\""+rId+"\",\""+rName+"\");' title='Unblock this request'>unblock</a>";
      rLink.parentNode.insertBefore(newElement, rLink.nextSibling);
      hideHIT(rLink);
  	  numBlocked+=1;
    } else {
      newElement = document.createElement('a');
      newElement.innerHTML = "&nbsp;<a href='javascript:blockRequest(\""+rId+"\","+i+");' style='font-size:80%;' title='Block this request'>x</a>";
      rLink.parentNode.insertBefore(newElement, rLink.nextSibling);
    }
  }
  return numBlocked;
}

unsafeWindow.unhideAllHITs = function () {
	theseRequests = document.evaluate("//a[starts-with(@href,'/mturk/preview?groupId=')]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
	for (i=0; i<theseRequests.snapshotLength; i++) {
		unhideHIT(theseRequests.snapshotItem(i));
	}
}

function showNumBlocked(numBlocked) {
  collapseAll = document.getElementById('collapseall');
  showAllBlocked = document.createElement("span");
  showAllBlocked.innerHTML = '&nbsp;&nbsp;<font color="#9ab8ef">|</font>&nbsp;&nbsp;<a href="javascript:unhideAllHITs();" class="footer_links" id="showrblocked">Show ' + numBlocked + ' rBlocked</a>';
  collapseAll.parentNode.insertBefore(showAllBlocked, collapseAll.nextSibling);
}
           
		   


unsafeWindow.blockRequest = function (rId,i) {
    rName = "x";
    rEntry = rId+"::"+rName;
    requestIndex+= rEntry+"}{";
    if (confirm("Hide this HIT?")) { 
		window.setTimeout(function() {
			GM_setValue("requestIndex", requestIndex);
			GM_setValue("requestUpdated", "Blocked,"+rEntry);
		  }, 0);
      //window.setTimeout(GM_setValue, 0, "requestIndex", requestIndex);
      //window.setTimeout(GM_setValue, 0, "requestUpdated", "Blocked,"+rEntry);
	  
	 
      document.location.reload();
    }
}





unsafeWindow.unblockRequest = function (rId,rName) {
  theseRequests = document.evaluate("//a[starts-with(@href,'/mturk/preview?groupId=')]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
  rEntry = rId+"::"+rName;
  half = requestIndex.split(rId+"::");
  left = half[0];
  temp = half[1].split('}{');
  right = temp[1]+"}{";
  if (temp.length>1) {
    for (i=2;i<temp.length-1;i++) {
      right+=temp[i]+"}{";
    }
  }  
  requestIndex = left + right;
  window.setTimeout(function() {
			GM_setValue("requestIndex", requestIndex);
			GM_setValue("requestUpdated", "Unblocked,"+rEntry);
		  }, 0);
  //window.setTimeout(GM_setValue, 0, "requestIndex", requestIndex);
  //window.setTimeout(GM_setValue, 0, "requestUpdated", "Unblocked,"+rEntry);
  document.location.reload();
}

function addGlobalStyle(css) {
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.rblocked { display: none; }');
showUpdates();
showNumBlocked(hideMatchingHITs());
