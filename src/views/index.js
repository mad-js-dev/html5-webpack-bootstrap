import "../styles/pageStyles.scss";

var hi = 'world1';
console.log(hi);

/*
class BridePie {
    constructor(...data){
        const width = 540;
        const height = 540;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select("#graph")
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
             "#e78ac3","#a6d854","#ffd92f"]);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        
        const newarc = d3.arc()
            .innerRadius(2 * radius / 3)
            .outerRadius(radius);


        function arcTween(a) {
            const i = d3.interpolate(this._current, a);
            this._current = i(1);
            return (t) => arc(i(t));
        }
        
        d3.json("./assets/data/data.json").then(info => {
                // Join new data
                const groups = svg.selectAll('g')
                  .data(pie(info.data));
            
                const path = svg.selectAll("path")
                    .data(pie(info.data));

                // Update existing arcs
                groups.transition().duration(200).attrTween("d", arcTween);

                // Enter new arcs
                groups.enter().append("g").append("path")
                    .attr("fill", (d, i) => color(i))
                    .attr("d", arc)
                    .attr("stroke", "white")
                    .attr("stroke-width", "6px")
//                    .append("text")
//                    .attr("transform", function (d) {
//                        return "translate(" + newarc.centroid(d) + ")";
//                    })
//                    .attr("text-anchor", "middle")
//                    .attr("fill", "white")
//                    .text(function (d) {
//                        return d.data.label;
//                    })
                    .each(function(d) { this._current = d; });
        });
    }
}

let pie = new BridePie();*/


class IconsHandler {
    //Class handling for animated icons
    constructor() {
        this.selectors = [ "o-icon--circle", "o-icon--square", "o-icon--square--no-rad", "o-icon--hrect", "o-icon--hrect--no-rad", "o-icon--vrect", "o-icon--vrect--no-rad"];
        
        //Setting binding for all icons
        for(let selector of this.selectors) {
            let collection = document.getElementsByClassName(selector);

            for(let htmlElement of collection) {
                let dataToggle = htmlElement.attributes.getNamedItem("data-toggle");
                //Filtering out the ones that dont have data-toggle="icon"
                if(dataToggle != null && dataToggle.value == "icon") {
                    console.log(htmlElement);
                    //Setting listener
                    htmlElement.addEventListener('click', this.toggleIcon());
                }
            }
        }
            
    }

    toggleIcon() {
        return (e) => {
            console.log(e.target, e.currentTarget);
            let rootElement = e.currentTarget;

            if(rootElement.classList.contains('shown')) {
                rootElement.classList.add('hidding');
                setTimeout(()=>{
                    rootElement.classList.remove('hidding');
                    rootElement.classList.remove('shown');
                },200);
            } else {
                rootElement.classList.add('showing');
                setTimeout(()=>{
                    rootElement.classList.add('shown');
                    rootElement.classList.remove('showing');
                },200);
            }
            //

        }
    }
    
}

let icons = new IconsHandler();

