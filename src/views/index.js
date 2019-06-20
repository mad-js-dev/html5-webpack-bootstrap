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
*/
//let pie = new BridePie();
/*
function filterNumbersFromArray(arr) {
  // Write the code that goes here
  let removalIndexes = [];

  arr.forEach((elem, ind, arr) => {
    console.log(elem, ind,arr)
    if(typeof elem != 'number')removalIndexes.push(ind),console.log('**', ind);
        arr.splice(ind, 1);
  })
    
  //console.log('--', arr); 
  removalIndexes.forEach((elem, ind, arr) => {
    removalIndexes.splice(elem, 1);
  })
  
}

var arr = [1, 'a', 'b', 2];
filterNumbersFromArray(arr);
for (var i = 0; i < arr.length; i++)
  console.log(arr[i]);
*/
/*
function setup() {
  // Write your code here.
  let spans = document.getElementsByTagName('span');
  //console.log(spans)

  for(var i = 0, all = spans.length; i < all; i++){   

        spans[i].addEventListener('click', (e) => {
            let parentLength = e.target.parentElement;
            console.log(parentLength)
            //elem.toggleClass('active')

            for(var n = 0; n < parentLength.children.length; n++) {
                if(parentLength.children[n] == e.target) {//remove class
                    parentLength.children[n].classList.add('active');
                } else {//addclass
                    parentLength.children[n].classList.remove('active');
                }
            }
        })
  }
}

// Example case. 
document.body.innerHTML = `
<div id='rating'>
  <span>*</span>
  <span>*</span>
  <span>*</span>
  <span>*</span>
  <span>*</span>
</div>`;

setup();

document.getElementsByTagName("span")[2].click();
console.log(document.body.innerHTML);*/
/*
const getPolygon = function (countOfSegments) {
  // Create a Polygon Object

  if(countOfSegments < 3 || countOfSegments == null){
    console.log("A polygon need to have at least 3 segments, it will be set to 3")
    countOfSegments=3;
  }

  const result = {
    segments : countOfSegments,
    getSegments() {
      // Return (Number) the current count of segments
      return this.segments
    },
    describe() {
      // log 'The polygon you created is a *** composed by * segments'    
      let name = "";
      if(this.segments <= 3 || this.segments == undefined){//tri
         name = 'triangle';
      }else if(this.segments == 4){
        name = 'quadrilateral';
      }else if(this.segments == 5){
        name = 'pentagon';
      }else if(this.segments == 6){
        name = 'hexagon';
      }else if(this.segments > 6){
        name = 'generic polygon';
      }
      console.log('The polygon you created is a '+name+' composed by '+this.segments+' segments'    ) 
    },
    increase() {
      // Increase the segments of a created polygon and log the same sentence in describe()  
      this.segments++;
      this.describe();    
    },
    whatIs() {
      // Open a new window that links to https://en.wikipedia.org/wiki/Polygon
      window.open( 'https://en.wikipedia.org/wiki/Polygon', '_blank')
    }
  };
  return result;
};

const square = getPolygon(4);
square.describe(); // The polygon you created is a quadrilateral composed by 4 segments
square.increase() // The polygon you created is a pentagon composed by 5 segments

const generic = getPolygon(18);
generic.describe(); // The polygon you created is a generic polygon composed by 18 segments

generic.whatIs(); // Open a new window that links to https://en.wikipedia.org/wiki/Polygon


const emptyPolygon = getPolygon(); // Emit a log message: 'A polygon needs to have at least 3 segments, it will be set to 3' and set it to 3

*/

let ratings = document.getElementsByClassName('c-rating');

for (let item of ratings) {
    console.log(item);
    item.addEventListener('click', (e) => {
        console.log(e.currentTarget.classList.contains('c-rating') ,e);
        if(!e.target.classList.contains('c-rating')){
            let rootElement = e.target.farthestViewportElement.parentElement;
            rootElement.classList.remove('empty');
            console.log(rootElement.getElementsByClassName('active'));
            for(let elem of rootElement.getElementsByClassName('active'))elem.classList.remove('active');
            e.target.farthestViewportElement.classList.add('active');
        }
    })
}