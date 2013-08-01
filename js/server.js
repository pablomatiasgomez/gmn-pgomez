var Server = function() {
    //variables privadas
    var url = "";

    var setUrl = function(value) {
        url = value;
    }
    
    getData = function(subUrl, oClient, callback){
        subUrl = subUrl.replace("<privateUuid>", oClient.getPrivateID());
        subUrl = subUrl.replace("<publicUuid>", oClient.getGuessingToID());

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
        });
    }
        
    return {
        "setUrl": setUrl,
        "getData": getData,
    }
};