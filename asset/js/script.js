let url ="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

fetch(url)
.then(res=>res.json())
.then(res=>{
    createStuff(res.map(i=>[converData(i.Time),
    i.Year,
    i.Doping,
    i.Name
]))
})

let createInnerHtmlToolyip = (d)=>{
    return `
    <p>${d[3]} ${d[1]}</P>
    <p>time: ${d[0].getMinutes()}:${d[0].getSeconds()}</p>
    <p><small>${d[2]}</small></p>
    `
}

let converData=(str)=>{
    return new Date("2010 01 01 00:"+str +"")
}

let createStuff=(data)=>{
    const width = 800;
    const height = 400;
    const padding = 40;
    const circleRadius = 7;


    const yScale = d3.scaleTime()
                    .domain([d3.min(data,d=>d[0]),
                             d3.max(data,d=>d[0])])
                    .range([padding,height-padding])

    const xScale = d3.scaleTime()
                    .domain([d3.min(data,d=>d[1]-1),
                            d3.max(data,d=>d[1])+1])                
                    .range([padding,width-padding])

    const svg = d3.select('#container').append("svg")
                .attr("width",width)
                .attr("height",height)

    /*create graph */
    
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("data-xvalue",d=>d[1])
        .attr("data-yvalue",d=>d[0])
        .attr("cx",d=>xScale(d[1]))
        .attr("cy",d=>yScale(d[0]))
        .attr("fill",d=>d[2]===""?"#e0576e":"#fefbfb")
        .attr("r",circleRadius)
        .on("mouseover",(d,i)=>{
            tooltip.classList.add("show");
            tooltip.style.left = xScale(d[1])+20+"px";
            tooltip.style.top = yScale(d[0])+10+"px";
            tooltip.setAttribute("data-year",d[1]);

            tooltip.innerHTML = createInnerHtmlToolyip(d)
        }).on("mouseout",()=>{
            tooltip.classList.remove("show")
        })

    /*format*/           

    const timeFormMandS = d3.timeFormat("%M:%S")
    const timeFormaYear = d3.format("d")            
                
    /*create axis*/
    
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(timeFormaYear)
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(timeFormMandS)

    svg.append("g")
       .attr("id","x-axis")
       .attr('transform','translate(0,'+ (height-padding) + ')')
       .call(xAxis)

    svg.append("g")
       .attr("id","y-axis")
       .attr("transform","translate("+(padding)+",0)")   
       .call(yAxis)
}



