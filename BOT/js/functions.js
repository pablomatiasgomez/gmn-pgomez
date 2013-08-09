      /////////////////////////////////////
     //*********************************//
    //         Gomez Pablo Matias      //
   //         July 2013               //
  //                                 //
 //*********************************//
/////////////////////////////////////


KEY_ENTER = 13;
ANIMATE_FAST = 200;
ANIMATE_SLOW = 500;
FORM_SERVER = 1;
FORM_USER = 2;
FORM_NUMBER = 3;

ERRCODE_USER_ALREADY_REGISTERED = 520;
ERRCODE_PRIVATE_UUID_NOT_FOUND = 521;
ERRCODE_ALREADY_HAS_NUMBER = 523; 
ERRCODE_INTERVAL_NOT_EXPIRED = 524;
ERRCODE_PRIVATE_UUID_NO_ACTIVE_NUMBER = 525;
ERRCODE_PUBLIC_UUID_NOT_FOUND = 526
ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER = 527;
ERRCODE_INVALID_NUMBER = 528;
ERRCODE_GUESSING_OWN_NUMBER = 529;

var possibleNumbers;
$(function(){ //ready function 

    oClient = Client();
    oServer = Server();
    
    $("#divData").draggable({ handle: "#divTitle" });
    
    $("#divData").css("top", $(window).height() - 200);
    $(window).resize(function() {
        $("#divData").css("top", $(window).height() - 200);
    });
    
    
    
    
    while (true) {
        oServer.getData('players/board/<privateUuid>', oClient, function(data) {
            if (data.status == undefined) {
                
                //Guardo datos
                if (!data['me'][0]['numberActivated']) {
                    $("li#number").html("<u>N&uacute;mero</u>: No seteado");
                    setNumber();
                }
                $("li#score").html("<u>Score</u>: " + data['me'][0]['score']);
                      
                //Cargo lista (ordenada por score de mayor a menor):
                data['players'].sort(function (a, b){ return ((a['score'] > b['score'] ) ? -1 : ((a['score'] < b['score']) ? 1 : 0)); });
                
                oClient.setGuessingToID('');
                $.each(data['players'], function(index, value){ 
                    if (value['numberActivated']) {
                        oClient.setGuessingToID(value['publicUuid']);
                        return;
                    }
                        
                });
            }
            else solveErrors(data.status, data['message']);
        });

        possibleNumbers = new Array(10000);
        
        for (var i =0; i<= 100; i++){
            setTimeout(guessNumber, i*1200);
        }

        return;
        //guessTimer();
        while (oClient.getGuessingToID != '') {};
    }
    

});

// FUNCTIONS:

function process(){
    
    
    
    
    oServer.setUrl("http://gmn.despegar.net/"); //Guardo datos del servidor

    setName();
    
    setNumber();
    
    
    
    
    
    
    
}
function guessTimer(){
    alert('');
    setTimeout(function() { 
        alert('');
        if (oClient.getGuessingToID != '') {
           guessNumber();
           guessTimer(); 
        }
    }, 1100);
}
function guessNumber(){
    num = Math.random().toString().substr(3,4);
    numberRegExp = /^[0-9]{4,4}$/

    while ((parseInt(num) != num) || (repeatedNumbers(num)) || !(numberRegExp.test(num)) || oClient.checkPreviousNumbers(num))  {num = Math.random().toString().substr(3,4) }
    if (oClient.getGuessingToID() != ''){
        //El numero esta correcto, realizo accion de adivinar:
        // Verificar que tenga numero, que yo tenga numero, que el exista.. bla bla 
        oServer.getData('play/guessnumber/<privateUuid>/<publicUuid>/' + num, oClient, function(data) {
            if (data.status == undefined){  
                // TODO: guardo valores en Array de objetos de numeros con hash !!
                // TODO: //data['timeToNextAttemp']; // data['numberId'];

                tr_html =" <tr> <td>" + oClient.getGuessingToID() + "</td> <td>"  + data['number'] + "</td> <td>" + data['correctChars'] + "</td> <td>" + data['existingChars'] + "</td> <td>" + data['wrongChars'] + "</td> </tr>";
                $("#tblAttempts tbody").append(tr_html);
                
                if (data['correctChars'] == 4){ // Adivne el numero !!
                    oClient.setGuessingToID('');
                    $("#tblAttempts tbody tr:last-child").css('background-color', '#FFFFFF');
                    // TODO: Guardar el valor en el array de numeros con el numero adivinado para poder ser referenciado por el hash .. !

                }

            }
            else solveErrors(data.status, data['message']);
        });
        oClient.setAttempts(oClient.getAttempts()+1);
    }
    
}
function setNumber(){
    num = Math.random().toString().substr(3,4);
    numberRegExp = /^[0-9]{4,4}$/
    
    while ((parseInt(num) != num) || (repeatedNumbers(num)) || !(numberRegExp.test(num)) || oClient.checkPreviousNumbers(num))  {num = Math.random().toString().substr(3,4) }
    oServer.getData('play/setnumber/<privateUuid>/' + num, oClient, function(data) {
        if (data.status == undefined){
            oClient.setNumber(data['number']); // Guardo datos
        }
        else solveErrors(data.status, data['message']);  
    });
}


function setName(){
    oServer.getData('players/register/BOTT' + Math.random().toString().substr(3,7) , oClient, function(data) {
        if (data.status == undefined){
            oClient.setName(data['name']);
            oClient.setPrivateID(data['privateUuid']); //Guardo datos
            
        }
        else solveErrors(data.status, data['message']); 
    });
}


function solveErrors(errorNumber, message){
    
    switch (errorNumber){
        case ERRCODE_PRIVATE_UUID_NOT_FOUND: //Private Uuid not found
            setName();
            break;
                   
        case ERRCODE_PUBLIC_UUID_NOT_FOUND: 
            break;
            
        case ERRCODE_GUESSING_OWN_NUMBER: //User tries to guess his own number.
            break;
            
        case ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER:
            break;
            
        case ERRCODE_INVALID_NUMBER: 
            setNumber();
            break;
            
        case ERRCODE_INTERVAL_NOT_EXPIRED: 
            break;
            
        case ERRCODE_ALREADY_HAS_NUMBER: // Already active number
            break;
            
        case ERRCODE_USER_ALREADY_REGISTERED: // Nombre de usuario ya existente
            setName();
            break;
            
        case ERRCODE_PRIVATE_UUID_NO_ACTIVE_NUMBER: //Private UUID has no active number.
            setNumber(); //Solo hago refresh board ya que dicha funcion se encarga de verficiar si no tengo numero y hace todo el proceso
            break;
            
        default:
            alert ('Error desconocido. Nro: ' + errorNumber + "<br /> Message: " + message);
            break;   
    }
}

function repeatedNumbers(number){
    repeated = false;
    number = number.toString();
    for (var i=0; i<4; i++){
        if (number.indexOf(number.substring(i,i+1),i+1) > 0) repeated = true;
    }
    return repeated;
}
    
function validateControl(control, valid) {
    if (valid)
        $(control).animate({ backgroundColor: '#C0FFC0', borderColor: '#00FF00'  }, ANIMATE_SLOW);
    else
        $(control).animate({ backgroundColor: '#FFD0D0', borderColor: '#FF0000' }, ANIMATE_SLOW);
}