function generateBtn () {
  const parentDom = document.querySelector('#form')
  const btnDom = document.createElement('button')
  btnDom.classList.add('s_btn')
  btnDom.setAttribute('style', 'position: absolute; right: -120px; top: 0; z-index: 999;')
  btnDom.innerText = '按钮测试'
  parentDom.appendChild(btnDom)
}
generateBtn()
