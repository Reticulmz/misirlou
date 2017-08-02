import backend from "./backend"

export default function(baseArr, idRetrieverFunc, component) {
  let users = new Set()
  baseArr.forEach(i => users.add(idRetrieverFunc(i)))
  backend.getUsersBulk([...users], data => {
    // int + "" is a clever way to convert to string
    // why we need component.$set: https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
    data.users.forEach(x => component.$set(component.names, x.id + "", x.username))
  })
}
