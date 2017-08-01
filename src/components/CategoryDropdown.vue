<template>
  <div class="control">
    <div class="select">
      <select :value="value" @input="selected($event.target.value)">
        <option v-for="(option, idx) in options" :key="option" :value="idx">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import osu from "../osu"

// $emit('change', $)

export default {
  props: ["mode", "value"],
  computed: {
    options() {
      return osu.beatmapCategories[this.mode]
    },
  },
  methods: {
    selected(val) {
      this.$emit("input", val)
    }
  },
}
</script>
