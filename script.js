
var padding = { top: 8, right: 40, bottom: 0, left: 90 },

    w = 560 - padding.left - padding.right,

    h = 560 - padding.top - padding.bottom,

    r = Math.min(w, h) / 2,

    rotation = 0,

    oldrotation = 0,

    picked = 100000,

    oldpick = [],

    color = d3.scale.category20b();




var answerShow = false;

var data = [

    {

        "label": "1",

        "value": 1,

        "question": "which goal-setting methodology is designed to create high quality goals ?",

        "answer": "SMART"

    },

    {

        "label": "2",

        "value": 2,

        "question": "Who can help manager with the additional support related to performance process?",

        "answer": "HRA"

    },

    {

        "label": "3",

        "value": 3,

        "question": "What topics can be discussed in SAP talk?",

        "answer": "Performance Discussions and Working Conditions and development"

    },

    {

        "label": "4",

        "value": 4,

        "question": "Name the initiative channel where we can talk to external experts about all life challenges anonymously around the clock.",

        "answer": "Employee Assistance Program"

    },

    {

        "label": "5",

        "value": 5,

        "question": "The practice of sharing regular, constructive response at work through a series of ongoing and structured conversations between managers and their employees is called ?",

        "answer": "Continuous Feedback"

    },

    {

        "label": "6",

        "value": 6,

        "question": "What is the channel used to have regular, open dialogue between employee and manager. The dialogue is forward-looking and solution oriented rather than backward-looking.",

        "answer": "SAP Talk"

    },

    {

        "label": "7",

        "value": 7,

        "question": "Name the teams who support managers to bring the performance concerns back on track.",

        "answer": "People Relations/HR advisor"

    },

    {

        "label": "8",

        "value": 8,

        "question": "Which platform enables to collect feedback from peers, managers and other stakeholders.",

        "answer": "360 degree feedback"

    },

    {

        "label": "9",

        "value": 9,

        "question": "Which process in Success map enables managers to correct the performance deviations?",

        "answer": "Manage to Success"

    },

    {

        "label": "10",

        "value": 10,

        "question": "Who is responsible to initiate the SAP Talk?",

        "answer": "It is the joint It is the joint and collaborative of employee  & manager."

    }

];




var svg = d3.select('#chart')

    .append("svg")

    .data([data])

    .attr("width", w + padding.left + padding.right)

    .attr("height", h + padding.top + padding.bottom);

var container = svg.append("g")

    .attr("class", "chartholder")

    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

var vis = container

    .append("g");




var answerDiv = document.querySelector("#answer")

var showButton = document.querySelector(".show-answer-button")

var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });

// declare an arc generator function

var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw

var arcs = vis.selectAll("g.slice")

    .data(pie)

    .enter()

    .append("g")

    .attr("class", "slice");




arcs.append("path")

    .attr("fill", function (d, i) { return color(i); })

    .attr("d", function (d) { return arc(d); });

// add the text

arcs.append("text").attr("transform", function (d) {

    d.innerRadius = 0;

    d.outerRadius = r;

    d.angle = (d.startAngle + d.endAngle) / 2;

    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";

})

    .attr("text-anchor", "end")

    .text(function (d, i) {

        return data[i].label;

    });

container.on("click", spin);

function spin(d) {

    container.on("click", null);

    //all slices have been seen, all done

    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);

    if (oldpick.length == data.length) {

        console.log("done");

        container.on("click", null);

        return;

    }

    var ps = 360 / data.length,

        pieslice = Math.round(1440 / data.length),

        rng = Math.floor((Math.random() * 1440) + 360);




    rotation = (Math.round(rng / ps) * ps);




    picked = Math.round(data.length - (rotation % 360) / ps);

    picked = picked >= data.length ? (picked % data.length) : picked;

    if (oldpick.indexOf(picked) !== -1) {

        d3.select(this).call(spin);

        return;

    } else {

        oldpick.push(picked);

    }

    rotation += 90 - Math.round(ps / 2);

    vis.transition()

        .duration(3000)

        .attrTween("transform", rotTween)

        .each("end", function () {

            //mark question as seen

            d3.select(".slice:nth-child(" + (picked + 1) + ") path")

                .attr("fill", "#FFD700");

            //populate question

            d3.select("#question h2")

                .text(data[picked].question);

            d3.select("#answer h2")

                .text(data[picked].answer);

            oldrotation = rotation;

            answerDiv.style.visibility = "hidden"

            /* Get the result value from object "data" */

            console.log(data[picked].value)
			
            /* Comment the below line for restrict spin to sngle time */

            container.on("click", spin);

        });

}

//make arrow

svg.append("g")

    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")

    .append("path")

    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")

    .style({ "fill": "black" });

//draw spin circle

container.append("circle")

    .attr("cx", 0)

    .attr("cy", 0)

    .attr("r", 60)

    .style({ "fill": "white", "cursor": "pointer" });

//spin text

container.append("text")

    .attr("x", 0)

    .attr("y", 15)

    .attr("text-anchor", "middle")

    .text("SPIN")

    .style({ "font-weight": "bold", "font-size": "30px" });





function rotTween(to) {

    var i = d3.interpolate(oldrotation % 360, rotation);

    return function (t) {

        return "rotate(" + i(t) + ")";

    };

}





function getRandomNumbers() {

    var array = new Uint16Array(1000);

    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

    if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {

        window.crypto.getRandomValues(array);

        console.log("works");

    } else {

        //no support for crypto, get crappy random numbers

        for (var i = 0; i < 1000; i++) {

            array[i] = Math.floor(Math.random() * 100000) + 1;

        }

    }

    return array;

}




function showAnswer() {

    answerShow = true

    if (answerShow) {

        answerDiv.style.visibility = "visible"

        showButton.textContent = "Hide Answer"

        showButton.style.background = "red"
		
		setInterval(
		function(){ 
			showButton.textContent = "Show Answer"
			showButton.style.background = "#4CAF50"
		
		},
		3000
		);

    }

   /* else {

        showButton.textContent = "Show Answer"

        showButton.style.background = "#4CAF50"

       

    }*/


}