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

chartReady = true;