<script>
import storage from "../storageHandler"

export default {
  mounted() {
    storage.clear()
    window.location.pathname = "/"
  }
}
</script>
