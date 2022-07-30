const getYear = (timeString) => {
    return timeString.split("-")[0]
}

/* data transformations */
let minNumOfEarthquakes = 0;
let maxNumOfEarthquakes = 0;
let maxNumOfSignificantEarthquakes = 0;
let years = []
let calculatedEarthquakesPerYear = {};
let year = getYear(earthquakes[0]["time"]);
years.push(year);
calculatedEarthquakesPerYear[year] = {
    total: 0,
    maxMagnitude: 0,
    threeLess: 0,
    threeFour: 0,
    fourFourHalf: 0,
    fourHalfFive: 0,
    fourFive: 0,
    fiveSix: 0,
    sixSeven: 0,
};
for (const record of earthquakes) {
    const recordYear = getYear(record["time"]);
    if (recordYear === years[years.length - 1]) {
        calculatedEarthquakesPerYear[recordYear].total +=1;
        if (calculatedEarthquakesPerYear[recordYear].maxMagnitude < record["mag"]) {
            calculatedEarthquakesPerYear[recordYear].maxMagnitude = record["mag"];
        }
        if (record["mag"] < 3) {
            calculatedEarthquakesPerYear[recordYear].threeLess +=1
        }
        if (record["mag"] >= 3 && record["mag"] < 4) {
            calculatedEarthquakesPerYear[recordYear].threeFour +=1
        }
        if (record["mag"] >= 4 && record["mag"] < 4.5) {
            calculatedEarthquakesPerYear[recordYear].fourFourHalf +=1
        }
        if (record["mag"] >= 4.5 && record["mag"] < 5) {
            calculatedEarthquakesPerYear[recordYear].fourHalfFive +=1
        }
        if (record["mag"] >= 4 && record["mag"] < 5) {
            calculatedEarthquakesPerYear[recordYear].fourFive +=1
        }
        if (record["mag"] >= 5 && record["mag"] < 6) {
            calculatedEarthquakesPerYear[recordYear].fiveSix +=1
        }
        if (record["mag"] >= 6 && record["mag"] < 7) {
            calculatedEarthquakesPerYear[recordYear].sixSeven +=1
        }
    } else {
        years.push(recordYear);
        calculatedEarthquakesPerYear[recordYear] = {
            total: 1,
            maxMagnitude: record["mag"],
            threeLess: record["mag"] < 3 ? 1 : 0,
            threeFour: record["mag"] >= 3 && record["mag"] < 4 ? 1 : 0,
            fourFourHalf: record["mag"] >= 4 && record["mag"] < 4.5 ? 1 : 0,
            fourHalfFive: record["mag"] >= 4.5 && record["mag"] < 5 ? 1 : 0,
            fourFive: record["mag"] >= 4 && record["mag"] < 5 ? 1 : 0,
            fiveSix: record["mag"] >= 5 && record["mag"] < 6 ? 1 : 0,
            sixSeven: record["mag"] >= 6 && record["mag"] < 7 ? 1 : 0,
        };
    }
}
const earthquakesPerYear = years.map(year => {
    const perYear = calculatedEarthquakesPerYear[year].total;
    const perYearMag = calculatedEarthquakesPerYear[year].maxMagnitude;
    const threeLess = calculatedEarthquakesPerYear[year].threeLess;
    const threeFour = calculatedEarthquakesPerYear[year].threeFour;
    const fourFourHalf = calculatedEarthquakesPerYear[year].fourFourHalf;
    const fourHalfFive = calculatedEarthquakesPerYear[year].fourHalfFive;
    const fourFive = calculatedEarthquakesPerYear[year].fourFive;
    const fiveSix = calculatedEarthquakesPerYear[year].fiveSix;
    const sixSeven = calculatedEarthquakesPerYear[year].sixSeven;
    // // min
    // if (minNumOfEarthquakes === 0) {
    //     minNumOfEarthquakes = perYear;
    // } else if (minNumOfEarthquakes > perYear) {
    //     minNumOfEarthquakes = perYear;
    // }

    // max
    if (maxNumOfEarthquakes < perYear) {
        maxNumOfEarthquakes = perYear;
    }


    if (maxNumOfSignificantEarthquakes < fiveSix + sixSeven) {
        maxNumOfSignificantEarthquakes = fiveSix + sixSeven;
    }

    return { 
        year: year, 
        earthquakes: perYear, 
        maximumMagnitude: perYearMag, 
        magnitudeThreeLess: threeLess, 
        magnitudeThreeFour: threeFour, 
        magnitudeFourFourHalf: fourFourHalf, 
        magnitudeFourHalfFive: fourHalfFive, 
        magnitudeFourFive: fourFive, 
        magnitudeFiveSix: fiveSix, 
        magnitudeSixSeven: sixSeven, 
    }
});

