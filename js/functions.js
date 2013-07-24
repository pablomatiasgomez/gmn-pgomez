

$(document).ready(function() { $("#divServer").show(); });

$(function(){ //ready function 

    $(".initForm input[type='text']").keypress(function (event) { if (event.keyCode == 13)  $($($(this).parent()).find("input[type='button']")).click(); });
    
    $("#btnServer_Save").click(function (){
        flag = true;
        if (parseInt($("#txtPort").val(), 10) != $("#txtPort").val()) {
            validateControl($("#txtPort"), false);
            flag = false;
        } else validateControl($("#txtPort"), true);
        if (($("#txtServer").val()).length < 1){
            validateControl($("#txtServer"), false);
            flag = false;
        } else validateControl($("#txtServer"), true);
        if (flag){
            $("#divServer").fadeOut(500, function(){ $("#divUser").fadeIn(500, function(){ $("#txtUser").focus() })});
        }
    });
    
    
    $("#btnUser_Save").click(function (){
        
        if (($("#txtUser").val()).length < 1)
            validateControl($("#txtUser"), false);
        else 
            $("#divUser").fadeOut(500, function(){ $("#divNumber").fadeIn(500, function(){ $("#txtNumber").focus() })});
   
    });
    
    $("#btnNumber_Save").click(function (){
        if ((parseInt($("#txtNumber").val(), 10) != $("#txtNumber").val()) || ($("#txtNumber").val()).length != 4 )
            validateControl($("#txtNumber"), false);
        else
            $("#divNumber").fadeOut(500, function(){ $("#divMain").fadeIn(500, function(){})});
    });
});




function validateControl(control, valid) {
    if (valid)
        $(control).animate({ backgroundColor: '#C0FFC0' }, 500);
    else
        $(control).animate({ backgroundColor: '#FFD0D0' }, 500);
}