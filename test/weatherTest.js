let chai = require("chai");
let chaihttp = require("chai-http");
const addContext = require("mochawesome/addContext");
const dataInput = require("../data/inputDataFile");

//Assertion Style
chai.should();

//Http Integration Library
chai.use(chaihttp);

describe("Open Weather API - Test Suite",function(){
    this.timeout(30000);

    describe("Functional Test Scenario - GET /data/2.5/forecast", function(){
        
        //Data loop to iterate through inputDataFile records
        dataInput.forEach(function({BaseURL, ApiKey, city, expectedTemperatureInDegree, weatherCondition}){
        it("Verify the number of days in Sydney where the temperature is predicated to be above " + expectedTemperatureInDegree + " degrees and Weather is " + weatherCondition + " in the next 5 days", function(done){
            
            chai.request(BaseURL)
                .get("/data/2.5/forecast?q=" + city + "&appid=" + ApiKey + "&units=metric")
                .end((err,response, body)=>{
                    response.should.have.status(200);
                    
                    var dateArray=[];
                    var listArrayCountResponse = response.body.cnt;

                    for (var i = 0; i < listArrayCountResponse; i++) 
                        {
                            var maxTemperatureResponse = response.body.list[i].main.temp_max;
                            var weatherConditionResponse = response.body.list[i].weather[0].main;
                            
                            if(maxTemperatureResponse > expectedTemperatureInDegree & weatherConditionResponse === weatherCondition)
                                {
                                    var dateTimeResponse = response.body.list[i].dt_txt;
                                    var date = dateTimeResponse.substring(0,10);
                                    
                                    // Code to find unique dates in the array
                                    if(dateArray.indexOf(date) === -1)
                                       {
                                            dateArray.push(date);
                                       }   
                                }
                        }
                    
                    // Add additonal context to report to showcase the desired outcome
                    addContext(this, {
                        title: "Number of Days with Temperature above " + expectedTemperatureInDegree + " degrees & " + weatherCondition + " Weather",
                        value: dateArray.length
                    }),
                    addContext(this, {
                        title: 'Dates',
                        value: dateArray
                    });

                    done();
                        if (err) throw err;
                })  
            })  
        })
    })
})
