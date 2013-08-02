
      /////////////////////////////////////
     //*********************************//
    //         Gomez Pablo Matias      //
   //         July 2013               //
  //                                 //
 //*********************************//
/////////////////////////////////////

/* 
preguntas a hacer:
    validacion con w3 errores de ISO y etc...
    Coomo crear un array de numeros dentro de client
    Obejto dentro de objetos.. ya arme objeto, como los meot como arrays a ambos ?

    problema de recibir message y timetonextattemp en ERROR ! PREGUNTAR !!!
    OBJETOS 
    
    number = {};
        
        // en cada number guardo por hash un numero, adentro de eso si SE el numero ya lo tendria guardado y sino tendria guardado los intentos, tal numero y un jason adentro que tenga los correctos, etc??
        number['HASH'] = {'number':'', "1235":{'correct': 3}};
        number['HASH']['number'] = '1234';
        //number['HASH'][]
        console.log(number['HASH']);
        return;
        
        
    y lo mismo con numberSetted, esta bien hecho que sea con un array?
    
    

    TODO: setTimeOut ( rellamandola para problemas de sincronia)   haceer timerrrrr 1000ms
                                            
    TODO: guardar hashes de numeros sabidos para adivinar los siguients si son iguales!
    TODO: mostrar intentos por numberid y no POR USUARIO !!!
    TODO: verificar hash e number para saeber si el contricante sigue con el mismo numero ! ESTO ESTA HECHO PERO FALTARIA EL TEST CUANDO GUARDE CADA ACIERTOS DE NUMERO
    
    
    TODO: Hacer metodos en cliente y server ṕara cada accion.. !!!
    TODO: cambiar el succes por complete (Error tmb)
    ERROR EN LA DOCUMENTACION GUESSNUMBER DEVUELVE ID DEL NUMBER DEL TIP; NO DEL TRIED
*/


/*










var tries = {};





if (tries[numberId] === undefined){
    tries[numberId] = [];
}

tries[numberId].push({
    "number": data.number,
    "correctChars": ...,
    ...
    ...
    ...
});

































var oserver = server({"a": "a"});
options

var arr;

arr['uuid234823094823f99sd809fsdf'] = Objeto ;
arr[saddasdas].guessed.. ;
va intentos;
intentos.

FUNCAAAA !!:!:!:!:!:!:!:!!:!!:!: ASDASKASDM Pero no puedo aplicar diccionario... para guardar el hash del numero.. como hago ?

        oNumber = Number();
        
        oNumber.setNum ( '1234');
        oNumber.attempts[0].setNumber('1233');
        oNumber.attempts[0].setCorrect ('1');
        oNumber.attempts[0].setWrong ( '3');
        oNumber.attempts[0].setExisting(  '2');
        
        index = oNumber.attempts.push(Attempt());

        oNumber.attempts[index-1].setWrong('2343');
        
        $.each(oNumber.attempts, function(index, value){
            //alert(oNumber.attempts[index].getNumber());
           alert(oNumber.getNum()  + ' ' + value.getNumber() + ' ' + value.getCorrect() + ' ' + value.getWrong() + ' ' + value.getExisting()) ;
            
        });
*/

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

var canGuess = true;

