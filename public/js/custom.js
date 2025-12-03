fetch("/getColors")
.then(res => res.json())
.then(data => {
    document.documentElement.style.setProperty('--color1',`#${data.color1}`)
    document.documentElement.style.setProperty('--color2',`#${data.color2}`)
    document.documentElement.style.setProperty('--color3',`#${data.color3}`)
})