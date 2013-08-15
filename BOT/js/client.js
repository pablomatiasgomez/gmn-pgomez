     ////////////OBJECT CLIENT////////////
    //*********************************//
   //         Gomez Pablo Matias      //
  //         July 2013               //
 //*********************************//
/////////////////////////////////////

var Client = function(server, engine) {
    //variables privadas
    var oServer = server;
    var oEngine = engine;
    
    var name;
    var privateID;
    var number;
    var guessingToID = '';
    var attempts = 0;
    var timerEnabled = false;
    var nextAttempt = new Date().getTime();
    
    
    
    var canGuess = true;
    
    //constantes privadas:
    ANIMATE_FAST = 200;
    ANIMATE_SLOW = 500;

    CODE_STATUS_OK = 200;
    ERRCODE_USER_ALREADY_REGISTERED = 520;
    ERRCODE_PRIVATE_UUID_NOT_FOUND = 521;
    ERRCODE_ALREADY_HAS_NUMBER = 523; 
    ERRCODE_INTERVAL_NOT_EXPIRED = 524;
    ERRCODE_PRIVATE_UUID_NO_ACTIVE_NUMBER = 525;
    ERRCODE_PUBLIC_UUID_NOT_FOUND = 526
    ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER = 527;
    ERRCODE_INVALID_NUMBER = 528;
    ERRCODE_GUESSING_OWN_NUMBER = 529;
    
    REFRESH_INTERVAL = 1500;
    
    LISTS_MAX_LENGTH = 200;
    
    var getPrivateID = function() {
        return privateID;
    }
    
    var addAttempt = function() {
        attempts++;
        $("li#attempts").html("<u>Intentos</u>: " + attempts);
    }
    
    var setInterval = function(value) {
        nextAttempt = new Date().getTime();
        nextAttempt += value ;
    }
    
    var timeToWait = function (){
        now = new Date().getTime();
        return (nextAttempt - now);   
    }

    var writeLog = function(text){
        if ($("#tblInfo tbody tr").length > LISTS_MAX_LENGTH)  $("#tblInfo tbody tr:last-child").remove();
        $("#tblInfo tbody").prepend("<tr><td>" + text + "</td></tr>");
        console.log(text);
    }
    var setServer = function(IP, PORT){
        writeLog("Intento server:" + IP + ":" + PORT);
        
        if (validateServerForm()){
            $("#divServer .result").slideUp(ANIMATE_FAST);
            oServer.tryServer(IP, PORT, function(flag){
                if (flag){
                    $("#divServer").fadeOut(ANIMATE_FAST, function(){ $("#divMain").fadeIn(ANIMATE_FAST, function(){ botProcess(); })}); //Iniciio proceso
                }
                else {
                    $("#divServer .result span").html("Error de conexion al servidor");
                    $("#divServer .result").slideDown(ANIMATE_SLOW);
                    $("#txtServer").focus();
                    $("#frmServer").css('box-shadow', '0 0 10px 2px #FF0000');
                }
            });
        }
    }
    
    var botProcess = function(){
        if (!name || name == ''){
            setName(oEngine.getRandomName());
            return;
        } 
        if (!number || number == ''){
            setNumber(oEngine.getRandomNumber());
            return;
        }
        
        oServer.requestBoard(privateID, function(data) {
            if (data.status === CODE_STATUS_OK) {
                data = data.responseJSON;
                
                $("li#score").html("<u>Score</u>: " + data['me'][0]['score']);
                
                //Guardo datos
                if (!data['me'][0]['numberActivated']) {
                    number = ''
                    $("li#number").html("<u>N&uacute;mero</u>: No seteado");
                    setNumber(oEngine.getRandomNumber());
                    return;
                }
 
                if (guessingToID == '') guessingToID = oEngine.selectUser(data['players']);

                // Si tengo a alquien a quien adivinarle:
                var exists = false;
                if (guessingToID != ''){
                    $.each(data['players'], function(index, value){ //Verifico que exista:
                        if (value['publicUuid'] == guessingToID) {
                            if (value['numberActivated'] == true) {
                                exists = true;
                                guessNumber(oEngine.getNumberToGuess(value['numberId']));  
                            }
                            else guessingToID = '';
                        }
                    });
                }
                if ((exists==false) || (guessingToID == '')){
                    guessingToID = '';
                    writeLog("No hay oponentes activos");
                    botProcess();
                }
            }
            else solveErrors(data);
        });
    }
    
    var setName = function(value) {
        writeLog("Intento nombre: " + value);
        oServer.registerUser(value, function(data) {
            if (data.status === CODE_STATUS_OK){
                data = data.responseJSON;
                
                name = data['name']; //Guardo datos
                writeLog("Nombre asignado: " + name);
                attempts = 0;
                number = '';
                $("li#user").html("<u>Usuario</u>: " + name);
                privateID = data['privateUuid']; 
                $("li#publicID").html("<u>ID</u>: " + privateID);
                botProcess();
            }
            else solveErrors(data);  
        });
    }

    var setNumber = function(value) {
        writeLog("Intento asignar numero: " + value)
        oServer.setNumber(privateID, value, function(data) {
            if (data.status === CODE_STATUS_OK){
                data = data.responseJSON;

                number = data['number']; //Guardo datos
                writeLog("Numero asignado: " + number);
                oEngine.addNumberUsed(number.toString())
                $("li#number").html("<u>N&uacute;mero</u>: <span title='" + number + "'><img src='images/icons/number.ico' alt='*' /><img src='images/icons/number.ico' alt='*' /><img src='images/icons/number.ico' alt='*' /><img src='images/icons/number.ico' alt='*' /></span>");
                botProcess();
            }
            else solveErrors(data);  
        });
    }

    var guessNumber = function(value){
        if (canGuess === false) return;
        canGuess = false; // No permito adivinar si se esta esperando respuesta del servidor 
        if (guessingToID != ''){
            setTimeout(function(){
                oServer.guessNumber(privateID, guessingToID, value, function(data) {
                    canGuess = true;
                    if (data.status === CODE_STATUS_OK){  
                        data = data.responseJSON;
                        
                        writeLog("Intento numero: " + data['number']);
                        setInterval(data['timeToNextAttemp']);// Guardo intervalo para no ejercutar el proximo antes.
                        oEngine.addTry(data['numberId'], data['number'], data['correctChars'], data['existingChars'], data['wrongChars']);
                        
                        if ($("#tblAttempts tbody tr").length > LISTS_MAX_LENGTH)  $("#tblAttempts tbody tr:last-child").remove();
                        tr_html = " <tr> <td><div class='numberColor'></div></td> <td>"  + data['number'] + "</td> <td>" + data['correctChars'] + "</td> <td>" + data['existingChars'] + "</td> <td>" + data['wrongChars'] + "</td> </tr>";
                        $("#tblAttempts tbody").prepend(tr_html).hide().fadeIn(ANIMATE_FAST);
                        colorFormats = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit'];
                        var num = data['numberId'].substring(0,1);
                        num = num.replace('a', '8').replace('b', '7').replace('c', '6').replace('d', '5').replace('e', '4').replace('f', '3').replace('9', '2');
                        var hexCode = data['numberId'].replace(/\-/g, '');
                        $("#tblAttempts tbody tr:first-child .numberColor").css({'border-style': colorFormats[parseInt(num)], 'border-color': '#' + hexCode.substr(0,6) + ' #' + hexCode.substr(6,6) + ' #' + hexCode.substr(12,6) + ' #' + hexCode.substr(18,6)});
                        $("#tblAttempts tbody tr:first-child .numberColor").attr('title', data['numberId']);
                        
                        if (data['correctChars'] == 4) {
                            writeLog("Adivine numero!!!!");
                            guessingToID = '';
                            $("#tblAttempts tbody tr:first-child").css({ 'background-color': '#00FF00'});
                        } 
                        setTimeout(botProcess, timeToWait());
                    }
                    else solveErrors(data);
                });
                addAttempt();
            }, timeToWait());
        } 
        else canGuess = true;
    }

    var validateServerForm = function(){
        flag = true;
  
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
   
        return flag;
    }

    var validateControl = function(control, valid) {
        if (valid) $(control).animate({ backgroundColor: '#C0FFC0', borderColor: '#00FF00'  }, ANIMATE_SLOW);
        else $(control).animate({ backgroundColor: '#FFD0D0', borderColor: '#FF0000' }, ANIMATE_SLOW);
    }

    var solveErrors = function(data) {
        errorNumber = data.status;
        data = data.responseJSON;
        message = data['message'];
        
        switch (errorNumber){
            case ERRCODE_PRIVATE_UUID_NOT_FOUND: //Private Uuid not found
                writeLog("ERRCODE_PRIVATE_UUID_NOT_FOUND");
                name = '';
                break;
                       
            case ERRCODE_PUBLIC_UUID_NOT_FOUND: //Public UUID is was not found.
                writeLog("ERRCODE_PUBLIC_UUID_NOT_FOUND");
                guessingToID = '';
                break;
                
            case ERRCODE_GUESSING_OWN_NUMBER: //User tries to guess his own number.
                writeLog("ERRCODE_GUESSING_OWN_NUMBER");
                guessingToID = ''; // Actualizo toda la board porque algo surgio mal
                break;
                
            case ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER: //Public UUID has no active number.
                writeLog("ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER");
                guessingToID = '';
                break;
                
            case ERRCODE_INVALID_NUMBER: // Invalid number
                writeLog("ERRCODE_INVALID_NUMBER");
                number = '';
                break;
                
            case ERRCODE_INTERVAL_NOT_EXPIRED: //Minimum interval between attempts was not expired.
                writeLog("ERRCODE_INTERVAL_NOT_EXPIRED");
                setInterval(data['timeToNextAttemp']);
                break;
                
            case ERRCODE_ALREADY_HAS_NUMBER: // Already active number
                writeLog("ERRCODE_ALREADY_HAS_NUMBER");
                break;
                
            case ERRCODE_USER_ALREADY_REGISTERED: // Nombre de usuario ya existente
                writeLog("ERRCODE_USER_ALREADY_REGISTERED");
                break;
                
            case ERRCODE_PRIVATE_UUID_NO_ACTIVE_NUMBER: //Private UUID has no active number.
                writeLog("ERRCODE_PRIVATE_UUID_NO_ACTIVE_NUMBER");
                number = '';
                break;
                
            default:
                writeLog('Error desconocido. Nro: ' + errorNumber + "<br /> Message: " + message);
        }
        botProcess();
    }

    
    return {
        "setServer": setServer,
        "validateServerForm": validateServerForm,
    }
};