<template>
  <div v-if="!hasDisplayedCookieBanner">
    <transition name="slide">
      <div class="notices is-bottom">
        <div role="alertdialog" class="snackbar is-success is-bottom-right">
          <div class="text">{{ $t('cookies.notice') }}</div>
          <div class="action is-light is-cancel">
            <button class="button" @click="declineCookies">
              {{ $t('cookies.decline') }}
            </button>
          </div>
          <div class="action is-success">
            <button class="button" @click="acceptCookies">
              {{ $t('cookies.accept') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}, // do not remove!
})
export default class CookieBanner extends Vue {
  public hasDisplayedCookieBanner: boolean =
    localStorage.getItem('cookies_enabled') !== null || false

  public acceptCookies() {
    localStorage.setItem('cookies_enabled', '1')
    this.hasDisplayedCookieBanner = true
    this.$gtag.optIn()
  }

  public declineCookies() {
    localStorage.setItem('cookies_enabled', '0')
    this.hasDisplayedCookieBanner = true
    this.$gtag.optOut()
  }
}
</script>
