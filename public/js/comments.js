

const comments = document.querySelectorAll('.commentText')
comments.forEach(comment => {
    const width = comment.innerText.length
    const speed = 100
    const newDuration = width/speed
    comment.style.setProperty('--animation-duration',`${newDuration}`)
})