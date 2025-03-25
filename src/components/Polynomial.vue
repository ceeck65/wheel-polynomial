<template>
  <div id="app">

        <div class="row">

          <h1 class="title">Ruleta de Polinimios</h1>

          <div class="col-md-6">
            <div class="draw">
              <Wheel
                  style="width: 500px; max-width: 100%;"
                  :verify="canvasVerify"
                  :canvas="canvasOptions"
                  :prizes="prizesCanvas"
                  @rotateStart="onCanvasRotateStart"
                  @rotateEnd="onRotateEnd"
              />

              <audio id="spin">
                <source src="../assets/sound/spin.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>

              <audio id="timer">
                <source src="../assets/sound/timer.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>

              <audio id="winner">
                <source src="../assets/sound/win.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>

            </div>
          </div>
          <div class="col-md-3">
            <span class="question">{{ selection }}</span>
            <br><br>
            <span class="counter" v-if="showCounter"> <img src="./icons/cronometer.svg" width="64"> {{ counters }}</span>
            <p class="answer" v-if="showAnswer"> {{ answer }}</p>

          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Wheel from './Wheel/Wheel.vue'
import { PrizeConfig } from './Wheel/types'
import data from "../data.json"

const prizeId = ref(0)

const selection = ref("");


const hundredths = ref(0)
const seconds  = ref(10)
const counters  = ref("")

const canvasVerify = ref(false)
const showAnswer = ref(false)
const showCounter = ref(false)
const answer = ref("")



const verifyDuration = 2
const canvasOptions = {
  btnWidth: 140,
  borderColor: '#584b43',
  borderWidth: 6,
  lineHeight: 1
}

const prizesCanvas: PrizeConfig[] = data


const prizeRes = computed(() => {
  return prizesCanvas.find(item => item.id === prizeId.value) || prizesCanvas[0]
})

function testRequest (verified: boolean, duration: number) { // 参数 1: 是否通过验证, 2: 延迟时间
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(verified)
    }, duration)
  })
}

function onCanvasRotateStart (rotate: Function) {
  if (canvasVerify.value) {
    const verified = true
    testRequest(verified, verifyDuration * 1000).then((verifiedRes) => {
      if (verifiedRes) {
        console.log('')
        rotate()
        canvasVerify.value = false
      } else {
        alert('no verificado')
      }
    })
    return
  }
  console.log('onCanvasRotateStart')
}

function onImageRotateStart () {
  console.log('onImageRotateStart')
}

function onRotateEnd (prize: PrizeConfig) {
  showAnswer.value = false
  selection.value = prize.value
  answer.value = prize.answer
  showCounter.value = true
  setInterval(counter, 10);
}


function counter(){
  let timerSound = document.getElementById("timer");
  timerSound.play();
  if((hundredths.value == 0) &&( seconds.value == 0)){
    showAnswer.value = true
    showCounter.value = false
    timerSound.pause();
    win()
  }else{
    if(hundredths.value == 0){
      --seconds.value;
      hundredths.value = 99;
    }else{
      --hundredths.value;
    }
    counters.value = seconds.value +':'+hundredths.value;
  }

}

function win() {
  const winner = document.getElementById("winner");
  // winner.play();


}




function onChangePrize (id: number) {
  prizeId.value = id
}

</script>

<style lang="scss" scoped>
@import '../assets/css/bootstrap-grid.min.css';


@font-face {
  font-family: KGEverywhereEverything;
  src: url("../assets/font/KGEverywhereEverything.otf");
}

.draw {
  margin-left: 25%;
}

h2 {
  font-size: 30px;
  margin-bottom: 40px;
}

button {
  margin-top: 4px;
  padding: 15px;
  border: 0;
  background: gray;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  transition: linear 0.2s background;
  &.blue {
    background: #45ace9;
  }
  &.red {
    background: #dd3832;
  }
}

.btn-list {
  display: flex;
  margin-bottom: 30px;
  .btn {
    flex: 1;
    height: 40px;
    border-radius: 5px;
    margin: 0 5px;
    cursor: pointer;
    user-select: none;
  }
}

.wheel-result {
  span {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    border-radius: 3px;
  }
}

.title {
  margin-top: 3%;
  text-align: center;
  font-size: 6em;
  font-family: "Cafe24Decoschool", serif;
  color: #FFFFFF;
}

.question {
  margin-top: 3%;
  text-align: center;
  font-size: 2.5em;
  font-family: "Cafe24Decoschool", serif;
  color: #FFFFFF;
}


.counter {
  text-align: center;
  font-size: 4em;
  font-family: "Cafe24Decoschool", serif;
  color: #FFFFFF;
}


.answer {
  margin-top: 3%;
  text-align: center;
  font-size: 2em;
  font-family: "Cafe24Decoschool", serif;
  color: #FFFFFF;
}





</style>