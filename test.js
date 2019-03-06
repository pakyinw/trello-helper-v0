var helper = require('./helper.js');
var assert = require('assert');

describe('helper', function(){
    describe('#getWeeksInMonth()',function(){
        it('Weeks should be equal',function(){
            var month=1;
            var year=2019;
            assert.deepEqual(helper.getWeeksInMonth(month, year),
                    [{
                        start: new Date('31 Dec 2018 00:00:00 GMT'),
                        end: new Date('06 Jan 2019 00:00:00 GMT')
                    },{
                        start: new Date('07 Jan 2019 00:00:00 GMT'),
                        end: new Date('13 Jan 2019 00:00:00 GMT')
                    },{
                        start: new Date('14 Jan 2019 00:00:00 GMT'),
                        end: new Date('20 Jan 2019 00:00:00 GMT')
                    },{
                        start:  new Date('21 Jan 2019 00:00:00 GMT'),
                        end: new Date('27 Jan 2019 00:00:00 GMT')
                    }
                    ]);
        });
        //var startenddate = helper.getStartEndDate(weeks, week);
    });  
});

describe('helper', function(){
    describe('#getStartEndDate()',function(){
        it('Week\'s start / end dates should be equal',function(){
            var weeks= [{
                            start: new Date('31 Dec 2018 00:00:00 GMT'),
                            end: new Date('06 Jan 2019 00:00:00 GMT')
                        },{
                            start: new Date('07 Jan 2019 00:00:00 GMT'),
                            end: new Date('13 Jan 2019 00:00:00 GMT')
                        },{
                            start: new Date('14 Jan 2019 00:00:00 GMT'),
                            end: new Date('20 Jan 2019 00:00:00 GMT')
                        },{
                            start:  new Date('21 Jan 2019 00:00:00 GMT'),
                            end: new Date('27 Jan 2019 00:00:00 GMT')
                        }
                        ];
            var week=1;
            assert.deepEqual(helper.getStartEndDate(weeks, week),
                    {
                        start: new Date('31 Dec 2018 00:00:00 GMT'),
                        end: new Date('06 Jan 2019 00:00:00 GMT')
                    });
        });
    });  
});

describe('helper', function(){
    describe('#getDatesInWeek()',function(){
        it('Dates should be equal',function(){
            var startdate= new Date('31 Dec 2018 00:00:00 GMT');
            assert.deepEqual(helper.getDatesInWeek(startdate),
                    [
                        new Date('31 Dec 2018 00:00:00 GMT'),
                        new Date('01 Jan 2019 00:00:00 GMT'),
                        new Date('02 Jan 2019 00:00:00 GMT'),
                        new Date('03 Jan 2019 00:00:00 GMT'),
                        new Date('04 Jan 2019 00:00:00 GMT'),
                        new Date('05 Jan 2019 00:00:00 GMT'),
                        new Date('06 Jan 2019 00:00:00 GMT')
                    ]);
        });
    });  
});

describe('helper', function(){
    describe('#getYYYYMMDD()',function(){
        it('Date in string should be equal',function(){
            var startdate=new Date('31 Dec 2018 00:00:00 GMT');
            assert.equal(helper.getYYYYMMDD(startdate),'2018 12 31');
        });
    });  
});

describe('helper', function(){
    describe('#zeroFill()', function(){
        it('0 is filled', function(){
            assert.equal(helper.zeroFill(24,7),'0000024');
        });
    });
});
