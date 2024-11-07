document.addEventListener('DOMContentLoaded', function() { 

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let projectName = urlParams.get('projectName');
    
    let savedProjects = localStorage.getItem('savedProjects');
    savedProjects = JSON.parse(savedProjects);
    let selectedProject = savedProjects.find(project => project.projectName === projectName);
    let xData = selectedProject.simulations.map(sim => sim.x);
    let yData = selectedProject.simulations.map(sim => sim.y);

    var myChart = echarts.init(document.getElementById('main'));
      var option = {
        title: {
          text: "Abschlussbericht für " + selectedProject.projectName + " | " + selectedProject.microOrganism
        },
        tooltip: {},
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
          {
            name: 'Wachstumsrate',
            type: 'line',
            data: yData
          }
        ]
      };
      myChart.setOption(option);
});