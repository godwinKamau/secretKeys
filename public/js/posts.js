const commentButtons = document.querySelectorAll('.comments')
const commPopups = document.querySelectorAll('.commentPopup')

commentButtons.forEach(button => {
    button.addEventListener('click', async function() {
        const commInput = button.parentElement.parentElement.nextElementSibling
        if (!commInput.classList.contains('activatedPopup')){
            commInput.classList.add('activatedPopup')
            button.classList.add('activatedBtn')
        } else {
            commInput.classList.remove('activatedPopup')
            button.classList.remove('activatedBtn')
        }
        
    })
})

