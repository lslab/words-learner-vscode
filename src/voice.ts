import { getConfig } from './utils'
interface NativeModule {
  playerPlay(voiceUrl: string, callback: () => void): void
}

let NATIVE: any = null

try {
  NATIVE = require(`node-loader!./rodio/mac-arm.node`) as NativeModule
} catch (error) {
  NATIVE = null
}

if(!(NATIVE && NATIVE.playerPlay)){
  try{
    NATIVE = require(`node-loader!./rodio/win32.node`) as NativeModule
  }catch(error){
    NATIVE = null
  }
}
if(!(NATIVE && NATIVE.playerPlay)){
  try{
    NATIVE = require(`node-loader!./rodio/mac-intel.node`) as NativeModule
  }catch(error){
    NATIVE = null
  }
}

if(!(NATIVE && NATIVE.playerPlay)){
  NATIVE = null
}


type VoiceType = 'us' | 'uk' | 'close'

export const getVoiceType = () => {
  const voiceType: VoiceType = getConfig('voiceType')
  let type
  switch (voiceType) {
    case 'us':
      type = 2
      break
    case 'uk':
      type = 1
      break
    case 'close':
      type = ''
      break
    default:
      type = ''
      break
  }
  return type
}

export const voicePlayer = (word: string, type: string | number, callback: () => void) => {
  if (NATIVE) {
    NATIVE.playerPlay(`https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`, callback)
  } else {
    callback()
  }
}
