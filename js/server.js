var Server = function() {
    //variables privadas
    var url = "";
    var waiting = false;
    
    var setUrl = function(value) {
        url = value;
    }
    
    getData = function(subUrl, oClient, callback){
        //$("li#asd").html("<u>testtttttt</u>: " + doOnWaiting + " OR " + !waiting);
        //if (!waiting || doOnWaiting){
            subUrl = subUrl.replace("<privateUuid>", oClient.getPrivateID());
            subUrl = subUrl.replace("<publicUuid>", oClient.getGuessingToID());
            waiting = true;
            $.ajax({
                type: 'GET',
                url: url + subUrl,
                dataType:"json",
                success: function(data) {
                    callback(data);
                },
                error: function(data) {
                    callback(data);
                }
            }).done (function() { waiting = false;});
        //}
    }
        
    return {
        "setUrl": setUrl,
        "getData": getData,
    }
};