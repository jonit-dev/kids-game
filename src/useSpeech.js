import { useCallback, useEffect, useState } from 'react'

// Custom hook for text-to-speech functionality
export const useSpeech = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const [voicesReady, setVoicesReady] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsSupported(true)

      // Load available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        console.log('🔊 Voices loaded:', availableVoices.length)
        if (availableVoices.length > 0) {
          setVoices(availableVoices)
          setVoicesReady(true)
          console.log('✓ Voices ready:', availableVoices.map(v => v.name).slice(0, 3).join(', '))
        } else {
          console.warn('⚠ No voices available yet')
        }
      }

      // Initial load
      loadVoices()

      // Chrome loads voices asynchronously - set up listener
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }

      // Also try loading after delays (some browsers need this)
      const timeouts = [100, 300, 500, 1000, 2000].map(delay =>
        setTimeout(loadVoices, delay)
      )

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout))
      }
    }
  }, [])

  const speak = useCallback((text, options = {}) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Create utterance with minimal configuration
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate || 0.9
    utterance.pitch = options.pitch || 1.1
    utterance.volume = options.volume || 1
    utterance.lang = 'en-US'

    // Don't set a custom voice - just use browser default
    // This avoids issues with voice loading in privacy-focused browsers

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsBlocked(false) // If it started, it's not blocked
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error('❌ Speech error:', event.error)
      setIsSpeaking(false)

      // Detect if the API is being blocked (common in Brave browser)
      if (event.error === 'synthesis-failed' || event.error === 'synthesis-unavailable') {
        setIsBlocked(true)
        console.warn('⚠️ Speech Synthesis appears to be blocked by your browser.')
        console.warn('   If you\'re using Brave, click the Shields icon and set')
        console.warn('   Fingerprinting protection to "Standard" or "Off" for this site.')
      }
    }

    try {
      // Cancel any previous speech without delay
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel()
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('❌ Speak() failed:', error)
      setIsSpeaking(false)
      setIsBlocked(true)
    }
  }, [isSupported])

  const speakWord = useCallback((word) => {
    // Speak the word slowly and clearly for spelling
    speak(word, { rate: 0.8, pitch: 1.2 })
  }, [speak])

  const speakLetter = useCallback((letter) => {
    // Speak individual letters
    speak(letter, { rate: 0.7, pitch: 1.3 })
  }, [speak])

  const spellOut = useCallback((word) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech first
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel()
    }

    console.log('📝 Spelling out:', word)

    // Spell out the word letter by letter with pauses
    const letters = word.split('')
    let delay = 200

    letters.forEach((letter) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(letter)
        utterance.rate = 0.7
        utterance.pitch = 1.3
        utterance.lang = 'en-US'
        utterance.volume = 1

        // Don't set custom voice - use browser default

        utterance.onerror = (event) => {
          console.error(`❌ Letter "${letter}" error:`, event.error)
          if (event.error === 'synthesis-failed' || event.error === 'synthesis-unavailable') {
            setIsBlocked(true)
          }
        }

        try {
          window.speechSynthesis.speak(utterance)
        } catch (error) {
          console.error('❌ Failed to speak letter:', letter, error)
          setIsBlocked(true)
        }
      }, delay)
      delay += 1000
    })
  }, [isSupported])

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    isSupported,
    isSpeaking,
    voicesReady,
    isBlocked,
    speak,
    speakWord,
    speakLetter,
    spellOut,
    cancel
  }
}
