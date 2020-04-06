<template>
  <div>
    <div class="loading"
         v-if="loading">
      <img src="@/assets/loader.gif"/> Loading...
    </div>
    <div>
      <div class="type">
        <label>
          <input type="radio"
                 value="random"
                 v-model="showTag"/>
          Random tag
        </label>
        <label>
          <input type="radio"
                 value="last"
                 v-model="showTag"/>
          Last tag
        </label>
      </div>
      <div class="tag" v-if="Object.keys(randomTag).length">
        {{ randomTag.label }} - {{ randomTag.type }}
      </div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    name: 'random',
    data () {
      return {
        loading: 0,
        showTag: 'random',
        randomTag: {}
      }
    },
    apollo: {
      $client: 'test',
      $loadingKey: 'loading',

      // Random tag
      randomTag: {
        query () {
          if (this.showTag === 'random') {
            return gql`{
              randomTag {
                id
                label
                type
              }
            }`
          } else if (this.showTag === 'last') {
            return gql`{
              randomTag: lastTag {
                id
                label
                type
              }
            }`
          }
        },
      }
    }
  }
</script>

<style scoped lang="scss">
  .loading {
    color: #999;
    margin: 12px;
  }

  .tag {
    display: inline-block;
    padding: 4px;
    background: #40b883;
    color: white;
    border-radius: 2px;
    margin: 2px;
  }

  form {
    margin: 22px;
  }

  input {
    padding: 8px;
    border: solid 1px #bbb;
    border-radius: 2px;
  }

  input:focus {
    box-shadow: none;
    outline: none;
    border-color: #40b883;
  }
</style>
