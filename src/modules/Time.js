module.exports.Time = {
    format: function (duration) {
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
    }
}