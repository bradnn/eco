module.exports.String = {
    capitalize: function (s) {
        if (typeof s != 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}