import { useCallback, useEffect, useState } from 'react'

// Custom hook for text-to-speech functionality
export const useSpeech = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState([])

  useEffect(() => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsSupported(true)

      // Load available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }
  }, [])

  const speak = useCallback((text, options = {}) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Configure voice settings for kids
    utterance.rate = options.rate || 0.9 // Slightly slower for clarity
    utterance.pitch = options.pitch || 1.1 // Slightly higher pitch
    utterance.volume = options.volume || 1

    // Try to use a child-friendly voice if available
    const preferredVoice = voices.find(
      voice =>
        voice.lang.startsWith('en') &&
        (voice.name.includes('Female') || voice.name.includes('Child'))
    ) || voices.find(voice => voice.lang.startsWith('en'))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [isSupported, voices])

  const speakWord = useCallback((word) => {
    // Speak the word slowly and clearly for spelling
    speak(word, { rate: 0.8, pitch: 1.2 })
  }, [speak])

  const speakLetter = useCallback((letter) => {
    // Speak individual letters
    speak(letter, { rate: 0.7, pitch: 1.3 })
  }, [speak])

  const spellOut = useCallback((word) => {
    // Spell out the word letter by letter with pauses
    const letters = word.split('')
    let delay = 0

    letters.forEach((letter, index) => {
      setTimeout(() => {
        speakLetter(letter)
      }, delay)
      delay += 800 // 800ms between letters
    })
  }, [speakLetter])

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    isSupported,
    isSpeaking,
    speak,
    speakWord,
    speakLetter,
    spellOut,
    cancel
  }
}
