var helper = {
    isEmptyObject: function (obj) { 
        for ( var name in obj ) {
            return false;
        }
        return true;
    },

    // This function is referenced from https://gist.github.com/markthiessen/3883242
    getWeeksInMonth: function (month, year){
        var dateOffset = 24*60*60*1000;
        var weeks=[];
        var firstDate= new Date(Date.UTC(year, month - 1, 1));
        var lastDate= new Date(Date.UTC(year, month, 0));
        var startDate = new Date(firstDate.getTime());
        var endDate = new Date(firstDate.getTime());

        startDate.setTime(firstDate.getTime() - (firstDate.getUTCDay() - 1) * dateOffset );
        endDate.setTime(startDate.getTime() + 6 * dateOffset );
        
        while(startDate.getTime() <= lastDate.getTime() && endDate.getTime() <= lastDate.getTime()){
            var thisweek = {start: new Date(startDate) , end: new Date(endDate)};
            weeks.push(thisweek);
            startDate.setTime(endDate.getTime() + dateOffset * 1);
            endDate.setTime(endDate.getTime() + dateOffset * 7);            
        }        
        return weeks;
    },
    getStartEndDate: function (weeks, week_no){
        return { start: new Date(weeks[week_no - 1].start), end: new Date(weeks[week_no - 1].end) };
    },
    getDatesInWeek: function (startDate){
        var dateOffset = 24*60*60*1000;

        var dates = [];
        var dateInWeek = new Date(startDate);
        for (var i = 0; i < 7; i++){
            dates.push(new Date(dateInWeek));
            dateInWeek.setTime(dateInWeek.getTime() + dateOffset);
        }
        return dates;  
    },
    getYYYYMMDD: function (date){
        var mm = date.getUTCMonth() + 1; // getMonth() is zero-based
        var dd = date.getUTCDate();
      
        return [date.getUTCFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
               ].join(' ');
    },
    zeroFill: function ( number, width )
    {
        width -= number.toString().length;
        if ( width > 0 )
        {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    }
};

module.exports = helper;
