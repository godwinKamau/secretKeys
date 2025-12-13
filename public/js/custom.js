fetch("/getColors")
.then(res => res.json())
.then(data => {
    console.log('color data',data)
    if (data === null){
        document.documentElement.style.setProperty('--color1',`#5A7684`)
        document.documentElement.style.setProperty('--color2',`#92AFD7`)
        document.documentElement.style.setProperty('--color3',`#C5D1EB`)
    } else {
        document.documentElement.style.setProperty('--color1',`#${data.color1}`)
        document.documentElement.style.setProperty('--color2',`#${data.color2}`)
        document.documentElement.style.setProperty('--color3',`#${data.color3}`)
    } 
    
})