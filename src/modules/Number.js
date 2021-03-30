module.exports.Number = {
    numberComma: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    numberLetter: function (x) {
        var NUM_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

        var level = Math.log10(x) / 3 | 0;

        if(level == 0) return x;
    
        var numSuffix = NUM_SYMBOL[level];
        var scale = Math.pow(10, level * 3);
        var scaled = x / scale;
    
        return scaled.toFixed(1) + numSuffix;
    },
    money: function (x) {
        return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    gem: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    convertToHex: function(int) {
        var hex = int.toString(16);
        switch (hex.length) {
            case 1: {
                hex = `00${hex}`;
                break;
            }
            case 2: {
                hex = `0${hex}`;
                break;
            }
            default: {
                break;
            }
        }

        return hex;
    }
}