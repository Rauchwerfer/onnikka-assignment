const weightData = [
    {
        "month": 1,
        "averageChange": -0.5,
        "medianChange": -0.7,
        "count": 500,
        "standardDeviation": 0.1
    },
    {
        "month": 2,
        "averageChange": -0.78,
        "medianChange": -0.8,
        "count": 534,
        "standardDeviation": 0.2
    },
    {
        "month": 3,
        "averageChange": -1.4,
        "medianChange": -1.38,
        "count": 580,
        "standardDeviation": 1.0
    },
    {
        "month": 4,
        "averageChange": -2.0,
        "medianChange": -2.1,
        "count": 600,
        "standardDeviation": 0.5
    },
    {
        "month": 5,
        "averageChange": -2.5,
        "medianChange": -2.5,
        "count": 604,
        "standardDeviation": 2.0
    },
    {
        "month": 6,
        "averageChange": -3.78,
        "medianChange": -3.8,
        "count": 610,
        "standardDeviation": 2.5
    },
    {
        "month": 7,
        "averageChange": -4.3,
        "medianChange": -3.8,
        "count": 620,
        "standardDeviation": 2.0
    },
    {
        "month": 8,
        "averageChange": -4.5,
        "medianChange": -4.5,
        "count": 630,
        "standardDeviation": 3.0
    },
    {
        "month": 9,
        "averageChange": -5.0,
        "medianChange": -5.8,
        "count": 640,
        "standardDeviation": 2.0
    },
    {
        "month": 10,
        "averageChange": -5.5,
        "medianChange": -5.5,
        "count": 650,
        "standardDeviation": 3.0
    },
    {
        "month": 11,
        "averageChange": -6.1,
        "medianChange": -5.79,
        "count": 660,
        "standardDeviation": 3.88
    },
    {
        "month": 12,
        "averageChange": -6.5,
        "medianChange": -6.5,
        "count": 670,
        "standardDeviation": 4.0
    }
]


class WeightDataController {
    /**
     * Weight Data
     * @type {[{ month: number, averageChange: number, medianChange: number, count: number, standardDeviation: number}]} 
     */
    #data

    /**
     * Controller for WeightData model
     * @type {HTMLElement}
     */
    #tableBody
    /**
     * 2D Context of chart canvas
     * @type {CanvasRenderingContext2D}
     */
    #chartCtx
    /**
     * Chart control
     * @type {Chart}
     */
    #chart

    /**
     * Filter Checkbox: Average Changes
     * @type {HTMLElement}
     */
    #averageChangesCheckbox
    /**
     * Filter Checkbox: Median Changes
     * @type {HTMLElement}
     */
    #medianChangesCheckbox
    /**
     * Filter Checkbox: Standard Deviations
     * @type {HTMLElement}
     */
    #standardDeviationsCheckbox

    /**
     * Controller for WeightData model
     * @param {[{ month: number, averageChange: number, medianChange: number, count: number, standardDeviation: number}]} weightData
     */
    constructor(weightData) {
        this.#data = weightData
    }

