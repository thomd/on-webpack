document.querySelector('button').addEventListener('click', function () {
  import('./message').then(({default: message}) => console.log(message))
})
