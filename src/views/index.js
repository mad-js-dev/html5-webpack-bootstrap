import "../styles/pageStyles.scss";



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

//let pie = new BridePie();



function filterNumbersFromArray(data) {
  // This could be made with arr.filter but it returns a new array that needs to be reasigned to the original var,
  //(therby, filter doesnt change the original array and its not applicable to this exercise)
  let i = data.length
  while(i-- != 0) {
    if(typeof data[i] != 'number' ) {
        data.splice(i,1);
    }
  }
  
}

var arr = [1, 'a', 'b', 2];
filterNumbersFromArray(arr);
for (var i = 0; i < arr.length; i++)
  console.log(arr[i]);
