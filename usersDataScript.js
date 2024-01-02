const usersData = [
    {
        "date": "2023-01-01",
        "users": 143
    },
    {
        "date": "2023-02-01",
        "users": 150
    },
    {
        "date": "2022-12-01",
        "users": 140
    },
    {
        "date": "2023-03-01",
        "users": 151
    },
    {
        "date": "2023-05-01",
        "users": "160"
    },
    {
        "date": "2022-11-01",
        "users": 136
    },
    {
        "date": "2023-06-01",
        "users": 162
    }
]

class UsersDataController {
    /**
     * Users Data
     * @type {[{ users: number, date: Date}]} 
     */
    #initialData = []

    /**
     * Chart control
     * @type {Chart}
     */
    #chart
    /**
     * 2D Context of chart canvas
     * @type {CanvasRenderingContext2D}
     */
    #chartCtx
    /**
     * Table body
     * @type {HTMLElement}
     */
    #tableBody

    /**
     * Filter Input: Date from
     * @type {HTMLElement}
     */
    #dateFromInput
    /**
     * Filter Input: Date to
     * @type {HTMLElement}
     */
    #dateToInput

    /**
     * Shown records number
     * @type {HTMLElement}
     */
    #shownRecordsView
    /**
     * Total records number
     * @type {HTMLElement}
     */
    #totalRecordsView

    /**
     * Controller for UsersData model
     * @param {[{ users: number, date: Date}]} usersData
     */
    constructor(usersData) {
        this.#initialData = usersData
    }

