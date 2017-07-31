import backend from "./backend"

export default function(baseArr, idRetrieverFunc, component) {
  let users = new Set()
  baseArr.forEach(i => users.add(idRetrieverFunc(i)))
  backend.getUsersBulk([...users], data => {
    data.users.forEach(x => component.names[x.id] = x.username)
    // I dunno why I need to do this, but apparently I do.
    component.$forceUpdate()
  })
}