$(function(){ //ready function 
    oClient = Client();
    oServer = Server();
    
    $("#divServer").show();
    $("#txtServer").focus();
    $("#divData").draggable({ handle: "#divTitle" });
    
    $("#divData").css("top", $(window).height() - 180);
    $(window).resize(function() {
        $("#divData").css("top", $(window).height() - 180);
    });

    $("#frmServer input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(FORM_SERVER); });
    $("#frmUser input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(FORM_USER); });
    $("#frmNumber input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(FORM_NUMBER); });
    
    $("#txtGuessNumber").keyup(function (event) { 
        numberRegExp = /^[0-9]{4,4}$/
        if (numberRegExp.test($("#txtGuessNumber").val())){
            $("#btnGuess").removeAttr("disabled");   
        }
        else $("#btnGuess").attr('disabled', 'disabled');         
        
        if (event.keyCode === KEY_ENTER) $("#btnGuess").click();
    });
    
    $("#btnServer_Save").click(function (){
        /*number = {};
        
        // en cada number guardo por hash un numero, adentro de eso si SE el numero ya lo tendria guardado y sino tendria guardado los intentos, tal numero y un jason adentro que tenga los correctos, etc??
        number['HASH'] = {'number':'', "1235":{'correct': 3}};
        number['HASH']['number'] = '1234';
        //number['HASH'][]
        console.log(number['HASH']);
        return;*/
        
        
        if (validateForm(FORM_SERVER)){
            $("#divServer .result").slideUp(ANIMATE_FAST);
            $.ajax({
                type: 'GET',
                url: "http://" +  $("#txtServer").val() + ((parseInt($("#txtPort").val()) === 80) ? '' : $("#txtPort").val()) + "/version",
                dataType:"json",
                success: function(data){
                    if (data['version']) {
                        oServer.setUrl("http://" +  $("#txtServer").val() + ((parseInt($("#txtPort").val()) === 80) ? '' : $("#txtPort").val()) + "/"); //Guardo datos del servidor
                        $("#divServer").fadeOut(ANIMATE_FAST, function(){ $("#divUser").fadeIn(ANIMATE_FAST, function(){ $("#txtUser").focus(); })}); //Muestro siguiente form
                    }
                },
                error: function() {
                    $("#divServer .result span").html("Error de conexion al servidor");
                    $("#divServer .result").slideDown(ANIMATE_SLOW);
                    $("#txtServer").focus();
                    $("#frmServer").css('box-shadow', '0 0 10px 2px #FF0000');
                }
             });
        }
    });
    
    $("#btnUser_Save").click(function (){
        if (validateForm(FORM_USER)){
            $("#divUser .result").slideUp(ANIMATE_FAST);
            oServer.getData('players/register/' + $("#txtUser").val(), oClient, function(data) {
                if (data.status == undefined){
                    oClient.setName(data['name']);
                    oClient.setPrivateID(data['privateUuid']); //Guardo datos
                    $("#divUser").fadeOut(ANIMATE_FAST, function(){ $("#divNumber").fadeIn(ANIMATE_FAST, function(){ $("#txtNumber").focus(); })}); //Muestro siguiente form
                }
                else solveErrors(data);  
            });
        }
    });
    
    $("#btnNumber_Save").click(function (){
        if (validateForm(FORM_NUMBER)){
            if (oClient.checkPreviousNumbers($("#txtNumber").val())) {
                $("#divNumber .result span").html("N&uacute;mero ya elegido previamente.");
                $("#divNumber .result").slideDown(ANIMATE_SLOW);
                $("#txtNumber").focus();
                $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
            }
            else {
                $("#divNumber .result").slideUp(ANIMATE_FAST);
                oServer.getData('play/setnumber/<privateUuid>/' + $("#txtNumber").val(), oClient, function(data) {
                    if (data.status == undefined){
                        oClient.setNumber(data['number']); // Guardo datos
                        $("#divNumber").fadeOut(ANIMATE_FAST, function(){ $("#divMain").fadeIn(ANIMATE_FAST, function() { refreshBoard(); } )});   //Muestro siguiente form
                    }
                    else solveErrors(data);  
                });
            }
        }
    });
        
    $("#btnGuess").click(function (){
        if (canGuess == false) return;
        canGuess = false; // No permito que apriete el boton si previamente se apreto el boton y se esta esperando respuesta del servidor 
        numberRegExp = /^[0-9]{4,4}$/
        if (numberRegExp.test($("#txtGuessNumber").val()) && (oClient.getGuessingToID() != '')){
            //El numero esta correcto, realizo accion de adivinar:
            $("#frmGuessNumber .result").slideUp(ANIMATE_FAST);
            refreshBoard(); //Con esto verifico que si mi oponente no tiene numero o dejo de existir, desaparece ! Tambien verifico yo tener numero.. !
            if ($("#divMain").is (':visible') && oClient.getGuessingToID != '') {
                oClient.clearGuessTimer(); // Esto es para ejecutar un solo llamado al servidor y no tenr wastedAttempts
                var timer = setTimeout(function(){
                    oServer.getData('play/guessnumber/<privateUuid>/<publicUuid>/' + $("#txtGuessNumber").val(), oClient, function(data) {
                        canGuess = true;
                        if (data.status == undefined){  
                            // TODO: guardo valores en Array de objetos de numeros con hash !!
                            // TODO: // // data['numberId'];
                            oClient.setInterval(data['timeToNextAttemp']); // Guardo intervalo para no ejercutar el proximo antes.
                            oClient.clearGuessTimer();
                            
                            tr_html =" <tr> <td>"  + data['number'] + "</td> <td>" + data['correctChars'] + "</td> <td>" + data['existingChars'] + "</td> <td>" + data['wrongChars'] + "</td> </tr>";
                            $("#tblAttempts tbody").append(tr_html).hide().fadeIn(ANIMATE_FAST);
                            //$("#tblAttempts tbody tr:last-child");
                            
                            if (data['correctChars'] == 4){ // Adivne el numero !!
                                oClient.setGuessingToID('');
                                // TODO: Guardar el valor en el array de numeros con el numero adivinado para poder ser referenciado por el hash .. !
                                $("#tblOponent").fadeOut(ANIMATE_SLOW, function(){ refreshBoard(); });
                            }
                            $("#txtGuessNumber").focus();
                        }
                        else solveErrors(data);
                    });
                    oClient.setAttempts(oClient.getAttempts()+1);
                }, oClient.timeToWait());
                oClient.setGuessTimer(timer);    
            } 
            else canGuess = true;
        }
        else canGuess = true;
     });

     $("#btnRefreshLobby").click(function() { refreshBoard(); });
});

// FUNCTIONS:

function refreshBoard(){
    oServer.getData('players/board/<privateUuid>', oClient, function(data) {
        if (data.status == undefined) {
            colorFormats = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit'];
            
            //Guardo datos
            if (!data['me'][0]['numberActivated']) {
                $("li#number").html("<u>N&uacute;mero</u>: No seteado");
                $("#txtNumber").val('');
                $("#divMain").fadeOut(ANIMATE_FAST, function(){ $("#divNumber").fadeIn(ANIMATE_FAST, function(){ $("#txtNumber").focus(); })});
                $("#divNumber .result span").html("No tienes numero asignado");
                $("#divNumber .result").slideDown(ANIMATE_SLOW);
                validateForm(FORM_NUMBER);
            }
            $("li#score").html("<u>Score</u>: " + data['me'][0]['score']);
                  
            //Cargo lista (ordenada por score de mayor a menor):
            data['players'].sort(function (a, b){ return ((a['score'] > b['score'] ) ? -1 : ((a['score'] < b['score']) ? 1 : 0)); });
            $("#tblPlayers tbody").html('');
            $("#tblOponent").hide();
            $("#tblOponent tbody").html('');
            // TODO: $("#tblAttempts tbody").html('');
            $.each(data['players'], function(index, value){ 
                tr_html = "<tr id='<HASH>'> <td><div class='userColor'></div></td> <td><ACTIVE><span></span></td> <td><SCORE></td> <td><input type='button' value='Jugar' /></td></tr>";
                tr_html = tr_html.replace("<HASH>", value['publicUuid']);
                tr_html = tr_html.replace("<ACTIVE>", (value['numberActivated'] == true) ? "S&iacute;" : "No");
                tr_html = tr_html.replace("<SCORE>", value['score']);
                
                

                if (!value['numberActivated'] && value['publicUuid'] == oClient.getGuessingToID()) oClient.setGuessingToID('');
                
                if (value['publicUuid'] == oClient.getGuessingToID()){ //Si encuentro al que estoy adivinando entonces lo cargo en el div de oponente, sino en la lista
                    $("#tblOponent").show();
                    $("#tblOponent tbody").html(tr_html);
                    $("#" + value['publicUuid'] + " td:last-child").remove();
                
                    // TODO: Cargar lista de intentos en base al hash del number:  value['numberId'] 
                    // $("#tblAttempts").html
                    // attempt_tr_html ="<tr> <td><NUMBER></td> <td><CORRECT_CHARS></td> <td><EXISTING_CHARS></td> <td><WRONG_CHARS></td> </tr>";
                    
                }
                else {
                    $("#tblPlayers tbody").append(tr_html);
                    if(!value['numberActivated']) $("#" + value['publicUuid'] + " input[type='button']").attr('disabled', 'disabled').hide();

                    $("#" + value['publicUuid'] + " input[type='button']").click(function () {
                        // Si tiene contrincante activo entonces:
                        if (oClient.getGuessingToID() != '')  $("#" + oClient.getGuessingToID()).fadeOut(ANIMATE_FAST);
                           
                        oClient.setGuessingToID(value['publicUuid']);
                        $("#" + value['publicUuid']).fadeOut(ANIMATE_SLOW, function(){
                            $("#" + value['publicUuid'] + " td:last-child").remove();
                            $("#tblOponent").show();
                            $("#tblOponent tbody").html($("#" + value['publicUuid']));
                            $("#" + value['publicUuid']).hide();
                            $("#divOponent *").removeAttr("disabled");
                            $("#txtGuessNumber").focus();
                            $("#txtGuessNumber").val('');
                            $("#" + value['publicUuid']).fadeIn(ANIMATE_SLOW, function() { refreshBoard(); });
                            // TODO: cargar lista de intentos pero aca animadamente. value['numberId'] 
                            
                            // TODO: Hacer Fadeout de la lista y luego fadein con los nuevos atributos ARRIBA DE ESTO (Refreshboard))
                            
                        });                           
                    });
                }      
                if (value['numberActivated'] && false ){ //Si tiene numero activo y si compruebo (TODO: REPLACE) coincidencia de hash entonces es adivinable: 
                    $("#" + value['publicUuid'] + " span").css({'color': 'blue', 'text-decoration': 'underline', 'cursor': 'pointer', 'margin-left': '10px'});
                    $("#" + value['publicUuid'] + " span").html('1234') //TODO: REEMPLEZAR POR EL NUMERO QUE ES !
                    $("#" + value['publicUuid'] + " span").click(function () {
                        oServer.getData('play/guessnumber/<privateUuid>/' + value['publicUuid'] + '/' + '1234', oClient, function(data) { refreshBoard(); }); //TODO: REEMPLEZAR POR EL NUMERO QUE ES !
                        oClient.setAttempts(oClient.getAttempts()+1);
                        $("#txtGuessNumber").focus();
                    });
                } 
                
                // Doy estilos para la imagen de cada usuario
                num = value['publicUuid'].substring(0,1);
                num = num.replace('a', '8').replace('b', '7').replace('c', '6').replace('d', '5').replace('e', '4').replace('f', '3').replace('9', '2');
                $("#" + value['publicUuid'] + " .userColor").css('border-style', colorFormats[parseInt(num)]);
                var hexCode = value['publicUuid'].replace(/\-/g, '');
                $("#" + value['publicUuid'] + " .userColor").css('border-color', '#' + hexCode.substr(0,6) + ' #' + hexCode.substr(6,6) + ' #' + hexCode.substr(12,6) + ' #' + hexCode.substr(18,6));
                $("#" + value['publicUuid'] + " .userColor").attr('title', value['publicUuid']);
            });
            if ($("#tblOponent tbody").html() == '') { //No tengo oponente asignado
                oClient.setGuessingToID('');
                $("#divOponent *").attr("disabled", 'disabled');
            }
            else $("#divOponent *").removeAttr("disabled");
        }
        else solveErrors(data);
    });
}

function validateForm(form){
    flag = true;
    if (form === FORM_SERVER){
        serverRegExp = /^[A-z0-9\.\-]+$/
        portRegExp = /^[0-9]{1,5}$/

        if (parseInt($("#txtPort").val()) != $("#txtPort").val() || !(portRegExp.test($("#txtPort").val()))) {
            validateControl($("#txtPort"), false);
            flag = false;
        } else validateControl($("#txtPort"), true);
        
        if (($("#txtServer").val()).length < 1 || !(serverRegExp.test($("#txtServer").val()))){
            validateControl($("#txtServer"), false);
            flag = false;
        } else validateControl($("#txtServer"), true);
        
        if (flag) 
            $("#frmServer").css('box-shadow', '0 0 10px 2px #00FF00')
        else
            $("#frmServer").css('box-shadow', '0 0 10px 2px #FF0000')
        
    }
    else if (form === FORM_USER){
        userRegExp = /^[A-z0-9]+$/
        if (($("#txtUser").val()).length < 1 || !(userRegExp.test($("#txtUser").val()))) {
            validateControl($("#txtUser"), false);
            flag = false;
        }
        else validateControl($("#txtUser"), true);
        
        if (flag) 
            $("#frmUser").css('box-shadow', '0 0 10px 2px #00FF00')
        else
            $("#frmUser").css('box-shadow', '0 0 10px 2px #FF0000')
    }
    else if (form === FORM_NUMBER){
        numberRegExp = /^[0-9]{4,4}$/
        if ((parseInt($("#txtNumber").val()) != $("#txtNumber").val()) || (repeatedNumbers($("#txtNumber").val())) || !(numberRegExp.test($("#txtNumber").val()))) {
            validateControl($("#txtNumber"), false);
            flag = false;
        }
        else validateControl($("#txtNumber"), true);
        
        if (flag) 
            $("#frmNumber").css('box-shadow', '0 0 10px 2px #00FF00')
        else
            $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000')
    }
    return flag;
}

function solveErrors(data){
    errorNumber = data.status;
    message = data['message'];
    
    switch (errorNumber){
        case ERRCODE_PRIVATE_UUID_NOT_FOUND: //Private Uuid not found
            $("#txtNumber").val('');
            $("#txtUser").val('');
            $("#divMain, #divNumber").fadeOut(ANIMATE_FAST, function(){ $("#divUser").fadeIn(ANIMATE_FAST, function(){ $("#txtUser").focus(); })});
            $("#divUser .result span").html("ID de user inexistente.");
            $("#divUser .result").slideDown(ANIMATE_SLOW);
            validateForm(FORM_USER);
            break;
                   
        case ERRCODE_PUBLIC_UUID_NOT_FOUND: //Public UUID is was not found.
            $("#frmGuessNumber .result span").html("Contrincante no encontrado.");
            $("#frmGuessNumber .result").slideDown(ANIMATE_SLOW);
            // Actualizo toda la board porque se elimino el usuario
            oClient.setGuessingToID('');
            refreshBoard(); 
            break;
            
        case ERRCODE_GUESSING_OWN_NUMBER: //User tries to guess his own number.
            $("#frmGuessNumber .result span").html("Adivinando numero propio.");
            $("#frmGuessNumber .result").slideDown(ANIMATE_SLOW);
            // Actualizo toda la board porque algo surgio mal
            oClient.setGuessingToID('');
            refreshBoard();
            break;
            
        case ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER: //Public UUID has no active number.
            $("#frmGuessNumber .result span").html("El contrincante no tiene numero activo.");
            $("#frmGuessNumber .result").slideDown(ANIMATE_SLOW);
            oClient.setGuessingToID('');
            refreshBoard();
            break;
            
        case ERRCODE_INVALID_NUMBER: // Invalid number
            $("#divNumber .result span").html("N&uacute;mero inv&aacute;lido. Chequear repetidos");
            $("#divNumber .result").slideDown(ANIMATE_SLOW);
            $("#txtNumber").focus();
            $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
            break;
            
        case ERRCODE_INTERVAL_NOT_EXPIRED: //Minimum interval between attempts was not expired.
            $("#frmGuessNumber .result span").html("No se dejo pasar el tiempo de espera");
            $("#frmGuessNumber .result").slideDown(ANIMATE_SLOW);
            
            // PREGUNTAR: alert(data['message']);
            
            oClient.setInterval(1500);//oClient.setInterval(data['timeToNextAttemp']);
            break;
            
        case ERRCODE_ALREADY_HAS_NUMBER: // Already active number
            $("#divNumber").fadeOut(3000, function(){ $("#divMain").fadeIn(ANIMATE_FAST, function(){})});
            $("#divNumber .result span").html("Ya ten&eacute;s un n&uacute;mero activo.");
            $("#divNumber .result").slideDown(ANIMATE_SLOW);
            break;
            
        case ERRCODE_USER_ALREADY_REGISTERED: // Nombre de usuario ya existente
            $("#divUser .result span").html("El nombre de usuario ya ha sido elegido");
            $("#divUser .result").slideDown(ANIMATE_SLOW);
            $("#txtUser").focus();
            $("#frmUser").css('box-shadow', '0 0 10px 2px #FF0000');
            break;
            
        case ERRCODE_PRIVATE_UUID_NO_ACTIVE_NUMBER: //Private UUID has no active number.
            refreshBoard(); //Solo hago refresh board ya que dicha funcion se encarga de verficiar si no tengo numero y hace todo el proceso
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