    initialize() {
        // Filter checkboxes
        this.#averageChangesCheckbox = document.getElementById('averageChangesCheckbox')
        this.#medianChangesCheckbox = document.getElementById('medianChangesCheckbox')
        this.#standardDeviationsCheckbox = document.getElementById('standardDeviationsCheckbox')

        this.#averageChangesCheckbox.onchange = () => this.#applyFiltersOnChart()
        this.#medianChangesCheckbox.onchange = () => this.#applyFiltersOnChart()
        this.#standardDeviationsCheckbox.onchange = () => this.#applyFiltersOnChart()

        // Table
        this.#tableBody = document.getElementById('weightDataTableBody')

        // Chart
        const chartCanvas = document.getElementById('weightDataChart')

        this.#chartCtx = chartCanvas.getContext('2d')
        this.#chart = new Chart(this.#chartCtx, {
            type: 'line',
            data: this.#getDataForChart(this.#data),
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: CHART_COLORS.green
                        },
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        //reverse: true
                    }
                },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'WeightsData.json content representation'
                    },
                },
                maintainAspectRatio: false,
                aspectRatio: 2,
                interaction: {
                    intersect: false
                }
            }
        })

        // Custom handler for theme changing since Chart styles are controlled from script
        chartCanvas.addEventListener("themechanged",
            (e) => {
                const isDarkThemeOn = e.detail

                this.#chart.options.plugins.title.color = isDarkThemeOn ? '#FFFFFF' : '#000000'
                this.#chart.options.scales.x.ticks.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color
                this.#chart.options.scales.y2.ticks.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color

                this.#chart.data.datasets.forEach(dataset => {
                    dataset.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color
                });

                this.#chart.options.plugins.legend.labels.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color

                this.#chart.update()
            },
            false)
    }

    /**
     * Apply filters and render (table render without filtering)
     */
    processAndRenderContent() {
        this.#applyFiltersOnChart()
        this.#renderTableContent(this.#data)
    }

    /**
     * Prepare weight data to be used in chart
     * @param {[{ month: number, averageChange: number, medianChange: number, count: number, standardDeviation: number}]} data 
     * @returns {ChartData<TType, TData, TLabel>}
     */
    #getDataForChart(data) {
        const labels = data.map(weightDataElement => `Month ${weightDataElement.month}`)
        const counts = data.map(weightDataElement => weightDataElement.count)
        const averageChanges = data.map(weightDataElement => weightDataElement.averageChange)
        const medianChanges = data.map(weightDataElement => weightDataElement.medianChange)
        const standardDeviations = data.map(weightDataElement => weightDataElement.standardDeviation)

        return {
            labels: labels,
            datasets: [{
                label: 'Count',
                data: counts,
                backgroundColor: CHART_COLORS.green,
                borderColor: CHART_COLORS.green,
                borderWidth: 1,
                cubicInterpolationMode: 'monotone',
                yAxisID: 'y'
            }, {
                label: 'Average Change',
                data: averageChanges,
                backgroundColor: CHART_COLORS.yellow,
                borderColor: CHART_COLORS.yellow,
                borderWidth: 1,
                yAxisID: 'y2'
            }, {
                label: 'Median Change',
                data: medianChanges,
                backgroundColor: CHART_COLORS.blue,
                borderColor: CHART_COLORS.blue,
                borderWidth: 1,
                yAxisID: 'y2'
            }, {
                label: 'Standard Deviation',
                data: standardDeviations,
                backgroundColor: CHART_COLORS.red,
                borderColor: CHART_COLORS.red,
                borderWidth: 1,
                yAxisID: 'y2'
            }]
        }
    }

    #applyFiltersOnChart() {
        this.#chart.setDatasetVisibility(1, averageChangesCheckbox.checked)
        this.#chart.setDatasetVisibility(2, medianChangesCheckbox.checked)
        this.#chart.setDatasetVisibility(3, standardDeviationsCheckbox.checked)
        this.#chart.update()
    }

    /**
     * Render chart with given sorted and filtered dataset
     * @param {[{ month: number, averageChange: number, medianChange: number, count: number, standardDeviation: number}]} processedData 
     */
    #renderTableContent(processedData) {
        while (this.#tableBody.firstChild) {
            this.#tableBody.removeChild(this.#tableBody.firstChild)
        }

        processedData.forEach(weightDataElement => {
            const row = document.createElement('tr')

            const monthCell = document.createElement('th')

            monthCell.textContent = weightDataElement.month
            row.appendChild(monthCell)

            const countCell = document.createElement('td')
            countCell.textContent = weightDataElement.count
            row.appendChild(countCell)

            const averageChangeCell = document.createElement('td')
            averageChangeCell.textContent = weightDataElement.averageChange
            row.appendChild(averageChangeCell)

            const medianChangeCell = document.createElement('td')
            medianChangeCell.textContent = weightDataElement.medianChange
            row.appendChild(medianChangeCell)

            const standardDeviationCell = document.createElement('td')
            standardDeviationCell.textContent = weightDataElement.standardDeviation
            row.appendChild(standardDeviationCell)

            this.#tableBody.appendChild(row)
        })
    }
}

const weightDataController = new WeightDataController(weightData)
weightDataController.initialize()
weightDataController.processAndRenderContent()