/* calculating day of the year */
const estimateRemainder = (lastDataDate, totalEarthquakes) => {
    // used some code from https://stackoverflow.com/a/8619946
    const lastDayWithData = earthquakes[earthquakes.length -1];
    const endDay = new Date(lastDayWithData["time"]);
    const start = new Date(getYear(lastDayWithData["time"]), 0, 0);
    const yearEnd = new Date(getYear(lastDayWithData["time"]), 12, 31);
    const endDayDiff = (endDay - start) + ((start.getTimezoneOffset() - endDay.getTimezoneOffset()) * 60 * 1000);
    const endYearDiff = (endDay - yearEnd) + ((yearEnd.getTimezoneOffset() - endDay.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayNumber = Math.floor(endDayDiff / oneDay);
    const daysLeftInYear = Math.floor(endYearDiff / oneDay) - dayNumber;

    // estimating reminder

}

const earthquakeBands = [
    "magnitudeThreeLess",
    "magnitudeThreeFour",
    // "magnitudeFourFourHalf",
    // "magnitudeFourHalfFive",
    "magnitudeFourFive",
    "magnitudeFiveSix",
    "magnitudeSixSeven"
]

const earthquakeBandNames = {
    "magnitudeThreeLess": "Magnitude less than 3",
    "magnitudeThreeFour": "Magnitude 3-4",
    // "magnitudeFourFourHalf": "Magnitude 4-4.5",
    // "magnitudeFourHalfFive": "Magnitude 4.5-5",
    "magnitudeFourFive": "Magnitude 4-5",
    "magnitudeFiveSix": "Magnitude 5-6",
    "magnitudeSixSeven": "Magnitude 6-7"
}

/* generating graph */
const height = 600;
const width = screen.width - 200;
const margin = 100;

const svg = d3.selectAll('svg');

const div = d3.select("body")
    .append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Axis functions
const x = d3.scaleBand()
    .range([ 100, width ])
    .domain(years)
    .padding(0.2);

const y = d3.scaleLinear()
    .domain([0, maxNumOfEarthquakes])
    .range([ height, 100]);

// Color
const getMagnitudeColor = d3.scaleLinear().domain([3.5, 4.5, 7]).range(["#ccebc5", "#80b1d3", "brown"])
const getEarthquakesNumberColor = d3.scaleLinear().domain([100, 720]).range(["#ccebc5", "brown"])
const getMagnitudeBandColor = d3.scaleOrdinal().domain(earthquakeBands).range([
    "#72C8B9",
    "#37A3A7",
    "#F09551",
    "#CB4F41",
    "#A60C0C"
])

// Stacked data
const stackedData = d3.stack()
    .keys(earthquakeBands)
    (earthquakesPerYear);

const sceneAnnotations = [
    {
        note: {
            label: "The most earthquakes we had per year was 720 in 1989. This was also when the Loma Prieta Earthquake (6.9) happened.",
            title: "1989",
            wrap: 240,  // try something smaller to see text split in several lines
            padding: 5   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#37A3A7"],
        x: x("1989"),
        y: y(720),
        dy: 20,
        dx: -50
    },
    {
        note: {
            label: "From 1991, the average number of detected earthquakes reduced significantly, despite no change in technology",
            title: "1991",
            wrap: 220,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#37A3A7"],
        x: x("1991"),
        y: y(241),
        dy: -50,
        dx: 100
    },
    {
        note: {
            label: "2022 doesn't have the full data, but it's on track and on trend to be below 200 earthquakes per year",
            title: "2022",
            wrap: 220,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#37A3A7"],
        x: x("2022"),
        y: y(72),
        dy: -130,
        dx: -1
    },
    {
        note: {
            label: "There is only a fraction of earthquakes that result in significant damage",
            title: "",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#A60C0C"],
        x: x("1989"),
        y: y(720),
        dy: -30,
        dx: 100
    },
    {
        note: {
            label: "Most earthquakes that are happening are not even noticeable",
            title: "",
            wrap: 250,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#37A3A7"],
        x: x("1990"),
        y: y(301),
        dy: -40,
        dx: 100
    },
    {
        note: {
            label: "When they are noticeable, most don't result in any significant damage",
            title: "",
            wrap: 250,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#F09551"],
        x: x("2008"),
        y: y(225),
        dy: -40,
        dx: 100
    },
    {
        note: {
            label: "Loma Prieta Earthquake (6.9)",
            title: "1989",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#A60C0C"],
        x: x("1989"),
        y: y(720),
        dy: -30,
        dx: 10
    },
    {
        note: {
            label: "Morgan Hill earthquake (6.2)",
            title: "1984",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#A60C0C"],
        x: x("1984"),
        y: y(321),
        dy: -180,
        dx: 70
    },
    {
        note: {
            label: "South Napa earthquake (6.02)",
            title: "2014",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCallout,
        color: ["#A60C0C"],
        x: x("2014"),
        y: y(180),
        dy: -70,
        dx: 25
    },
    {
        note: {
            label: "Before 1991 there were not only more earthquakes, they were bigger",
            title: "1974-1990",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 5   // More = text lower
            
        },
        type: d3.annotationCalloutRect,
        color: ["#F09551"],
        x: x("1991"),
        y: y(722),
        dy: 30,
        dx: 0,
        subject: {
            width: -396,
            height: 505
        }
    },
    {
        note: {
            label: "Looks like we entered a calmer time with lesser and less devastating earthquakes",
            title: "1991-2022",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 0   // More = text lower
            
        },
        type: d3.annotationCalloutRect,
        color: ["#37A3A7"],
        x: width,
        y: y(283),
        dy: -100,
        dx: -30,
        subject: {
            width: -743,
            height: 200
        }
    },
    {
        note: {
            label: "Click anywhere on the graph to continue forward",
            title: "",
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 0   
            
        },
        type: d3.annotationLabel,
        color: ["lightgrey"],
        x: x("2018"),
        y: y(720),
    },
    {
        note: {
            label: "Earthquakes can be scary. Anyone new to SF Bay Area who has experienced an earthquake keeps worrying about the next one happening. Here is a look at the earthquake data for the past 48 years and an attempt to undestand what is going on with our seismic activity.",
            title: "",
            wrap: 400,  // try something smaller to see text split in several lines
            padding: 0   
            
        },
        type: d3.annotationLabel,
        color: ["grey"],
        x: x("2000"),
        y: y(720),
    },
    {
        note: {
            label: "Click anywhere on the graph to continue forward.",
            title: "",
            wrap: 400,  // try something smaller to see text split in several lines
            padding: 0   
            
        },
        type: d3.annotationLabel,
        color: ["purple"],
        x: x("1999"),
        y: y(540),
    },
    {
        note: {
            label: "Highlighted are the only earthquakes in SF Bay Area in the past 48 years that resulted in significant damage.",
            title: "",
            wrap: 400,  // try something smaller to see text split in several lines
            padding: 0   
            
        },
        type: d3.annotationLabel,
        color: ["grey"],
        x: x("2000"),
        y: y(720),
    },
    {
        note: {
            label: "Free explore. Hover over bands to see the details or click any of the buttons above",
            title: "",
            wrap: 200, 
            padding: 0 
            
        },
        type: d3.annotationLabel,
        color: ["lightgrey"],
        x: x("2018"),
        y: y(720),
    }
]

const stepParameters = {
    scene1: {
        showBands: false,
        explore: false,
        caption: "Earthquakes can be scary. Anyone new to SF Bay Area who has experienced an earthquake keeps worrying about the next one happening.<br/>Here is a look at the earthquake data for the past 48 years and an attempt to undestand what is going on with our seismic activity.<br/>These are the earthquakes that happened each year in SF Bay Area since 1974.",
        description: "",
        annotations: [
            sceneAnnotations[0],
            sceneAnnotations[1],
            sceneAnnotations[2],
        ]
    },
    scene2: {
        showBands: true,
        explore: false,
        bands: [
            "magnitudeThreeLess",
            "magnitudeThreeFour",
            "magnitudeFourFive",
            "magnitudeFiveSix",
            "magnitudeSixSeven"
        ],
        caption: "Earthquakes can be scary. Anyone new to SF Bay Area who has experienced an earthquake keeps worrying about the next one happening.<br/>Here is a look at the earthquake data for the past 48 years and an attempt to undestand what is going on with our seismic activity.<br/>This is the breakdown of all recorded earthquakes since 1974 per magnitude.",
        description: "",
        annotations: [
            sceneAnnotations[3],
            sceneAnnotations[4],
            sceneAnnotations[5],
            sceneAnnotations[6],
            sceneAnnotations[7],
            sceneAnnotations[8],
            sceneAnnotations[9],
            sceneAnnotations[10],
        ]
    },
    exploreByMagnitude: {
        showBands: true,
        explore: true,
        bands: [
            "magnitudeThreeLess",
            "magnitudeThreeFour",
            "magnitudeFourFive",
            "magnitudeFiveSix",
            "magnitudeSixSeven"
        ],
        caption: "Earthquakes can be scary. Anyone new to SF Bay Area who has experienced an earthquake keeps worrying about the next one happening.<br/>Here is a look at the earthquake data for the past 48 years and an attempt to undestand what is going on with our seismic activity.<br/>Hover over the bands to see the earthquake count for each type.",
        description: "",
        annotations: [
            sceneAnnotations[6],
            sceneAnnotations[7],
            sceneAnnotations[8],
            sceneAnnotations[15],
        ]
    },
    exploreTotal: {
        showBands: false,
        explore: true,
        caption: "Earthquakes can be scary. Anyone new to SF Bay Area who has experienced an earthquake keeps worrying about the next one happening.<br/>Here is a look at the earthquake data for the past 48 years and an attempt to undestand what is going on with our seismic activity.<br/>Hover over the bands to see the total earthquake count per year.",
        description: "",
        annotations: [
            sceneAnnotations[15],
        ]
    },
    exploreSignificant: {
        showBands: true,
        explore: true,
        bands: [
            "magnitudeSixSeven"
        ],
        caption: "Earthquakes can be scary. Anyone new to SF Bay Area who has experienced an earthquake keeps worrying about the next one happening.<br/>Here is a look at the earthquake data for the past 48 years and an attempt to undestand what is going on with our seismic activity.<br/>These are only the most significant earthquakes that resulted in damages. Hover over the bands to see the total earthquake count per year.",
        description: "",
        annotations: [
            {
                note: {
                    label: "Morgan Hill earthquake (6.2)",
                    title: "1984",
                    wrap: 200,  // try something smaller to see text split in several lines
                    padding: 0   // More = text lower
                    
                },
                color: ["#cc0000"],
                x: x("1984"),
                y: y(230),
                dy: -110,
                dx: -30
            },
            {
                note: {
                    label: "Loma Prieta Earthquake (6.9)",
                    title: "1989",
                    wrap: 200,  // try something smaller to see text split in several lines
                    padding: 0   // More = text lower
                    
                },
                color: ["#cc0000"],
                x: x("1989"),
                y: y(230),
                dy: -200,
                dx: 15
            },
            {
                note: {
                    label: "South Napa earthquake (6.02)",
                    title: "2014",
                    wrap: 200,  // try something smaller to see text split in several lines
                    padding: 0   // More = text lower
                    
                },
                color: ["#cc0000"],
                x: x("2014"),
                y: y(230),
                dy: -80,
                dx: 15
            },
            sceneAnnotations[15],
        ]
    }
};

const significantEarthquakesInfo = {
    "1984": `<b>1984 Morgan Hill Earthquake (6.2)</b><br/>The 1984 Morgan Hill earthquake occurred on April 24 at 1:15 p.m.<br/>local time in the Santa Clara Valley of Northern California.<br/>The shock had a moment magnitude of 6.2<br/>and a maximum Mercalli intensity of VIII.<br/>The epicenter was located near Mount Hamilton</br>in the Diablo Range of the California Coast Ranges.`,
    "1989": `<b>1989 Loma Prieta earthquake (6.9)</b><br/>The 1989 Loma Prieta earthquake occurred on California's Central Coast <br/>on October 17 at 5:04 p.m. local time. The shock was centered <br/>in The Forest of Nisene Marks State Park in Santa Cruz County, <br/>approximately 10 mi (16 km) northeast of Santa Cruz on a section <br/>of the San Andreas Fault System and was named for the nearby <br/>Loma Prieta Peak in the Santa Cruz Mountains.The shock was responsible <br/>for 63 deaths and 3,757 injuries. The Loma Prieta segment of the San Andreas <br/>Fault Systemhad been relatively inactive since the 1906 San Francisco earthquake <br/>(to the degree that it was designated a seismic gap) until two moderate foreshocks <br/>occurred in June 1988 and again in August 1989.`,
    "2014": `<b>2014 South Napa earthquake</b><br/>The 2014 South Napa earthquake occurred in the North San Francisco<br/>Bay Area on August 24 at 03:20:44 Pacific Daylight Time. The event was<br/>the largest in the San Francisco Bay Area since the 1989 Loma Prieta earthquake.<br/>The epicenter of the earthquake was located to the south of Napa<br/>and to the northwest of American Canyon on the West Napa Fault.<br/><br/>Total damage in the southern Napa Valley and Vallejo areas<br/>was in the range of $362 million to $1 billion, with<br/>one person killed and 200 injured. Other aspects of the event included<br/>an experimental earthquake warning system that alerted seismologists<br/>several seconds before the damaging shear waves arrived, temporary changes<br/>in springs and wells, and the potential for postseismic fault creep.`,
};

let currentStep = "scene1";

const generateView = (stepName) => {
    currentStep = stepName;
    const parameters = stepParameters[stepName];
    document.getElementById("pageCaption").innerHTML = parameters.caption;

    let currentBands;
    let providedData;

    if (!!parameters.showBands) {
        currentBands = parameters.bands;
        providedData = d3.stack()
            .keys(currentBands)
            (earthquakesPerYear);
    } else {
        providedData = d3.stack()
            .keys(["earthquakes"])
            (earthquakesPerYear);
    }

    svg.selectAll('*').remove();

    yExtent = !parameters.showBands || parameters.bands.length > 2 ? maxNumOfEarthquakes : maxNumOfSignificantEarthquakes;// + 350;
    const yDomain = [0, yExtent];
    y.domain(yDomain)

    svg.append("g")
        .attr("transform", "translate(0,600)")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    const axisLeft = d3.axisLeft(y);
    if (!!parameters.showBands && parameters.bands.length <= 2) {
        axisLeft.tickValues([0,1,2.3])
        .tickFormat(d3.format("d"));
    }
    svg.append("g")
        .attr("transform", "translate(100,0)")
        .call(axisLeft);

    // Bars
    const layers = svg.selectAll("bar")
        .data(providedData)
        .enter().append("g")
        .attr("fill", function(d) { 
                if (!!parameters.showBands) {
                    return getMagnitudeBandColor(d.key);
                } else return "#37A3A7"
            });
    layers
        .selectAll("rect")
        .data(function(d) { return d })
        .enter()
        .append("rect")
        .attr("x", function(d, i) { 
            return x(years[i]);
        })
        .attr("y", function(d) { 
            if (!!parameters.showBands) {
                return y(d[1]);
            } else {
                return y(d[1]);
            }
        })
        .attr("height", function(d) { 
            if (!!parameters.showBands) {
                return y(d[0]) - y(d[1]);
            } else {
                return y(d[0]) - y(d[1]);
            }
         })
        .attr("width", x.bandwidth())
        .attr("fill", function(d) { 
            if (!parameters.showBands) { return getEarthquakesNumberColor(d.earthquakes) }
        })
        .on("mouseover", function(event, d) {
            if (!!parameters.explore) {
                d3.select(this).style('stroke', 'black');
                const[mouseX, mouseY] = d3.pointer(event);	
                const bandName = d3.select(this.parentNode).datum().key;
                const bandValue = d.data[bandName];
                const tooltipData = d.data;
                div.transition()
                    .duration(200)		
                    .style("opacity", .9);	
                if (!parameters.showBands || parameters.bands.length > 2) {
                    div.html(`Year: ${tooltipData.year}` + 
                    (!!parameters.showBands ? `<br/>${earthquakeBandNames[bandName]}: ${bandValue}` : `<br/>Total earthquakes: ${bandValue}`) + 
                    `<br/>Max magnitude: ${tooltipData.maximumMagnitude}`
                    )
                    .style("left", mouseX + "px")		
                    .style("top", mouseY + 100 + "px");	
                } else {
                    div.html(`${significantEarthquakesInfo[tooltipData.year]}`)
                    .style("left", mouseX - 50 + "px")		
                    .style("top", mouseY + "px");	
                }
            }
        })					
        .on("mouseout", function(event, d) {
            if (!!parameters.explore) {
                d3.select(this).style('stroke', 'none');		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            }
        })
}

const renderAnnotation = (annotationData) => {
    const makeAnnotations = d3.annotation()
        .annotations(annotationData)
    svg.append("g")
        .call(makeAnnotations);
}

const story = [
    () => {
        generateView("scene1");
        generateButtons([true, true, true, true, true, false]);
        renderAnnotation([
            sceneAnnotations[11]
        ]);
    },
    () => {
        generateView("scene1");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene1"].annotations[0],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene1");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene1"].annotations[0],
            stepParameters["scene1"].annotations[1],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene1");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene1"].annotations[0],
            stepParameters["scene1"].annotations[1],
            stepParameters["scene1"].annotations[2],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene2");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene2"].annotations[1],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene2");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene2"].annotations[1],
            stepParameters["scene2"].annotations[2],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene2");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene2"].annotations[1],
            stepParameters["scene2"].annotations[2],
            stepParameters["scene2"].annotations[0],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene2");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene2"].annotations[3],
            stepParameters["scene2"].annotations[4],
            stepParameters["scene2"].annotations[5],
            sceneAnnotations[11],
            sceneAnnotations[14]
        ]);
    },
    () => {
        generateView("scene2");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene2"].annotations[6],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("scene2");
        generateButtons([true, true, true, false, false, false]);
        renderAnnotation([
            stepParameters["scene2"].annotations[6],
            stepParameters["scene2"].annotations[7],
            sceneAnnotations[11],
        ]);
    },
    () => {
        generateView("exploreByMagnitude");
        generateButtons([false, false, false, false, true, true]);
        renderAnnotation([
            // stepParameters["exploreByMagnitude"].annotations[0],
            // stepParameters["exploreByMagnitude"].annotations[1],
            // stepParameters["exploreByMagnitude"].annotations[2],
            sceneAnnotations[15],
        ]);
    },
];

let currentStoryStep = 1;

const progressOnClick = () => {
    if (currentStoryStep < story.length) {
        const currentAction = story[currentStoryStep];
        currentStoryStep += 1;
        currentAction();
    } else {
        // currentStoryStep = 0;
        // const currentAction = story[currentStoryStep];
        // currentAction();
    }
}

const buttons = [
    {
        name: "Total",
        description: "Total earthquakes",
        className: "exploreTotal",
        action: () => {
            generateView("exploreTotal");
            renderAnnotation([sceneAnnotations[15]]);
            generateButtons([false, false, false, false, true, true]);
        },
        disabled: true,
    },
    {
        name: "By magnitude",
        description: "Breakdown by magnitude",
        className: "exploreByMagnitude",
        action: () => {
            generateView("exploreByMagnitude");
            renderAnnotation([sceneAnnotations[15]]);
            generateButtons([false, false, false, false, true, true]);
        },
        disabled: true,
    },
    {
        name: "Only significant",
        description: "Significant (damaging) earthquakes only",
        className: "exploreSignificant",
        action: () => {
            generateView("exploreSignificant");
            renderAnnotation(stepParameters["exploreSignificant"].annotations);
            generateButtons([false, false, false, false, true, true]);
        },
        disabled: true,
    },
    {
        name: "Start over",
        description: "Restart the story",
        className: "start",
        action: () => {
            currentStoryStep = 0;
            progressOnClick();
            generateButtons([true, true, true, true, true, false]);
        },
        disabled: true,
    },
    {
        name: "Back",
        description: "Go to the previous slide",
        className: "back",
        action: () => {
            currentStoryStep -= 2;
            progressOnClick();
        },
        disabled: true,
    },
    {
        name: "Forward",
        description: "Go to the next slide",
        className: "forward",
        action: () => {
            progressOnClick();
        },
        disabled: false,
    }
];

const generateButtons = (buttonStates) => {
    !!buttonStates && buttonStates.map((btnState, i) => {
        buttons[i].disabled = btnState;
    })

    document.getElementById("nav").innerHTML = "";
    buttons.map(button => {
        const btn = document.createElement("button");
        btn.innerText = button.name;
        btn.onclick = button.action;
        btn.className = `${button.className} ${currentStep === button.className ? 'active' : ''}`;
        btn.disabled = button.disabled;
        document.getElementById("nav").appendChild(btn);
    });
}

generateView("scene1");
generateButtons();
renderAnnotation([
    sceneAnnotations[11]
]);