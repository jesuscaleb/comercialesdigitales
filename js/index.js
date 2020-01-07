// Select Element Rule Function
$.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg != value;
}, "Value must not equal arg.");

$.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
}, "Letters, numbers, and underscores only please but not whitespaces and arrobas");

$.validator.addMethod("nameRegex", function(value, element) {
    return this.optional(element) || /^[a-z0-9\ \s]+$/i.test(value);
}, "Name must contain only letters, number &  space");

// Public variable 
var countryCity; var countryName;
// Registration Form Validation
$(document).ready(function(){
    // Intl-Telf-Input
    
    var input1 = document.querySelector("#txtTelf");
   
    var iti1 = window.intlTelInput(input1, {        
        onlyCountries: [ "cl", "co", "cr", "cu",  "ec", "sv",
         "gt", "hn", "mx", "ni", "pa", "py", "pe", "do", "uy", "ve", "bo"],
        localizedCountries : {
            "do": "Republica Dominicana", "pe": "Peru",
            "mx": "Mexico", "pa": "Panama"
        },
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            $.getJSON('https://freegeoip.app/json/', function() {}, "jsonp").always(function(resp) {
              var countryCode = resp.country_code;
              countryCity = resp.city;
              countryName = resp.country_name;
              callback(countryCode);              
            });
        },
        utilsScript: "/js/utils.js" // just for formatting/placeholders etc
    }
    );
    var validator = $('#itsystems-form1').validate({
            rules:{
            txtNom:{
                required:true,
                nameRegex:true
            },
            txtTelf:{
                required:true,
                digits:true,
                minlength: 7,
                alphanumeric:true
            },
            txtNroDoc:{
                required:true,
                alphanumeric:true,
                digits:true
            },
            txtEmpresa:{
                required: true,
                nameRegex:true
            },
            txtEmail:{
                required:true,
                email: true
            },
            txtCargo:{
                required:true,
                nameRegex:true
            },
            selTipoDoc:{
                valueNotEquals: "default"
            },
            chkAuto:{
                required: true
            }
        },
        messages:{
            txtNom:{
                required:"Ingrese sus nombres completos",
                nameRegex:"Ingrese numeros o letras"
            },
            txtTelf:{
                required: "Ingrese su numero telefonico",
                digits: "Ingrese solo numeros",
                minlength: "Minimo 7 caracteres",
                alphanumeric:"Ingrese solo numeros"
            },
            txtNroDoc:{
                required: "Ingrese numero de su documento de identidad",
                digits: "Ingrese solo numeros",
                alphanumeric:"Ingrese numeros"
            },
            txtEmpresa:{
                required: "Ingrese el nombre de la empresa en la que pertenece",
                nameRegex:"Ingrese numeros o letras"
            },
            txtEmail:{
                required:"Ingrese su Correo electrónico",
                email:"Correo invalido"
            },
            txtCargo:{
                required:"Ingrese su cargo",
                nameRegex:"Ingrese numeros o letras"
            },
            selTipoDoc:{
                valueNotEquals: "Selecciona un tipo de documento"
            },
            chkAuto:{
                required: "Este campo es obligatorio"
            }
        },
        errorPlacement: function( label, element ) {
            if( element.attr( "name" ) === "audience[]" || element.attr( "name" ) === "event_services[]" ) {
                element.parent().append( label ); // this would append the label after all your checkboxes/labels (so the error-label will be the last element in <div class="controls"> )
            } else if (element.attr("name") == "txtTelf"){
                label.insertBefore(".telf-error");
            } else {
                label.insertBefore( element ); // standard behaviour
            }
        }
        ,
        submitHandler: function(form) {
            // Mientras carga el envio se bloquea el boton y luego realiza la animacion de carga.
            $('.btn-enviar').attr('disabled', 'true');
            $('.btn-enviar')
            .append('<span id="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

            // Variables para el envio
            var nombre = $('#itsystems-form1').find('input[name="txtNom"]').val();
            var digit1 = iti1.getSelectedCountryData().dialCode;
            var digit2 = $('#itsystems-form1').find('input[name="txtTelf"]').val();
            var telf = digit1 + digit2;
            var nroDoc = $('#itsystems-form1').find('input[name="txtNroDoc"]').val();
            var empresa = $('#itsystems-form1').find('input[name="txtEmpresa"]').val();
            var email = $('#itsystems-form1').find('input[name="txtEmail"]').val();
            var cargo = $('#itsystems-form1').find('input[name="txtCargo"]').val();
            var tipoDoc = $('#itsystems-form1').find('select[name="selTipoDoc"]').val();
            var paisSel = iti1.getSelectedCountryData().name;
            var paisR = countryName;
            var ciudad = countryCity;

            $.ajax({
                url: '',
                type: 'POST',
                // TODO: Cambiar los valores por el formulario actual 
                data: {
                    "entry.1474725647": nombre,
                    "entry.690927045": email,
                    "entry.1882664492": telf,
                    "entry.848626432": cargo,
                    "entry.1750988168": tipoDoc,
                    "entry.1991317504": nroDoc,
                    "entry.1703548301": empresa,
                    "entry.974747008": paisSel,
                    "entry.867370786": paisR,
                    "entry.140756896":ciudad,
                },
                success: function(data) {
                    console.log(data);
                    // Remover la etiqueta loading del botón Enviar
                    $('#loading').remove();
                    // Eliminar el bloque completo de ambos formularios
                    $('.after-post').remove();
                    // Deshabilitar el atributo disabled del botón Enviar
                    $('.btn-enviar').attr('disabled', 'false');
                    // Ejecutar la impresión de PDF 
                    var src_icon = 'img/exito.png';
                    var mensaje = 'Se envió el mensaje con éxito.';
                    $('.response').append("<img class='mx-auto' src='"+ src_icon +"'>");
                    $('.response').append("<h4 class='mx-auto text-white text-center'>"+mensaje+"</h4>");
                    // Clear the form
					validator.resetForm();
                },
                error: function (e) {
                    console.log(e);
                }            
            });
            return false;
        }
    });

    var input2 = document.querySelector("#txtTelf2");
    var iti2 = window.intlTelInput(input2, {
        onlyCountries: [ "cl", "co", "cr", "cu",  "ec", "sv",
         "gt", "hn", "mx", "ni", "pa", "py", "pe", "do", "uy", "ve", "bo"],
        localizedCountries : {
            "do": "Republica Dominicana", "pe": "Peru",
            "mx": "Mexico", "pa": "Panama"
        },
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            $.getJSON('https://freegeoip.app/json/', function() {}, "jsonp").always(function(resp) {
              var countryCode = resp.country_code;
              countryCity = resp.city;
              countryName = resp.country_name;
              callback(countryCode);
            });
          },
        utilsScript: "/js/utils.js" // just for formatting/placeholders etc
    }
    );

    var validator2 = $('#itsystems-form2').validate({
        rules:{
            txtNom2:{
                required:true,
                nameRegex:true
            },
            txtTelf2:{
                required:true,
                digits:true,
                minlength: 7,
                alphanumeric:true
            },
            txtNroDoc2:{
                required:true,
                alphanumeric:true,
                digits:true
            },
            txtEmpresa2:{
                required: true,
                nameRegex:true
            },
            txtEmail2:{
                required:true,
                email: true
            },
            txtCargo2:{
                required:true,
                nameRegex:true
            },
            selTipoDoc2:{
                valueNotEquals: "default"
            },
            chkAuto2:{
                required: true
            }
        },
        messages:{
            txtNom2:{
                required:"Ingrese sus nombres completos",
                nameRegex:"Ingrese numeros o letras"
            },
            txtTelf2:{
                required: "Ingrese su numero telefonico",
                digits: "Ingrese solo numeros",
                minlength: "Minimo 7 caracteres",
                alphanumeric:"Ingrese solo numeros"
            },
            txtNroDoc2:{
                required: "Ingrese numero de su documento de identidad",
                digits: "Ingrese solo numeros",
                alphanumeric:"Ingrese numeros"
            },
            txtEmpresa2:{
                required: "Ingrese el nombre de la empresa en la que pertenece",
                nameRegex:"Ingrese numeros o letras"
            },
            txtEmail2:{
                required:"Ingrese su Correo electrónico",
                email:"Correo invalido"
            },
            txtCargo2:{
                required:"Ingrese su cargo",
                nameRegex:"Ingrese numeros o letras"
            },
            selTipoDoc2:{
                valueNotEquals: "Selecciona un tipo de documento"
            },
            chkAuto2:{
                required: "Este campo es obligatorio"
            }
        },
        errorPlacement: function( label, element ) {
            if( element.attr( "name" ) === "audience[]" || element.attr( "name" ) === "event_services[]" ) {
                element.parent().append( label ); // this would append the label after all your checkboxes/labels (so the error-label will be the last element in <div class="controls"> )
            } else if (element.attr("name") == "txtTelf2"){
                label.insertBefore(".telf-error2");
            } else {
                label.insertBefore( element ); // standard behaviour
            }
        }
        ,
        submitHandler: function(form) {
            // Mientras carga el envio se bloquea el boton y luego realiza la animacion de carga.
            $('.btn-enviar').attr('disabled', 'true');
            $('.btn-enviar')
            .append('<span id="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

            // Variables para el envio
            var nombre = $('#itsystems-form2').find('input[name="txtNom2"]').val();
            var digit1 = iti2.getSelectedCountryData().dialCode;
            var digit2 = $('#itsystems-form2').find('input[name="txtTelf2"]').val();
            var telf = digit1 + digit2;
            var nroDoc = $('#itsystems-form2').find('input[name="txtNroDoc2"]').val();
            var empresa = $('#itsystems-form2').find('input[name="txtEmpresa2"]').val();
            var email = $('#itsystems-form2').find('input[name="txtEmail2"]').val();
            var cargo = $('#itsystems-form2').find('input[name="txtCargo2"]').val();
            var tipoDoc = $('#itsystems-form2').find('select[name="selTipoDoc2"]').val();
            var paisSel = iti1.getSelectedCountryData().name;
            var paisR = countryName;
            var ciudad = countryCity;

            $.ajax({
                url: '',
                type: 'POST',
                // TODO: Cambiar los valores por el formulario actual 
                data: {
                    "entry.1474725647": nombre,
                    "entry.690927045": email,
                    "entry.1882664492": telf,
                    "entry.848626432": cargo,
                    "entry.1750988168": tipoDoc,
                    "entry.1991317504": nroDoc,
                    "entry.1703548301": empresa,
                    "entry.974747008": paisSel,
                    "entry.867370786": paisR,
                    "entry.140756896":ciudad,
                },
                success: function(data) {
                    console.log(data);
                    // Remover la etiqueta loading del botón Enviar
                    $('#loading').remove();
                    // Eliminar el bloque completo de ambos formularios
                    $('.after-post').remove();
                    // Deshabilitar el atributo disabled del botón Enviar
                    $('.btn-enviar').attr('disabled', 'false');
                    // Ejecutar la impresión de PDF 
                    var src_icon = 'img/exito.png';
                    var mensaje = 'Se envió el mensaje con éxito.';
                    $('.response').append("<img class='mx-auto' src='"+ src_icon +"'>");
                    $('.response').append("<h4 class='mx-auto text-white text-center'>"+mensaje+"</h4>");
                    // Clear the form
					validator.resetForm();
                },
                error: function (e) {
                    console.log(e);
                }            
            });
            return false;
        }
    });
});

