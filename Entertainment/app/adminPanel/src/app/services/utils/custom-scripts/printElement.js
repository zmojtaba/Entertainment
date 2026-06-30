/*add print method to all element instance 
with this abroach can print directly from any element without opening new window
@Author morgan 
  all right reserved :/
*/
HTMLElement.prototype.printMe = printMe

function printMe() {
  var myframe = document.createElement("IFRAME")
  myframe.domain = document.domain
  myframe.style.position = "absolute"
  myframe.style.top = "-10000px"
  document.body.appendChild(myframe)
  myframe.contentDocument.write(this.innerHTML)
  setTimeout(function () {
    myframe.focus()
    myframe.contentWindow.print()
    myframe.parentNode.removeChild(myframe)// remove frame
  }, 2000) // wait for images to load inside iframe
  window.focus()
}
