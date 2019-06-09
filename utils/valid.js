var valid = {
    checkParams: function(refobj, evalueobj){
        if(Object.keys(refobj).sort().toString()==Object.keys(evalueobj).sort().toString()){
            return true;
        }
        return false;
    },
    checkEmail: function(email){
        var regexp = /^\w*@\w*[.]\w{2,3}$/g;
        if(email.match(regexp)==null){
            return false;
        }
        return true;
    }
}
module.exports = valid;