app.controller("MainController",["$scope",function(c){
    this.startDate = new Date();
    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() + 5);

    c.eventList =[];//To store all events
    c.relavantEventList =[];//To store the relevant event list for a chosen day
    this.countDownHours = null;//To store remaining countdown Hours
    this.countDownDays = null;//To store remaining countdown Days
    this.countDownMinutes = null;//To store remaining countdown Minutes
    this.countDownSeconds = null;//To store remaining countdown Seconds
    //Deleting an event
    c.deleteEvent=(eventId,endDate)=>{
        c.eventList.map(event=>{
            if(event.eventId === eventId){

                const index = c.eventList.indexOf(event);
                if (index > -1) {
                    c.eventList.splice(index, 1);
                }

            }
            c.displayEventList(endDate);

        })

    }
//Updating the event details
    c.updateEvent=(updatedText,eventId)=>{

      c.eventList.map(event=>{
          if(event.eventId === eventId){
              event.eventText = updatedText;
             event.eventTime =new Date(event.eventDateTime).toLocaleTimeString()
          }
        })
    }
    //Displaying the relevant event list
     c.displayEventList =  (endDate)=>{
         c.relavantEventList =[];
         c.eventList.map(event=>{
             if(event.evnetDate === endDate){
                 c.relavantEventList.push(event);

             }
         });

         return c.relavantEventList;


    }
    //Adding a new event
    c.addEvent = (date)=>{



        c.eventList.push(
            {
                eventId : new Date().getTime()  ,
                evnetDate:date ,
                eventTime: new Date(c.newEventTime).toLocaleTimeString(),
                eventText:c.newEventText,
                eventDateTime : new Date(c.newEventTime)

            }
            );

    }
    //To compare dates
    var dates = {
        convert:function(d) {

            return (
                d.constructor === Date ? d :
                    d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                        d.constructor === Number ? new Date(d) :
                            d.constructor === String ? new Date(d) :
                                typeof d === "object" ? new Date(d.year,d.month,d.date) : NaN
            );
        },
        compare:function(a,b) {

            return (
                isFinite(a=this.convert(a).valueOf()) &&
                isFinite(b=this.convert(b).valueOf()) ?
                    (a>b)-(a<b) : NaN
            );
        },
        inRange:function(d,start,end) {

            return (
                isFinite(d=this.convert(d).valueOf()) &&
                isFinite(start=this.convert(start).valueOf()) &&
                isFinite(end=this.convert(end).valueOf()) ?
                    start <= d && d <= end : NaN
            );
        }
    }

   //Displaying the countdown timer and deleting an item in a case of expire
    var x = setInterval(function() {
        //Getting the nearest event time and date
        if (c.eventList.length !== 0) {


            var minDate = c.eventList[0].evnetDate;
            var minIndex = 0;

            for (var i = 1; i < c.eventList.length; i++) {
                let res = dates.compare(c.eventList[i].evnetDate,minDate);

                if (res === -1) {
                    console.log(i);
                    minIndex = i;
                    minDate = c.eventList[i].evnetDate;
                }
            }

        }
        let tempArr = [];
        for(let i= 0 ; i < c.eventList.length ; i++){
            if(c.eventList[i].evnetDate === minDate){
                tempArr.push(c.eventList[i]);
            }
        }
        if (tempArr.length !== 0) {


            var minTime1 = tempArr[0].eventTime;
            var minIndex1 = 0;

            for (var y = 1; y < tempArr.length; y++) {
                let res1 = dates.compare(tempArr[y].eventTime,minTime1);

                if (res1 === -1) {
                    console.log(y);
                    minIndex1 = y;
                    minTime1 = c.eventList[y].eventTime;
                }
            }

        }



         let now = new Date().getTime();//Getting the current date
        let countDownDate = new Date(minDate + " " + minTime1).getTime();//Getting the nearest event's date in miliseconds

         let distance = countDownDate - now;


         let days = Math.floor(distance / (1000 * 60 * 60 * 24));
         let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((distance % (1000 * 60)) / 1000);

         this.countDownDays = days;
         this.countDownHours=hours;
         this.countDownMinutes = minutes;
         this.countDownSeconds=seconds;


        if (distance < 0) {//Deleting an item in the case of expiring
            clearInterval(x);
             c.eventList.map(event=>{
                 if(event.eventId === tempArr[minIndex1].eventId){

                     const index = c.eventList.indexOf(event);
                     if (index > -1) {
                         c.eventList.splice(index, 1);
                     }

                 }

             })
        }
    }, 1000);
}]);
