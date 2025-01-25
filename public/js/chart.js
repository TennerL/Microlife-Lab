document.addEventListener('DOMContentLoaded', function() { 

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let projectName = urlParams.get('projectName');
    
    let savedProjects = localStorage.getItem('savedProjects');
    savedProjects = JSON.parse(savedProjects);
    let selectedProject = savedProjects.find(project => project.projectName === projectName);
    let xData = selectedProject.simulations.map(sim => sim.point.x);
    let yData = selectedProject.simulations.map(sim => sim.point.y);
    let count = selectedProject.simulations.map(sim => sim.point.count);
    let countMutations = selectedProject.simulations.map(sim => sim.point.mutation);

    var myChart = echarts.init(document.getElementById('main'));
      var option = {
        title: {
          text: "Abschlussbericht für " + selectedProject.projectName + " | " + selectedProject.microOrganism
        },
        tooltip: {},
        legend: {
          textStyle: {color: 'white'},
          data: ["Wachstumsrate", "Anzahl Mikroorganismen", "Anzahl Mutationen"]
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
          }

        ]
      };
      myChart.setOption(option);
});