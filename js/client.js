var Client = function(server) {
    //variables privadas
    var oServer = server;
    var name;
    var privateID;
    var number;
    var guessingToID = '';
    var attempts = 0;
    var timerEnabled = false;
    var nextAttempt = new Date().getTime();
    var numbers = {}; 
    var numbersSetted = [];
    
    var canGuess = true;
    
    //constantes privadas:
    ANIMATE_FAST = 200;
    ANIMATE_SLOW = 500;
    FORM_SERVER = 1;
    FORM_USER = 2;
    FORM_NUMBER = 3;

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

    var setServer = function(IP, PORT){
        if (validateForm(FORM_SERVER)){
            $("#divServer .result").slideUp(ANIMATE_FAST);
            oServer.tryServer(IP, PORT, function(flag){
                if (flag){
                    $("#divServer").fadeOut(ANIMATE_FAST, function(){ $("#divUser").fadeIn(ANIMATE_FAST, function(){ $("#txtUser").focus(); })}); //Muestro siguiente form
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
    
    var setName = function(value) {
        if (validateForm(FORM_USER)){
            $("#divUser .result").slideUp(ANIMATE_FAST);
            oServer.registerUser(value, function(data) {
                if (data.status === CODE_STATUS_OK){
                    data = data.responseJSON;
                    
                    name = data['name']; //Guardo datos
                    attempts = 0;
                    number = '';
                    $("li#user").html("<u>Usuario</u>: " + name);
                    privateID = data['privateUuid']; 
                    $("li#publicID").html("<u>ID</u>: " + privateID);
                    $("#divUser").fadeOut(ANIMATE_FAST, function(){ $("#divNumber").fadeIn(ANIMATE_FAST, function(){ $("#txtNumber").focus(); })}); //Muestro siguiente form
                }
                else solveErrors(data);  
            });
        }
    }
    
    var getPrivateID = function() {
        return privateID;
    }
    
    var setNumber = function(value) {
        if (validateForm(FORM_NUMBER)){
            if (checkPreviousNumbers(value)) {
                $("#divNumber .result span").html("N&uacute;mero ya elegido previamente.");
                $("#divNumber .result").slideDown(ANIMATE_SLOW);
                $("#txtNumber").focus();
                $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
            }
            else {
                $("#divNumber .result").slideUp(ANIMATE_FAST);
                oServer.setNumber(oClient.getPrivateID(), value, function(data) {
                    if (data.status === CODE_STATUS_OK){
                        data = data.responseJSON;

                        number = data['number']; //Guardo datos
                        numbersSetted.push(number.toString());
                        $("li#number").html("<u>N&uacute;mero</u>: <span title='" + number + "'><img src='images/icons/number.ico' alt='*' /><img src='images/icons/number.ico' alt='*' /><img src='images/icons/number.ico' alt='*' /><img src='images/icons/number.ico' alt='*' /></span>");
                        $("#divNumber").fadeOut(ANIMATE_FAST, function(){ $("#divMain").fadeIn(ANIMATE_FAST, function() { refreshBoard(); } )});   //Muestro siguiente form
                        startRefreshTimer(refreshBoard, REFRESH_INTERVAL);
                    }
                    else solveErrors(data);  
                });
            }
        }
    }
    
    var addAttempt = function() {
        attempts++;
        $("li#attempts").html("<u>Intentos</u>: " + attempts);
    }
    
    var guessNumber = function(value){
        if (canGuess === false) return;
        canGuess = false; // No permito que apriete el boton si previamente se apreto el boton y se esta esperando respuesta del servidor 
        numberRegExp = /^[0-9]{4,4}$/
        if (numberRegExp.test(value) && (guessingToID != '')){
            //El numero esta correcto, realizo accion de adivinar:
            $("#frmGuessNumber .result").slideUp(ANIMATE_FAST);
            refreshBoard(); //Con esto verifico que si mi oponente no tiene numero o dejo de existir, desaparece ! Tambien verifico yo tener numero.. !
            if ($("#divMain").is(':visible') && guessingToID != '') {
                setTimeout(function(){
                    oServer.guessNumber(privateID, guessingToID, value, function(data) {
                        canGuess = true;
                        if (data.status === CODE_STATUS_OK){  
                            data = data.responseJSON;
                            
                            window.scrollTo(0,document.body.scrollHeight);
                            setInterval(data['timeToNextAttemp']);// Guardo intervalo para no ejercutar el proximo antes.
                            tr_html = " <tr> <td>"  + data['number'] + "</td> <td>" + data['correctChars'] + "</td> <td>" + data['existingChars'] + "</td> <td>" + data['wrongChars'] + "</td> </tr>";
                            $("#tblAttempts tbody").append(tr_html).hide().fadeIn(ANIMATE_FAST);
                            $("#txtGuessNumber").focus();
                            
                            addTry(data['numberId'], data['number'], data['correctChars'], data['existingChars'], data['wrongChars']);
                        }
                        else solveErrors(data);
                    });
                    addAttempt();
                }, timeToWait());
            } 
            else canGuess = true;
        }
        else canGuess = true;
    }
    
    
    var loadTries = function(numberID){
        var tries = numbers[numberID];
        $("#tblAttempts tbody").html('');
        if (tries != undefined && typeof tries != 'string'){ //Si es string es porque yo guarde el valor del numero para el hash ese
            $.each(tries, function(index, tried){
                attempt_tr_html = " <tr> <td>"  + tried['number'] + "</td> <td>" + tried['correctChars'] + "</td> <td>" + tried['existingChars'] + "</td> <td>" + tried['wrongChars'] + "</td> </tr>";
                $("#tblAttempts tbody").append(attempt_tr_html);
            });
        }
    }
    
    var refreshBoard = function(){
        oServer.requestBoard(privateID, function(data) {
            if (data.status === CODE_STATUS_OK) {
                data = data.responseJSON;
                colorFormats = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit'];
                
                //Guardo datos
                if (!data['me'][0]['numberActivated']) {
                    stopRefreshTimer();
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
                $("#tblAttempts tbody").html('').show();
                $.each(data['players'], function(index, value){ 
                    tr_html = "<tr id='<HASH>'> <td><div class='userColor'></div></td> <td><ACTIVE><span></span></td> <td><SCORE></td> <td>  <button> <img src='images/icons/play.ico' />  Jugar</button></td></tr>";
                    tr_html = tr_html.replace("<HASH>", value['publicUuid']);
                    tr_html = tr_html.replace("<ACTIVE>", (value['numberActivated'] == true) ? "S&iacute;" + ((typeof numbers[value['numberId']] === 'object') ? " (" + numbers[value['numberId']].length + ")" : "" ) : "No");
                    tr_html = tr_html.replace("<SCORE>", value['score']);
                    
                    if (!value['numberActivated'] && value['publicUuid'] == guessingToID) guessingToID = '';
                    if (value['publicUuid'] == guessingToID){ //Si encuentro al que estoy adivinando entonces lo cargo en el div de oponente, sino en la lista
                        $("#tblOponent").show();
                        $("#tblOponent tbody").html(tr_html);
                        $("#" + value['publicUuid'] + " td:last-child").remove();
                    
                        loadTries(value['numberId']);  //Cargo tabla de intentos
                    }
                    else {
                        $("#tblPlayers tbody").append(tr_html);
                        if(!value['numberActivated']) $("#" + value['publicUuid'] + " button").attr('disabled', 'disabled').hide();
    
                        $("#" + value['publicUuid'] + " button").click(function () {
                            // Si tiene contrincante activo entonces:
                            if (guessingToID != '')  $("#" + guessingToID).fadeOut(ANIMATE_FAST);
                               
                            guessingToID = value['publicUuid'];
                            $("#" + value['publicUuid']).fadeOut(ANIMATE_SLOW, function(){
                                $("#" + value['publicUuid'] + " td:last-child").remove();
                                $("#tblOponent").show();
                                $("#tblOponent tbody").html($("#" + value['publicUuid']));
                                $("#divOponent *").removeAttr("disabled");
                                $("#txtGuessNumber").focus().val('');
                                loadTries(value['numberId']); //Cargo tabla de intentos
                                $("#" + value['publicUuid'] + ", #tblAttempts").hide().fadeIn(ANIMATE_SLOW, function() { refreshBoard(); });
                            });                           
                        });
                    }      
                    
                    if (value['numberActivated'] &&  (typeof numbers[value['numberId']] === 'string')){ 
                        $("#" + value['publicUuid'] + " span").css({'color': 'blue', 'text-decoration': 'underline', 'cursor': 'pointer', 'margin-left': '10px'}).html(numbers[value['numberId']]).click(function () {
                            setTimeout(function(){
                                oServer.guessNumber(privateID, value['publicUuid'], numbers[value['numberId']], function(data){
                                    if (data.status === CODE_STATUS_OK){  
                                        data = data.responseJSON;
                                        setInterval(data['timeToNextAttemp']);
                                        refreshBoard(); 
                                    }
                                    else solveErrors(data);
                                });
                                addAttempt();
                            }, timeToWait());
                            $("#txtGuessNumber").focus();
                        });
                    } 
                    // Doy estilos para la imagen de cada usuario
                    var num = value['publicUuid'].substring(0,1);
                    num = num.replace('a', '8').replace('b', '7').replace('c', '6').replace('d', '5').replace('e', '4').replace('f', '3').replace('9', '2');
                    var hexCode = value['publicUuid'].replace(/\-/g, '');
                    $("#" + value['publicUuid'] + " .userColor").css({'border-style': colorFormats[parseInt(num)], 'border-color': '#' + hexCode.substr(0,6) + ' #' + hexCode.substr(6,6) + ' #' + hexCode.substr(12,6) + ' #' + hexCode.substr(18,6)});
                    $("#" + value['publicUuid'] + " .userColor").attr('title', value['publicUuid']);
                });
                if ($("#tblOponent tbody").html() == '') { //No tengo oponente asignado
                    guessingToID = '';
                    $("#divOponent *").attr("disabled", 'disabled');
                }
                else $("#divOponent *").removeAttr("disabled");
                $("#txtGuessNumber").keyup().focus();
            }
            else solveErrors(data);
        });
    }
    
    var startRefreshTimer = function(callback, interval) {
        timerEnabled = true;
        setTimeout(function(){
            if (timerEnabled){
                callback();
                startRefreshTimer(callback, interval);
            }
        }, interval);
    }
    
    var stopRefreshTimer = function(){
        timerEnabled = false;
    }
    
    var setInterval = function(value) {
        nextAttempt = new Date().getTime();
        nextAttempt += value ;
    }
    
    var timeToWait = function (){
        now = new Date().getTime();
        return (nextAttempt - now);   
    }
    
    var checkPreviousNumbers = function(value) {
        return (numbersSetted.indexOf(value) != -1);
    }
    

    var addTry = function(numberId, number, correctChars, existingChars, wrongChars){
        if (numbers[numberId] === undefined) numbers[numberId] = [];
        if (typeof numbers[numberId] != 'string'){
            numbers[numberId].push({
                "number": number,
                "correctChars": correctChars,
                "existingChars": existingChars,
                "wrongChars": wrongChars
            });
        }
        
        if (correctChars == 4){ // Adivne el numero !!
            guessingToID = '';
            numbers[numberId] = number.toString();
            $("#tblOponent, #tblAttempts tbody").fadeOut(ANIMATE_SLOW, function(){ refreshBoard(); });
        }   
    }
    
    var validateForm = function(form){
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
    
    var repeatedNumbers = function(number){
        repeated = false;
        number = number.toString();
        for (var i=0; i<4; i++){
            if (number.indexOf(number.substring(i,i+1),i+1) > 0) repeated = true;
        }
        return repeated;
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
                stopRefreshTimer();
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
                guessingToID = ''; // Actualizo toda la board porque se elimino el usuario
                refreshBoard(); 
                break;
                
            case ERRCODE_GUESSING_OWN_NUMBER: //User tries to guess his own number.
                $("#frmGuessNumber .result span").html("Adivinando numero propio.");
                $("#frmGuessNumber .result").slideDown(ANIMATE_SLOW);
                guessingToID = ''; // Actualizo toda la board porque algo surgio mal
                refreshBoard();
                break;
                
            case ERRCODE_PUBLIC_UUID_NO_ACTIVE_NUMBER: //Public UUID has no active number.
                $("#frmGuessNumber .result span").html("El contrincante no tiene numero activo.");
                $("#frmGuessNumber .result").slideDown(ANIMATE_SLOW);
                guessingToID = '';
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
                setInterval(data['timeToNextAttemp']);
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
                refreshBoard(); //Solo hago refresh board ya que dicha funcion se encarga de verficiar si no tengo numero y hace el proceso
                break;
                
            default:
                alert ('Error desconocido. Nro: ' + errorNumber + "<br /> Message: " + message);
        }
    }

    return {
        "setServer": setServer,
        "setName": setName,
        "getPrivateID": getPrivateID,
        "setNumber": setNumber,
        "guessNumber": guessNumber,
        "startRefreshTimer": startRefreshTimer,
        "stopRefreshTimer": stopRefreshTimer,
        "validateForm": validateForm,
        "numbers": numbers,
        "addTry": addTry,
        "refreshBoard": refreshBoard,
        
    }
};