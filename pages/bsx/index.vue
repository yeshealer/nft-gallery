<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {},
})
export default class LandingPage extends Vue {
  layout() {
    return 'full-width-layout'
  }

  middleware({ store, redirect }) {
    // If the user is not authenticated
    const prefix = store.getters.currentUrlPrefix
    if (prefix !== 'bsx') {
      this.$consola.log('Not BSX')
      store.dispatch('setUrlPrefix', 'bsx')
    }
    setTimeout(() => redirect('/'))
  }
}
</script>
