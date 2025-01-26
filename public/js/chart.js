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
      document.getElementById('txtMindestkeimzahl').innerHTML = "Die Mindestkeimzahl wurde überschritten bei: "+minTime+" Stunden";
    } else {
      document.getElementById('txtMindestkeimzahl').innerHTML = "Die mindestkeimzahl wurde in der angegebenen Zeit nicht überschritten."
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
  const startCountMicrobes = simulations[0].point.count;
  const growthRates = simulations.map((sim, index) => {
    if (index === 0) return 0; 
    const prevCount = simulations[index - 1].point.count;
    const currentCount = sim.point.count;
    const timeElapsed = sim.point.x - simulations[index - 1].point.x;
    return Math.log(currentCount / prevCount) / timeElapsed;
  }).filter(rate => rate > 0); 

  const averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const minTime = Math.log(N_min / startCountMicrobes) / averageGrowthRate;

  return minTime.toFixed(2);
}