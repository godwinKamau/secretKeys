const commentButtons = document.querySelectorAll('.comments')
const commPopups = document.querySelectorAll('.commentPopup')

commentButtons.forEach(button => {
    button.addEventListener('click', async function() {
        const commInput = button.parentElement.parentElement.nextElementSibling
        const marquee = button.parentElement.parentElement.previousElementSibling.firstElementChild
        if (!commInput.classList.contains('activatedPopup')){
            commInput.classList.add('activatedPopup')
            button.classList.add('activatedBtn')
            marquee.classList.add('marqueeActivated')
        } else {
            commInput.classList.remove('activatedPopup')
            button.classList.remove('activatedBtn')
            marquee.classList.remove('marqueeActivated')
        }
        
    })
})

