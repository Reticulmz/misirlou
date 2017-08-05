<script>
import storage from "../storageHandler"

export default {
  mounted() {
    storage.logout()
    window.location.pathname = "/"
  }
}
</script>
