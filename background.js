// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.
var _tranSData = null, _domainURL = "";
function JiraData(){
    var userDetails = null,
    timeDetails = null;
    this.setUserDeatails = function(userData){
        userDetails = userData;
    };
    this.getUserDetails = function(){
        return userDetails;
    };
    this.setTimeDetails = function(timeData){
        timeDetails = timeData;
    };
    this.getTimeDetails = function(){
        return timeDetails;
    };
}


/*chrome.webRequest.onResponseStarted.addListener(
    function (details) {
        if(details.url.indexOf(_domainURL)>-1) {
            setUserDetails(details);
        }
        return {cancel: false};
    },
    {
        urls: [
            "*://!*!/!*!/CreateWorklog.jspa", "*://!*!/!*!/UpdateWorklog.jspa"
        ]
    },
    // extraInfoSpec
    ["responseHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if(details.url.indexOf(_domainURL)>-1) {
            setUserDetails(details);
        }
        return {cancel: false};
    },
    {
        urls: [
            "*://!*!/!*!/CreateWorklog.jspa", "*://!*!/!*!/UpdateWorklog.jspa"
        ]
    },
    // extraInfoSpec
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if(details.url.indexOf(_domainURL)>-1){
            setTimeDetails(details);
        }
        return {cancel: false};
    },
    {
        urls: [
            "*://!*!/!*!/CreateWorklog.jspa", "*://!*!/!*!/UpdateWorklog.jspa"
        ]
    },
    // extraInfoSpec
    ["blocking", "requestBody"]
);*/

function setTimeDetails(timeDetails) {
    if (timeDetails.hasOwnProperty('requestBody')) {
        var formData = timeDetails.requestBody.formData;
        var jsonTimeObj = {};
        jsonTimeObj.comment = formData.comment[0];
        jsonTimeObj.id = formData.id[0];
        jsonTimeObj.datelogged = formData.startDate[0];
        jsonTimeObj.timeLogged = formData.timeLogged[0];
        jsonTimeObj.worklogId = formData.worklogId[0];
        //jsonTimeObj.jiraTitle = timeDetails.requestBody.referrer[0];
        startTransaction();
    }
}

function setUserDetails(userDetails) {
    //Collect user details
    chrome.storage.sync.get('jira_user', function (value) {
        if (value['jira_user'] != userDetails) {
            //save new user
            chrome.storage.sync.set({'jira_user': userDetails}, function() {});
        }
        sendTransactionData();
    });
}

function getTotalTime(date){
    chrome.storage.sync.get('jira_user', function (value) {
        if (value['jira_user'] != null) {
            var user = value['jira_user'];
            var date = moment(date).format('DD/MM/YY');
            //send ajax to get the total
            var notificationOption = {
                type: "basic",
                iconUrl: "icon.png",
                title: "Success",
                message: "You have logged {time} hours for the {data}."
            };
            chrome.notifications.create('001', notificationOption, function () {});
        }
    });
}

function startTransaction(){
    _tranSData = new JiraData();
}

function endTransaction() {
    _tranSData = null;
}

function sendTransactionData() {
    //Ajax call to save
    var callBackFn = function(){
        //Show Notification
        var notificationOption = {
            type: "basic",
            iconUrl: "icon.png",
            title: "Success",
            message: "You have logged {time}."
        };
        chrome.notifications.create('001', notificationOption, function () {});
        //End the transaction
        endTransaction();
    }
}
function onSubmitEvent(event){
    alert(1);
}
function init() {

    chrome.webNavigation.onCompleted.addListener(function (details){
        var myForm = document.forms;
        //myForm.addEventListener('submit', onSubmitEvent);
    });


    chrome.storage.sync.get('domain_url', function (value) {
        if (value['domain_url'] === null) {
            //send ajax to get the total
            _domainURL = value['domain_url'];
            var notificationOption = {
                type: "basic",
                iconUrl: "icon.png",
                title: "Success",
                message: "Jira reference is not set, set it from the options"
            };
            chrome.notifications.create('100', notificationOption, function () {});
        }
    });

    chrome.storage.sync.get('jira_user', function (value) {
        // Check if user exixst
        if (value['jira_user'] == null) {
            var notificationOption = {
                type: "basic",
                iconUrl: "icon.png",
                title: "Warining",
                message: "You have not logged time with jira-time-tracker enabled.\n log times with with jira-time-tracker"
            };
            chrome.notifications.create('001', notificationOption, function () {});
        } else {
            //chrome.storage.sync.set({'jira_user': null}, function() {
            // Notify that we saved.
            // message('Settings saved');
            //});
        }

    });

}
init();

