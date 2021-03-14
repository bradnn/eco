module.exports.FormatUtils = {
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
    time: function (duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
        if(isNaN(seconds) || isNaN(minutes) || isNaN(hours)) {
            return "None";
        }
    
        hours = (hours < 10) ? hours : hours;
        minutes = (minutes < 10) ? minutes : minutes;
        seconds = (seconds < 10) ? seconds : seconds;
    
        if(hours != 0) {
            return hours + " hours " + minutes + " minutes " + seconds + " seconds";
        } else if(minutes != 0) {
            return minutes + " minutes " + seconds + " seconds";
        } else if (seconds > 0) {
            return seconds + " seconds";
        } else {
            return "None";
        }
    },
    capitalize: function (s) {
        if (typeof s != 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}