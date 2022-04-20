export function copyString(sourceStr: string = ""): boolean {
  const d = document; // rudeuce size
  try {
    const inputDom = d.createElement("textarea");
    inputDom.setAttribute("readonly", "");
    inputDom.setAttribute("style", "position: fixed; top:0; left:0; opacity:0;");
    inputDom.textContent = sourceStr;
    d.body.appendChild(inputDom);
    // inputDom.setSelectionRange(0, sourceStr.length);
    inputDom.select();
    d.execCommand("copy");
    d.body.removeChild(inputDom);
    return true;
  } catch (error) {
    return false;
  }
}
