const comments = document.querySelectorAll('.commentText')
comments.forEach(comment => {
    const width = comment.scrollWidth
    const speed = 20
    const newDuration = width/speed
    const containerWidth = comment.parentElement.offsetWidth
    const translateDistance = -(width + containerWidth)
    comment.style.setProperty('--animation-duration',`${newDuration}s`)
    comment.style.setProperty('--translate-length',`${translateDistance}%`)
    console.log(newDuration, translateDistance)
})