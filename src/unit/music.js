import store from '../vuex/store'
// 使用 Web Audio API
const AudioContext =
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext

export const hasWebAudioAPI = {
  data: !!AudioContext && location.protocol.indexOf('http') !== -1
}

import musicUrl from '../assets/sound/music.mp3'
import moveUrl from '../assets/sound/move.wav'
import rotateUrl from '../assets/sound/rotate.wav'
import fallUrl from '../assets/sound/fall.wav'
import clearUrl from '../assets/sound/clear.wav'
import gameoverUrl from '../assets/sound/gameover.wav'
import gamestartUrl from '../assets/sound/gamestart.wav'

export const music = {}
  ; (() => {
    if (!hasWebAudioAPI.data) {
      return
    }
    const context = new AudioContext()

    const loadAudio = (url) => {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('GET', url, true)
        req.responseType = 'arraybuffer'
        req.onload = () => {
          context.decodeAudioData(
            req.response,
            buf => resolve(buf),
            error => reject(error)
          )
        }
        req.onerror = () => reject(new Error(`Network error loading ${url}`))
        req.send()
      })
    }

    Promise.all([
      loadAudio(musicUrl),
      loadAudio(moveUrl),
      loadAudio(rotateUrl),
      loadAudio(fallUrl),
      loadAudio(clearUrl),
      loadAudio(gameoverUrl),
      loadAudio(gamestartUrl)
    ]).then(([musicBuf, moveBuf, rotateBuf, fallBuf, clearBuf, gameoverBuf, gamestartBuf]) => {
      const getSource = (buf, volume = 1.0) => {
        const source = context.createBufferSource()
        source.buffer = buf
        if (volume !== 1.0) {
          const gainNode = context.createGain()
          gainNode.gain.value = volume
          source.connect(gainNode)
          gainNode.connect(context.destination)
        } else {
          source.connect(context.destination)
        }
        return source
      }

      music.killStart = () => {
        music.start = () => { }
      }

      music.start = () => {
        music.killStart()
        if (!store.state.music) {
          return
        }
        getSource(gamestartBuf, 0.5).start(0)
      }

      music.clear = () => {
        if (!store.state.music) {
          return
        }
        getSource(clearBuf, 0.5).start(0)
      }

      music.fall = () => {
        if (!store.state.music) {
          return
        }
        getSource(fallBuf, 0.5).start(0)
      }

      music.gameover = () => {
        if (!store.state.music) {
          return
        }
        getSource(gameoverBuf, 0.5).start(0)
      }

      music.rotate = () => {
        if (!store.state.music) {
          return
        }
        getSource(rotateBuf, 0.5).start(0)
      }

      music.move = () => {
        if (!store.state.music) {
          return
        }
        getSource(moveBuf).start(0)
      }
    }).catch(error => {
      if (window.console && window.console.error) {
        window.console.error(`音频读取错误`, error)
        hasWebAudioAPI.data = false
      }
    })
  })()