    initialize() {
        // Limits for data adjustments
        const { minDate, maxDate, minUsers, maxUsers } = usersData.reduce((acc, usersDataElement) => {
            const date = usersDataElement.date

            acc.minDate = acc.minDate < date ? acc.minDate : date
            acc.maxDate = acc.maxDate > date ? acc.maxDate : date

            const users = Number(usersDataElement.users)

            acc.minUsers = Math.min(acc.minUsers, users)
            acc.maxUsers = Math.max(acc.maxUsers, users)

            return acc
        }, { minDate: new Date('9999-12-31'), maxDate: new Date('0000-01-01'), minUsers: Infinity, maxUsers: -Infinity })

        //Table
        this.#tableBody = document.getElementById('usersDataTableBody')

        // Chart
        const chartCanvas = document.getElementById('usersDataChart')

        this.#chartCtx = chartCanvas.getContext('2d')
        this.#chart = new Chart(this.#chartCtx, {
            type: 'line',
            data: this.#initialData,
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true
                        },
                        offsetAfterAutoskip: true
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: CHART_COLORS.green
                        },
                        min: minUsers - (maxUsers - minUsers),
                        max: maxUsers + (maxUsers - minUsers)
                    }
                },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'UsersData.json content representation'
                    },
                },
                maintainAspectRatio: false,
                aspectRatio: 2
            }
        })

        // Date filter
        this.#dateFromInput = document.getElementById('dateFromInput')
        this.#dateToInput = document.getElementById('dateToInput')

        this.#shownRecordsView = document.getElementById('usersDataShownRecordsView')
        this.#totalRecordsView = document.getElementById('usersDataTotalRecordsView')

        this.#dateFromInput.value = this.#dateFromInput.min = this.#dateToInput.min = minDate
        this.#dateToInput.value = this.#dateToInput.max = this.#dateFromInput.max = maxDate

        this.#dateFromInput.onchange = () => {
            this.#dateToInput.min = this.#dateFromInput.value

            this.processAndRenderContent()
        }

        this.#dateToInput.onchange = () => {
            this.#dateFromInput.max = this.#dateToInput.value

            this.processAndRenderContent()
        }


        // Sorting radiogroups
        const radioButtons = document.querySelectorAll('input[name="sortingFieldRadios"], input[name="sortingTypeRadios"]')

        radioButtons.forEach(radioButton => {
            radioButton.onchange = () => this.processAndRenderContent()
        })

        // Custom handler for theme changing since Chart styles are controlled from script
        chartCanvas.addEventListener("themechanged",
            (e) => {
                const isDarkThemeOn = e.detail

                this.#chart.options.plugins.title.color = isDarkThemeOn ? '#FFFFFF' : '#000000'
                this.#chart.options.scales.x.ticks.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color
                this.#chart.options.scales.y.ticks.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color

                this.#chart.data.datasets.forEach(dataset => {
                    dataset.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color
                });

                this.#chart.options.plugins.legend.labels.color = isDarkThemeOn ? '#FFFFFF' : Chart.defaults.color

                this.#chart.update()
            },
            false)
    }

    /**
     * Apply filters and sortings and render views
     */
    processAndRenderContent() {
        const processedData = this.#getFilteredAndSortedData()

        this.#renderTableContent(processedData)
        this.#renderChartContent(processedData)
    }

    /**
     * Prepare data to be used in chart
     * @returns {[{ users: number, date: Date}]} processedData 
     */
    #getFilteredAndSortedData() {
        const selectedSortField = document.querySelector('input[name="sortingFieldRadios"]:checked')
        const selectedSortType = document.querySelector('input[name="sortingTypeRadios"]:checked')

        if (selectedSortField === null || selectedSortType === null) {
            console.error(`Error getting sorting radiogroup checked element: ${selectedSortField === null ? "selectedSortField is null" : "selectedSortType is null"}!`)

            return []
        }

        if (selectedSortField.value === 'date') {
            if (selectedSortType.value === 'asc') {
                this.#initialData.sort(this.#compareDatesAsc)
            } else {
                this.#initialData.sort(this.#compareDatesDesc)
            }
        } else {
            if (selectedSortType.value === 'asc') {
                this.#initialData.sort(this.#compareUsersAsc)
            } else {
                this.#initialData.sort(this.#compareUsersDesc)
            }
        }

        let filteredAndSortedData = []

        this.#initialData.forEach(usersDataElement => {
            const inputDate = new Date(usersDataElement.date)

            if (!(inputDate >= new Date(dateFromInput.value) && inputDate <= new Date(dateToInput.value))) return

            filteredAndSortedData.push({
                date: inputDate,
                users: Number(usersDataElement.users)
            })
        })

        return filteredAndSortedData
    }

    /**
     * Render table with given sorted and filtered dataset
     * @param {[{ users: number, date: Date}]} processedData 
     */
    #renderTableContent(processedData) {
        while (this.#tableBody.firstChild) {
            this.#tableBody.removeChild(this.#tableBody.firstChild)
        }

        processedData.forEach(usersDataElement => {

            const row = document.createElement('tr')

            const dateCell = document.createElement('th')

            const inputDate = new Date(usersDataElement.date)

            dateCell.textContent = `${inputDate.getDate()}.${inputDate.getMonth() + 1}.${inputDate.getFullYear()}`
            row.appendChild(dateCell)

            const usersCell = document.createElement('td')
            usersCell.textContent = usersDataElement.users
            row.appendChild(usersCell)

            this.#tableBody.appendChild(row)
        })

        this.#shownRecordsView.innerHTML = processedData.length
        this.#totalRecordsView.innerHTML = usersData.length
    }


    /**
     * Converts filtered and sorted data to type of data field of Chart
     * @param {[{ users: number, date: Date}]} processedData 
     * @returns {ChartData<TType, TData, TLabel>}
     */
    #getDataForChart(processedData) {
        const labels = processedData.map(usersDataElement => `${usersDataElement.date.getDate()}.${usersDataElement.date.getMonth() + 1}.${usersDataElement.date.getFullYear()}`)

        const users = processedData.map(usersDataElement => usersDataElement.users)

        return {
            labels: labels,
            datasets: [{
                label: 'Users',
                data: users,
                backgroundColor: CHART_COLORS.green,
                borderColor: CHART_COLORS.green,
                borderWidth: 1,
                cubicInterpolationMode: 'default',
                yAxisID: 'y'
            }]
        }
    }

    /**
     * Render chart with given sorted and filtered dataset
     * @param {[{ users: number, date: Date}]} processedData 
     */
    #renderChartContent(processedData) {
        this.#chart.data = this.#getDataForChart(processedData)
        this.#chart.update()
    }

    // Sorting
    #compareDatesAsc = (a, b) => new Date(a.date) - new Date(b.date)
    #compareDatesDesc = (a, b) => new Date(b.date) - new Date(a.date)
    #compareUsersAsc = (a, b) => a.users - b.users
    #compareUsersDesc = (a, b) => b.users - a.users
}

const usersDataController = new UsersDataController(usersData)
usersDataController.initialize()
usersDataController.processAndRenderContent()