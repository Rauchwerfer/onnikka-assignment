const colorSchemeSwitcher = document.getElementById('colorSchemeSwitcher')

let isDarkThemeOn = false

class ThemedElement {
    constructor (element, lightThemeClasses, darkThemeClasses) {
        this.element = element;
        this.lightThemeClasses = lightThemeClasses;
        this.darkThemeClasses = darkThemeClasses;
    }

    applyTheme(darkTheme) {
        this.element.classList.remove(...this.darkThemeClasses, ...this.lightThemeClasses);

        const selectedThemeClasses = darkTheme ? this.darkThemeClasses : this.lightThemeClasses;
        this.element.classList.add(...selectedThemeClasses);
    }
}

const themedElements = [
    new ThemedElement(document.querySelector('[data-theme-colored="navbar"]'), ['navbar-light', 'bg-light'], ['navbar-dark', 'bg-dark']),
    new ThemedElement(document.querySelector('[data-theme-colored="container"]'), [], ['dark-bg']),
    new ThemedElement(document.querySelector('[data-theme-colored="body"]'), [], ['dark-bg']),
    new ThemedElement(document.querySelector('[data-theme-colored="bordered-1"]'), [], ['border-secondary']),
    new ThemedElement(document.querySelector('[data-theme-colored="bordered-2"]'), [], ['border-secondary']),
    new ThemedElement(document.querySelector('[data-theme-colored="footer"]'), ['bg-light'], ['bg-dark','border-secondary']),
    new ThemedElement(document.querySelector('[data-theme-colored="table-1"]'), [], ['table-dark']),
    new ThemedElement(document.querySelector('[data-theme-colored="table-2"]'), [], ['table-dark']), 
    new ThemedElement(document.querySelector('[data-theme-colored="buttonTableCollapse"]'), ['btn-outline-dark'], ['btn-outline-light']),
    new ThemedElement(document.querySelector('[data-theme-colored="bordered-3"]'), [], ['border-secondary']),
    new ThemedElement(document.querySelector('[data-theme-colored="bordered-4"]'), [], ['border-secondary']),
    new ThemedElement(document.querySelector('[data-theme-colored="bordered-5"]'), [], ['border-secondary']),
]

const themeSwitchEventHandlers = [
    document.getElementById('weightDataChart'),
    document.getElementById('usersDataChart')
]

function switchTheme() {
    isDarkThemeOn = !isDarkThemeOn
    
    themedElements.forEach(element => {
        element.applyTheme(isDarkThemeOn)
    })

    themeSwitchEventHandlers.forEach(element => {
        element.dispatchEvent(new CustomEvent("themechanged", { detail: isDarkThemeOn }))
    })

    colorSchemeSwitcher.innerHTML = isDarkThemeOn ? 'Light Mode' : 'Dark Mode'
    colorSchemeSwitcher.classList.remove(...['btn-light', 'btn-dark'])
    colorSchemeSwitcher.classList.add(isDarkThemeOn ? 'btn-light' : 'btn-dark')  
}

colorSchemeSwitcher.onclick = switchTheme

switchTheme()