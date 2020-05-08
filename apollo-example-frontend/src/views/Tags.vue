<template>
  <div>
    <div class="info">
      <label><input type="checkbox"
                    v-model="skipQuery"/> Skip query (this disables the apollo query)</label>
    </div>
    <div class="info">
      Query updates: {{ updateCount }}
    </div>
    <div class="type">
      <label>
        <input type="radio"
               value="City"
               v-model="type"/>
        Cities
      </label>
      <label>
        <input type="radio"
               value="Company"
               v-model="type"/>
        Companies
      </label>
    </div>
    <div class="tags">
      <div v-for="(tag,index) in tags"
           :key="index"
           :class="['tag',{optimistic: tag.id === -1}]"
           :title="tag.id">
        {{tag.label}}
      </div>
    </div>
    <div class="loading"
         v-if="tagsLoading">
      <img src="@/assets/loader.gif"/> Loading tags...
    </div>
    <div>
      <button @click="refetchTags">Refetch</button>
    </div>
    <form @submit.prevent="addTag">
      <input v-model="newTag"
             placeholder="New tag"
             autocomplete="off"/>
    </form>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    name: 'tags',
    data () {
      return {
        newTag: null,
        updateCount: 0,
        type: 'City',
        skipQuery: false,
        tagsLoading: 0
      }
    },
    apollo: {
      $client: 'test',
      $loadingKey: 'loading',
      // 'tags' data property on vue instance
      tags () {
        return {
          // client: 'a',
          // GraphQL Query
          query () {
            if (this.type) {
              return gql`query tagList ($type: String!) {
                tags(type: $type) {
                  id
                  label
                }
              }`
            }
          },
          // Reactive variables
          variables () {
            return {
              type: this.type
            }
          },
          // manual: true,
          // Polling
          // pollInterval: 300, // ms
          // Hook example
          result (result) {
            if (!result.loading && result.stale === false) {
              this.updateCount++
            }
            // if (!result.loading) {
            //   this.tags = result.data.tags
            // }
          },
          // Disable the query
          skip () {
            return this.skipQuery
          },
          // Loading key
          loadingKey: 'tagsLoading'
        }
      }
    },
    methods: {
      addTag () {
        // We save the user input in case of an error
        const newTag = this.newTag
        // We clear it early to give the UI a snappy feel
        this.newTag = ''
        // Call to the graphql mutation
        this.$apollo.mutate({
          // Query
          mutation: gql`mutation ($type: String!, $label: String!) {
            addTag(type: $type, label: $label) {
              id
              label
            }
          }`,
          // Parameters
          variables: {
            type: this.type,
            label: newTag
          },
          // Update the cache with the result
          // 'tagList' is the name of the query declared before
          // that will be updated with the optimistic response
          // and the result of the mutation
          updateQueries: {
            tagList: (previousResult, { mutationResult }) => {
              console.log(previousResult, mutationResult)
              // If we added the tag already don't do anything
              // This can be caused by the `updateQuery` of our subscribeToMore
              if (previousResult.tags.find(tag => tag.id === mutationResult.data.addTag.id)) {
                return previousResult
              }

              // We incorporate any received result (either optimistic or real)
              // into the 'tagList' query we set up earlier
              return {
                tags: [
                  ...previousResult.tags,
                  mutationResult.data.addTag
                ]
              }
            }
          },
          // Optimistic UI
          // Will be treated as a 'fake' result as soon as the request is made
          // so that the UI can react quickly and the user be happy
          optimisticResponse: {
            __typename: 'Mutation',
            addTag: {
              __typename: 'Tag',
              id: -1,
              label: newTag,
              type: this.type
            }
          }
        }).then((data) => {
          // Result
          console.log(data)
        }).catch((error) => {
          // Error
          console.error(error)
          // We restore the initial user input
          this.newTag = newTag
        })
      },

      refetchTags () {
        this.$apollo.queries.tags.refetch()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .info,
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

  .tag.optimistic {
    background: #b76c40;
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
