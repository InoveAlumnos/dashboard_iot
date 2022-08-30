// Define the chart axes
const chartData = {
    datasets: [
        {
        fill: false,
        label: 'Heading',
        yAxisID: 'value',
        borderColor: 'rgba(255, 204, 0, 1)',
        pointBoarderColor: 'rgba(255, 204, 0, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
        spanGaps: true,
        }
    ]
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
        id: 'value',
        type: 'linear',
        scaleLabel: {
            labelString: 'value',
            display: true,
        },
        ticks: {
            beginAtZero: true,
            steps: 8,
            stepValue: 36,
            max: 360
        },
        position: 'left',
        }]
    }
};

chartData.labels = headingTime;
chartData.datasets[0].data = headingData;

// Get the context of the canvas element we want to select
const ctx = document.getElementById('headingChart').getContext('2d');
const headingChart = new Chart(
ctx,
{
    type: 'line',
    data: chartData,
    options: chartOptions,
});

const chartData2 = {
    datasets: [
        {
        fill: false,
        label: 'Accel',
        yAxisID: 'value',
        borderColor: 'rgba(0, 204, 0, 1)',
        pointBoarderColor: 'rgba(0, 204, 0, 1)',
        backgroundColor: 'rgba(0, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(0, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(0, 204, 0, 1)',
        spanGaps: true,
        }
    ]
};

const chartOptions2 = {
    scales: {
        yAxes: [{
        id: 'value',
        type: 'linear',
        scaleLabel: {
            labelString: 'value',
            display: true,
        },
        ticks: {
            beginAtZero: true,
            steps: 2,
            stepValue: 5,
            max: 30
        },
        position: 'left',
        }]
    }
};

chartData2.labels = accelTime;
chartData2.datasets[0].data = accelData;

// Get the context of the canvas element we want to select
const ctx2 = document.getElementById('accelChart').getContext('2d');
const accelChart = new Chart(
ctx2,
{
    type: 'line',
    data: chartData2,
    options: chartOptions2,
});

// Monitoreo Radar
const chartRadarData = {
    labels: [
        'CPU',
        'RAM',
        'DISK',
        'TEMP',
      ],
    datasets: [
        {
        label: 'Monitoreo',
        data: [0, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
        }
    ]
};

const chartRadarOptions = {
    elements: {
        line: {
          borderWidth: 3
        }
    },
    scales: {
        r: {
            angleLines: {
                display: false
            },
            suggestedMin: 50,
            suggestedMax: 100
        }
    }
};

chartRadarData.datasets[0].data = monitoreoData;

// Get the context of the canvas element we want to select
const radarctx = document.getElementById('monitoreoChart').getContext('2d');
const monitoreoChart = new Chart(
radarctx,
{
    type: 'radar',
    data: chartRadarData,
    options: chartOptions,
});


chartReady = true;