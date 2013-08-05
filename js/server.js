var Server = function() {
    //variables privadas
    var url = "";
    
    var setUrl = function(value) {
        url = value;
    }
    
    var getData = function(subUrl, oClient, callback) {
        subUrl = subUrl.replace("<privateUuid>", oClient.getPrivateID());
        subUrl = subUrl.replace("<publicUuid>", oClient.getGuessingToID());

        $.ajax({
            type: 'GET',
            url: url + subUrl,
            dataType:"json",
            complete: function(data) {
                callback(data);
            }
        });
    }
  
    return {
        "setUrl": setUrl,
        "getData": getData
    }
};