type OpenFilePickerSettings = {
  multiple?: boolean
  accept?: string
}

export async function openFilePicker(settings: OpenFilePickerSettings) {
  return new Promise((resolve, reject) => {
    const fileinput: HTMLInputElement = document.createElement("input")
    fileinput.setAttribute("type", "file")
    fileinput.setAttribute("multiple", settings.multiple ? "true" : "false")
    fileinput.setAttribute("accept", settings.accept ? settings.accept : "*")
    fileinput.setAttribute("style", "display: none")
    fileinput.setAttribute("class", "openFilePicker-element")
    fileinput.addEventListener("change", (e) => {
      //@ts-ignore
      const files = [...e.target.files] as File[]

      resolve(files)
      fileinput.remove()
    })
    document.body.appendChild(fileinput)
    fileinput.click()
  })
}
