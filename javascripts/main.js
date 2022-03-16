// Reset all check boxes to unchecked 
    $('[type=checkbox]').each((i, input) => {input.checked = false;});

// Airline tile template 
// Pass through the airline data and the alliance to filter. 
// Alliance defaults to "Sparse" to pull data sparsely when loadMore() is called
    const airlineTemp = (data, alliance = "Sparse") => {
        if(alliance != "Sparse") {
            $('#airlines-container').html(""); 
        }

        let allianceData = {"OW": "One World", "ST": "Sky Team", "SA": "Star Alliance"}; 

        data.map((airline, i) => {
            
            if(airline.alliance === alliance || alliance === "Sparse") {
                
                $('#airlines-container').append(`
                    <article class="airline-tile airline">
                        <div class="airline-container">
                            <div class="airline-logo" >
                                <img src="https://www.kayak.com/${data[i].logoURL}" alt="Airline Logo">
                            </div>
                            <div class="airline-details">
                                <span class="airline-name">${data[i].name}</span>
                                <ul class="airline-info">
                                    ${(data[i].alliance != "" ? 
                                    "<li class='airline-alliance'>"+ (allianceData[data[i].alliance] ? 
                                        allianceData[data[i].alliance] : data[i].alliance) +
                                    "</li>" : "")}
                                    ${data[i].phone != "" ? "<li class='airline-phone'>"+data[i].phone+"</li>" : ""}
                                    ${data[i].site != "" ? "<li class='airline-site'>"+data[i].site+"</li>" : ""}
                                </ul>
                            </div>
                        </div>
                    </article>
                `);
            }
        });


        // add "Load more" button if all of the ailine tiles are not populated (data is populated sparsely)
        if(data.length > $('#airlines-container').children.length && alliance === "Sparse") {
            $('#load-more-container').html(`<button id="load-more" onClick="loadMore()">Load more</button>`);
        } 
        
        // data is populated in full by using the filters (defining the alliance param with OW, ST or SA)
        if(alliance != "Sparse") {
            $('#load-more-container').html('');
        }
    };

    // Handle load more event to populate more airline tiles 
    function loadMore() {
        console.log("load");
        getData("Sparse");
    }

// when a checkbox is checked filter data 
// if it is not checked, get sparse results
    function handleChange(event) {
        let inputName = event.target.name;
        let checked = event.target.checked;

        $('[type=checkbox]').each((i, input) => {
            if(input != event.target) {
                input.checked = false;
            }
        });

        if(checked) {
            getData(inputName);
        } else {
            $('#airlines-container').html("");
            getData("Sparse");
        }
    }

// filter for One World and send data to Airline template
    function getOW(data) {
        airlineTemp(data, "OW");
    }

// filter for Sky Team and send data to Airline template
    function getST(data) {
        airlineTemp(data, "ST");
    }

// filter for Star Alliance and send data to Airline template
    function getSA(data) {
        airlineTemp(data, "SA");
    }

// populate in icrements of 10 when getSparse is called. Append sliced array with existing tiles 
    function getSparse(data) {
        let tileLength = $('#airlines-container')[0].childElementCount;
            data = data.slice(tileLength, tileLength + 10);

        airlineTemp(data);
    }

    // inital call to populate a set of 10 tiles
    getData("Sparse");

    // request JOSONP data
  function getData(term) {
   $.ajax({
    type: 'GET',
    url: `https://www.kayak.com/h/mobileapis/directory/airlines/homework?jsonp=get${term}`,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp'
    });
}  



    
