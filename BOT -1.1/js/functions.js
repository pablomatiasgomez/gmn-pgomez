     ////////////FUNCTIONS JS/////////////
    //*********************************//
   //         Gomez Pablo Matias      //
  //         July 2013               //
 //*********************************//
/////////////////////////////////////

KEY_ENTER = 13;

$(function(){ //ready function 
    oServer = Server();
    oEngine = Engine();
    oClient = Client(oServer, oEngine);
    
    $("#divServer").show();
    $("#txtServer").focus();
    $("#divData").draggable({ handle: "#divTitle" });
    
    $("#divData").css("top", $(window).height() - 160);
    $(window).resize(function() {
        $("#divData").css("top", $(window).height() - 160);
    });

    $("#frmServer input[type='text']").keyup(function (event) { if (event.keyCode === KEY_ENTER) $($($(this).parent()).find("input[type='button']")).click(); else oClient.validateServerForm(); });
    
    $("#btnServer_Save").click(function (){ oClient.setServer($("#txtServer").val(), $("#txtPort").val()); });
});