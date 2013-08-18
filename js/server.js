     ////////////OBJECT SERVER////////////
    //*********************************//
   //         Gomez Pablo Matias      //
  //         July 2013               //
 //*********************************//
/////////////////////////////////////

var Server = function(divAjaxLoaderID) {
    //variables privadas
    var url = "";
    var divAjaxLoader = $("#" + divAjaxLoaderID);
    
    var getData = function(subUrl, callback) {
        divAjaxLoader.show();
        $.ajax({
            type: 'GET',
            url: url + subUrl,
            dataType:"json",
            complete: function(data) {
                divAjaxLoader.hide();
                callback(data);
            }
        });
    }
    
    var tryServer = function(IP, PORT, callback){
        $.ajax({
            type: 'GET',
            url: "http://" + IP + ((parseInt(PORT) === 80) ? '' : ':' + PORT) + "/version",
            dataType:"json",
            success: function(data){
                if (data['version']) {
                    url = "http://" +  IP + ((parseInt(PORT) === 80) ? '' : ':' + PORT) + "/"; //Guardo datos del servidor
                    callback(true)
                }
                else callback(false);
            },
            error: function() {
                callback(false)
            }
         });
    }
  
    var registerUser = function(userName, callback){
        getData('players/register/' + userName, callback);
    }
    
    var setNumber = function(privateID, number, callback){
        getData('play/setnumber/' + privateID + '/' + number, callback);  
    }
                
    var guessNumber = function(privateID, publicID, number, callback){
        getData('play/guessnumber/' + privateID + '/' + publicID + '/' + number, callback);
    }
    
    var requestBoard = function(privateID, callback){
        getData('players/board/' + privateID, callback);
    }
    
    return {
        "registerUser": registerUser,
        "setNumber": setNumber,
        "guessNumber": guessNumber,
        "requestBoard": requestBoard,
        "tryServer": tryServer,
    }
};