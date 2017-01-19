var optionURL = "";
chrome.storage.sync.get('domain_url', function (value) {
    if(value['domain_url']!==null){
        optionURL = value['domain_url'];
        document.getElementById('domain').value = optionURL;
    }
});
function saveDomain() {
    if(document.getElementById('domain').value!==""){
        optionURL = document.getElementById('domain').value;
        chrome.storage.sync.set({'domain_url': optionURL}, function (value) {
            document.getElementById('error').style.display = "none";
        });
    }else{
        chrome.storage.sync.set({'domain_url': null}, function (value) {
            document.getElementById('error').style.display = "block";
        });
    }
}
document.getElementById('save').addEventListener('click', saveDomain);