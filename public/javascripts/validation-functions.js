function validateIP(modelNew) {
    var valid = true;
    var pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // IP present
    if ( !$('#sourceIp').val() ) {
        valid = false;
    }
    // IP in IPv4 format
    if ( !pattern.test($('#sourceIp').val())) {
        valid = false;
        $('.wrong-format-ip').show();
    } else {
        $('.wrong-format-ip').hide();
    }
    // IP unique
    if (modelNew && existingIPs.includes($('#sourceIp').val())) {
        valid = false;
        $('.duplicate-ip').show();
    } else {
        $('.duplicate-ip').hide();
    }

    if ( valid ) {
        $('#sourceIp').removeClass('invalid');
        $('.wrong-format-ip').hide();
        $('.duplicate-ip').hide();
    } else {
        $('#sourceIp').addClass('invalid');
    }
    return valid;
}

function validatePassword() {
    var valid = true;
    if ( !$('#password2').val() || ( $('#password2').val() !== $('#password').val()) ) {
        $('#password2').addClass('invalid');
        valid = false;
    } else {
        $('#password2').removeClass('invalid');
    }
    return valid;
}

function validateElValueNotNull(el) {
    var valid = true;
    if ( !$(el).val() ) {
        $(el).addClass('invalid');
        valid = false;
    } else {
        $(el).removeClass('invalid');
    }
    return valid;
}