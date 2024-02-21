<template>
  <div class="relative p-16">
    <div class="load">
      <hr/>
      <hr/>
      <hr/>
      <hr/>
    </div>
  </div>
</template>

<style>
.load {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.load hr {
  border: 0;
  margin: 0;
  width: 40%;
  height: 40%;
  position: absolute;
  border-radius: 50%;
  animation: spin 2s ease infinite;
}

.load :first-child {
  background: #6500fe;
  animation-delay: -1.5s;
}

.load :nth-child(2) {
  background: #f63d3a;
  animation-delay: -1s;
}

.load :nth-child(3) {
  background: #fda543;
  animation-delay: -0.5s;
}

.load :last-child {
  background: #193b48;
}

@keyframes spin {
  0%, 100% {
    transform: translate(0);
  }
  25% {
    transform: translate(160%);
  }
  50% {
    transform: translate(160%, 160%);
  }
  75% {
    transform: translate(0, 160%);
  }
}
</style>