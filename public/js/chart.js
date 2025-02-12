document.addEventListener('DOMContentLoaded', function() { 

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let savedProjects = localStorage.getItem('savedProjects');
    savedProjects = JSON.parse(savedProjects);
    let projectID = urlParams.get('projectID');
    let selectedProject = savedProjects.find(project => project.id == projectID);
    let xData = selectedProject.simulations.map(sim => sim.point.x);
    let yData = selectedProject.simulations.map(sim => sim.point.y);
    let count = selectedProject.simulations.map(sim => sim.point.count);
    let countMutations = selectedProject.simulations.map(sim => sim.point.mutation);
    let mutationRate = selectedProject.simulations.map(sim => sim.point.mutationrate);
    let N_min = selectedProject.minGermCount;

    const minTime = mindestKeimzahlBerechnen(selectedProject.simulations, N_min)
    if (N_min < selectedProject.simulations[selectedProject.simulations.length - 1].point.count){
      let warningIndicator1 = document.getElementById('imgWarning1');
      let warningIndicator2 = document.getElementById('imgWarning2');
      warningIndicator1.style.visibility = 'visible';
      warningIndicator2.style.visibility = 'visible';
      document.getElementById('txtMindestkeimzahl').innerHTML = "Der Grenzwert wurde überschritten bei: "+minTime+" Stunden";
    } else {
      document.getElementById('txtMindestkeimzahl').innerHTML = "Der Grenzwert wurde in der angegebenen Zeit nicht überschritten."
    }

    const minLineData = xData.map(() => N_min);

    var myChart = echarts.init(document.getElementById('main'));
      var option = {
        title: {
          text: "Abschlussbericht für " + selectedProject.projectName
        },
        tooltip: {},
        legend: {
          textStyle: {color: 'white'},
          data: ["Wachstumsrate", "Anzahl Mikroorganismen", "Anzahl Mutationen", "Mutationsrate", "Mindestkeimzahl"],
          top: '5%'
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
          {
            name: 'Wachstumsrate',
            type: 'line',
            data: yData,
            smooth: true
          },
          {
            name: 'Anzahl Mikroorganismen',
            type: 'line',
            data: count,
            smooth: true
          },
          {
            name: 'Anzahl Mutationen',
            type: 'line',
            data: countMutations,
            smooth: true
          },
          {
            name: 'Mutationsrate',
            type: 'line',
            data: mutationRate,
            smooth: true
          },
          {
            name: 'Mindestkeimzahl',
            type: 'line',
            data: minLineData, 
            smooth: false,
            lineStyle: {
              type: 'dashed',
              color: 'red'
            }
          }

        ]
      };
      myChart.setOption(option);
});

function mindestKeimzahlBerechnen(simulations, N_min) {
  for (let i = 1; i < simulations.length; i++) {
    const prevCount = simulations[i - 1].point.count;
    const currCount = simulations[i].point.count;

    if (prevCount < N_min && currCount >= N_min) {
      const prevTime = simulations[i - 1].point.x;
      const currTime = simulations[i].point.x;

      const interpolatedTime = prevTime + ((N_min - prevCount) / (currCount - prevCount)) * (currTime - prevTime);

      return interpolatedTime.toFixed(2);
    }
  }
  return -1;
}
