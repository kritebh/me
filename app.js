let themeDot = document.getElementsByClassName('theme-dot')
let currentTheme = localStorage.getItem('currentTheme')



for (let i = 0; i < themeDot.length; i++) {
    themeDot[i].addEventListener('click', function () {
        let mode = this.dataset.mode
        setTheme(mode)
    })
}

const setTheme = (mode) => {
    if (mode === 'light') {
        document.getElementById('theme-style').href = 'main_style.css'
    }
    if (mode === 'blue') {
        document.getElementById('theme-style').href = 'blue.css'
    }
    if (mode === 'green') {
        document.getElementById('theme-style').href = 'green.css'
    }
    if (mode === 'purple') {
        document.getElementById('theme-style').href = 'purple.css'
    }

    localStorage.setItem('currentTheme', mode)
}



if (currentTheme == null) {
    setTheme('light')
}
else {
    setTheme(currentTheme)
}