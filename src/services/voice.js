const recognition =
  new window.webkitSpeechRecognition()

recognition.lang = 'en-US'
recognition.start()