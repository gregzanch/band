type OpenFilePickerSettings = {
  multiple?: boolean
  accept?: string
}

type OpenFilePickerSettingsMultiple = {
  multiple: true
  accept?: string
}

type OpenFilePickerSettingsSingle = {
  multiple: false
  accept?: string
}

const defaultPickerSettings: OpenFilePickerSettings = {
  multiple: false,
  accept: "*",
}

export async function openFilePicker(settings: OpenFilePickerSettingsMultiple): Promise<File[]>
export async function openFilePicker(settings: OpenFilePickerSettingsSingle): Promise<File>
export async function openFilePicker(settings: OpenFilePickerSettings) {
  settings = {
    ...defaultPickerSettings,
    ...settings,
  }
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

      resolve(settings.multiple ? files : files[0])
      fileinput.remove()
    })
    document.body.appendChild(fileinput)
    fileinput.click()
  })
}
