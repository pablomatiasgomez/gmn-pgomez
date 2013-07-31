////////////////////////
// Gomez Pablo Matias //
// July 2013          //
////////////////////////

/* 
preguntas a hacer:
    los usuarios que no tienen numero activo se los muestro ?
    lo de actualizar como seria? porque no se si es necesario.. voy actualizando por eventos o por timer?    cancelar timer sino.
    cuando te adivinan el numero te aparecia la pantalla para poner numero y no puedo jugar no?
    validacion con w3 errores de ISO y etc...
    Coomo crear un array de oponentes dentro de client
    Obejto dentro de objetos.. ya arme objeto, como los meot como arrays a ambos ?
    
    that's it
*/


$(function(){ //ready function 
    $("#divServer").show();
    $("#txtServer").focus();
    $("#divData").draggable({ handle: "#divTitle" });
    
    $("#divData").css("top", $(window).height() - 200);
    $(window).resize(function() {
        $("#divData").css("top", $(window).height() - 200);
    });

    var oServer = function() {
        //variables privadas
        var url = "";
    
        var setUrl = function(value) {
            url = value;
        }
        
        return {
            "setUrl": setUrl,
            "getData": function(subUrl, callback){
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
        }
    }();
    
    
    var Oponent = function(){
        //varibles
        var publicID;
        
        var setPublicID = function(value) {
            publicID = value;
        }
        var getPublicID = function() {
            return publicID;
        }     
        
        
        return {
            "setPublicID": setPublicID,
            "getPublicID": getPublicID,
        }
    };
    
    var Attempts = function () {
        //varibles
        var number;
        var correct;
        var existing;
        var wrong;
        
        var setNumber = function(value) {
            number = value;
        }
        var getNumber = function() {
            return number;
        }     
        var setCorrect = function(value) {
            correct = value;
        }
        var getCorrect = function() {
            return correct;
        }      
        var setExisting = function(value) {
            existing = value;
        }
        var getExisting = function() {
            return existing;
        }      
        var setWrong = function(value) {
            wrong = value;
        }
        var getWrong = function() {
            return wrong;
        }       
        
        return {
            "setNumber": setNumber,
            "getNumber": getNumber,
            "setCorrect": setCorrect,
            "getCorrect": getCorrect,
            "setExisting": setExisting,
            "getExisting": getExisting,
            "setWrong": setWrong,
            "getWrong": getWrong,
        }
    };
    
    var oClient = function() {
        //variables privadas
        var name;
        var privateID;
        var number;
        var guessingToID = '';
        var attempts = 0;
        
        var setName = function(value) {
            name = value;
            $("li#user").html("<u>Usuario</u>: " + value);
        }
        var getName = function() {
            return name;
        }
        var setPrivateID = function(value) {
            privateID = value;
            $("li#publicID").html("<u>ID</u>: " + value );
        }
        var getPrivateID = function() {
            return privateID;
        }
        var setNumber = function(value) {
            number = value;
            $("li#number").html("<u>N&uacute;mero</u>: " + value);
        }
        var getNumber = function() {
            return number;
        }
        var setGuessingToID = function(value) {
            guessingToID = value;
        }
        var getGuessingToID = function() {
            return guessingToID;
        }
        var setAttempts = function(value) {
            attempts = value;
            $("li#attempts").html("<u>Intentos</u>: " + value);
        }
        var getAttempts = function() {
            return attempts;
        }

        var oOponents = function(){
            //Como creo un array aca?
            
        }
        
        
        var refreshBoard = function (){
            oServer.getData('players/board/<privateUuid>', function(data) {
                switch (data.status){
                    case undefined:
                        colorFormats = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit'];
                        
                        //Guardo datos
                        if (!data['me'][0]['numberActivated']) {
                            $("li#number").html("<u>N&uacute;mero</u>: No seteado");
                            // TODO: mostrar pantalla de numero !!
                            
                        }
                        
                        $("li#score").html("<u>Score</u>: " + data['me'][0]['score']);
                              
                        //Cargo lista (ordenada por score de mayor a menor):
                        data['players'].sort(function (a, b){ return ((a['score'] > b['score'] ) ? -1 : ((a['score'] < b['score']) ? 1 : 0)); });
                        $("#tblPlayers tbody").html('');
                        $("#tblOponent").hide();
                        $.each(data['players'], function(index, value){ 
                            if (value['publicUuid'] == oClient.getGuessingToID()){ //Si encuentro al que estoy adivinando entonces lo cargo en el div de oponente, sino en la lista
                                tr_html = "<tr id='<HASH>'> <td><div class='userColor'></div></td> <td><ACTIVE></td> <td><SCORE></td></tr>";
                                tr_html = tr_html.replace("<HASH>", value['publicUuid']);
                                tr_html = tr_html.replace("<ACTIVE>", (value['numberActivated'] == true) ? "S&iacute;" : "No");
                                tr_html = tr_html.replace("<SCORE>", value['score']);
                                      
                                $("#tblOponent").show();
                                $("#tblOponent tbody").html(tr_html);
                                num = value['publicUuid'].substring(0,1);
                                num = num.replace('a', '0');
                                num = num.replace('b', '1');
                                num = num.replace('c', '2');
                                num = num.replace('d', '3');
                                num = num.replace('e', '4');
                                num = num.replace('f', '5');
                                $("#" + value['publicUuid'] + " .userColor").css('border-style', colorFormats[parseInt(num)]);
                                $("#" + value['publicUuid'] + " .userColor").attr('title', value['publicUuid']);
                            }
                            else {
                                tr_html = "<tr id='<HASH>'> <td><div class='userColor'></div></td> <td><ACTIVE></td> <td><SCORE></td> <td><input type='button' value='Jugar' /></td></tr>";
                                tr_html = tr_html.replace("<HASH>", value['publicUuid']);
                                tr_html = tr_html.replace("<ACTIVE>", (value['numberActivated'] == true) ? "S&iacute;" : "No");
                                tr_html = tr_html.replace("<SCORE>", value['score']);
                                //value['numberId'] 
                                
                                $("#tblPlayers tbody").append(tr_html);
                                
                                if(!value['numberActivated'] || !data['me'][0]['numberActivated']) $("#" + value['publicUuid'] + " input[type='button']").attr('disabled', 'disabled');
                                num = value['publicUuid'].substring(0,1);
                                num = num.replace('a', '0');
                                num = num.replace('b', '1');
                                num = num.replace('c', '2');
                                num = num.replace('d', '3');
                                num = num.replace('e', '4');
                                num = num.replace('f', '5');
                                $("#" + value['publicUuid'] + " .userColor").css('border-style', colorFormats[parseInt(num)]);
                                $("#" + value['publicUuid'] + " .userColor").attr('title', value['publicUuid']);
                                $("#" + value['publicUuid'] + " input[type='button']").click(function () {
                                    //TODO: Aca tengo que verificar si ya tiene uno activo en guessingto y ahi aplico algo diferenteeee !
                                    // Si no tiene contrincante activo entonces:
                                    if (oClient.getGuessingToID() == '') { 
                                        oClient.setGuessingToID(value['publicUuid']);
                                        $("#" + value['publicUuid']).fadeOut(500, function(){
                                            $("#" + value['publicUuid'] + " td:last-child").remove();
                                            $("#tblOponent").show();
                                            $("#tblOponent tbody").html('');
                                            $("#tblOponent tbody").append($("#" + value['publicUuid']));
                                            $("#" + value['publicUuid']).hide()
                                            $("#" + value['publicUuid']).fadeIn(500, function() {oClient.refreshBoard(); });
                                        });
                                    }                                 
                                });
                            }
                        });
                        break;
                    case 521: // Private Uuid not found !
                        setTimeout(function(){
                            $("#txtNumber").val('');
                            $("#txtUser").val('');
                            $("#divMain").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                            $("#divUser .result span").html("ID de user inexistente.");
                            $("#divUser .result").slideDown(500);
                        },3000);
                        break;
                }
            });
        }
        return {
            "setName": setName,
            "getName": getName,
            "setPrivateID": setPrivateID,
            "getPrivateID": getPrivateID,
            "setNumber": setNumber,
            "getNumber": getNumber,
            "refreshBoard": refreshBoard,
            "setGuessingToID": setGuessingToID,
            "getGuessingToID": getGuessingToID,
            "setAttempts": setAttempts,
            "getAttempts": getAttempts,
        }
    }();
    
    $("#frmServer input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(1); });
    $("#frmUser input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(2); });
    $("#frmNumber input[type='text']").keyup(function (event) { if (event.keyCode === 13) $($($(this).parent()).find("input[type='button']")).click(); else validateForm(3); });
    
    $("#txtGuessNumber").keyup(function (event) { 
        numberRegExp = /^[0-9]{4,4}$/
        if (numberRegExp.test($("#txtGuessNumber").val())){
            $("#btnGuess").removeAttr("disabled");   
        }
        else $("#btnGuess").attr('disabled', 'disabled');         
        
        if (event.keyCode === 13) $("#btnGuess").click();
    });
    
    $("#btnServer_Save").click(function (){
        if (validateForm(1)){
            $("#divServer .result").slideUp(200);
            $.ajax({
                type: 'GET',
                url: "http://" +  $("#txtServer").val() + ((parseInt($("#txtPort").val()) === 80) ? '' : $("#txtPort").val()) + "/version",
                dataType:"json",
                success: function(data){
                    if (data['version']) {
                        //Guardo datos del servidor
                        oServer.setUrl("http://" +  $("#txtServer").val() + ((parseInt($("#txtPort").val()) === 80) ? '' : $("#txtPort").val()) + "/")
                        //Muestro siguiente form
                        $("#divServer").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                    }
                },
                error: function() {
                    $("#divServer .result span").html("Error de conexion al servidor");
                    $("#divServer .result").slideDown(500);
                    $("#txtServer").focus();
                    $("#frmServer").css('box-shadow', '0 0 10px 2px #FF0000');
                }
             });
        }
    });
    
    $("#btnUser_Save").click(function (){
        if (validateForm(2)){
            $("#divUser .result").slideUp(200);
            oServer.getData('players/register/' + $("#txtUser").val(), function(data) {
                switch (data.status){
                    case undefined:
                        //Guardo datos
                        oClient.setName(data['name']);
                        oClient.setPrivateID(data['privateUuid']);
                        //Muestro siguiente form
                        $("#divUser").fadeOut(300, function(){ $("#divNumber").fadeIn(300, function(){ $("#txtNumber").focus(); })});
                        break;
                    case 520: // Nombre de usuario ya existente
                        $("#divUser .result span").html("El nombre de usuario ya ha sido elegido");
                        $("#divUser .result").slideDown(500);
                        $("#txtUser").focus();
                        $("#frmUser").css('box-shadow', '0 0 10px 2px #FF0000');
                        break;
                }
            });
        }
    });
    
    $("#btnNumber_Save").click(function (){
        if (validateForm(3)){
            $("#divNumber .result").slideUp(200);
            oServer.getData('play/setnumber/<privateUuid>/' + $("#txtNumber").val(), function(data) {
                switch (data.status){
                    case undefined:
                        //Guardo datos
                        oClient.setNumber(data['number']);
                        //Muestro siguiente form
                        $("#divNumber").fadeOut(300, function(){ $("#divMain").fadeIn(300, function() { oClient.refreshBoard(); } )});
                        break;
                    case 521: // Uuid inexistente
                        setTimeout(function(){
                            $("#txtNumber").val('');
                            $("#txtUser").val('');
                            $("#divNumber .result").slideUp(200);
                            $("#divNumber").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                        },3000);
                        $("#divNumber .result span").html("ID de user inexistente, volviendo en 3 seg..");
                        $("#divNumber .result").slideDown(500);
                        $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
                        break;
                    case 528: // Invalid number
                        $("#divNumber .result span").html("N&uacute;mero inv&aacute;lido. Chequear repetidos");
                        $("#divNumber .result").slideDown(500);
                        $("#txtNumber").focus();
                        $("#frmNumber").css('box-shadow', '0 0 10px 2px #FF0000');
                        break;
                    case 523: // Already active number
                        $("#divNumber").fadeOut(3000, function(){ $("#divMain").fadeIn(300, function(){})});
                        $("#divNumber .result span").html("Ya ten&eacute;s un n&uacute;mero activo.");
                        $("#divNumber .result").slideDown(500);
                        break;
                }
            });
        }
    });
    
     $("#btnGuess").click(function (){
        numberRegExp = /^[0-9]{4,4}$/
        if (numberRegExp.test($("#txtGuessNumber").val()) && (oClient.getGuessingToID() != '')){
            //El numero esta correcto, realizo accion de adivinar:
            
            // TODO:  PRIMERO VERIFICO EN BOARD QUE EXISTE EL USUARIO Y QUE TIENE NUMERO ACTIVO: SINO ACTUALIZO TODO ! Y VERIFICO YO TENER NUM TMB
            
            
            $("#frmGuessNumber .result").slideUp(200);
            oServer.getData('play/guessnumber/<privateUuid>/<publicUuid>/' + $("#txtGuessNumber").val(), function(data) {
                switch (data.status){
                    case undefined:
                        
                        // TODO: guardo valores en oClient
                        // TODO: //data['timeToNextAttemp'];
  
                        tr_html =" <tr> <td>"  + data['number'] + "</td> <td>" + data['correctChars'] + "</td> <td>" + data['existingChars'] + "</td> <td>" + data['wrongChars'] + "</td> </tr>";
                        $("#tblAttempts tbody").append(tr_html);
                        
                        if (data['correctChars'] == 4){ // Adivno el numero !!
                            oClient.setGuessingToID('');
                            $("#tblOponent").fadeOut(500, function(){
                                oClient.refreshBoard();
                            });
                            
                            
                        }
                        
                        $("#txtNumber").val('');
                        $("#txtNumber").focus();
                        
                        break;
                        
                    case 521: //Private UUID is was not found
                        setTimeout(function(){
                            $("#txtNumber").val('');
                            $("#txtUser").val('');
                            $("#frmGuessNumber .result").slideUp(200);
                            $("#divMain").fadeOut(300, function(){ $("#divUser").fadeIn(300, function(){ $("#txtUser").focus(); })});
                        },3000);
                        $("#frmGuessNumber .result span").html("ID de user inexistente, volviendo en 3 seg..");
                        $("#frmGuessNumber .result").slideDown(500);
                        break;
                    case 524: //Minimum interval between attempts was not expired.
                        $("#frmGuessNumber .result span").html("No se dejo pasar el tiempo de espera");
                        $("#frmGuessNumber .result").slideDown(500);
                        break;
                    case 525: //Private UUID has no active number.
                        //No tengo numero asignado, tengo que ponerme a actualizar mi numero !!!!!
                    
                    
                        break;
                        
                    case 526: //Public UUID is was not found.
                        $("#frmGuessNumber .result span").html("Contrincante no encontrado. Refreshing..");
                        $("#frmGuessNumber .result").slideDown(500);
                        
                        // TODO: Actualizo toda la board porque se elimino el usuario
                        oClient.setGuessingToID('');
                        // oClient.refreshBoard(); ?
                    
                        break;
                    case 529: //User tries to guess his own number.
                        $("#frmGuessNumber .result span").html("Adivinando numero propio. Refreshing..");
                        $("#frmGuessNumber .result").slideDown(500);
                        
                        // TODO: Actualizo toda la board porque algo surgio mal
                        oClient.setGuessingToID('');
                    
                        break;
                    case 527: //Public UUID has no active number.
                        $("#frmGuessNumber .result span").html("El contrincante no tiene numero activo. Refreshing..");
                        $("#frmGuessNumber .result").slideDown(500);
                        
                        // TODO: Actualizo toda la board porque se le fue el numero
                        oClient.setGuessingToID('');
                        
                        break;
                }
            });
            oClient.setAttempts(oClient.getAttempts()+1);
        }
     });
     
     $("#btnRefreshLobby").click(function() {
        oClient.refreshBoard();
     });
});


function validateForm(form){
    flag = true;
    if (form === 1){
        serverRegExp = /^[A-z0-9\.\-]+$/
        portRegExp = /^[0-9]{1,5}$/

        if (parseInt($("#txtPort").val(), 10) != $("#txtPort").val() || !(portRegExp.test($("#txtPort").val()))) {
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
    else if (form === 2){
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
    else if (form === 3){
        numberRegExp = /^[0-9]{4,4}$/
        if ((parseInt($("#txtNumber").val(), 10) != $("#txtNumber").val()) || (repeatedNumbers($("#txtNumber").val())) || !(numberRegExp.test($("#txtNumber").val()))) {
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
        $(control).animate({ backgroundColor: '#C0FFC0', borderColor: '#00FF00'  }, 300);
    else
        $(control).animate({ backgroundColor: '#FFD0D0', borderColor: '#FF0000' }, 300);
}