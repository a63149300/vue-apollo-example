<template>
  <div class="list">
    <template v-if="tagsPage">
      <div class="list-item"
           v-for="(tag,index) in tagsPage.tags"
           :key="index">
        {{ tag.id }} - {{ tag.label }} - {{ tag.type }}
      </div>
    </template>
    <div v-if="tagsPageLoading">
      <img src="@/assets/loader.gif"/> Loading paginated tags...
    </div>
    <div v-else>
      <button v-if="showMoreEnabled"
              @click="showMore">Show More
      </button>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  const pageSize = 10

  export default {
    name: 'list',
    data () {
      return {
        tagsPageLoading: 0,
        showMoreEnabled: false,
        page: 0
      }
    },
    apollo: {
      $client: 'test',
      $loadingKey: 'loading',

      // list
      tagsPage: {
        // GraphQL Query
        query: gql`query tagsPage ($page: Int!, $pageSize: Int!) {
          tagsPage(page: $page, size: $pageSize) {
            tags {
              id
              label
              type
            }
            hasMore
          }
        }`,
        variables: {
          page: 0,
          pageSize
        },
        result ({ data }) {
          this.showMoreEnabled = data.tagsPage.hasMore
        },
        loadingKey: 'tagsPageLoading'
      }
    },
    methods: {
      showMore () {
        this.page++
        this.$apollo.queries.tagsPage.fetchMore({
          variables: {
            page: this.page,
            pageSize
          },
          // Mutate the previous result
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newTags = fetchMoreResult.tagsPage.tags
            const hasMore = fetchMoreResult.tagsPage.hasMore

            this.showMoreEnabled = hasMore

            return {
              tagsPage: {
                __typename: previousResult.tagsPage.__typename,
                tags: [
                  ...previousResult.tagsPage.tags,
                  // Add the new tags
                  ...newTags
                ],
                hasMore
              }
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list {
    text-align: left;
    border: solid 1px #40b883;
    padding: 10px;
    border-radius: 3px;
  }
</style>
