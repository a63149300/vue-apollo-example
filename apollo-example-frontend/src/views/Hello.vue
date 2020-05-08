<template>
  <div id="app">
    <div class="loading"
         v-if="loading">
      <img src="@/assets/loader.gif"/> Loading...
    </div>
    {{hello}}
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    name: 'hello',
    data () {
      return {
        loading: 0
      }
    },
    apollo: {
      $client: 'test',
      $loadingKey: 'loading',

      // hello
      hello: {
        query: gql`query {
          hello
        }`
      }
    }
  }
</script>

<style scoped lang="scss">
  .loading {
    color: #999;
    margin: 12px;
  }
</style>
