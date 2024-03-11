const winningModalCotent = ()=> ({
  messageType: 'INDEX_JS_MESSAGE',
  modalType: 'WIN',
  data: {
    message: 'You win ╰(*°▽°*)╯'
  }
})
const losingModalCotent = ()=>({
  messageType: 'INDEX_JS_MESSAGE',
  modalType: 'LOSE',
  data: {
    message: 'You lose ಥ_ಥ'
  }
})

export {winningModalCotent, losingModalCotent}